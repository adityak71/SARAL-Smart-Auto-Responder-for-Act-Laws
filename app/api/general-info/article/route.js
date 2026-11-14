import { NextResponse } from "next/server";
import { fetchWikipediaFullArticle } from "@/lib/services/wikipediaService";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    const lang = searchParams.get("lang") || "en";

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title parameter is required" },
        { status: 400 }
      );
    }

    const article = await fetchWikipediaFullArticle(title.trim(), lang);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article details could not be retrieved" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Error in /api/general-info/article:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
