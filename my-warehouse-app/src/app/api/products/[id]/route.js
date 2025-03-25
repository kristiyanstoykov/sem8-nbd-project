import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

const dbName = process.env.DB_NAME;

export async function GET(req, { params }) {
  try {
    const { id } = await params;

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

export async function PUT(req, { params }) {
  try {
    const { name, price, stock, thumbnail_guid } = await req.formData();
    console.log("name", name);
    console.log("price", price);
    console.log("stock", stock);
    console.log("thumbnail_guid", thumbnail_guid);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
