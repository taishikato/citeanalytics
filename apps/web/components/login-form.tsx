"use client";

import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { googleLogin } from "@/app/login/actions";
import { GoogleButton } from "@/components/google-button";
import { Quote } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-12 items-center justify-center rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Quote className="size-12" />
            </div>
            <span className="sr-only">{siteConfig.name}</span>
          </Link>
          <h1 className="text-xl font-bold">Welcome to {siteConfig.name}</h1>
          <p className="text-center text-sm text-muted-foreground">
            Sign in to your account. If you don&apos;t yet have an account, it
            will be created automatically.
          </p>
        </div>
        <form action={googleLogin}>
          <p className="text-center text-sm text-muted-foreground mt-4">
            add your sign up button here
          </p>
        </form>
      </div>
    </div>
  );
}
