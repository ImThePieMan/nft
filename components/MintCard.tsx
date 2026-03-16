"use client";

import { useState } from "react";
import Image from "next/image";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { polygon } from "wagmi/chains";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contractConfig";
import WalletConnect from "./WalletConnect";
import QuantitySelector from "./QuantitySelector";

export default function MintCard() {
  const [quantity, setQuantity] = useState(1);

  const { address, isConnected, chain } = useAccount();

  const { data: contractData, isLoading: isLoadingContract } = useReadContracts({
    contracts: [
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "name" },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "cost" },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "maxSupply" },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "totalSupply" },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "maxMintAmount" },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "paused" },
      { address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: "symbol" },
    ],
  });

  const collectionName = contractData?.[0]?.result as string | undefined;
  const cost = contractData?.[1]?.result as bigint | undefined;
  const maxSupply = contractData?.[2]?.result as bigint | undefined;
  const totalSupply = contractData?.[3]?.result as bigint | undefined;
  const maxMintAmount = contractData?.[4]?.result as bigint | undefined;
  const paused = contractData?.[5]?.result as boolean | undefined;

  const { writeContract, data: txHash, isPending: isMinting, error: mintError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isMinted } = useWaitForTransactionReceipt({ hash: txHash });

  const isWrongNetwork = isConnected && chain?.id !== polygon.id;
  const isSoldOut = totalSupply !== undefined && maxSupply !== undefined && totalSupply >= maxSupply;
  const maxQty = maxMintAmount ? Number(maxMintAmount) : 10;
  const totalPrice = cost ? cost * BigInt(quantity) : 0n;
  const supplyProgress =
    totalSupply !== undefined && maxSupply !== undefined
      ? Number((totalSupply * 100n) / maxSupply)
      : 0;

  const canMint =
    isConnected && !isWrongNetwork && !paused && !isSoldOut && !isMinting && !isConfirming;

  const getMintButtonLabel = () => {
    if (!isConnected) return "Connect Wallet to Mint";
    if (isWrongNetwork) return "Switch to Polygon";
    if (paused) return "Minting Paused";
    if (isSoldOut) return "Sold Out";
    if (isMinting) return "Waiting for Wallet…";
    if (isConfirming) return "Confirming…";
    return `▶ MINT ${quantity} NFT${quantity > 1 ? "s" : ""}`;
  };

  const handleMint = () => {
    if (!address || !cost) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "mint",
      args: [address, BigInt(quantity)],
      value: totalPrice,
    });
  };

  const labelStyle = {
    fontFamily: "var(--font-press-start), monospace",
    fontSize: "9px",
    color: "#111111",
    lineHeight: "1.7",
  } as React.CSSProperties;

  const valueStyle = {
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    fontSize: "16px",
    color: "#111111",
    fontWeight: 600,
  } as React.CSSProperties;

  const retrolabelStyle = {
    fontFamily: "var(--font-vt323), monospace",
    fontSize: "20px",
    color: "#111111",
  } as React.CSSProperties;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="retro-window">

        {/* Window header */}
        <div className="retro-window-header">
          <span className="truncate">Mint_NFT.exe</span>
          <div className="retro-window-close">✕</div>
        </div>

        {/* Collection image */}
        <div className="relative aspect-square w-full" style={{ borderBottom: "3px solid #1A1A1A" }}>
          <Image
            src="/nft-preview.png"
            alt={collectionName ?? "NFT Collection"}
            fill
            className="object-cover"
            style={{ imageRendering: "pixelated" }}
            priority
            unoptimized
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          {/* Status badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {paused && (
              <span
                className="px-2 py-1"
                style={{
                  fontFamily: "var(--font-press-start), monospace",
                  fontSize: "9px",
                  background: "#F9A822",
                  border: "2px solid #1A1A1A",
                  color: "#111111",
                }}
              >
                PAUSED
              </span>
            )}
            {isSoldOut && (
              <span
                className="px-2 py-1"
                style={{
                  fontFamily: "var(--font-press-start), monospace",
                  fontSize: "9px",
                  background: "#E96635",
                  border: "2px solid #1A1A1A",
                  color: "white",
                }}
              >
                SOLD OUT
              </span>
            )}
            {isWrongNetwork && (
              <span
                className="px-2 py-1"
                style={{
                  fontFamily: "var(--font-press-start), monospace",
                  fontSize: "9px",
                  background: "#E96635",
                  border: "2px solid #1A1A1A",
                  color: "white",
                }}
              >
                WRONG NETWORK
              </span>
            )}
          </div>

          {/* Collection name badge */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 py-3"
            style={{ background: "rgba(249,168,34,0.92)", borderTop: "3px solid #1A1A1A" }}
          >
            <p
              style={{
                fontFamily: "var(--font-press-start), monospace",
                fontSize: "10px",
                color: "#111111",
                lineHeight: "1.5",
              }}
            >
              {isLoadingContract ? "Loading…" : (collectionName ?? "NFT Collection")}
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="retro-window-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Wallet: Connected / Price row */}
          <div
            className="grid grid-cols-2 gap-3"
          >
            <div
              className="p-3"
              style={{ border: "2px solid #1A1A1A", background: "#93D3AE" }}
            >
              <p style={labelStyle}>Mint Price</p>
              <p style={valueStyle}>
                {isLoadingContract ? (
                  <span style={{ opacity: 0.4 }}>…</span>
                ) : cost !== undefined ? (
                  `${formatEther(cost)} POL`
                ) : "—"}
              </p>
            </div>
            <div
              className="p-3"
              style={{ border: "2px solid #1A1A1A", background: "#93D3AE" }}
            >
              <p style={labelStyle}>Max / Wallet</p>
              <p style={valueStyle}>
                {isLoadingContract ? (
                  <span style={{ opacity: 0.4 }}>…</span>
                ) : maxMintAmount !== undefined ? Number(maxMintAmount) : "—"}
              </p>
            </div>
          </div>

          {/* Supply progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span style={retrolabelStyle}>Supply</span>
              <span style={{ ...retrolabelStyle, fontFamily: "var(--font-ibm-plex-mono), monospace", fontSize: "16px" }}>
                {isLoadingContract ? "…" : (
                  totalSupply !== undefined && maxSupply !== undefined
                    ? `${Number(totalSupply).toLocaleString()} / ${Number(maxSupply).toLocaleString()}`
                    : "—"
                )}
              </span>
            </div>
            <div
              className="w-full overflow-hidden"
              style={{ height: "16px", border: "2px solid #1A1A1A", background: "#FAECB6" }}
            >
              <div
                style={{
                  width: `${supplyProgress}%`,
                  height: "100%",
                  background: "#E96635",
                  transition: "width 0.5s",
                }}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "2px solid #1A1A1A" }} />

          {/* Quantity selector */}
          <div className="flex items-center justify-between">
            <span style={retrolabelStyle}>Quantity</span>
            <QuantitySelector
              quantity={quantity}
              max={maxQty}
              onChange={setQuantity}
              disabled={!canMint}
            />
          </div>

          {/* Total price */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ border: "2px solid #1A1A1A", background: "#93D3AE" }}
          >
            <span style={retrolabelStyle}>Total</span>
            <span
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: "18px",
                color: "#111111",
                fontWeight: 600,
              }}
            >
              {cost !== undefined ? `${formatEther(totalPrice)} POL` : "—"}
            </span>
          </div>

          {/* Wallet connect / Mint button */}
          {!isConnected ? (
            <div className="flex justify-center">
              <WalletConnect />
            </div>
          ) : (
            <button
              onClick={handleMint}
              disabled={!canMint}
              className="retro-mint-btn"
            >
              {getMintButtonLabel()}
            </button>
          )}

          {/* Transaction status */}
          {isMinted && txHash && (
            <div
              className="p-4 text-center"
              style={{ border: "2px solid #1A1A1A", background: "#93D3AE" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-press-start), monospace",
                  fontSize: "9px",
                  color: "#111111",
                  lineHeight: "1.7",
                  marginBottom: "8px",
                }}
              >
                ✓ Minted successfully!
              </p>
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  fontSize: "12px",
                  color: "#111111",
                  textDecoration: "underline",
                  wordBreak: "break-all",
                }}
              >
                View on PolygonScan ↗
              </a>
            </div>
          )}

          {mintError && (
            <div
              className="p-4 text-center"
              style={{ border: "2px solid #1A1A1A", background: "#E96635" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-vt323), monospace",
                  fontSize: "20px",
                  color: "white",
                }}
              >
                {mintError.message.includes("User rejected")
                  ? "Transaction rejected."
                  : "Transaction failed. Please try again."}
              </p>
            </div>
          )}

          {/* Connected wallet info */}
          {isConnected && !isMinted && (
            <div className="flex justify-center">
              <WalletConnect />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
