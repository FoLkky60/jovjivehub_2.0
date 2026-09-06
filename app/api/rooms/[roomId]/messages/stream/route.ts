import { listMessages } from "@/app/services/room-service";

type RouteContext = { params: Promise<{ roomId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { roomId } = await context.params;
  const id = Number(roomId);
  if (!Number.isSafeInteger(id)) return new Response("Invalid room id", { status: 400 });

  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;
  const stream = new ReadableStream({
    start(controller) {
      const publish = async () => {
        const messages = await listMessages(id);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(messages)}\n\n`));
      };
      void publish();
      timer = setInterval(() => void publish(), 1500);
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}