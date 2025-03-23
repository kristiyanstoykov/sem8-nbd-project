"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUp } from "../actions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signUpSchema } from "../schemas";
import Link from "next/link";

export function SignUpForm({ theme }: { theme: string }) {
  const [error, setError] = useState<string>();
  const form = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const formTheme = theme;

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    const error = await signUp(data);
    setError(error);
  }

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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
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
        <div className="mt-4 flex gap-4 justify-end">
          <Button
            className="px-3 py-1 bg-emerald-600 hover:text-black text-white rounded hover:bg-emerald-200 transition-colors"
            type="submit"
          >
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
}
