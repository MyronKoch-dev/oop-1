"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function IssueCardSkeleton() {
  return (
    <Card className="bg-[#1f1f1f] border-[#333333] shadow-md h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-3/5 mt-2" />
      </CardHeader>
      <CardContent className="text-white/80 text-sm flex-grow">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-2" />

        <div className="flex flex-wrap gap-2 mt-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t border-[#333333]">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
