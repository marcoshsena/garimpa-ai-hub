import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/produto/$id")({
  component: ProductLayout,
});

function ProductLayout() {
  return <Outlet />;
}
