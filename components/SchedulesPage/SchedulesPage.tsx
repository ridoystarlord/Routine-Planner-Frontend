"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../Datatable";
import { Card } from "../ui/card";
import { Schedules, columns } from "./columns";
import { deleteSchedules, getSchedules } from "@/services/schedules";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { Modal } from "../Modal/Modal";

interface Props {
  token: string;
}

export function SchedulesPage({ token }: Props) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [currentStudyTopic, setCurrentStudyTopic] = useState<Schedules | null>(
    null
  );
  const { api, getKey } = getSchedules({ token: token });
  const { data } = useQuery({ queryKey: getKey(), queryFn: api });
  const { api: deleteStudyTopicApi } = deleteSchedules({ token });
  const { mutateAsync } = useMutation({
    mutationFn: deleteStudyTopicApi,
    onSuccess(data) {
      queryClient.invalidateQueries();
      setShowModal(false);
    },
  });
  const handleDelete = () => {
    toast.promise(
      mutateAsync(currentStudyTopic?.id as string),
      {
        loading: "Deleting",
        success: "Schedules Deleted successful!",
        error: "Error! deleting Sehedules",
      },
      {
        id: "delete-schedule",
      }
    );
  };
  return (
    <>
      <div className="space-y-3">
        <Card>
          <DataTable
            columns={[
              ...columns,
              {
                accessorKey: "actions",
                header: () => (
                  <div className="font-semibold text-black">Actions</div>
                ),
                cell: ({ row }) => {
                  return (
                    <div>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setCurrentStudyTopic(row.original);
                          setShowModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  );
                },
              },
            ]}
            data={data ? data.data : []}
          />
        </Card>
      </div>
      <Modal
        show={showModal}
        setShow={setShowModal}
        title="Are you sure want to delete this Schedule?"
      >
        <div className="flex justify-end">
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleDelete}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
