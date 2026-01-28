"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "info" | "warning" | "error" | "success" | "confirm";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  onConfirm,
  confirmText = "OK",
  cancelText = "Batal",
  showCancel = false,
}: ModalProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "confirm":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "warning":
        return "border-yellow-200";
      case "error":
        return "border-red-200";
      case "success":
        return "border-green-200";
      case "confirm":
        return "border-yellow-200";
      default:
        return "border-blue-200";
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity duration-300">
      <Card
        className={`w-full max-w-md bg-white shadow-2xl ${getBorderColor()} border-2 transform transition-all duration-300 scale-100 opacity-100`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 pt-0">
          {showCancel && (
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 hover:bg-gray-50"
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className={`px-6 ${
              type === "error"
                ? "bg-red-600 hover:bg-red-700"
                : type === "warning" || type === "confirm"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : type === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Hook untuk mengelola modal state
export const useModal = () => {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: "info" | "warning" | "error" | "success" | "confirm";
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showModal = (config: {
    title: string;
    message: string;
    type?: "info" | "warning" | "error" | "success" | "confirm";
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
  }) => {
    setModal({
      isOpen: true,
      ...config,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const showAlert = (
    title: string,
    message: string,
    type?: "info" | "warning" | "error" | "success",
  ) => {
    showModal({
      title,
      message,
      type,
      showCancel: false,
    });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
    },
  ) => {
    return new Promise<boolean>((resolve) => {
      showModal({
        title,
        message,
        type: "confirm",
        showCancel: true,
        onConfirm: () => {
          onConfirm();
          resolve(true);
        },
        confirmText: options?.confirmText,
        cancelText: options?.cancelText,
      });
    });
  };

  return {
    modal,
    showModal,
    closeModal,
    showAlert,
    showConfirm,
    Modal: () => (
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        showCancel={modal.showCancel}
      />
    ),
  };
};

export default Modal;
