"use client";

import {
  deleteAvailableTime,
  getAvailableTimes,
} from "@/services/availableTime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css";
import { useState } from "react";
import "react-clock/dist/Clock.css";
import toast from "react-hot-toast";
import { DataTable } from "../Datatable";
import { Modal } from "../Modal/Modal";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AvailableTimeSlot, columns } from "./columns";

interface Props {
  token: string;
}

export function AvailableTimePage({ token }: Props) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [currentStudyTopic, setCurrentStudyTopic] =
    useState<AvailableTimeSlot | null>(null);
  const { api, getKey } = getAvailableTimes({ token: token });
  const { data } = useQuery({ queryKey: getKey(), queryFn: api });
  const { api: deleteApi } = deleteAvailableTime({ token });
  const { mutateAsync } = useMutation({
    mutationFn: deleteApi,
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
        success: "Available Time Deleted successful!",
        error: "Error! deleting Available Time",
      },
      {
        id: "delete-available-time",
      }
    );
  };

  return (
    <>
      <div className="space-y-3">
        <Card>
          <h1 className="text-3xl px-4 py-2 font-semibold">
            Available Time Slots
          </h1>
        </Card>
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
