import { ConfigPage } from "@/components/ConfigPage";

export default async function ItemConfigRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConfigPage itemId={id} />;
}
