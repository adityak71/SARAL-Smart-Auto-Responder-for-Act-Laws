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

/**
 * Fetches extended article text, intro paragraphs, and high-res media from Wikipedia for full in-app preview.
 * @param {string} title Article title
 * @param {string} lang Language code ("en" | "hi")
 */
export async function fetchWikipediaFullArticle(title, lang = "en") {
  if (!title || typeof title !== "string" || !title.trim()) {
    return null;
  }

  const cleanTitle = title.trim();
  const domain = lang === "hi" ? "hi.wikipedia.org" : "en.wikipedia.org";

  try {
    // 1. Fetch REST v1 summary for rich metadata & original resolution image
    const summaryUrl = `https://${domain}/api/rest_v1/page/summary/${encodeURIComponent(cleanTitle)}`;
    const summaryRes = await fetch(summaryUrl, {
      headers: {
        "User-Agent": WIKI_USER_AGENT,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(4500),
    });

    let summaryData = null;
    if (summaryRes.ok) {
      summaryData = await summaryRes.json();
    }

    // 2. Fetch full introductory text via Action API (exintro=1, explaintext=1)
    const actionUrl = `https://${domain}/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
      cleanTitle
    )}&format=json&origin=*`;

    let extendedExtract = "";
    try {
      const actionRes = await fetch(actionUrl, {
        headers: {
          "User-Agent": WIKI_USER_AGENT,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(4500),
      });

      if (actionRes.ok) {
        const actionData = await actionRes.json();
        const pages = actionData?.query?.pages || {};
        const pageId = Object.keys(pages)[0];
        if (pageId && pages[pageId]?.extract) {
          extendedExtract = pages[pageId].extract;
        }
      }
    } catch (e) {
      // Fallback to summary extract if action API times out
    }

    const finalExtract = extendedExtract || summaryData?.extract || "";

    return {
      title: summaryData?.title || cleanTitle,
      description: summaryData?.description || "Verified Public Encyclopedia Subject",
      extract: finalExtract,
      thumbnail: summaryData?.thumbnail?.source || summaryData?.originalimage?.source || null,
      pageUrl: summaryData?.content_urls?.desktop?.page || `https://${domain}/wiki/${encodeURIComponent(cleanTitle)}`,
      lang,
      source: "Wikipedia (Verified Public Encyclopedia)",
    };
  } catch (error) {
    console.warn("fetchWikipediaFullArticle error:", error.message);
    return null;
  }
}

