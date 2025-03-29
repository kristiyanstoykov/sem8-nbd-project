import { z } from "zod";
import { userRoles } from "../../lib/mongodb";
import crypto from "crypto";
import { ObjectId } from "mongodb";

import clientPromise from "../../lib/mongodb";

const dbName = process.env.DB_NAME;

const sessionSchema = z.object({
  id: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  }),
  role: z.enum(userRoles),
});

const SESSION_EXPIRATION_SECONDS = 4 * 60 * 60 * 1000; // 4 hours in seconds
// const SESSION_EXPIRATION_SECONDS = 10 * 1000; // 10s expiration in seconds
const COOKIE_SESSION_KEY = "session-id";

type UserSession = z.infer<typeof sessionSchema>;
export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

export function getUserFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) {
    return null;
  }

  return getUserFromSessionId(sessionId);
}

export async function removeUserFromSession(
  cookies: Pick<Cookies, "get" | "delete">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db(dbName);
  const sessionsCollection = db.collection("sessions");

  const sessions = await sessionsCollection.deleteMany({
    sessionId: sessionId,
  });
  cookies.delete(COOKIE_SESSION_KEY);
}

export async function createUserSession(
  user: UserSession,
  cookies: Pick<Cookies, "set">
) {
  const sessionId = crypto.randomBytes(64).toString("hex").normalize();
  const client = await clientPromise;
  const db = client.db(dbName);
  const sessionsCollection = db.collection("sessions");

  // Parse and validate user data
  const userData = sessionSchema.parse(user);

  // Ensure the TTL index exists
  const existingIndexes = await sessionsCollection.indexes();
  const expiresAtIndex = existingIndexes.find(
    (index) => index.key?.expiresAt === 1
  );

  if (!expiresAtIndex) {
    await sessionsCollection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0, background: true }
    );
  } else if (
    expiresAtIndex.expireAfterSeconds !==
    SESSION_EXPIRATION_SECONDS / 1000
  ) {
    await sessionsCollection.dropIndex(expiresAtIndex.name);
    await sessionsCollection.createIndex(
      { expiresAt: 1 },
      {
        expireAfterSeconds: 0,
        background: true,
      }
    );
  }

  // Store expiresAt as a Date object
  const sessionExpiry = new Date();
  sessionExpiry.setTime(sessionExpiry.getTime() + SESSION_EXPIRATION_SECONDS);

  // Create session document
  const session = {
    sessionId: sessionId,
    userId: userData.id,
    role: userData.role,
    expiresAt: sessionExpiry,
    createdAt: new Date(),
  };

  // Insert session into MongoDB
  const result = await sessionsCollection.insertOne(session);

  // Set cookie
  setCookie(sessionId, cookies);
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  // Set cookie
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS,
  });
}

async function getUserFromSessionId(sessionId: string) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const sessionsCollection = db.collection("sessions");

  const session = await sessionsCollection.findOne({
    sessionId: sessionId,
  });

  if (session == null) {
    return null;
  }

  const userCollection = db.collection("users");
  const rawUser = await userCollection.findOne({
    _id: new ObjectId(session.userId),
  });

  const userData = {
    id: rawUser._id.toString(),
    role: rawUser.role,
  };

  const { success, data: user } = sessionSchema.safeParse(userData);

  return success ? user : null;
}
