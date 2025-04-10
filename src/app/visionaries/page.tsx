import { Metadata } from 'next';
import { Lightbulb, Wand2, UploadCloud, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Visionary Path | Andromeda Protocol',
    description: 'Submit your ADO or feature ideas to help shape the future of Andromeda Protocol',
};

export default function VisionariesPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4 text-white">Submit Your ADO or Feature Idea</h1>
                    <p className="text-lg text-gray-400 mb-8">
                        Help shape the future of Andromeda by proposing new ADOs (Andromeda Digital Objects)
                        or suggesting features for existing ones. Choose the appropriate template below to get started on GitHub.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col">
                        <div className="mb-4 text-amber-500">
                            <Lightbulb className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-semibold mb-3">Propose a New ADO Idea</h2>
                        <p className="text-gray-400 mb-6 flex-grow">
                            Have a concept for a new Andromeda Digital Object? Share your innovative idea with the community.
                        </p>
                        <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                            <a
                                href="https://github.com/andromedaprotocol/ado-database/issues/new?template=ado-idea-proposal.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                <Lightbulb className="w-4 h-4" />
                                <span>Propose ADO Idea</span>
                            </a>
                        </Button>
                    </div>

                    <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col">
                        <div className="mb-4 text-blue-500">
                            <Wand2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-semibold mb-3">Suggest an ADO Feature</h2>
                        <p className="text-gray-400 mb-6 flex-grow">
                            Have ideas to improve existing ADOs? Suggest new features or enhancements to make them even better.
                        </p>
                        <Button asChild className="w-full bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff]">
                            <a
                                href="https://github.com/andromedaprotocol/ado-database/issues/new?template=ado-feature-request.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                <Wand2 className="w-4 h-4" />
                                <span>Suggest Feature</span>
                            </a>
                        </Button>
                    </div>

                    <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col">
                        <div className="mb-4 text-green-500">
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-semibold mb-3">Submit a Completed ADO</h2>
                        <p className="text-gray-400 mb-6 flex-grow">
                            Already built an ADO? Submit your completed work to be included in the Andromeda ecosystem.
                        </p>
                        <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                            <a
                                href="https://github.com/andromedaprotocol/ado-database/issues/new?template=ado-submission.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                <UploadCloud className="w-4 h-4" />
                                <span>Submit Completed ADO</span>
                            </a>
                        </Button>
                    </div>

                    <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col">
                        <div className="mb-4 text-gray-400">
                            <FilePlus2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-semibold mb-3">Open Blank Issue</h2>
                        <p className="text-gray-400 mb-6 flex-grow">
                            Have a different type of request or feedback? Create a blank issue to share with the Andromeda team.
                        </p>
                        <Button asChild className="w-full bg-[#333333] hover:bg-[#444444] text-white">
                            <a
                                href="https://github.com/andromedaprotocol/ado-database/issues/new"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                <FilePlus2 className="w-4 h-4" />
                                <span>Create Blank Issue</span>
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="text-center p-6 bg-[#1a1a1a] rounded-lg border border-[#333333]">
                    <h2 className="text-xl font-semibold mb-4">Why Contribute Ideas?</h2>
                    <p className="text-gray-400 mb-4">
                        Your ideas help shape the future of the Andromeda ecosystem. By contributing your thoughts and
                        creativity, you&apos;re directly influencing the development of new features and capabilities.
                    </p>
                    <p className="text-gray-400">
                        The Andromeda team reviews all submissions and may reach out to discuss promising ideas further.
                    </p>
                </div>
            </div>
        </main>
    );
} 