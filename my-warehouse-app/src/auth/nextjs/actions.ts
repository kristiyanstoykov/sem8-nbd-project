"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { signInSchema, signUpSchema } from "./schemas";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../core/passwordHasher";
import { cookies } from "next/headers";
import { createUserSession, removeUserFromSession } from "../core/session";

const dbName = process.env.DB_NAME;

import clientPromise from "../../lib/mongodb";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) return "Unable to log you in";
  // TODO implement

  redirect("/");
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeData);

  if (!success) return "Unable to create account";
  const client = await clientPromise;
  const db = client.db(dbName);

  const existingUser = await db
    .collection("users")
    .findOne({ email: data.email });

  if (existingUser != null) return "Account already exists for this email";

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const user = await db.collection("users").insertOne({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      salt,
      role: "user",
    });
    if (user == null) throw new Error("Failed to create user");

    const insertedUser = await db
      .collection("users")
      .findOne({ _id: user.insertedId });
    if (!insertedUser) throw new Error("Failed to retrieve inserted user");

    const userId = insertedUser._id.toString();
    const userRole = insertedUser.role;

    await createUserSession({ id: userId, role: userRole }, await cookies());
  } catch (error) {
    if (error && typeof error === "object" && "message" in error) {
      return error.message as string;
    }
    return "An unexpected error occurred";
  }

  redirect("/");
}

export async function logOut() {
  // TODO implement
  redirect("/");
}
