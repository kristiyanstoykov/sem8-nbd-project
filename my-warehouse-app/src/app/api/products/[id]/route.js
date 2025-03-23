import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

const dbName = process.env.DB_NAME;

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    console.log("Product ID:", id);

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db(dbName);

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    console.log("Product:");
    console.log(product);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
