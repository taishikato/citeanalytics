"use client";

import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

export const LogoutButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      className="flex w-full items-center gap-2"
      disabled={pending}
      type="submit"
    >
      <LogOut className="size-4" />
      Log out
    </button>
  );
};
