"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function PaymentErrorPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <Navbar />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">✗</div>
          <CardTitle className="text-2xl text-red-600">
            Payment Failed
          </CardTitle>
          <CardDescription>
            There was an error processing your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Your payment could not be processed. Please try again or contact
            support if the problem persists.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push("/payment")} className="w-full">
              Try Again
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
