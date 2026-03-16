"use client";

import { useEffect, useRef, useState } from "react";
import {
  createPublicClient,
  http,
  type Address,
  type PublicClient,
} from "viem";
import { polygon } from "viem/chains";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contractConfig";

// ── Configuration ─────────────────────────────────────────────────────────────
//
//  NEXT_PUBLIC_RPC_URL  — set in .env.local (Alchemy, QuickNode, Ankr, etc.)
//  Falls back to the public Polygon RPC when not set.
//
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? "https://polygon-rpc.com";

//  Polygonscan NFT page: polygonscan.com/nft/{contract}/{tokenId}
const EXPLORER_NFT = `https://polygonscan.com/nft/${CONTRACT_ADDRESS}/`;

//  IPFS HTTP gateway
const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

//  Maximum cards to display
const MAX_ITEMS = 12;

//  How often to poll totalSupply() for new mints (ms)
const POLL_INTERVAL_MS = 10_000;

// ── Types ─────────────────────────────────────────────────────────────────────

interface MintItem {
  key: string;
  tokenId: bigint;
  owner: Address;
  image: string;
  name: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ipfsToHttp(uri: string): string {
  return uri.startsWith("ipfs://") ? uri.replace("ipfs://", IPFS_GATEWAY) : uri;
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

// ── Token resolver ────────────────────────────────────────────────────────────
//
//  Uses only eth_call (readContract) — no eth_getLogs, no block-range limits.
//  Works on any RPC tier including Alchemy Free.

async function resolveToken(
  client: PublicClient,
  tokenId: bigint
): Promise<MintItem | null> {
  try {
    const [rawUri, owner] = await Promise.all([
      client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "tokenURI",
        args: [tokenId],
      }) as Promise<string>,
      client.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "ownerOf",
        args: [tokenId],
      }) as Promise<Address>,
    ]);

    const res = await fetch(ipfsToHttp(rawUri));
    if (!res.ok) throw new Error(`metadata fetch failed (${res.status})`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const meta: any = await res.json();

    return {
      key: `token-${tokenId}`,
      tokenId,
      owner,
      image: ipfsToHttp(meta.image ?? ""),
      name: meta.name ?? `#${tokenId.toString()}`,
    };
  } catch {
    return null;
  }
}

// Fetch the last `count` minted tokens (most-recent first) via tokenByIndex()
async function fetchLatest(client: PublicClient, supply: bigint): Promise<MintItem[]> {
  const count = supply < BigInt(MAX_ITEMS) ? Number(supply) : MAX_ITEMS;

  // Indices of the most-recent tokens: supply-1, supply-2, …
  const indices = Array.from({ length: count }, (_, i) => supply - 1n - BigInt(i));

  const tokenIds = await Promise.all(
    indices.map(
      (idx) =>
        client.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "tokenByIndex",
          args: [idx],
        }) as Promise<bigint>
    )
  );

  const resolved = await Promise.all(tokenIds.map((id) => resolveToken(client, id)));
  return resolved.filter((x): x is MintItem => x !== null);
}

// ── Card ──────────────────────────────────────────────────────────────────────

function MintCard({ item }: { item: MintItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {!imgError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-gray-200 text-3xl select-none">◈</span>
        )}
      </div>

      <div className="px-3 py-3 flex flex-col gap-2 flex-1">
        <p className="text-gray-800 text-xs font-semibold truncate">{item.name}</p>

        <div className="flex flex-col gap-0.5">
          <p className="text-gray-400 text-[10px] font-mono">
            <span className="text-gray-300 uppercase tracking-widest">ID </span>
            {item.tokenId.toString()}
          </p>
          <p className="text-gray-400 text-[10px] font-mono truncate">
            <span className="text-gray-300 uppercase tracking-widest">BY </span>
            {shortenAddress(item.owner)}
          </p>
        </div>

        <a
          href={`${EXPLORER_NFT}${item.tokenId.toString()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-[10px] font-mono uppercase tracking-widest text-gray-300 hover:text-gray-500 transition-colors duration-150"
        >
          View on Polygonscan ↗
        </a>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="px-3 py-3 flex flex-col gap-2">
        <div className="h-2.5 w-3/4 rounded bg-gray-100" />
        <div className="h-2 w-1/2 rounded bg-gray-100" />
        <div className="h-2 w-2/3 rounded bg-gray-100" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LatestMints() {
  const [items, setItems] = useState<MintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const knownSupplyRef = useRef<bigint>(0n);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!CONTRACT_ADDRESS) {
      setError("NEXT_PUBLIC_CONTRACT_ADDRESS is not set in .env.local");
      setLoading(false);
      return;
    }

    const client = createPublicClient({
      chain: polygon,
      transport: http(RPC_URL),
    });

    // ── Initial load ───────────────────────────────────────────────────────────
    async function loadHistory() {
      try {
        const supply = (await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "totalSupply",
        })) as bigint;

        knownSupplyRef.current = supply;

        if (supply === 0n) {
          if (!cancelled) { setItems([]); setLoading(false); }
          return;
        }

        const latest = await fetchLatest(client, supply);

        if (!cancelled) {
          setItems(latest);
          setLoading(false);
        }
      } catch (err) {
        console.error("[LatestMints] loadHistory failed:", err);
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          setError(`Could not load mints: ${msg}`);
          setLoading(false);
        }
      }
    }

    // ── Poll for new mints ─────────────────────────────────────────────────────
    async function pollForNew() {
      if (cancelled) return;
      try {
        const supply = (await client.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: "totalSupply",
        })) as bigint;

        if (supply <= knownSupplyRef.current) return;

        const newCount = Number(supply - knownSupplyRef.current);
        const indices = Array.from(
          { length: Math.min(newCount, MAX_ITEMS) },
          (_, i) => supply - 1n - BigInt(i)
        );

        const tokenIds = await Promise.all(
          indices.map(
            (idx) =>
              client.readContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: "tokenByIndex",
                args: [idx],
              }) as Promise<bigint>
          )
        );

        const resolved = await Promise.all(tokenIds.map((id) => resolveToken(client, id)));
        const valid = resolved.filter((x): x is MintItem => x !== null);

        if (!cancelled && valid.length) {
          setItems((prev) => {
            const seen = new Set(prev.map((i) => i.key));
            const fresh = valid.filter((i) => !seen.has(i.key));
            return [...fresh, ...prev].slice(0, MAX_ITEMS);
          });
        }

        knownSupplyRef.current = supply;
      } catch {
        // Silent — don't disrupt the UI on a failed poll tick
      }
    }

    loadHistory().then(() => {
      if (!cancelled) {
        pollTimerRef.current = setInterval(pollForNew, POLL_INTERVAL_MS);
      }
    });

    return () => {
      cancelled = true;
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const title = (
    <p className="text-center text-gray-400 text-[23px] leading-[30px] uppercase tracking-widest mb-8 font-mono">
      Latest Mints
    </p>
  );

  if (loading) {
    return (
      <section className="w-full max-w-3xl mx-auto px-4 py-16">
        {title}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: MAX_ITEMS }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-3xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
        {title}
        <p className="text-red-400 text-xs font-mono text-center max-w-sm">{error}</p>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="w-full max-w-3xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
        {title}
        <p className="text-gray-300 text-xs font-mono">No mints yet. Be the first!</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-16">
      {title}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <MintCard key={item.key} item={item} />
        ))}
      </div>
    </section>
  );
}
