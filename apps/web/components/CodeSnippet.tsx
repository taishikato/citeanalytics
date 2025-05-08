import { Highlight } from "@/lib/config";
import { CodeBlock, CodeBlockCode } from "./code-block";

export const CodeSnippet = () => {
  return (
    <CodeBlockCode
      className="bg-background"
      language="typescript"
      code={`fetch("${process.env.NEXT_PUBLIC_APP_URL}/api/track", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    projectId: <PROJECT_ID>,
    url,
    userAgent,
  }),
});`}
    />
  );
};
