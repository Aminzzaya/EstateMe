import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Street from "@/model/street";

export async function POST(req) {
  try {
    const { districtId } = await req.json();

    await connectMongo();

    const street = await Street.aggregate([
      {
        $match: {
          districtId,
        },
      },
    ]);

    if (!street) {
      return NextResponse.json(
        { message: "Хороо/баг олдсонгүй." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Амжилттай.", street },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Хороо/багийн мэдээлэл буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
