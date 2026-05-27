import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const truncateToWords = (text: string, maxWords = 10) => {
  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) return text;

  return `${words.slice(0, maxWords).join(" ")}...`;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-black tracking-tight text-text md:text-2xl lg:text-3xl">
          {title}
        </h1>

        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {description ? (
        <p className="max-w-[90%] text-sm text-muted-foreground">
          {truncateToWords(description)}
        </p>
      ) : null}
    </div>
  );
};

export default PageHeader;
