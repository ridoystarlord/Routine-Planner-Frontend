"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterUser } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/Routes";

const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type RegisterUserFormType = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterUserFormType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { api } = RegisterUser();
  const { mutateAsync } = useMutation({
    mutationFn: api,
    onSuccess(data) {
      form.reset();
      router.push(ROUTES.LOG_IN("/"));
    },
    onError: (err: Error | AxiosError<any>) => {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          toast.error(err?.response?.data?.message, {
            id: "error-registering-user",
          });
        } else {
          toast.error(err?.message, {
            id: "error-registering-user",
          });
        }
      }
    },
  });

  function onSubmit(values: RegisterUserFormType) {
    toast.promise(
      mutateAsync(values),
      {
        success: "User Register Successfully",
        error: "Error Registering User",
        loading: "Registering User",
      },
      {
        id: "register-user",
      }
    );
  }

  return (
    <div className="w-[50%]">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Routine Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Your E-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Your Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button type="submit">Register</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
