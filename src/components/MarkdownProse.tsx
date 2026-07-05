import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * The one styled markdown renderer for every long-form field on the site —
 * bios, summaries, strategic ideas, decision briefs, option text. Wrap it in
 * `.prose-strategic` (default) or pass a className for a tighter context.
 */
export function MarkdownProse({
  children,
  className = "prose-strategic",
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
