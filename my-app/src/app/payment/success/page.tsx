"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { paymentService } from "@/services/paymentService";
import Navbar from "@/components/layout/Navbar";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTokenBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await paymentService.getTokenBalance(token);
          setTokenBalance(response.data.tokenBalance);
        }
      } catch (error) {
        console.error("Failed to load token balance:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTokenBalance();
  }, []);

  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <Navbar />
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">✓</div>
          <CardTitle className="text-2xl text-green-600">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your tokens have been added to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!loading && tokenBalance !== null && (
            <div className="text-center py-4">
              <Badge variant="outline" className="text-lg px-6 py-3">
                Current Balance: {tokenBalance} Tokens
              </Badge>
            </div>
          )}
          <p className="text-center text-sm text-muted-foreground">
            You can now use your tokens for AI interviews, CV analysis, and more
            features.
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
              Buy More Tokens
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
