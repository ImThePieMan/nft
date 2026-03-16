import MintCard from "@/components/MintCard";
import Header from "@/components/Header";
import HowToMint from "@/components/HowToMint";

export default function Home() {
  return (
    <main className="flex flex-col items-center bg-gray-50 min-h-screen">
      <Header />

      <HowToMint />

      <div id="mint-section" className="relative z-10 w-full px-4 py-12">
        <MintCard />
      </div>
    </main>
  );
}
