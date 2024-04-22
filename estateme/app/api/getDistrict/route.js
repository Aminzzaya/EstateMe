import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import District from "@/model/district";

export async function POST(req) {
  try {
    const { cityId } = await req.json();

    await connectMongo();

    const district = await District.aggregate([
      {
        $match: {
          cityId,
        },
      },
    ]);

    if (!district) {
      return NextResponse.json(
        { message: "Дүүрэг/сум олдсонгүй." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Амжилттай.", district },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Дүүрэг/сумын мэдээлэл буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
