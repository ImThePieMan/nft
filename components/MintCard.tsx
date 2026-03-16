"use client";

import { useState } from "react";
import Image from "next/image";
import { useAccount, useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
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

  const { isLoading: isConfirming, isSuccess: isMinted } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isWrongNetwork = isConnected && chain?.id !== polygon.id;
  const isSoldOut = totalSupply !== undefined && maxSupply !== undefined && totalSupply >= maxSupply;
  const maxQty = maxMintAmount ? Number(maxMintAmount) : 10;
  const totalPrice = cost ? cost * BigInt(quantity) : 0n;
  const supplyProgress = totalSupply !== undefined && maxSupply !== undefined
    ? Number((totalSupply * 100n) / maxSupply)
    : 0;

  const canMint =
    isConnected &&
    !isWrongNetwork &&
    !paused &&
    !isSoldOut &&
    !isMinting &&
    !isConfirming;

  const getMintButtonLabel = () => {
    if (!isConnected) return "Connect Wallet to Mint";
    if (isWrongNetwork) return "Switch to Polygon";
    if (paused) return "Minting Paused";
    if (isSoldOut) return "Sold Out";
    if (isMinting) return "Waiting for Wallet…";
    if (isConfirming) return "Confirming…";
    return `Mint ${quantity} NFT${quantity > 1 ? "s" : ""}`;
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
        {/* Collection image */}
        <div className="relative aspect-square w-full bg-gradient-to-br from-purple-900/60 via-indigo-900/60 to-blue-900/60">
          <Image
            src="/nft-preview.png"
            alt={collectionName ?? "NFT Collection"}
            fill
            className="object-cover opacity-90"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Collection name badge */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg truncate">
              {isLoadingContract ? (
                <span className="animate-pulse bg-white/20 rounded w-40 h-7 inline-block" />
              ) : (
                collectionName ?? "NFT Collection"
              )}
            </h1>
          </div>

          {/* Status badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            {paused && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/80 text-yellow-100 backdrop-blur-sm">
                Paused
              </span>
            )}
            {isSoldOut && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/80 text-red-100 backdrop-blur-sm">
                Sold Out
              </span>
            )}
            {isWrongNetwork && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/80 text-orange-100 backdrop-blur-sm">
                Wrong Network
              </span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="p-6 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Mint Price</p>
              <p className="text-lg font-bold text-white">
                {isLoadingContract ? (
                  <span className="animate-pulse bg-white/20 rounded w-24 h-5 inline-block" />
                ) : cost !== undefined ? (
                  `${formatEther(cost)} MATIC`
                ) : (
                  "—"
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Max / Wallet</p>
              <p className="text-lg font-bold text-white">
                {isLoadingContract ? (
                  <span className="animate-pulse bg-white/20 rounded w-12 h-5 inline-block" />
                ) : (
                  maxMintAmount !== undefined ? Number(maxMintAmount) : "—"
                )}
              </p>
            </div>
          </div>

          {/* Supply progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Supply</span>
              <span className="text-white font-medium">
                {isLoadingContract ? (
                  <span className="animate-pulse bg-white/20 rounded w-20 h-4 inline-block" />
                ) : (
                  totalSupply !== undefined && maxSupply !== undefined
                    ? `${Number(totalSupply).toLocaleString()} / ${Number(maxSupply).toLocaleString()}`
                    : "—"
                )}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
                style={{ width: `${supplyProgress}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Quantity selector */}
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Quantity</span>
            <QuantitySelector
              quantity={quantity}
              max={maxQty}
              onChange={setQuantity}
              disabled={!canMint}
            />
          </div>

          {/* Total price */}
          <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
            <span className="text-white/60 text-sm">Total</span>
            <span className="text-white font-bold text-lg">
              {cost !== undefined
                ? `${formatEther(totalPrice)} MATIC`
                : "—"}
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
              className="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200
                bg-gradient-to-r from-purple-600 to-indigo-500
                hover:from-purple-500 hover:to-indigo-400
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-indigo-500
                text-white shadow-lg shadow-purple-900/30"
            >
              {getMintButtonLabel()}
            </button>
          )}

          {/* Transaction status */}
          {isMinted && txHash && (
            <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-4 text-center space-y-2">
              <p className="text-green-400 font-semibold text-sm">Minted successfully!</p>
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-300/70 hover:text-green-300 underline underline-offset-2 break-all"
              >
                View on PolygonScan ↗
              </a>
            </div>
          )}

          {mintError && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4">
              <p className="text-red-400 text-sm text-center">
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
