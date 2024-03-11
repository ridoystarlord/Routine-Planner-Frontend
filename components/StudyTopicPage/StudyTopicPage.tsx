"use client";

import React, { useState } from "react";
import StudyTopicTable from "../StudyTopicTable/StudyTopicTable";
import { Button } from "../ui/button";
import { Modal } from "../Modal/Modal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { addStudyTopic } from "@/services/studyTopic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Card } from "../ui/card";

interface Props {
  token: string;
}

const AddStudyTopicSchema = z.object({
  topic: z.string({
    required_error: "Please, Enter the topic name",
  }),
  priority: z.string({
    required_error: "Please, select Priority",
  }),
  duration: z.string({
    required_error: "Please, Enter Study Duration of the topic",
  }),
});

export type AddStudyTopicFormType = z.infer<typeof AddStudyTopicSchema>;

export function StudyTopicPage({ token }: Props) {
  const queryClient = useQueryClient();
  const form = useForm<AddStudyTopicFormType>({
    resolver: zodResolver(AddStudyTopicSchema),
    defaultValues: {
      topic: "",
      //   priority: "",
      duration: "",
    },
  });
  const [showAddStudyTopic, setShowAddStudyTopic] = useState(false);
  const { api } = addStudyTopic({ token });
  const { mutateAsync } = useMutation({
    mutationFn: api,
    onSuccess(data: any) {
      queryClient.invalidateQueries();
      setShowAddStudyTopic(false);
      form.reset();
    },
  });
  const handleAddStudyTopic = (data: AddStudyTopicFormType) => {
    toast.promise(
      mutateAsync({
        ...data,
        priority: Number(data?.priority),
        duration: Number(data?.duration),
      }),
      {
        loading: "Adding",
        success: "Study Topic Added successful!",
        error: "Error! adding Study Topic",
      },
      {
        id: "add-study-topic",
      }
    );
  };
  return (
    <>
      <div className="space-y-3">
        <Card>
          <h1 className="text-3xl px-4 py-2 font-semibold">Study Topics</h1>
        </Card>
        <div>
          <Button
            variant="default"
            onClick={() => {
              setShowAddStudyTopic(true);
            }}
          >
            Add Topic
          </Button>
        </div>
        <StudyTopicTable token={token} />
      </div>
      <Modal
        show={showAddStudyTopic}
        setShow={setShowAddStudyTopic}
        title="Add Study Topic"
      >
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddStudyTopic)}
              className="w-full space-y-3"
            >
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Topic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">Low</SelectItem>
                        <SelectItem value="2">Medium</SelectItem>
                        <SelectItem value="1">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration(Minutes)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Topic Duration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setShowAddStudyTopic(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="default">
                    Add
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
