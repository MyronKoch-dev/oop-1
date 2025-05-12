import { Metadata } from "next";
import { Lightbulb, Wand2, UploadCloud, MessageSquare, Sparkles } from "lucide-react"; // Added MessageSquare, Sparkles, removed FilePlus2
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Visionary Path | Andromeda Protocol",
  description:
    "Share your ADO or feature ideas to help shape the future of Andromeda Protocol through GitHub Discussions.",
};

export default function VisionariesPage() {
  const baseDiscussionUrl = "https://github.com/andromedaprotocol/ado-database-hackerboard/discussions/new?category=";

  return (
    <main className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen bg-black text-white">
      {/* Removed redundant inner container div */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-white">
          💡 Visionary 💡
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-3xl mx-auto">
          Share Your Ideas & Creations!
          Help shape the future of Andromeda by proposing new ADOs (Andromeda
          Digital Objects), suggesting features, or sharing your projects. Start a discussion in the appropriate category on GitHub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"> {/* Changed to lg:grid-cols-3 for 5 items */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col hover:shadow-lg hover:border-gray-500 transition-all duration-300">
          <div className="mb-4 text-amber-500">
            <Lightbulb className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-3">
            Propose a New ADO Idea
          </h2>
          <p className="text-gray-400 mb-6 flex-grow">
            Have a concept for a new Andromeda Digital Object? Share your
            innovative idea with the community.
          </p>
          <Button
            asChild
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            <a
              href={`${baseDiscussionUrl}ado-idea-proposals`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Discuss ADO Idea</span>
            </a>
          </Button>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col hover:shadow-lg hover:border-gray-500 transition-all duration-300">
          <div className="mb-4 text-blue-500">
            <Wand2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-3">
            Suggest an ADO Feature
          </h2>
          <p className="text-gray-400 mb-6 flex-grow">
            Have ideas to improve existing ADOs? Suggest new features or
            enhancements to make them even better.
          </p>
          <Button
            asChild
            className="w-full bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff]"
          >
            <a
              href={`${baseDiscussionUrl}ado-feature-requests`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>Suggest Feature</span>
            </a>
          </Button>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col hover:shadow-lg hover:border-gray-500 transition-all duration-300">
          <div className="mb-4 text-[#e74c3c]">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-3">
            Submit a Completed ADO
          </h2>
          <p className="text-gray-400 mb-6 flex-grow">
            Already built an ADO? Share it with the community for evaluation and potential inclusion.
          </p>
          <Button
            asChild
            className="w-full bg-[#e74c3c] hover:bg-[#c0392b] text-white"
          >
            <a
              href={`${baseDiscussionUrl}ado-submissions`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Discuss ADO Submission</span>
            </a>
          </Button>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col hover:shadow-lg hover:border-gray-500 transition-all duration-300">
          <div className="mb-4 text-[#f39c12]">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Show and Tell</h2>
          <p className="text-gray-400 mb-6 flex-grow">
            Built something cool with Andromeda? Share your projects, demos, and creations with the community!
          </p>
          <Button
            asChild
            className="w-full bg-[#f39c12] hover:bg-[#d35400] text-white"
          >
            <a
              href={`${baseDiscussionUrl}show-and-tell`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Share Your Project</span>
            </a>
          </Button>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col hover:shadow-lg hover:border-gray-500 transition-all duration-300">
          <div className="mb-4 text-gray-400">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-3">General Discussion</h2>
          <p className="text-gray-400 mb-6 flex-grow">
            Have other feedback, questions, or topics to discuss with the Andromeda team and community?
          </p>
          <Button
            asChild
            className="w-full bg-[#333333] hover:bg-[#444444] text-white"
          >
            <a
              href={`${baseDiscussionUrl}general-feedback`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Start Discussion</span>
            </a>
          </Button>
        </div>

      </div>

      <div className="text-center p-6 bg-[#1a1a1a] rounded-lg border border-[#333333]">
        <h2 className="text-xl font-semibold mb-4">Why Share Your Ideas?</h2>
        <p className="text-gray-400 mb-4">
          Your ideas and creations help shape the future of the Andromeda ecosystem. By
          contributing your thoughts and creativity, you are directly
          influencing the development of new features and capabilities.
        </p>
        <p className="text-gray-400">
          The Andromeda team reviews all discussions and may reach out to
          discuss promising ideas further.
        </p>
      </div>
      {/* Removed closing tag for redundant inner container div */}
    </main>
  );
}
