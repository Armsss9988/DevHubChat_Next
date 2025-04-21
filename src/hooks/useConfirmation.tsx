"use client";
import { useState } from "react";
import ConfirmationModal from "@/components/UI/ConfirmationModal";

export interface ConfirmationOptions {
  title: string;
  message: string;
  type?: "info" | "warning" | "error" | "success";
  onConfirm: () => Promise<void> | void;
}

const useConfirmation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions | null>(null);

  const requestConfirmation = (
    title: string,
    message: string,
    type: ConfirmationOptions["type"] = "info",
    onConfirm: () => Promise<void> | void
  ) => {
    setOptions({ title, message, type, onConfirm });
    setIsVisible(true);
  };

  const handleConfirm = async () => {
    if (options?.onConfirm) {
      await options.onConfirm();
    }
    setIsVisible(false);
  };

  const handleCancel = () => setIsVisible(false);

  const ConfirmationDialog = () =>
    options && (
      <ConfirmationModal
        isVisible={isVisible}
        title={options.title}
        message={options.message}
        type={options.type}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

  return { requestConfirmation, ConfirmationDialog };
};

export default useConfirmation;
