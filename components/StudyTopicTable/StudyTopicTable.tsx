"use client";

import { getStudyTopic } from "@/services/studyTopic";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../Datatable";
import { columns } from "./columns";

interface Props {
  token: string;
}

import React from "react";
import { Card } from "../ui/card";

const StudyTopicTable = ({ token }: Props) => {
  const { api, getKey } = getStudyTopic({ token: token });
  const { data, isLoading } = useQuery({ queryKey: getKey(), queryFn: api });
  return (
    <Card>
      <DataTable columns={columns} data={data?.data} />
    </Card>
  );
};

export default StudyTopicTable;
