/**
 * Striped "photo" placeholder used until the client supplies real photography.
 * Variant controls the stripe palette to suit dark / cream / light backgrounds.
 */
export function PhotoPlaceholder({
  caption,
  variant = "cream",
  className = "",
  captionClassName = "",
}: {
  caption: string;
  variant?: "dark" | "cream" | "light";
  className?: string;
  captionClassName?: string;
}) {
  const fill =
    variant === "dark"
      ? "placeholder-dark border-gold/20"
      : variant === "light"
        ? "placeholder-light border-primary/10"
        : "placeholder-cream border-primary/10";

  const caps =
    variant === "dark"
      ? "text-gold-light/85 bg-deep/70"
      : "text-[#5f5a4d] bg-cream/85";

  return (
    <div
      className={`relative overflow-hidden border flex items-end justify-center ${fill} ${className}`}
    >
      <span
        className={`font-mono text-[12px] tracking-[0.08em] uppercase px-[14px] py-[8px] rounded-[6px] ${caps} ${captionClassName}`}
      >
        {caption}
      </span>
    </div>
  );
}
