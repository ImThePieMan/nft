import MintCard from "@/components/MintCard";
import Header from "@/components/Header";
import HowToMint from "@/components/HowToMint";
import LatestMints from "@/components/LatestMints";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen" style={{ background: "#2BABA5" }}>
      <Header />
      <div id="mint-section" className="relative z-10 w-full px-4 pt-4 pb-12 max-w-screen-lg mx-auto">
        <MintCard />
      </div>
      <LatestMints />
      <HowToMint />
    </main>
  );
}
