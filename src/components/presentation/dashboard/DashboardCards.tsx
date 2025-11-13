import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Activity,
  Loader,
  UserCheck,
  UserX as UserRoundX,
  Book,
  Icon as LucideIcon,
} from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  AccountByStatusByMonth,
  MonthlyData,
} from "@/features/reports/reportApiSlice";


// Type definitions
interface ChartData {
  month: string;
  value: number;
}

interface StatCardProps {
  title: string;
  icon: typeof LucideIcon;
  color: string;
  value: string | number;
  chartData: ChartData[];
  lineColor: string;
}

interface DashboardCardsProps {
  accountsGroupedByStatusAndMonthlyData: AccountByStatusByMonth | undefined;
}

// Utility to sort months in chronological order
const monthOrder = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const cardOrder = [
  "APPROVED",
  "AUTHORIZED",
  "PENDING",
  "UNSETTLED",
  "INITIAL",
  "REJECTED",
];

const sortChartDataByMonth = (data: ChartData[]): ChartData[] => {
  return data.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );
};
// Function to sort card data by defined order
const sortCardData = (data: StatCardProps[]): StatCardProps[] => {
  return data.sort((a, b) => {
    const titleA = a.title.toUpperCase();
    const titleB = b.title.toUpperCase();
    return cardOrder.indexOf(titleA) - cardOrder.indexOf(titleB);
  });
};

// StatCard component
const StatCard: React.FC<StatCardProps> = ({
  title,
  color,
  value,
  chartData,
  lineColor,
}) => {
  const chartConfig = {
    value: {
      label: "Value",
      color: lineColor,
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between relative space-y-0 pb-1">
        <CardTitle className={`text-lg font-medium ${color}`}>
          {title === "Initial" ? "Prospective" : title}
        </CardTitle>
        <Book size={24} color={lineColor} />
      </CardHeader>
      <CardContent>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          <ChartContainer config={chartConfig} className="w-full h-10 -mt-1">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={1}
                dot={{ fill: lineColor, r: 1 }}
              />
            </LineChart>
          </ChartContainer>
        </p>
      </CardContent>
    </Card>
  );
};

// DashboardCards component
const statusIconMap: Record<string, typeof LucideIcon> = {
  APPROVED: UserCheck,
  PENDING: Loader,
  REJECTED: UserRoundX,
  UNSETTLED: Activity,
};

const DashboardCards: React.FC<DashboardCardsProps> = ({
  accountsGroupedByStatusAndMonthlyData,
}) => {
  const cardData =
    accountsGroupedByStatusAndMonthlyData &&
    Object.keys(accountsGroupedByStatusAndMonthlyData).map((status) => {
      const statusData = accountsGroupedByStatusAndMonthlyData[status];
      const icon = statusIconMap[status] || Book;
      const lineColor =
        {
          APPROVED: "#00A9E8",
          PENDING: "#8080A9",
          REJECTED: "#DE8224",
          UNSETTLED: "#505050",
        }[status] || "#000000";
      const color =
        {
          APPROVED: "text-[#00A9E8]",
          AUTHORIZED: "text-[#00A9E8]",
          PENDING: "text-[#8080A9]",
          REJECTED: "text-[#DE8224]",
          UNSETTLED: "text-[#505050]",
        }[status] || "text-black";

      // Convert and sort the API data for the chart
      const chartData = sortChartDataByMonth(
        Object.keys(statusData.data).map((month) => ({
          month: month.slice(0, 3), // display key
          value: statusData.data[month as keyof MonthlyData] || 0,
        }))
      );
      
      
      return {
        title: status.charAt(0) + status.slice(1).toLowerCase(), // Capitalize status name
        icon,
        color,
        value: statusData.totalData,
        chartData,
        lineColor,
      };
    });

  // Sort cards based on the predefined order
  const sortedCardData = cardData && sortCardData(cardData);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {sortedCardData &&
        sortedCardData
          .filter((data) => data.title !== "Authorized")
          .map((data, index) => <StatCard key={index} {...data} />)}
    </div>
  );
};

export default DashboardCards;
