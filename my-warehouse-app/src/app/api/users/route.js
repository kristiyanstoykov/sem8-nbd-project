// app/api/users/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { generateSalt, hashPassword } from "@/auth/core/passwordHasher";
import clientPromise from "../../../lib/mongodb";

const dbName = process.env.DB_NAME;

export async function GET(req) {
  const user = await getCurrentUser({ withFullUser: true });
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const client = await clientPromise;
  const db = client.db(process.env.DB_NAME);

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const search = searchParams.get("search");

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } }, // case-insensitive search for name
      { email: { $regex: search, $options: "i" } }, // case-insensitive search for email
    ];
  }

  const users = await db
    .collection("users")
    .find(query, { projection: { password: 0, salt: 0 } })
    .toArray();

  return NextResponse.json({ users });
}

export async function POST(req) {
  try {
    const user = await getCurrentUser({ withFullUser: true });
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const formData = await req.json();
    const { name, email, role, password } = formData;

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, role, password) are required" },
        { status: 400 }
      );
    }

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(password, salt);

    const newUser = {
      name,
      email,
      role,
      password: hashedPassword,
      salt,
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred while creating the user",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
