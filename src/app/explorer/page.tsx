import { BookOpen } from "lucide-react";
import { DiveInSection } from "@/components/ui/DiveInSection";

export const metadata = {
  title: "Explorer Path | Andromeda Protocol",
  description:
    "Explore Andromeda resources, tutorials, and learning materials. Find links, images, and videos here.",
};

export default function ExplorerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-foreground flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8 text-accent" /> Explorer Path
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dive into the Andromeda ecosystem! Discover tutorials, guides, and
            learning resources to help you get started and grow your knowledge.
          </p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6 mb-8 text-center">
          <a
            href="https://andromedaprotocol.io/learn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-md hover:bg-accent/90 transition-colors text-lg mb-4"
          >
            Andromeda Learn Portal
          </a>
          <div className="mt-6">
            <p className="text-muted-foreground">More resources coming soon!</p>
            {/* TODO: Add images and videos here */}
          </div>
        </div>
        <DiveInSection />
      </div>
    </main>
  );
}
