"use client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleGetStarted = () => {
    if (session?.user) {
      router.push("/dashboard" as any);
    } else {
      router.push("/login" as any);
    }
  };

  return (
    <div className="min-h-screen bg-background antialiased">
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
