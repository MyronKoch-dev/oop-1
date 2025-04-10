'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { GitHubIssue } from "@/lib/github";

interface IssueCardProps {
    issue: GitHubIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
    // Truncate the body to 150 characters if it's longer
    const truncatedBody = issue.body?.length > 150
        ? `${issue.body.substring(0, 150).trim()}...`
        : issue.body || 'No description provided';

    // Function to clean up markdown syntax
    const cleanMarkdown = (text: string) => {
        return text
            // Remove heading marks
            .replace(/#{1,6}\s+/g, '')
            // Replace lists with bullet points
            .replace(/[-*]\s+/g, '• ')
            // Replace checkboxes
            .replace(/\[\s*[xX]\s*\]/g, '✅ ')
            .replace(/\[\s*\]/g, '◻️ ')
            // Replace double asterisks with nothing (bold)
            .replace(/\*\*(.*?)\*\*/g, '$1')
            // Replace single asterisks with nothing (italic)
            .replace(/\*(.*?)\*/g, '$1')
            // Replace backticks
            .replace(/`([^`]+)`/g, '$1')
            // Replace multiple new lines with just one
            .replace(/\n{3,}/g, '\n\n');
    };

    const cleanedBody = cleanMarkdown(truncatedBody);

    return (
        <Card className="bg-[#1f1f1f] border-[#333333] shadow-md h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg font-medium">
                        {issue.title}
                    </CardTitle>
                    <Badge variant="outline" className="bg-[#2a2a2a] text-white border-[#444444]">
                        #{issue.number}
                    </Badge>
                </div>
                <CardDescription className="text-gray-400 text-sm">
                    Posted by {issue.user.login} • {new Date(issue.created_at).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-white/80 text-sm flex-grow">
                <p className="whitespace-pre-line">{cleanedBody}</p>

                {issue.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {issue.labels.map((label) => (
                            <Badge
                                key={label.id}
                                className="text-xs"
                                style={{
                                    backgroundColor: `#${label.color}20`, // Add transparency to label color
                                    color: `#${label.color}`,
                                    border: `1px solid #${label.color}`
                                }}
                            >
                                {label.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-4 border-t border-[#333333]">
                <Button
                    variant="default"
                    className="w-full bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff]"
                    asChild
                >
                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <span>View Details on GitHub</span>
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
} 