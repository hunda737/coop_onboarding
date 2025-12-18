import { FileQuestion, Timer } from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

const currentYear = new Date().getFullYear();

// export const years = Array.from(
//   { length: currentYear - 2024 + 1 },
//   (_, index) => {
//     const year = (2024 + index).toString();
//     return {
//       value: Number(year),
//       label: Number(year),
//       color: "#5A5A5A",
//       icon: Timer,
//     };
//   }
// );
export const years = [
  {
    value: String(currentYear),
    label: String(currentYear),
    color: "#5A5A5A",
    icon: Timer,
  },
];


export const accountType = [
  {
    value: "Deposit Account",
    label: "Deposit Account",
    color: "#5A5A5A",
    // icon: QuestionMarkCircledIcon,
  },
  {
    value: "Fixed Time Deposit Account",
    label: "Fixed Time Deposit Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Non-Repatriable Birr Account",
    label: "Non-Repatriable Birr Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "ECOLFL",
    label: "ECOLFL",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Diaspora Wadia Saving Account",
    label: "Diaspora Wadia Saving Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Diaspora Mudarabah Saving Account",
    label: "Diaspora Mudarabah Saving Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Diaspora Mudarabah Fixed Time",
    label: "Diaspora Mudarabah Fixed Time",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Sinqe-women Account",
    label: "Sinqe-women Account",
    color: "#5A5A5A",
    // icon: QuestionMarkCircledIcon,
  },
  {
    value: "Saving Account",
    label: "Saving Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Youth saving Account",
    label: "Youth saving Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "ECOLFL Saving",
    label: "ECOLFL Saving",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Farmers Savings Account",
    label: "Farmers Savings Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Zakat Wadi'ah saving Account",
    label: "Zakat Wadi'ah saving Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Wadiah farmers Savings Account",
    label: "Wadiah farmers Savings Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "TTS Account",
    label: "TTS Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Wadia ECOLFL Saving Account",
    label: "Wadia ECOLFL Saving Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Wadia Saving Account",
    label: "Wadia Saving Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Wadia Current Account",
    label: "Wadia Current Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Farmers Current Account",
    label: "Farmers Current Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Current Account",
    label: "Current Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Mudarabah Saving Account",
    label: "Mudarabah Saving Account",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
  {
    value: "Dergego -Youth Mudarabah Saving Acc",
    label: "Dergego -Youth Mudarabah Saving Acc",
    color: "#5A5A5A",
    // icon: StopwatchIcon,
  },
];
export const customerType = [
  {
    value: "INDIVIDUAL",
    label: "Individual Account",
    color: "#5A5A5A",

  },
  {
    value: "JOINT",
    label: "Joint Account",
    color: "#5A5A5A",

  },
  {
    value: "ORGANIZATION",
    label: "Organization Account",
    color: "#5A5A5A",

  },


];

export const sex = [
  {
    value: "MALE",
    label: "Male",
    color: "#5A5A5A",
    icon: FileQuestion,
  },
  {
    value: "FEMALE",
    label: "Female",
    color: "#5A5A5A",
    icon: FileQuestion,
  },
];

export const months = [
  {
    value: "JANUARY",
    label: "JANUARY",
    color: "#5A5A5A",
    // icon: MONTH,
  },
  {
    value: "FEBRUARY",
    label: "FEBRUARY",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "MARCH",
    label: "MARCH",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "APRIL",
    label: "APRIL",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "MAY",
    label: "MAY",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "JUNE",
    label: "JUNE",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "JULY",
    label: "JULY",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "AUGUST",
    label: "AUGUST",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "SEPTEMBER",
    label: "SEPTEMBER",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "OCTOBER",
    label: "OCTOBER",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "NOVEMBER",
    label: "NOVEMBER",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
  {
    value: "DECEMBER",
    label: "DECEMBER",
    color: "#5A5A5A",
    // icon: FileQuestion,
  },
];

export const completed = [
  {
    value: "20%",
    label: "20%",
    color: "#5A5A5A",
    // icon: QuestionMarkCircledIcon,
  },
  {
    value: "40%",
    label: "40%",
    color: "#5A5A5A",
    // icon: QuestionMarkCircledIcon,
  },
  {
    value: "60%",
    label: "60%",
    color: "#5A5A5A",
    // icon: QuestionMarkCircledIcon,
  },
  {
    value: "80%",
    label: "80%",
    color: "#5A5A5A",
    // icon: QuestionMarkCircledIcon,
  },
  {
    value: "100%",
    label: "100%",
    color: "#5A5A5A",
    // icon: QuestionMarkCircledIcon,
  },
];

export const statuses = [
  {
    value: "PENDING",
    label: "PENDING",
    color: "#5A5A5A",
    icon: FileQuestion,
  },
  {
    value: "UNSETTLED",
    label: "UNSETTLED",
    color: "#5A5A5A",
    icon: FileQuestion,
  },
  {
    value: "AUTHORIZED",
    label: "AUTHORIZED",
    color: "#5A5A5A",
    icon: FileQuestion,
  },
  {
    value: "INITIAL",
    label: "INITIAL",
    color: "#5A5A5A",
    icon: FileQuestion,
  },
  {
    value: "APPROVED",
    label: "APPROVED",
    color: "#0000FF",
    icon: FileQuestion,
  },
  {
    value: "REGISTERED",
    label: "REGISTERED",
    color: "#00AA00", // ✅ green for success
    icon: FileQuestion,
  },
  {
    value: "REJECTED",
    label: "REJECTED",
    color: "#FF0000",
    icon: FileQuestion,
  },
];

export const userStatus = [
  {
    value: "PENDING",
    label: "PENDING",
    color: "#5A5A5A",
    icon: FileQuestion,
  },
  {
    value: "ACTIVE",
    label: "ACTIVE",
    color: "#0000FF",
    icon: FileQuestion,
  },
  {
    value: "BANNED",
    label: "BANNED",
    color: "#FF0000",
    icon: FileQuestion,
  },
];

export const harmonizationStatuses = [
  {
    value: "PENDING_OTP",
    label: "Pending OTP",
    color: "#F59E0B", // Yellow/warning
    icon: FileQuestion,
  },
  {
    value: "OTP_VERIFIED",
    label: "OTP Verified",
    color: "#10B981", // Green/success
    icon: FileQuestion,
  },
  {
    value: "FAYDA_DATA_RECEIVED",
    label: "Fayda Data Received",
    color: "#3B82F6", // Blue/info
    icon: FileQuestion,
  },
  {
    value: "PENDING_KYC_REVIEW",
    label: "Pending KYC Review",
    color: "#F59E0B", // Yellow/warning
    icon: FileQuestion,
  },
  {
    value: "MERGED",
    label: "Merged",
    color: "#10B981", // Green/success
    icon: FileQuestion,
  },
  {
    value: "REJECTED",
    label: "Rejected",
    color: "#EF4444", // Red/error
    icon: FileQuestion,
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    color: "#6B7280", // Gray
    icon: FileQuestion,
  },
];

export const operations = [
  {
    label: "FT",
    value: "ft",
    icon: FileQuestion,
  },
  {
    label: "FT Reversal",
    value: "ft reversal",
    icon: FileQuestion,
  },
  {
    label: "FT Reversal ND",
    value: "ft reversal next day",
    icon: FileQuestion,
  },
  {
    label: "FT Lump Sum",
    value: "ft lump sum",
    icon: FileQuestion,
  },
  {
    label: "FT Interest",
    value: "ft interest",
    icon: FileQuestion,
  },
];
