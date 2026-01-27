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

export default function PaymentPendingPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <Navbar />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">⏳</div>
          <CardTitle className="text-2xl text-yellow-600">
            Payment Pending
          </CardTitle>
          <CardDescription>Your payment is being processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            We are waiting for your payment confirmation. Tokens will be added
            to your account once the payment is confirmed.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push("/payment")}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
