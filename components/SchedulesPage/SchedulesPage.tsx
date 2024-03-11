"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  addSchedules,
  deleteSchedules,
  getSchedules,
} from "@/services/schedules";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css";
import { format } from "date-fns";
import { useState } from "react";
import "react-clock/dist/Clock.css";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { DataTable } from "../Datatable";
import { Modal } from "../Modal/Modal";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Schedules, columns } from "./columns";

interface Props {
  token: string;
}

const CreateScheduleSchema = z.object({
  date: z.date({
    required_error: "Please, Select the schedule Date",
  }),
});

type ValuePiece = Date | string | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export type CreateScheduleFormType = z.infer<typeof CreateScheduleSchema>;

const TimePickerDefaultValue: Value = ["06:00", "07:00"];

export function SchedulesPage({ token }: Props) {
  const [classes, setClasses] = useState<Value[]>([]);
  const [jobs, setJobs] = useState<Value[]>([]);
  const [studySlots, setStudySlots] = useState<Value[]>([]);

  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);
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
        error: "Error! deleting Schedules",
      },
      {
        id: "delete-schedule",
      }
    );
  };

  const form = useForm<CreateScheduleFormType>({
    resolver: zodResolver(CreateScheduleSchema),
  });

  const { api: addScheduleApi } = addSchedules({ token });
  const { mutateAsync: addScheduleMutateAsync } = useMutation({
    mutationFn: addScheduleApi,
    onSuccess(data) {
      queryClient.invalidateQueries();
      setShowCreateScheduleModal(false);
    },
  });

  const handleCreateSchedule = (data: CreateScheduleFormType) => {
    const payload = {
      date: new Date(data.date).toISOString().split("T")[0],
      classes: classes.map((ls: any) => ({
        startTime: ls[0] as string,
        endTime: ls[1] as string,
      })),
      jobs: jobs.map((ls: any) => ({
        startTime: ls[0] as string,
        endTime: ls[1] as string,
      })),
      studySlots: studySlots.map((ls: any) => ({
        startTime: ls[0] as string,
        endTime: ls[1] as string,
      })),
    };
    toast.promise(
      addScheduleMutateAsync(payload),
      {
        loading: "Creating",
        success: "Schedules Added successful!",
        error: "Error! creating Schedules",
      },
      {
        id: "add-schedule",
      }
    );
  };
  return (
    <>
      <div className="space-y-3">
        <Card>
          <h1 className="text-3xl px-4 py-2 font-semibold">Schedules</h1>
        </Card>
        <div>
          <Button
            variant="default"
            onClick={() => {
              setShowCreateScheduleModal(true);
            }}
          >
            Create Schedule
          </Button>
        </div>
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
      <Modal
        show={showCreateScheduleModal}
        setShow={setShowCreateScheduleModal}
        title="Create Schedule"
      >
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateSchedule)}
              className="w-full space-y-3"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select the schedule Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="flex flex-col">
                <div className="flex justify-between items-center">
                  <FormLabel>Classes</FormLabel>
                  <button
                    onClick={() => {
                      setClasses((prev: Value[]) => [
                        ...prev,
                        TimePickerDefaultValue,
                      ]);
                    }}
                    type="button"
                    className="flex items-center gap-1 border rounded-sm border-gray-500 px-2"
                  >
                    <PlusIcon />
                  </button>
                </div>
                {classes?.map((ls: Value, i: number) => {
                  return (
                    <FormControl key={i}>
                      <TimeRangePicker
                        onChange={(val) => {
                          const updatedArray = classes.map((item, index) =>
                            index === i ? val : item
                          );
                          setClasses(updatedArray);
                        }}
                        value={ls}
                        disableClock
                        className="basis-3/4"
                      />
                    </FormControl>
                  );
                })}
                <FormMessage />
              </FormItem>
              <FormItem className="flex flex-col">
                <div className="flex justify-between items-center">
                  <FormLabel>Jobs</FormLabel>
                  <button
                    onClick={() => {
                      setJobs((prev: Value[]) => [
                        ...prev,
                        TimePickerDefaultValue,
                      ]);
                    }}
                    type="button"
                    className="flex items-center gap-1 border rounded-sm border-gray-500 px-2"
                  >
                    <PlusIcon />
                  </button>
                </div>
                {jobs?.map((ls: Value, i: number) => {
                  return (
                    <FormControl key={i}>
                      <TimeRangePicker
                        onChange={(val) => {
                          const updatedArray = jobs.map((item, index) =>
                            index === i ? val : item
                          );
                          setJobs(updatedArray);
                        }}
                        value={ls}
                        disableClock
                        className="basis-3/4"
                      />
                    </FormControl>
                  );
                })}
                <FormMessage />
              </FormItem>
              <FormItem className="flex flex-col">
                <div className="flex justify-between items-center">
                  <FormLabel>Available Time Slots</FormLabel>
                  <button
                    onClick={() => {
                      setStudySlots((prev: Value[]) => [
                        ...prev,
                        TimePickerDefaultValue,
                      ]);
                    }}
                    type="button"
                    className="flex items-center gap-1 border rounded-sm border-gray-500 px-2"
                  >
                    <PlusIcon />
                  </button>
                </div>
                {studySlots?.map((ls: Value, i: number) => {
                  return (
                    <FormControl key={i}>
                      <TimeRangePicker
                        onChange={(val) => {
                          const updatedArray = studySlots.map((item, index) =>
                            index === i ? val : item
                          );
                          setStudySlots(updatedArray);
                        }}
                        value={ls}
                        disableClock
                        className="basis-3/4"
                      />
                    </FormControl>
                  );
                })}
                <FormMessage />
              </FormItem>

              <div className="flex justify-end">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setShowCreateScheduleModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="default">
                    Create
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </Modal>
    </>
  );
}
