export interface Note {
  noteId: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
  category: "Personal" | "Work" | "Other";
  tags?: string[];
  lastUpdated?: string;
}

export const notes: Note[] = [
  {
    noteId: "N001",
    title: "Meeting Summary",
    content: "Discussed project milestones and upcoming deliverables.",
    createdBy: "John Doe",
    createdAt: "2024-11-15",
    category: "Work",
    tags: ["meeting", "milestones"],
    lastUpdated: "2024-11-18",
  },
  {
    noteId: "N002",
    title: "Grocery List",
    content: "Buy milk, eggs, bread, and coffee.",
    createdBy: "Jane Smith",
    createdAt: "2024-11-14",
    category: "Personal",
    tags: ["shopping", "groceries"],
  },
  {
    noteId: "N003",
    title: "Quarterly Review Notes",
    content: "Focus on increasing team efficiency and resource allocation.",
    createdBy: "Alice Johnson",
    createdAt: "2024-10-30",
    category: "Work",
    tags: ["review", "efficiency"],
    lastUpdated: "2024-11-02",
  },
  {
    noteId: "N004",
    title: "Vacation Plan",
    content: "Research hotels and activities for the Hawaii trip.",
    createdBy: "Bob Brown",
    createdAt: "2024-11-10",
    category: "Personal",
    tags: ["vacation", "travel"],
  },
  {
    noteId: "N005",
    title: "Book Recommendations",
    content: "Read 'Atomic Habits' and 'Deep Work' this month.",
    createdBy: "Charlie Davis",
    createdAt: "2024-11-12",
    category: "Other",
    tags: ["books", "recommendations"],
  },
];
