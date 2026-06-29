import type { Theme } from "@/src/theme";
import { THEME_COLORS } from "@/src/theme";
import { ScrollView, View } from "react-native";
import { PageContent } from "./PageContent";
import type { SentenceInfo } from "@/src/services/sentences";

type Language = "es" | "en" | "fr";

type Props = {
  contentTop: string;
  contentBottom: string;
  langTop: Language;
  langBottom: Language;
  bookId: string;
  pageId: string;
  activeParagraph: number | null;
  onParagraphPress: (index: number | null) => void;
  onSentencePress?: (sentenceGlobalIndex: number) => void;
  fontSize: number;
  theme: Theme;
  boldEnabled: boolean;
  lineSpacing: number;
  sideMargin: number;
  fontFamily: string | undefined;
  textAlign: "left" | "center" | "right" | "justify";
  sentences?: SentenceInfo[];
  activeSentenceIndex?: number | null;
};

export function DualPanelReader({
  contentTop,
  contentBottom,
  langTop,
  langBottom,
  bookId,
  pageId,
  activeParagraph,
  onParagraphPress,
  onSentencePress,
  fontSize,
  theme,
  boldEnabled,
  lineSpacing,
  sideMargin,
  fontFamily,
  textAlign,
  sentences,
  activeSentenceIndex,
}: Props) {
  const colors = THEME_COLORS[theme];

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: sideMargin,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderColor: theme === "dark" ? "#333" : "#ddd",
          backgroundColor: colors.bg,
        }}
      >
        <ScrollView>
          <PageContent
            content={contentTop}
            language={langTop}
            bookId={bookId}
            pageId={pageId}
            activeParagraph={activeParagraph}
            onParagraphPress={onParagraphPress}
            onSentencePress={onSentencePress}
            fontSize={fontSize}
            theme={theme}
            boldEnabled={boldEnabled}
            lineSpacing={lineSpacing}
            fontFamily={fontFamily}
            textAlign={textAlign}
            sentences={sentences}
            activeSentenceIndex={activeSentenceIndex}
          />
        </ScrollView>
      </View>

      <View style={{ flex: 1, paddingHorizontal: sideMargin, paddingVertical: 16, backgroundColor: colors.bg }}>
        <ScrollView>
          <PageContent
            content={contentBottom}
            language={langBottom}
            bookId={bookId}
            pageId={pageId}
            readonly
            activeParagraph={activeParagraph}
            onParagraphPress={onParagraphPress}
            fontSize={fontSize}
            theme={theme}
            boldEnabled={boldEnabled}
            lineSpacing={lineSpacing}
            fontFamily={fontFamily}
            textAlign={textAlign}
          />
        </ScrollView>
      </View>
    </View>
  );
}
