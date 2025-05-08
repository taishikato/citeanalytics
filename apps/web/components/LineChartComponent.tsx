"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";

type ChartDataItem = {
  day: string;
  chatgpt: number;
  perplexity: number;
  gemini: number;
};

type LineChartComponentProps = {
  data: ChartDataItem[];
};

const chartConfig = {
  chatgpt: {
    label: "ChatGPT",
    color: "oklch(62.8% 0.131 160.5)",
  },
  perplexity: {
    label: "Perplexity",
    color: "oklch(41.5% 0.203 281.6)",
  },
  gemini: {
    label: "Gemini",
    color: "oklch(44.4% 0.186 322.0)",
  },
} satisfies ChartConfig;

export function LineChartComponent({ data }: LineChartComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily AI Visits</CardTitle>
        <CardDescription>Last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              labelFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString();
              }}
            />
            <Line
              dataKey="chatgpt"
              type="monotone"
              stroke="var(--color-chatgpt)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="perplexity"
              type="monotone"
              stroke="var(--color-perplexity)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="gemini"
              type="monotone"
              stroke="var(--color-gemini)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Showing AI visit trends <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Daily visits for the last 30 days
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
