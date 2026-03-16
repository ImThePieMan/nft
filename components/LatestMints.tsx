"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {!imgError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
            className="w-full h-full object-cover pointer-events-none"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-gray-200 text-3xl select-none">◈</span>
        )}
      </div>

      <div className="px-4 py-4 flex flex-col gap-3 flex-1">
        <p className="text-gray-800 text-sm font-semibold truncate">{item.name}</p>

        <div className="flex flex-col gap-1">
          <p className="text-gray-400 text-xs font-mono">
            <span className="text-gray-300 uppercase tracking-widest">ID </span>
            {item.tokenId.toString()}
          </p>
          <p className="text-gray-400 text-xs font-mono truncate">
            <span className="text-gray-300 uppercase tracking-widest">BY </span>
            {shortenAddress(item.owner)}
          </p>
        </div>

        <a
          href={`${EXPLORER_NFT}${item.tokenId.toString()}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto text-[11px] font-mono uppercase tracking-widest text-gray-300 hover:text-gray-500 transition-colors duration-150"
        >
          View on Polygonscan ↗
        </a>
      </div>
    </div>
  );
}

// ── Card width (1.5× the original 240 px) ────────────────────────────────────
const CARD_W = 360;     // px
const CARD_GAP = 16;    // px (gap-4)
// Sub-pixel speed: accumulated in accRef and flushed as integer px steps.
// 0.35 acc/frame × 60fps ≈ 21 px/s — slow and smooth.
const SCROLL_SPEED = 0.15;

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-pulse shrink-0"
      style={{ width: CARD_W }}
    >
      <div className="aspect-square bg-gray-100" />
      <div className="px-4 py-4 flex flex-col gap-3">
        <div className="h-3 w-3/4 rounded bg-gray-100" />
        <div className="h-2.5 w-1/2 rounded bg-gray-100" />
        <div className="h-2.5 w-2/3 rounded bg-gray-100" />
      </div>
    </div>
  );
}


// ── Main component ────────────────────────────────────────────────────────────

export default function LatestMints() {
  const [items, setItems] = useState<MintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const knownSupplyRef   = useRef<bigint>(0n);
  const pollTimerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef         = useRef<HTMLDivElement>(null);
  const rafRef           = useRef<number | null>(null);
  const accRef           = useRef(0);      // sub-pixel accumulator
  const isPausedRef      = useRef(false);  // true while user drags
  const dragStartXRef    = useRef(0);
  const dragScrollRef    = useRef(0);

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

  // ── Continuous RAF scroll ─────────────────────────────────────────────────────
  // Sub-pixel accumulation: SCROLL_SPEED < 1 is collected in accRef and only
  // applied to scrollLeft when it crosses an integer boundary, avoiding
  // the browser's rounding that would otherwise freeze fractional increments.

  useEffect(() => {
    if (items.length === 0) return;

    function tick() {
      const el = trackRef.current;
      if (el && !isPausedRef.current) {
        accRef.current += SCROLL_SPEED;
        if (accRef.current >= 1) {
          const px = Math.floor(accRef.current);
          accRef.current -= px;
          // Seamless loop: when we pass the midpoint, jump back
          const half = el.scrollWidth / 2;
          el.scrollLeft = (el.scrollLeft + px >= half)
            ? el.scrollLeft + px - half
            : el.scrollLeft + px;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [items]);

  // ── Drag-to-scroll ────────────────────────────────────────────────────────────
  // Uses window-level listeners so drag never breaks when the cursor leaves the div.

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    e.preventDefault(); // prevent text selection

    isPausedRef.current   = true;
    dragStartXRef.current = e.clientX;
    dragScrollRef.current = el.scrollLeft;
    el.style.cursor       = "grabbing";

    const onMove = (ev: MouseEvent) => {
      el.scrollLeft = dragScrollRef.current - (ev.clientX - dragStartXRef.current);
    };
    const onUp = () => {
      isPausedRef.current = false;
      el.style.cursor     = "grab";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  }, []);

  // ── Shared section title ──────────────────────────────────────────────────────

  const title = (
    <p className="text-center text-gray-400 text-[23px] leading-[30px] uppercase tracking-widest mb-8 font-mono">
      Latest Mints
    </p>
  );

  // ── Loading ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <section className="w-full py-16">
        {title}
        <div className="flex gap-4 overflow-hidden px-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <section className="w-full py-16 flex flex-col items-center gap-4 px-4">
        {title}
        <p className="text-red-400 text-xs font-mono text-center max-w-sm">{error}</p>
      </section>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────────

  if (!items.length) {
    return (
      <section className="w-full py-16 flex flex-col items-center gap-4 px-4">
        {title}
        <p className="text-gray-300 text-xs font-mono">No mints yet. Be the first!</p>
      </section>
    );
  }

  // Duplicate for seamless loop: when we reach the midpoint we reset to 0
  const displayItems = [...items, ...items];

  return (
    <section className="w-full py-16 overflow-hidden">
      {title}

      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        className="flex gap-4 overflow-x-auto pb-2
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none"
        style={{ paddingLeft: 24, paddingRight: 24, cursor: "grab" }}
      >
        {displayItems.map((item, idx) => (
          <div key={`${item.key}-${idx}`} className="shrink-0" style={{ width: CARD_W }}>
            <MintCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
