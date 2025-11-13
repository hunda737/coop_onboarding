import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UserReport } from "@/features/reports/reportApiSlice";

const generateColor = (index: number) => {
  const shadeVariation = index * 5;
  return `hsl(${200 + shadeVariation}, 70%, 50%)`;
};

type TopFiveStaffsProps = {
  eachBranchUsersAchievements: UserReport[] | undefined;
};

export const TopFiveStaffs: React.FC<TopFiveStaffsProps> = ({
  eachBranchUsersAchievements,
}) => {
  // if (!eachBranchUsersAchievements || eachBranchUsersAchievements.length === 0) {
  //   return (
  //     <Card>
  //       <CardHeader>
  //         <CardTitle className="text-primary">Top Five Staffs</CardTitle>
  //       </CardHeader>
  //       <CardContent>No data available for staff performance.</CardContent>
  //     </Card>
  //   );
  // }

  // Filter out users with accountCount > 0
  const filteredData = eachBranchUsersAchievements?.filter((user) => user);

  if (filteredData?.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Top Five Staffs</CardTitle>
        </CardHeader>
        <CardContent>No staff have registered accounts.</CardContent>
      </Card>
    );
  }

  const chartData = filteredData
    ?.sort((a, b) => b.accountCount - a.accountCount)
    .slice(0, 5)
    .map((user, index) => ({
      staff: user.userName,
      performance: user.accountCount,
      fill: generateColor(index),
    }));

  const dynamicChartConfig = chartData?.reduce((acc, { staff }) => {
    acc[staff] = { label: staff, color: "#007ACC" };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Top Five Staffs</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={dynamicChartConfig || {}}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="staff"
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

export default TopFiveStaffs;
