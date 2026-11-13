import { NextResponse } from "next/server";
import { findRelevantPrecedents } from "@/lib/services/vectorService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { query, category, limit } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { success: false, error: "Search query is required to retrieve CIC precedents." },
        { status: 400 }
      );
    }

    const precedents = await findRelevantPrecedents(query, {
      category,
      limit: limit ? Number(limit) : 3,
    });

    return NextResponse.json({
      success: true,
      count: precedents.length,
      precedents,
    });
  } catch (error) {
    console.error("CIC Precedents Retrieval Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search CIC precedents." },
      { status: 500 }
    );
  }
}
