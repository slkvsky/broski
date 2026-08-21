import { ArrowUpRight } from "lucide-react";

const VARIANTS = {
  primary: "border border-ink bg-accent text-accent-ink hover:bg-ink hover:text-bg hover:border-ink",
  outline: "border border-ink/20 bg-transparent text-ink hover:border-ink",
  "outline-inverse":
    "border border-dark-ink/25 bg-transparent text-dark-ink hover:border-dark-ink",
};

export default function Button({
  as: Tag = "button",
  variant = "primary",
  arrow = true,
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5
        font-display text-sm font-medium tracking-wide
        transition-[background-color,color,border-color] duration-150 ease-out
        active:scale-[0.97] cursor-pointer
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
      {arrow && (
        <ArrowUpRight
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </Tag>
  );
}
