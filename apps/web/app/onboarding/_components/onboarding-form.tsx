"use client";

import { siteConfig } from "@/lib/config";
import { OnboardingSubmitButton } from "./onboarding-submit-button";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { completeOnboarding } from "..//actions";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";

export const OnboardingForm = () => {
  const posthog = usePostHog();

  return (
    <form
      className="space-y-6"
      action={async (formData) => {
        posthog.capture("signup_completed");
        const result = await completeOnboarding(formData);

        if (result.error) {
          toast.error(result.error);
        }
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" name="name" placeholder="Elon Musk" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="goal">Main Goal with Supavec</Label>
        <Input
          id="goal"
          name="goal"
          placeholder={`Use ${siteConfig.name} to build AI apps`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="occupation">What do you do in life?</Label>
        <Textarea
          id="job"
          name="job"
          placeholder="Tell us about your occupation or main activities"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="source">How did you hear about Supavec?</Label>
        <Input
          id="how_know"
          name="how_know"
          placeholder="Google, Twitter, etc."
        />
      </div>
      <OnboardingSubmitButton />
    </form>
  );
};
