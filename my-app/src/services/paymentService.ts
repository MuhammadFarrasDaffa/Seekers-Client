/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const paymentService = {
  // Get all available packages
  getPackages: async () => {
    try {
      const res = await fetch(`${API_URL}/payment/packages`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch packages");
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  },

  // Create payment transaction
  createPayment: async (packageType: string, token: string) => {
    try {
      const res = await fetch(`${API_URL}/payment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create payment");
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  },

  // Check payment status
  checkStatus: async (orderId: string, token: string) => {
    try {
      const res = await fetch(`${API_URL}/payment/status/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to check payment status");
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async (
    token: string,
    page: number = 1,
    limit: number = 10,
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/payment/history?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch payment history");
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  },

  // Get token balance
  getTokenBalance: async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/payment/balance`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch token balance");
      }

      return data;
    } catch (error: any) {
      throw error;
    }
  },
};
