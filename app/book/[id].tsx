import { BookDetailScreen } from "@/src/screens/BookDetailScreen";
import { useLocalSearchParams } from "expo-router";

export default function BookDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BookDetailScreen bookId={id} />;
}
