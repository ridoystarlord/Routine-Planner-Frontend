"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export interface Schedules {
  id: string;
  type: string;
  startTime: string;
  endTime: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const columns: ColumnDef<Schedules>[] = [
  {
    accessorKey: "type",
    header: () => <div className="font-semibold text-black">Type</div>,
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
    accessorKey: "duration",
    header: () => <div className="font-semibold text-black">Duration</div>,
    cell: ({ row }) => {
      const startTime = new Date(row.getValue("startTime"));
      const endTime = new Date(row.getValue("endTime"));

      function calculateDurationInMinutes(startTime: Date, endTime: Date) {
        // Parse the ISO 8601 formatted timestamps
        const start: any = new Date(startTime);
        const end: any = new Date(endTime);

        // Calculate the difference in milliseconds
        const differenceInMilliseconds = end - start;

        // Convert milliseconds to minutes
        const differenceInMinutes = differenceInMilliseconds / 1000 / 60;

        return differenceInMinutes;
      }

      return (
        <div>{`${calculateDurationInMinutes(startTime, endTime)} minutes`}</div>
      );
    },
  },
];
