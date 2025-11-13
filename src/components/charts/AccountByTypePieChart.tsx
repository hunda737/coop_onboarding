import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AccountByType } from "@/features/reports/reportApiSlice";

type AccountByTypePieChartProps = {
  detailedBranchReports: AccountByType | undefined;
};

// Predefined color map for account types
const colorMap: Record<string, string> = {
  "Fixed Time Deposit Account": "#00ADEF",
  "Non-Repatriable Birr Account": "#A3E6FF",
  "Deposit Account": "#EE7B28",
  "Diaspora Wadia Saving Account": "#7ACDF3",
};

const AccountByTypePieChart: React.FC<AccountByTypePieChartProps> = ({
  detailedBranchReports,
}) => {
  // Map the accountByAccountType to chartData
  const chartData = React.useMemo(() => {
    return (
      detailedBranchReports &&
      Object.entries(detailedBranchReports).map(([accountType, count]) => ({
        accountType,
        count,
        fill: colorMap[accountType] || "#CCCCCC", // Default color if not in colorMap
      }))
    );
  }, [detailedBranchReports]);

  // Calculate the total accounts
  const totalAccounts = React.useMemo(() => {
    return chartData && chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  // Generate chartConfig dynamically
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    chartData?.forEach(({ accountType, fill }) => {
      config[accountType] = {
        label: accountType,
        color: fill,
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Registered Accounts by Type</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[225px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="accountType"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAccounts?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Accounts
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AccountByTypePieChart;
