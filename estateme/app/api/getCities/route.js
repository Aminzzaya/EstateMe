import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import City from "@/model/city";

export async function GET() {
  try {
    await connectMongo();

    const cities = await City.aggregate([
      {
        $addFields: {
          customSort: {
            $cond: { if: { $eq: ["$cityId", 22] }, then: 0, else: 1 },
          },
        },
      },
      { $sort: { customSort: 1, cityId: 1 } },
    ]);

    return NextResponse.json(
      { message: "Амжилттай.", cities: cities },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Хотуудын мэдээлэл буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
