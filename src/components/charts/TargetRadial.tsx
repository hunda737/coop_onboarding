import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FC } from "react";
import { AccountByStatusByMonth } from "@/features/reports/reportApiSlice";

const chartConfig = {
  others: {
    label: "others",
    color: "hsl(var(--chart-1))",
  },
  approved: {
    label: "approved",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
interface DashboardCardsProps {
  accountsGroupedByStatusAndMonthlyData: AccountByStatusByMonth | undefined;
}

const TargetRadial: FC<DashboardCardsProps> = ({
  accountsGroupedByStatusAndMonthlyData,
}) => {
  const chartData = [
    accountsGroupedByStatusAndMonthlyData
      ? {
          month: "total",
          others:
            accountsGroupedByStatusAndMonthlyData?.PENDING.totalData +
            accountsGroupedByStatusAndMonthlyData?.INITIAL.totalData +
            accountsGroupedByStatusAndMonthlyData?.UNSETTLED.totalData +
            accountsGroupedByStatusAndMonthlyData?.REJECTED.totalData,
          approved: accountsGroupedByStatusAndMonthlyData?.APPROVED.totalData,
        }
      : {
          month: "total",
          others: 0,
          approved: 0,
        },
  ];
  const approvedPercent = (chartData[0].approved / chartData[0].others) * 100;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Approved Accounts</CardTitle>
        <CardDescription>Account approved against total</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[225px] w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {Number(approvedPercent || 0).toFixed(2)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Approved
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="others"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-others)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="approved"
              fill="var(--color-approved)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TargetRadial;
