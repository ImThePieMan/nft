import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { polygon } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "NFT Mint",
  projectId: "60d2acae28e3784b5f2378df5418fb29",
  chains: [polygon],
  ssr: true,
});
