import type { Item } from "@/lib/types";

const sizes = {
  sm: { box: "h-9 w-9", emoji: "text-lg" },
  md: { box: "h-12 w-12", emoji: "text-2xl" },
  lg: { box: "h-16 w-16", emoji: "text-3xl" },
  xl: { box: "h-24 w-24", emoji: "text-5xl" },
} as const;

export function Thumb({
  item,
  size = "md",
}: {
  item: Pick<Item, "thumb" | "thumbBg" | "name">;
  size?: keyof typeof sizes;
}) {
  const s = sizes[size];
  return (
    <div
      className={
        "flex shrink-0 items-center justify-center rounded-md border border-slate-200 bg-gradient-to-br shadow-inner " +
        s.box +
        " " +
        item.thumbBg
      }
      aria-label={item.name}
    >
      <span className={"select-none " + s.emoji}>{item.thumb}</span>
    </div>
  );
}
