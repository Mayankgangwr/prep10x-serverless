"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  showIcon?: boolean;
  showText?: boolean;
  subText?: string;
  fontSize?: number;
  onClick?: () => void;
}

const Logo = ({
  className = "",
  size = 54,
  showIcon = true,
  showText = true,
  subText = "",
  fontSize = 32,
  onClick,
}: LogoProps) => {
  const gapSize = Math.max(8, Math.round(fontSize * 0.16));
  const titleSize = `${fontSize * 1.2}px`;
  const iconFontSize = `${fontSize * 0.8}px`;
  const insetSize = `${fontSize * 0.2}px`;

  return (
    <div
      className={cn("flex items-center", className)}
      style={{ gap: `${gapSize}px` }}
    >
      {showIcon ? (
        onClick ? (
          <button
            type="button"
            onClick={onClick}
            aria-label="Logo"
            className={cn(
              "group relative flex items-center justify-center overflow-hidden rounded-[14px]",
              "border-[3px] border-[#0058ff]/30 bg-[linear-gradient(180deg,#f8fbff_0%,#e8f1ff_100%)]",
              "font-bold text-[#0058ff] shadow-[0_10px_24px_rgba(0,88,255,0.16)]",
              "transition-all duration-200",
              "dark:border-sky-300/20 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(30,41,59,0.96)_100%)]",
              "dark:text-sky-200 dark:shadow-[0_10px_24px_rgba(0,0,0,0.42)]",
              "hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,88,255,0.2)]",
              "dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.5)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              fontSize: iconFontSize,
            }}
          >
            <span className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.45)] dark:drop-shadow-[0_1px_0_rgba(255,255,255,0.08)]">
              P
            </span>
            <span
              className={cn(
                "absolute inset-0 rounded-[14px]",
                "bg-[radial-gradient(circle_at_top_left,rgba(0,88,255,0.18),transparent_55%)]",
                "dark:bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_60%)]",
              )}
            />
            <div
              className={cn(
                "absolute rounded-[10px] border border-dashed border-[#0058ff]/60 opacity-90",
                "dark:border-sky-300/35",
              )}
              style={{
                inset: insetSize,
              }}
            />
          </button>
        ) : (
          <div
            className={cn(
              "group relative flex items-center justify-center overflow-hidden rounded-[14px]",
              "border-[3px] border-[#0058ff]/30 bg-[linear-gradient(180deg,#f8fbff_0%,#e8f1ff_100%)]",
              "font-bold text-[#0058ff] shadow-[0_10px_24px_rgba(0,88,255,0.16)]",
              "transition-all duration-200",
              "dark:border-sky-300/20 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.98)_0%,rgba(30,41,59,0.96)_100%)]",
              "dark:text-sky-200 dark:shadow-[0_10px_24px_rgba(0,0,0,0.42)]",
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              fontSize: iconFontSize,
            }}
            aria-hidden="true"
          >
            <span className="relative z-10 drop-shadow-[0_1px_0_rgba(255,255,255,0.45)] dark:drop-shadow-[0_1px_0_rgba(255,255,255,0.08)]">
              P
            </span>
            <span
              className={cn(
                "absolute inset-0 rounded-[14px]",
                "bg-[radial-gradient(circle_at_top_left,rgba(0,88,255,0.18),transparent_55%)]",
                "dark:bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_60%)]",
              )}
            />
            <div
              className={cn(
                "absolute rounded-[10px] border border-dashed border-[#0058ff]/60 opacity-90",
                "dark:border-sky-300/35",
              )}
              style={{
                inset: insetSize,
              }}
            />
          </div>
        )
      ) : null}

      {showText ? (
        <div className="flex flex-col leading-tight">
          <div
            className="font-extrabold leading-none tracking-[-0.04em] text-slate-950 dark:text-slate-50"
            style={{ fontSize: titleSize }}
          >
            Prep<span className="text-[#0058ff]">10x</span>
          </div>

          {subText ? (
            <div className="mt-1 text-sm leading-none text-slate-600 dark:text-slate-400">
              {subText}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Logo;
