"use client";

import { CartesianGrid, LabelList, Line, LineChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Updated chart data with both actual and predicted data
const chartData = [
  { month: "January", actual: 186, prediction: null },
  { month: "February", actual: 305, prediction: null },
  { month: "March", actual: 237, prediction: null },
  { month: "April", actual: 73, prediction: null },
  { month: "May", actual: 209, prediction: null },
  { month: "June", actual: 214, prediction: null },
  { month: "July", actual: null, prediction: 250 },
  { month: "August", actual: null, prediction: 270 },
  { month: "September", actual: null, prediction: 300 },
];

const chartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-1))",
  },
  prediction: {
    label: "Prediction",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const PredictionGraph = () => {
  return (
    <ChartContainer config={chartConfig} className="h-28 w-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        {/* <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        /> */}
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        {/* Actual Line */}
        <Line
          dataKey="actual"
          type="natural"
          stroke="var(--color-actual)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-actual)",
          }}
          activeDot={{
            r: 6,
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>

        {/* Prediction Line */}
        <Line
          dataKey="prediction"
          type="natural"
          stroke="var(--color-prediction)"
          strokeWidth={2}
          strokeDasharray="5 5" // Dashed line for predictions
          dot={{
            fill: "var(--color-prediction)",
          }}
          activeDot={{
            r: 6,
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
      </LineChart>
    </ChartContainer>
  );
};

export default PredictionGraph;
