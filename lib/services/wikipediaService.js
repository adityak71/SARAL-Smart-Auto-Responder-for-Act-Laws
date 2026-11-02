/**
 * Wikipedia Service for SARAL Civic Knowledge Lookup.
 * Integrates with Wikimedia REST API and Action API to retrieve
 * reliable public explanations, legal context, and government scheme data.
 */

const WIKI_USER_AGENT =
  process.env.WIKIPEDIA_USER_AGENT || "SARAL-Civic-Copilot/1.0 (contact: info@saral-rti.in)";

/**
 * Searches Wikipedia for relevant civic/legal articles and fetches detailed summaries.
 * @param {string} query Search terms (e.g., "Right to Information Act", "Panchayati Raj", "Central Information Commission")
 * @param {string} lang Language code: "en" (default) or "hi"
 * @returns {Promise<Array>} List of article summaries
 */
export async function searchWikipedia(query, lang = "en") {
  if (!query || typeof query !== "string" || !query.trim()) {
    return [];
  }

  const cleanQuery = query.trim();
  const domain = lang === "hi" ? "hi.wikipedia.org" : "en.wikipedia.org";

  try {
    // Step 1: Query Action API for top matching article titles
    const searchUrl = `https://${domain}/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      cleanQuery
    )}&utf8=1&format=json&srlimit=4&origin=*`;

    const searchRes = await fetch(searchUrl, {
      headers: {
        "User-Agent": WIKI_USER_AGENT,
        Accept: "application/json",
      },
      // 5-second timeout safeguard
      signal: AbortSignal.timeout(5000),
    });

    if (!searchRes.ok) {
      console.warn(`Wikipedia search failed with status: ${searchRes.status}`);
      return [];
    }

    const searchData = await searchRes.json();
    const searchResults = searchData?.query?.search || [];

    if (searchResults.length === 0) {
      return [];
    }

    // Step 2: Fetch structured summary for the top 2-3 matching pages using REST v1
    const summaryPromises = searchResults.slice(0, 3).map(async (item) => {
      try {
        const title = item.title;
        const summaryUrl = `https://${domain}/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

        const summaryRes = await fetch(summaryUrl, {
          headers: {
            "User-Agent": WIKI_USER_AGENT,
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(4000),
        });

        if (!summaryRes.ok) {
          return {
            title: item.title,
            snippet: item.snippet.replace(/<[^>]+>/g, ""),
            pageUrl: `https://${domain}/wiki/${encodeURIComponent(item.title)}`,
            source: "Wikipedia",
          };
        }

        const summaryData = await summaryRes.json();
        return {
          title: summaryData.title || item.title,
          description: summaryData.description || null,
          extract: summaryData.extract || item.snippet.replace(/<[^>]+>/g, ""),
          thumbnail: summaryData.thumbnail?.source || null,
          pageUrl: summaryData.content_urls?.desktop?.page || `https://${domain}/wiki/${encodeURIComponent(item.title)}`,
          lang,
          source: "Wikipedia (Verified Public Encyclopedia)",
        };
      } catch (err) {
        return {
          title: item.title,
          snippet: item.snippet.replace(/<[^>]+>/g, ""),
          pageUrl: `https://${domain}/wiki/${encodeURIComponent(item.title)}`,
          source: "Wikipedia",
        };
      }
    });

    const summaries = await Promise.all(summaryPromises);
    return summaries.filter(Boolean);
  } catch (error) {
    console.error("Wikipedia search error:", error.message);
    return [];
  }
}
