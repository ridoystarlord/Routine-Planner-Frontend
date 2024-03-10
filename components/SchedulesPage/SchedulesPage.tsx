"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../Datatable";
import { Card } from "../ui/card";
import { columns } from "./columns";
import { getSchedules } from "@/services/schedules";

interface Props {
  token: string;
}

export function SchedulesPage({ token }: Props) {
  const { api, getKey } = getSchedules({ token: token });
  const { data } = useQuery({ queryKey: getKey(), queryFn: api });
  return (
    <>
      <div className="space-y-3">
        <Card>
          <DataTable columns={columns} data={data ? data.data : []} />
        </Card>
      </div>
    </>
  );
}
