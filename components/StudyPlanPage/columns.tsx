"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface StudyPlan {
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  duration: number;
}

export const columns: ColumnDef<StudyPlan>[] = [
  {
    accessorKey: "date",
    header: () => <div className="font-semibold text-black">Date</div>,
  },
  {
    accessorKey: "startTime",
    header: () => <div className="font-semibold text-black">Start Time</div>,
    cell: ({ row }) => {
      const startTime = new Date(row.getValue("startTime"));

      return <div>{startTime.toLocaleTimeString()}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: () => <div className="font-semibold text-black">End Time</div>,
    cell: ({ row }) => {
      const endTime = new Date(row.getValue("endTime"));

      return <div>{endTime.toLocaleTimeString()}</div>;
    },
  },

  {
    accessorKey: "topic",
    header: () => <div className="font-semibold text-black">Topic</div>,
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
