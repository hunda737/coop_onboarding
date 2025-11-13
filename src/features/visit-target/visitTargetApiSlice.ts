export type VisitTarget = {
  targetId?: number;
  userId: number;
  assignedUserName: string;
  visitTarget?: number;
  branchs?: string[];
  district?: string;
  month: string;
  year: number;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const dummyVisitTargets: VisitTarget[] = [
  {
    targetId: 1,
    userId: 101,
    assignedUserName: "Yared Mesele",
    visitTarget: 20,
    branchs: ["Djibruk Branch"],
    month: "JANUARY",
    year: 2024,
    createdAt: "2024-11-01T08:00:00Z",
    updatedAt: "2024-11-10T12:00:00Z",
    remarks: "Focus on high-performing branches.",
  },
  {
    targetId: 2,
    userId: 102,
    assignedUserName: "Yared Mesele",
    visitTarget: 15,
    branchs: ["Djibruk Branch"],
    month: "JANUARY",
    year: 2024,
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-11-08T10:30:00Z",
    remarks: "Increase visits in underserved areas.",
  },
  {
    targetId: 3,
    userId: 103,
    assignedUserName: "Yared Mesele",
    visitTarget: 25,
    branchs: ["Djibruk Branch"],
    month: "DECEMBER",
    year: 2024,
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-05T14:15:00Z",
    remarks: "Seasonal surge expected.",
  },
  {
    targetId: 4,
    userId: 104,
    assignedUserName: "Yared Mesele",
    visitTarget: 10,
    branchs: ["Djibruk Branch"],
    month: "DECEMBER",
    year: 2024,
    createdAt: "2024-12-02T11:00:00Z",
    updatedAt: "2024-12-06T16:20:00Z",
    remarks: "Single branch focus for new promotions.",
  },
  {
    targetId: 5,
    userId: 105,
    assignedUserName: "Yared Mesele",
    visitTarget: 18,
    branchs: ["Djibruk Branch"],
    month: "NOVEMBER",
    year: 2024,
    createdAt: "2024-11-01T08:30:00Z",
    updatedAt: "2024-11-15T09:45:00Z",
    remarks: "Adjust visits based on feedback.",
  },
];
