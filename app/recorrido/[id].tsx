import { RecorridoDetailScreen } from "@/src/screens/RecorridoDetailScreen";
import { useLocalSearchParams } from "expo-router";

export default function RecorridoDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <RecorridoDetailScreen recorridoId={id} />;
}
