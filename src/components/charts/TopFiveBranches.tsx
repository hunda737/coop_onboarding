import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BranchReport } from "@/features/reports/reportApiSlice";

// Function to generate varying colors based on index
const generateColor = (index: number) => {
  const shadeVariation = index * 5; // Adjust the variation for each bar
  return `hsl(${200 + shadeVariation}, 70%, 50%)`; // Lighten/darken based on index
};

type TopFiveBranchesProps = {
  detailedBranchReports: Record<string, BranchReport> | undefined;
};

export const TopFiveBranches: React.FC<TopFiveBranchesProps> = ({
  detailedBranchReports,
}) => {
  // Ensure branchReports is not undefined or null
  if (!detailedBranchReports) {
    return null; // or you could render a fallback UI like a loading spinner or an error message
  }

  // Prepare chart data
  const chartData = Object.entries(detailedBranchReports)
    .map(([branch, report], index) => ({
      branch, // Keep branch name from data
      performance: report.totalAccounts,
      fill: generateColor(index), // Use the dynamic color
    }))
    .sort((a, b) => b.performance - a.performance) // Sort by performance in descending order
    .slice(0, 5); // Take the top 5 branches

  // Generate dynamic chartConfig based on the actual data
  const dynamicChartConfig = chartData?.reduce((acc, { branch }) => {
    acc[branch] = { label: branch, color: "#007ACC" }; // Add color dynamically if needed
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Top Five Branches</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={dynamicChartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="branch"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value) =>
                dynamicChartConfig?.[value]?.label || value
              }
            />
            <XAxis dataKey="performance" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="performance" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TopFiveBranches;
