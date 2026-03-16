"use client";

import { useState } from "react";
import Image from "next/image";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
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
      <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xl">
        {/* Collection image */}
        <div className="relative aspect-square w-full bg-gray-100">
          <Image
            src="/nft-preview.png"
            alt={collectionName ?? "NFT Collection"}
            fill
            className="object-cover opacity-95"
            priority
            unoptimized
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Collection name badge */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg truncate font-mono">
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
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/90 text-yellow-900">
                Paused
              </span>
            )}
            {isSoldOut && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/90 text-white">
                Sold Out
              </span>
            )}
            {isWrongNetwork && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-400/90 text-white">
                Wrong Network
              </span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="p-6 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-mono">Mint Price</p>
              <p className="text-lg font-bold text-gray-900 font-mono">
                {isLoadingContract ? (
                  <span className="animate-pulse bg-gray-200 rounded w-24 h-5 inline-block" />
                ) : cost !== undefined ? (
                  `${formatEther(cost)} MATIC`
                ) : (
                  "—"
                )}
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-mono">Max / Wallet</p>
              <p className="text-lg font-bold text-gray-900 font-mono">
                {isLoadingContract ? (
                  <span className="animate-pulse bg-gray-200 rounded w-12 h-5 inline-block" />
                ) : (
                  maxMintAmount !== undefined ? Number(maxMintAmount) : "—"
                )}
              </p>
            </div>
          </div>

          {/* Supply progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400 font-mono">Supply</span>
              <span className="text-gray-800 font-medium font-mono">
                {isLoadingContract ? (
                  <span className="animate-pulse bg-gray-200 rounded w-20 h-4 inline-block" />
                ) : (
                  totalSupply !== undefined && maxSupply !== undefined
                    ? `${Number(totalSupply).toLocaleString()} / ${Number(maxSupply).toLocaleString()}`
                    : "—"
                )}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${supplyProgress}%` }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Quantity selector */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm font-mono">Quantity</span>
            <QuantitySelector
              quantity={quantity}
              max={maxQty}
              onChange={setQuantity}
              disabled={!canMint}
            />
          </div>

          {/* Total price */}
          <div className="flex items-center justify-between rounded-2xl bg-gray-50 border border-gray-200 px-4 py-3">
            <span className="text-gray-400 text-sm font-mono">Total</span>
            <span className="text-gray-900 font-bold text-lg font-mono">
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
                bg-green-600 hover:bg-green-500
                disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                text-white shadow-lg shadow-green-200"
            >
              {getMintButtonLabel()}
            </button>
          )}

          {/* Transaction status */}
          {isMinted && txHash && (
            <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center space-y-2">
              <p className="text-green-700 font-semibold text-sm">Minted successfully!</p>
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600/70 hover:text-green-700 underline underline-offset-2 break-all font-mono"
              >
                View on PolygonScan ↗
              </a>
            </div>
          )}

          {mintError && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
              <p className="text-red-600 text-sm text-center font-mono">
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
