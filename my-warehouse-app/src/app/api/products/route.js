import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { generateFilePath } from "../../../lib/helper";

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

    const formData = await request.formData();

    const name = formData.get("name");
    const price = parseFloat(formData.get("price"));
    const stock = parseInt(formData.get("stock"), 10);
    const file = formData.get("file");

    if (!name || isNaN(price) || !Number.isInteger(stock)) {
      return NextResponse.json(
        { error: "Invalid product data" },
        { status: 400 }
      );
    }

    // Generate file path and ensure directory exists
    const { filePath, fileName, imgThumbnailPath } = await generateFilePath(
      file
    );

    const result = await db.collection("products").insertOne({
      name,
      price,
      stock,
      thumbnail_guid: imgThumbnailPath,
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
