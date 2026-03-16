import MintCard from "@/components/MintCard";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="flex flex-col items-center bg-[#0a0a0f]">
      <Header />

      <div id="mint-section" className="relative z-10 w-full px-4 py-12">
        <MintCard />
      </div>
    </main>
  );
}
