import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BranchReport } from "@/features/reports/reportApiSlice";

// Function to generate progressively darker shades of blue
const generateColor = (index: number) => {
  const shadeVariation = index * 5; // Adjust the variation for each bar
  return `hsl(${200 + shadeVariation}, 70%, 80%)`; // Lighter color at the top, darker as index increases
};

type BottomFiveBranchesProps = {
  detailedBranchReports: Record<string, BranchReport> | undefined;
};

export const BottomFiveBranches: React.FC<BottomFiveBranchesProps> = ({
  detailedBranchReports,
}) => {
  // Ensure branchReports is not undefined or null
  if (!detailedBranchReports) {
    return null; // Render a fallback UI if branchReports is undefined
  }

  // Prepare chart data
  const chartData = Object.entries(detailedBranchReports)
    .map(([branch, report], index) => ({
      branch, // Keep branch name from data
      performance: report.totalAccounts,
      fill: generateColor(index), // Use the dynamic color
    }))
    .sort((a, b) => a.performance - b.performance) // Sort by performance in ascending order
    .slice(0, 5); // Take the bottom 5 branches

  // Generate dynamic chartConfig based on the actual data
  const dynamicChartConfig = chartData?.reduce((acc, { branch }) => {
    acc[branch] = { label: branch, color: "#007ACC" }; // Add color dynamically if needed
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Bottom Five Branches</CardTitle>
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
              tickMargin={10}
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

export default BottomFiveBranches;
