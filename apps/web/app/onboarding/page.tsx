import { Card, CardContent } from "@workspace/ui/components/card";
import { OnboardingForm } from "./_components/onboarding-form";
import { siteConfig } from "@/lib/config";

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome to {siteConfig.name}</h1>
        <p className="text-muted-foreground">
          Tell us a bit about yourself to personalize your experience
        </p>
      </div>
      <Card>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}
