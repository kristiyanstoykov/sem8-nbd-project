import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const dbName = process.env.DB_NAME;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const items = await db.collection("items").find({}).limit(10).toArray();

    return NextResponse.json({ items });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const body = await request.json();
    const { name, descritpion } = body;

    if (!name || !descritpion) {
      return NextResponse.json(
        { error: "Name and descritpion are required" },
        { status: 400 }
      );
    }

    const result = await db.collection("items").insertOne({
      name,
      descritpion,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
