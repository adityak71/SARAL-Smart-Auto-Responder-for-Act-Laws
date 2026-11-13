import { NextResponse } from "next/server";
import { scanSection8Exemptions } from "@/lib/services/aiService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { clauses } = body;

    if (!clauses) {
      return NextResponse.json(
        { success: false, error: "Petition clauses or text are required for scanning." },
        { status: 400 }
      );
    }

    const scan = await scanSection8Exemptions(clauses);

    return NextResponse.json({
      success: true,
      scan,
    });
  } catch (error) {
    console.error("Scan Exemptions Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to scan exemptions." },
      { status: 500 }
    );
  }
}
