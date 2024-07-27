import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">Aciertamente 🤙</h1>

      <Button className="font-bold text-xl" asChild>
        <Link href="/play">Play</Link>
      </Button>
    </main>
  );
}
