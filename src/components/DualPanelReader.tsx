import type { Theme } from "@/src/theme";
import { THEME_COLORS } from "@/src/theme";
import { ScrollView, View } from "react-native";
import { PageContent } from "./PageContent";

type Language = "es" | "en";

type Props = {
  contentTop: string;
  contentBottom: string;
  langTop: Language;
  langBottom: Language;
  bookId: string;
  pageId: string;
  activeParagraph: number | null;
  onParagraphPress: (index: number | null) => void;
  fontSize: number;
  theme: Theme;
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
  fontSize,
  theme,
}: Props) {
  const colors = THEME_COLORS[theme];

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 16,
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
            fontSize={fontSize}
            theme={theme}
          />
        </ScrollView>
      </View>

      <View style={{ flex: 1, padding: 16, backgroundColor: colors.bg }}>
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
          />
        </ScrollView>
      </View>
    </View>
  );
}
