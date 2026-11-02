import { NextResponse } from "next/server";
import { searchWikipedia } from "@/lib/services/wikipediaService";
import { searchStatutoryKnowledge, searchDepartments } from "@/lib/services/civicInfoService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const lang = searchParams.get("lang") || "en";

    if (!query || query.trim().length === 0) {
      // Default initial recommendations
      const defaultStatutory = searchStatutoryKnowledge("");
      const defaultDepartments = await searchDepartments("");

      return NextResponse.json({
        success: true,
        query: "",
        wikipediaArticles: [],
        statutoryRules: defaultStatutory,
        matchingDepartments: defaultDepartments,
        message: "Default civic information catalog loaded",
      });
    }

    // Parallel fetch: Wikipedia Encyclopedia + Statutory RTI Base + Database Departments
    const [wikipediaResults, statutoryResults, departmentResults] = await Promise.all([
      searchWikipedia(query, lang),
      searchStatutoryKnowledge(query),
      searchDepartments(query),
    ]);

    return NextResponse.json({
      success: true,
      query,
      lang,
      totalResults: wikipediaResults.length + statutoryResults.length + departmentResults.length,
      wikipediaArticles: wikipediaResults,
      statutoryRules: statutoryResults,
      matchingDepartments: departmentResults,
    });
  } catch (error) {
    console.error("Error in /api/general-info:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve civic information. Please try again.",
      },
      { status: 500 }
    );
  }
}
