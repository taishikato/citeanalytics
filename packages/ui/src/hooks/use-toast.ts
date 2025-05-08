import { useState } from "react";

type ToastType = "default" | "destructive";

interface Toast {
  title: string;
  description?: string;
  variant?: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = "default" }: Toast) => {
    const newToast = { title, description, variant };
    setToasts((prev) => [...prev, newToast]);

    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== newToast));
    }, 3000);
  };

  return { toast, toasts };
}
