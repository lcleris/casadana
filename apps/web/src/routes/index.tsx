import { createFileRoute } from "@tanstack/react-router";
import CollectionPage from "@/pages/collection-page";

export const Route = createFileRoute("/")({
  component: CollectionPage,
});
