"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginUser } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/Routes";

const LoginSchema = z.object({
  email: z.string().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export type LoginUserFormType = z.infer<typeof LoginSchema>;

export function LoginForm() {
  const searchParams = useSearchParams();
  // const redirect = searchParams.get("redirect");
  const router = useRouter();
  const form = useForm<LoginUserFormType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { api } = LoginUser();
  const { mutateAsync } = useMutation({
    mutationFn: api,
    onSuccess(data: any) {
      Cookies.set("token", data?.data?.token, { expires: 30 });
      // router.push(redirect ? redirect : ROUTES.DASHBOARD.HOME);
      router.push(ROUTES.DASHBOARD.HOME);
      form.reset();
    },
    onError: (err: Error | AxiosError<any>) => {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          toast.error(err?.response?.data?.message, {
            id: "error-login-user",
          });
        } else {
          toast.error(err?.message, {
            id: "error-login-user",
          });
        }
      }
    },
  });

  function onSubmit(values: LoginUserFormType) {
    toast.promise(
      mutateAsync(values),
      {
        success: "User Login Successfully",
        error: "Error Login User",
        loading: "Logging User",
      },
      {
        id: "login-user",
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
                <Button type="submit">Login</Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="text-center">
              <span>Don&apos;t have an Account? </span>
              <Link href={ROUTES.REGISTRATION} className="text-blue-700">
                Register
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
