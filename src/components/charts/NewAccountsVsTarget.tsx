import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DistrictTarget } from "@/features/reports/reportApiSlice";
import { FC, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { years } from "../ui/data/data";

const chartConfig = {
  registration: {
    label: "Registrations",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type NewAccountsVsTargetProps = {
  districtTargetAndAchievementsMonthly: DistrictTarget[] | undefined;
  setYear: React.Dispatch<React.SetStateAction<number>>;
  year: number;
};

const NewAccountsVsTarget: FC<NewAccountsVsTargetProps> = ({
  districtTargetAndAchievementsMonthly,
  setYear,
  year,
}) => {
  const [customerType, setCustomerType] = useState("newcustomers");
  const chartData = districtTargetAndAchievementsMonthly?.map((data) => ({
    ...data,
    percentage: ((data.registration / data.target) * 100).toFixed(0),
    difference: Math.max(data.target - data.registration, 0), // Set difference to 0 if negative
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Registrations vs. Target Progress</CardTitle>
        <div className="flex space-x-2">
          <Select
            defaultValue={String(year)}
            onValueChange={(value) => setYear(Number(value))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((item) => {
                  return (
                    <SelectItem value={String(item.value)}>
                      {item.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            defaultValue={customerType}
            onValueChange={(value) => setCustomerType(value)}
          >
            <SelectTrigger className="w-[165px]">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="newcustomers">New Customers</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[180px] w-full"
        >
          <BarChart data={chartData} barCategoryGap="2%">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  indicator="dot"
                />
              }
            />

            <Bar
              dataKey="registration"
              fill="var(--color-registration)"
              stackId="a"
              radius={[0, 0, 4, 4]}
              barSize={30}
            >
              <LabelList
                dataKey="percentage"
                position="top"
                offset={-12}
                className="fill-secondary"
                fontSize={12}
                formatter={(value: unknown) => `${value}%`}
              />
            </Bar>

            <Bar
              dataKey="difference"
              fill="var(--color-target)"
              radius={[4, 4, 0, 0]}
              stackId="a"
              className="pt-10"
              barSize={30}
            >
              <LabelList
                dataKey="target"
                position="top"
                offset={12}
                className="fill-primary"
                fontSize={12}
                formatter={(value: unknown) => `${value}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default NewAccountsVsTarget;
