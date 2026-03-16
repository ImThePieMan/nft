import MintCard from "@/components/MintCard";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[#0a0a0f]">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-900/30 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-900/30 blur-3xl" />
      </div>

      <div className="relative z-10 w-full">
        <MintCard />
      </div>
    </main>
  );
}
