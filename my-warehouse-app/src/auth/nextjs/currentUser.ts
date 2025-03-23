import { cookies } from "next/headers";
import { getUserFromSession } from "../core/session";
import { cache } from "react";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import clientPromise from "@/lib/mongodb";
const dbName = process.env.DB_NAME;

type FullUser = {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
};

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<FullUser | null>;
function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options?: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession(await cookies());

  if (user == null) {
    if (redirectIfNotFound) return redirect("/sign-in");
    return null;
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(user.id);
    // This should never happen
    if (fullUser == null) throw new Error("User not found in database");
    return fullUser;
  }

  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

async function getUserFromDb(id: string): Promise<FullUser | null> {
  const client = await clientPromise;
  const db = client.db(dbName);

  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

  return user;
}
