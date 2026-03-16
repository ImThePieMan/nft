// eslint-disable-next-line @typescript-eslint/no-explicit-any
import contractAbi from "@/abis/contract.json";

export const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CONTRACT_ABI = contractAbi as any[];
