"use client";

import { fetchSupavec } from "@/app/dashboard/actions";
import { AddDemoButton } from "./add-demo-button";
import { useRouter } from "next/navigation";

export function AddDemoForm() {
  const router = useRouter();
  return (
    <form
      action={async () => {
        await fetchSupavec();
        router.refresh();
      }}
    >
      <AddDemoButton />
    </form>
  );
}
