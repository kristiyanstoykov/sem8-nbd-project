"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "../actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signInSchema } from "../schemas";
import Link from "next/link";

export function SignInForm({ theme }: { theme: string }) {
  const [error, setError] = useState<string>();
  const form = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    const error = await signIn(data);
    setError(error);
  }

  const formTheme = theme;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-8 ${
          formTheme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
        } p-6 rounded-xl`}
      >
        {error && <p className="text-destructive">{error}</p>}
        <div className="flex gap-4">oAuth goes here</div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  className={
                    formTheme === "dark"
                      ? "bg-gray-100 text-white"
                      : "border-blue-200 bg-gray-50"
                  }
                />
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
                  type="password"
                  {...field}
                  className={
                    formTheme === "dark"
                      ? "bg-gray-100 text-white"
                      : "border-blue-200 bg-gray-50"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-end">
          <Button
            className="px-3 py-1 bg-blue-600 hover:text-black text-white rounded hover:bg-blue-200 transition-colors"
            type="submit"
          >
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}
