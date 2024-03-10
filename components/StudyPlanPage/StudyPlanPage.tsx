"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CalendarIcon } from "@radix-ui/react-icons";

import { Calendar } from "@/components/ui/calendar";

import { ROUTES } from "@/Routes";
import { formatDateToYYYYMMDD } from "@/app/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getUserStudyPlan } from "@/services/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DataTable } from "../Datatable";
import { Card } from "../ui/card";
import { columns } from "./columns";

interface Props {
  token: string;
}

const FormSchema = z.object({
  date: z.object({ from: z.date(), to: z.date() }),
});

export function StudyPlanPage({ token }: Props) {
  const searchParams = useSearchParams();
  const [timerId, setTimerId] = useState<null | NodeJS.Timeout>(null);
  const router = useRouter();

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: { from: new Date(), to: addDays(new Date(), 7) },
    },
  });

  const debouncedUpdateQuery = (
    newQuery: Record<string, string | undefined>
  ) => {
    if (timerId != null) {
      clearTimeout(timerId);
    }
    const updateQuery = () => {
      router.push(
        `${ROUTES.DASHBOARD.HOME}?startDate=${newQuery.startDate}&endDate=${newQuery.endDate}`
      );
    };
    const id = setTimeout(updateQuery, 300);
    setTimerId(id);
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    debouncedUpdateQuery({
      startDate: formatDateToYYYYMMDD(data.date.from) as string,
      endDate: formatDateToYYYYMMDD(data.date.to) as string,
    });
  }

  const { api, getKey } = getUserStudyPlan({
    token: token,
    startDate: startDate
      ? startDate
      : (formatDateToYYYYMMDD(new Date()) as string),
    endDate: endDate
      ? endDate
      : (formatDateToYYYYMMDD(addDays(new Date(), 7)) as string),
  });
  const { data } = useQuery({
    queryKey: getKey(),
    queryFn: api,
    enabled: Boolean(startDate) && Boolean(endDate),
  });

  return (
    <>
      <div className="space-y-3">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-3"
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Date Range</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !field?.value?.from &&
                                !field?.value?.to &&
                                "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-5">
                <Button type="submit">Get Plan</Button>
              </div>
            </form>
          </Form>
        </div>
        <Card>
          <DataTable columns={columns} data={data ? data?.data : []} />
        </Card>
      </div>
    </>
  );
}
