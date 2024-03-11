"use client";

import {
  deleteStudyTopic,
  getStudyTopic,
  updateStudyTopic,
} from "@/services/studyTopic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../Datatable";
import { StudyTopic, columns } from "./columns";
import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Modal } from "../Modal/Modal";
import toast from "react-hot-toast";

interface Props {
  token: string;
}

const StudyTopicTable = ({ token }: Props) => {
  const queryClient = useQueryClient();
  const [currentStudyTopic, setCurrentStudyTopic] = useState<StudyTopic | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showFinishedTopicModal, setShowFinishedTopicModal] = useState(false);
  const { api, getKey } = getStudyTopic({ token: token });
  const { data } = useQuery({ queryKey: getKey(), queryFn: api });
  const { api: deleteStudyTopicApi } = deleteStudyTopic({ token });
  const { mutateAsync } = useMutation({
    mutationFn: deleteStudyTopicApi,
    onSuccess(data) {
      queryClient.invalidateQueries();
      setShowModal(false);
    },
  });
  const { api: updateApi } = updateStudyTopic({ token });
  const { mutateAsync: updateMutateAsync } = useMutation({
    mutationFn: updateApi,
    onSuccess(data) {
      queryClient.invalidateQueries();
      setShowFinishedTopicModal(false);
    },
  });
  const handleDelete = () => {
    toast.promise(
      mutateAsync(currentStudyTopic?.id as string),
      {
        loading: "Deleting",
        success: "Study Topic Deleted successful!",
        error: "Error! deleting Study Topic",
      },
      {
        id: "delete-study-topic",
      }
    );
  };
  const handleCompleteTheTopic = () => {
    toast.promise(
      updateMutateAsync({
        id: currentStudyTopic?.id,
        isComplete: true,
      }),
      {
        loading: "Updating",
        success: "Study Topic Mark as Complete successful!",
        error: "Error! updating Study Topic",
      },
      {
        id: "update-study-topic",
      }
    );
  };
  return (
    <>
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
                const isComplete = row.original.isComplete;
                return (
                  <div className="flex gap-2">
                    <Button
                      disabled={isComplete}
                      variant="default"
                      onClick={() => {
                        setCurrentStudyTopic(row.original);
                        setShowFinishedTopicModal(true);
                      }}
                    >
                      Complete
                    </Button>
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
          data={data ? data?.data : []}
        />
      </Card>
      <Modal
        show={showModal}
        setShow={setShowModal}
        title="Are you sure want to delete this topic?"
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
      <Modal
        show={showFinishedTopicModal}
        setShow={setShowFinishedTopicModal}
        title="Are you sure want to mark this topic as finished?"
      >
        <div className="flex justify-end">
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={() => {
                setShowFinishedTopicModal(false);
              }}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleCompleteTheTopic}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StudyTopicTable;
