// app/api/orders/route.js
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import clientPromise from "../../../lib/mongodb";

const dbName = process.env.DB_NAME;

// GET /api/orders
export async function GET(req) {
  const currentUser = await getCurrentUser({ withFullUser: true });

  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const client = await clientPromise;
    const db = client.db(dbName);

    const pipeline = [];

    // ✅ Добавяме филтър по status, ако е подаден
    if (status) {
      pipeline.push({
        $match: { status },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "users",
          let: {
            searchId: {
              $toObjectId: "$client_id",
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$searchId"],
                },
              },
            },
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          status: 1,
          total_price: 1,
          user_name: "$user.name",
        },
      },
      {
        $sort: {
          _id: 1,
          church: 1,
        },
      }
    );

    const orders = await db.collection("orders").aggregate(pipeline).toArray();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    console.error("Error loading orders:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
