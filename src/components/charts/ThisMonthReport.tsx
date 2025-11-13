import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { CurrentMonthProps } from "@/features/reports/reportApiSlice";
import { FC } from "react";

const chartConfig = {
  acheivements: {
    label: "Achievements",
    color: "hsl(var(--chart-1))",
  },
  difference: {
    label: "Difference",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

type ThisMonthReportProps = {
  currentMonthTargetAchievements: CurrentMonthProps[] | undefined;
};

const ThisMonthReport: FC<ThisMonthReportProps> = ({ currentMonthTargetAchievements }) => {
  const chartData = currentMonthTargetAchievements?.map((data) => ({
    ...data,
    percentage: ((data.achievements / data.target) * 100).toFixed(0),
    difference: Math.max(data.target - data.achievements, 0),
  }));
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>This Month Vs Target</CardTitle>
        <CardDescription>November</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[140px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            className="pr-2"
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={0}
              axisLine={false}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="acheivements"
              layout="vertical"
              fill="var(--color-acheivements)"
              stackId="a"
              radius={[4, 0, 0, 4]}
            >
              <LabelList
                dataKey="percentage"
                position="insideRight"
                offset={0}
                className="fill-secondary"
                fontSize={12}
                formatter={(value: unknown) => `${value}%`}
              />
            </Bar>
            <Bar
              dataKey="difference"
              layout="vertical"
              fill="var(--color-difference)"
              stackId="a" // Stacking for overlap
              radius={[0, 4, 4, 0]}
            >
              <LabelList
                dataKey="difference"
                position="right"
                offset={12}
                className="fill-primary"
                fontSize={12}
                formatter={(value: unknown) => `${value}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ThisMonthReport;
