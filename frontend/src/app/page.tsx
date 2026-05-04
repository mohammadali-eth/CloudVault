import { Button } from "@/components/ui/button";
import { Cloud, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-24 min-h-[calc(100vh-16rem)]">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
        <Cloud className="w-4 h-4" />
        <span>Secure Cloud Storage for Professionals</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
        Store your data with <br />
        <span className="text-primary">Absolute Confidence</span>
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-10">
        Cloud Vault provides military-grade encryption and lightning-fast
        access to your files, anywhere in the world.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="h-12 px-8 text-lg gap-2">
          Get Started <ArrowRight className="w-5 h-5" />
        </Button>
        <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
          View Pricing
        </Button>
      </div>
    </div>
  );
}
