const LIBRE_URL = "https://libretranslate.com/translate";
const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

export async function translateText(
  text: string,
  source: string,
  target: string,
): Promise<string> {
  if (!text.trim() || source === target) return text;

  const t = await tryLibre(text, source, target);
  if (t !== text) return t;

  const m = await tryMyMemory(text, source, target);
  if (m !== text) return m;

  return text;
}

async function tryLibre(text: string, source: string, target: string) {
  try {
    const res = await fetch(LIBRE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source, target }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    return (data.translatedText as string) ?? text;
  } catch {
    return text;
  }
}

async function tryMyMemory(text: string, source: string, target: string) {
  try {
    const res = await fetch(
      `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${source}|${target}`,
    );
    if (!res.ok) return text;
    const data = await res.json();
    return (data.responseData?.translatedText as string) ?? text;
  } catch {
    return text;
  }
}
