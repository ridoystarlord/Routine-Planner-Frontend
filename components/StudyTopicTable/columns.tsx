"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudyTopic = {
  id: string;
  topic: string;
  priority: number;
  duration: number;
  isComplete: boolean;
};

export const columns: ColumnDef<StudyTopic>[] = [
  {
    accessorKey: "topic",
    header: () => <div className="font-semibold text-black">Topic</div>,
  },

  {
    accessorKey: "priority",
    header: () => <div className="font-semibold text-black">Priority</div>,
    cell: ({ row }) => {
      const priority = parseFloat(row.getValue("priority"));

      return (
        <div>{priority === 1 ? "High" : priority === 2 ? "Medium" : "Low"}</div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: () => <div className="font-semibold text-black">Duration</div>,
    cell: ({ row }) => {
      const duration = parseInt(row.getValue("duration"));

      return <div>{`${duration} Minutes`}</div>;
    },
  },
];
