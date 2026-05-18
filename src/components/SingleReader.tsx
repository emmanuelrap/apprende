import type { Theme } from "@/src/theme";
import { THEME_COLORS } from "@/src/theme";
import { ScrollView, View } from "react-native";
import { PageContent } from "./PageContent";

type Language = "es" | "en";

type Props = {
  content: string;
  language: Language;
  bookId: string;
  pageId: string;
  activeParagraph: number | null;
  onParagraphPress: (index: number | null) => void;
  fontSize: number;
  theme: Theme;
};

export function SingleReader({
  content,
  language,
  bookId,
  pageId,
  activeParagraph,
  onParagraphPress,
  fontSize,
  theme,
}: Props) {
  const colors = THEME_COLORS[theme];

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.bg }}>
      <ScrollView>
        <PageContent
          content={content}
          language={language}
          bookId={bookId}
          pageId={pageId}
          activeParagraph={activeParagraph}
          onParagraphPress={onParagraphPress}
          fontSize={fontSize}
          theme={theme}
        />
      </ScrollView>
    </View>
  );
}
