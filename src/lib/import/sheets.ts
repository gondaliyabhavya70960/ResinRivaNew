import "server-only";

/**
 * Convert a Google Sheets reference (edit link, share link, published-to-web
 * link, or a bare spreadsheet id) into a CSV-export URL. Returns null if the
 * input doesn't look like a Sheets reference.
 */
export function toSheetCsvUrl(input: string): string | null {
  const s = input.trim();
  if (!s) return null;

  // Already a CSV endpoint.
  if (/output=csv|format=csv|tqx=out:csv/.test(s)) return s;

  // Published to web: /spreadsheets/d/e/<token>/pubhtml|pub
  const pub = /\/spreadsheets\/d\/e\/([^/]+)\/pub/.exec(s);
  if (pub) {
    const gid = /gid=(\d+)/.exec(s)?.[1];
    return `https://docs.google.com/spreadsheets/d/e/${pub[1]}/pub?output=csv${gid ? `&gid=${gid}` : ""}`;
  }

  // Standard: /spreadsheets/d/<id>/edit#gid=<gid>
  const std = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/.exec(s);
  const id = std?.[1] ?? (/^[a-zA-Z0-9-_]{20,}$/.test(s) ? s : null);
  if (!id) return null;
  const gid = /[#&?]gid=(\d+)/.exec(s)?.[1] ?? "0";
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`;
}

/**
 * Fetch a Google Sheet as CSV text. Throws a friendly, actionable error when
 * the sheet isn't publicly readable (Google then serves an HTML sign-in page
 * instead of CSV).
 */
export async function fetchSheetCsv(input: string): Promise<string> {
  const url = toSheetCsvUrl(input);
  if (!url) {
    throw new Error("That doesn't look like a Google Sheets link — paste the full sheet URL.");
  }
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (ResinRiva Importer)" },
      cache: "no-store",
    });
  } catch {
    throw new Error("Couldn't reach Google Sheets. Check your connection and the link, then retry.");
  }
  if (!res.ok) {
    throw new Error(
      `Couldn't read the sheet (HTTP ${res.status}). In Sheets: Share → General access → “Anyone with the link · Viewer”.`,
    );
  }
  const text = await res.text();
  const head = text.slice(0, 200).toLowerCase();
  if (head.includes("<html") || head.includes("<!doctype")) {
    throw new Error(
      "The sheet isn't publicly readable. In Google Sheets: Share → General access → “Anyone with the link · Viewer”, then paste the link again.",
    );
  }
  return text;
}
