export function splitSentences(text: string): string[] {
  if (!text.trim()) return [];
  const parts = text.split(/(?<=[.!?])\s+/);
  return parts.filter((s) => s.trim().length > 0);
}

export type SentenceInfo = {
  text: string;
  paragraphIndex: number;
  sentenceIndex: number;
  globalIndex: number;
};

export function parseSentences(
  paragraphs: string[],
): SentenceInfo[] {
  const result: SentenceInfo[] = [];
  let globalIndex = 0;
  paragraphs.forEach((para, pIdx) => {
    const sentences = splitSentences(para);
    sentences.forEach((s, sIdx) => {
      result.push({
        text: s,
        paragraphIndex: pIdx,
        sentenceIndex: sIdx,
        globalIndex: globalIndex++,
      });
    });
  });
  return result;
}
