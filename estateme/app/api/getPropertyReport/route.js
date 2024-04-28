import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Property from "@/model/property";

export async function POST(req) {
  try {
    const { startDate, endDate } = await req.json();

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    await connectMongo();

    const propertyCountsByType = await Property.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDateObj,
            $lte: endDateObj,
          },
        },
      },
      {
        $group: {
          _id: "$typeId",
          count: { $sum: 1 },
          soldCount: {
            $sum: {
              $cond: [{ $eq: ["$typeId", 5] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "propertyType",
          localField: "_id",
          foreignField: "typeId",
          as: "typeDetails",
        },
      },
      {
        $unwind: "$typeDetails",
      },
      {
        $project: {
          typeId: "$_id",
          count: 1,
          soldCount: 1,
          typeName: "$typeDetails.typeName",
          soldPercentage: {
            $let: {
              vars: {
                percentage: {
                  $multiply: [{ $divide: ["$soldCount", "$count"] }, 100],
                },
              },
              in: {
                $concat: [
                  { $toString: { $round: ["$$percentage", 1] } },
                  {
                    $cond: [
                      { $eq: [{ $mod: ["$$percentage", 1] }, 0] },
                      ".0",
                      "",
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    if (propertyCountsByType.length === 0) {
      return NextResponse.json(
        {
          message:
            "No property listings available within the specified time range.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ propertyCountsByType }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error: Failed to fetch property counts.", error: error },
      { status: 500 }
    );
  }
}
