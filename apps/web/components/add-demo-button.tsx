"use client";

import { Button } from "@workspace/ui/components/button";
import { useFormStatus } from "react-dom";

export function AddDemoButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="mt-4" variant="secondary">
      {pending ? "Adding..." : "Add a demo AI visit"}
    </Button>
  );
}
