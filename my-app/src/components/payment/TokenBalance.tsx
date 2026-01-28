"use client";

import { useEffect, useState } from "react";
import { paymentService } from "@/services/paymentService";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";

export function TokenBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await paymentService.getTokenBalance(token);
        setBalance(response.data.tokenBalance);
      }
    } catch (error) {
      console.error("Failed to load token balance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Badge variant="outline" className="gap-2 rounded-lg">
        <Coins className="h-4 w-4" />
        Loading...
      </Badge>
    );
  }

  return (
    <Badge
      variant={balance > 0 ? "default" : "destructive"}
      className="gap-2 cursor-pointer hover:opacity-80 rounded-lg"
      onClick={() => (window.location.href = "/payment")}
      title="Click to buy more tokens"
    >
      <Coins className="h-4 w-4" />
      {balance} Tokens
    </Badge>
  );
}
