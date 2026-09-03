import { RoomDetailPage } from "@/app/component/RoomDetailPage";

type RoomPageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;
  return <RoomDetailPage roomId={Number(roomId) || 1} />;
}
