"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Heart, MessageCircle, Minus, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  demoPost,
  incomingComments,
  langTag,
  merchant,
  postComments,
  type PostComment,
} from "@/lib/data";
import { useLive, useMounted } from "@/lib/live";
import {
  Chip,
  ConfidenceBar,
  LanguageChip,
  Metric,
  MetricRow,
  Mono,
  PageHeader,
  Panel,
  PanelHeader,
  StatusDot,
} from "@/components/primitives";

/** Comments already handled, newest first, plus any that arrive while watching. */
type FeedEntry = { comment: PostComment; phase: number };

const PHASE_DETECTING = 1;
const PHASE_DONE = 2;

function DetectionRow({ comment }: { comment: PostComment }) {
  const { detection } = comment;
  const none = detection.trigger === "none";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {detection.trigger === "keyword" ? (
        <Chip tone="bg-route-soft text-route-ink">
          keyword <Mono className="text-[10px]">{detection.matched}</Mono>
        </Chip>
      ) : detection.trigger === "semantic" ? (
        <Chip tone="bg-machine-soft text-machine-ink">semantic intent</Chip>
      ) : (
        <Chip>no commercial intent</Chip>
      )}
      {detection.intent ? (
        <Mono className="text-[11px] text-muted-foreground">{detection.intent}</Mono>
      ) : null}
      <LanguageChip language={detection.language} />
      {!none ? <ConfidenceBar value={detection.confidence} /> : null}
    </div>
  );
}

function CommentCard({ entry }: { entry: FeedEntry }) {
  const { comment, phase } = entry;
  const skipped = comment.state === "skipped" || comment.detection.trigger === "none";

  return (
    <li className="px-4 py-3">
      <div className="flex gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[10px] font-medium">
          {comment.initials}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="truncate text-[13px] font-medium">{comment.name}</span>
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {comment.handle}
            </span>
            <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums">
              {comment.time}
            </span>
          </div>

          <p
            className="mt-0.5 text-[13px]"
            lang={langTag(comment.detection.language)}
            data-script={comment.script === "bengali" ? "bengali" : undefined}
          >
            {comment.text}
          </p>
          {comment.gloss ? (
            <p className="mt-0.5 text-[11px] italic text-muted-foreground">
              {comment.gloss}
            </p>
          ) : null}

          {phase >= PHASE_DETECTING ? (
            <div className="mt-2 border-l pl-3">
              <DetectionRow comment={comment} />
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2 border-l pl-3 text-[11px] text-muted-foreground">
              <span className="relative flex h-1 w-16 overflow-hidden rounded-full bg-muted">
                <span className="absolute inset-y-0 w-1/3 rounded-full bg-muted-foreground/40 animate-sweep" />
              </span>
              classifying
            </div>
          )}

          {phase >= PHASE_DONE ? (
            <div className="mt-2 border-l pl-3">
              {skipped ? (
                <div className="flex items-start gap-2 rounded-md bg-muted/60 px-2.5 py-1.5">
                  <Minus className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground">
                    {comment.skipReason}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border bg-card">
                  <div className="flex items-center gap-1.5 border-b px-2.5 py-1.5">
                    <Send className="size-3 shrink-0 text-live" />
                    <span className="text-[11px] font-medium">Private reply sent</span>
                    <Chip tone="bg-live-soft text-live-ink" className="ml-auto">
                      <Check className="size-2.5" />1 of 1 allowed
                    </Chip>
                  </div>
                  <p className="px-2.5 py-2 text-[12px] leading-relaxed">
                    {comment.reply}
                  </p>
                  <div className="flex items-center gap-1.5 border-t px-2.5 py-1.5 text-[10px] text-muted-foreground">
                    <StatusDot className="bg-pend" />
                    24-hour window opens only if {comment.name.split(" ")[0]} replies
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function ThePost() {
  return (
    <Panel>
      <PanelHeader
        title="The post"
        description={`${merchant.handle} · ${demoPost.posted}`}
      />
      <div className="p-4">
        <p className="text-[13px] leading-relaxed">{demoPost.caption}</p>

        <dl className="mt-3 grid grid-cols-3 gap-3 border-y py-3">
          <div>
            <dt className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Heart className="size-3" /> Likes
            </dt>
            <dd className="mt-0.5 font-mono text-sm font-medium tabular-nums">
              {demoPost.likes.toLocaleString("en-US")}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <MessageCircle className="size-3" /> Comments
            </dt>
            <dd className="mt-0.5 font-mono text-sm font-medium tabular-nums">
              {demoPost.commentCount}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted-foreground">Reach</dt>
            <dd className="mt-0.5 font-mono text-sm font-medium tabular-nums">
              {demoPost.reach.toLocaleString("en-US")}
            </dd>
          </div>
        </dl>

        <div className="mt-3">
          <h3 className="text-[12px] font-medium">Trigger keywords</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Matched literally. Anything else is judged on meaning instead, so
            &ldquo;kemon dam?&rdquo; and &ldquo;দাম কত?&rdquo; are caught too.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {demoPost.triggerKeywords.map((k) => (
              <Mono
                key={k}
                className="rounded border bg-muted px-1.5 py-0.5 text-[11px]"
              >
                {k}
              </Mono>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function MetaRules() {
  const rules = [
    {
      title: "One reply per comment",
      body: "Meta permits exactly one private reply to a comment. There is no automated follow-up, so the first message has to be worth reading.",
    },
    {
      title: "Seven days to use it",
      body: "The private reply must go out within seven days of the comment. After that the comment is no longer a way in.",
    },
    {
      title: "The window opens on their reply",
      body: "A 24-hour messaging window only starts if the customer answers. Until then the agent cannot send anything further.",
    },
    {
      title: "The post link rides along",
      body: "Meta attaches a link to the commented post automatically, so the customer always sees what the reply is about.",
    },
  ];

  return (
    <Panel>
      <PanelHeader
        title="What the platform allows"
        description="These limits are enforced in the gateway, not left to whoever is on the keyboard."
      />
      <ul className="divide-y">
        {rules.map((r) => (
          <li key={r.title} className="px-4 py-2.5">
            <h3 className="text-[12px] font-medium">{r.title}</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              {r.body}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export default function CommentsPage() {
  const { beat, live } = useLive();
  const mounted = useMounted();

  const [feed, setFeed] = React.useState<FeedEntry[]>(() =>
    postComments.map((c) => ({ comment: c, phase: PHASE_DONE }))
  );
  const arrived = React.useRef(0);

  React.useEffect(() => {
    if (!live || beat === 0) return;

    setFeed((prev) => {
      const advanced = prev.map((e) =>
        e.phase < PHASE_DONE ? { ...e, phase: e.phase + 1 } : e
      );
      if (arrived.current < incomingComments.length && beat % 2 === 1) {
        const next = incomingComments[arrived.current];
        arrived.current += 1;
        return [{ comment: next, phase: 0 }, ...advanced];
      }
      return advanced;
    });
  }, [beat, live]);

  const replied = feed.filter(
    (e) => e.phase >= PHASE_DONE && e.comment.detection.trigger !== "none"
  ).length;
  const skipped = feed.filter(
    (e) => e.phase >= PHASE_DONE && e.comment.detection.trigger === "none"
  ).length;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Comments"
        description="A public comment is the cheapest lead there is. This is the machine that turns one into a conversation, inside the rules the platform actually enforces."
        actions={
          <Link
            href="/admin/inbox"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
          >
            See where they land
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      <MetricRow>
        <Metric
          label="Comments on this post"
          value={mounted ? feed.length : postComments.length}
          basis={`of ${demoPost.commentCount} total`}
        />
        <Metric
          label="Conversations opened"
          value={mounted ? replied : postComments.filter((c) => c.state === "replied").length}
          basis="one compliant private reply each"
        />
        <Metric
          label="Deliberately skipped"
          value={mounted ? skipped : postComments.filter((c) => c.state === "skipped").length}
          basis="praise, no commercial intent"
        />
        <Metric
          label="Written in Banglish"
          value="62%"
          basis="of comments on this post"
        />
      </MetricRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="space-y-5">
          <ThePost />
          <MetaRules />
        </div>

        <Panel className="flex min-h-0 flex-col">
          <PanelHeader
            title="Comment stream"
            description="Each comment classified, then either answered in a DM or left alone."
            action={
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <StatusDot className={live ? "bg-live" : "bg-muted-foreground"} pulse={live} />
                {live ? "watching" : "paused"}
              </span>
            }
          />
          <ul className="divide-y">
            {feed.map((entry, i) => (
              <div
                key={entry.comment.id}
                className={cn(mounted && live && i === 0 && entry.phase === 0 && "animate-row-in")}
              >
                <CommentCard entry={entry} />
              </div>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
