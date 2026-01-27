import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobSkeleton() {
  return (
    <Card className="border-gray-200 h-full bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="mb-4 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-gray-100 flex justify-between">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </CardFooter>
    </Card>
  );
}
