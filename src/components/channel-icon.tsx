import { MessageCircle, Globe, Camera, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Channel } from "@/lib/data";

export function ChannelIcon({
  channel,
  className,
}: {
  channel: Channel;
  className?: string;
}) {
  const cls = cn("size-3.5", className);
  switch (channel) {
    case "instagram":
      return <Camera className={cls} />;
    case "facebook":
      return <MessageSquare className={cls} />;
    case "whatsapp":
      return <MessageCircle className={cls} />;
    default:
      return <Globe className={cls} />;
  }
}

export function ChannelLabel({ channel }: { channel: Channel }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <ChannelIcon channel={channel} />
      <span className="capitalize">{channel}</span>
    </span>
  );
}
