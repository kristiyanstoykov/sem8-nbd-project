import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const dbName = process.env.DB_NAME;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const products = await db
      .collection("products")
      .find({})
      .limit(10)
      .toArray();

    return NextResponse.json({ products });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const body = await request.json();
    let { name, price, stock } = body;
    price = parseFloat(price);
    stock = parseInt(stock);

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    if (!price) {
      return NextResponse.json(
        { error: "Product price is required" },
        { status: 400 }
      );
    }

    if (isNaN(price)) {
      return NextResponse.json(
        { error: "Product price needs to be a float" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "Product stock needs to be a whole number" },
        { status: 400 }
      );
    }

    const result = await db.collection("products").insertOne({
      name,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
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
