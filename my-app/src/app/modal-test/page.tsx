"use client";

import { useModal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ModalTest() {
  const { showAlert, showConfirm, Modal } = useModal();

  const testAlert = () => {
    showAlert(
      "Test Alert",
      "Ini adalah test alert dengan modal custom",
      "warning",
    );
  };

  const testConfirm = () => {
    showConfirm(
      "Test Confirm",
      "Apakah Anda yakin ingin melanjutkan?",
      () => {
        alert("Confirmed!");
      },
      {
        confirmText: "Ya, Lanjutkan",
        cancelText: "Batal",
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Modal Test</h1>

        <div className="space-y-4">
          <Button
            onClick={testAlert}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Test Alert Modal
          </Button>

          <Button
            onClick={testConfirm}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Test Confirm Modal
          </Button>
        </div>
      </Card>

      <Modal />
    </div>
  );
}
