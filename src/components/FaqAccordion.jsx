import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FaqItem({ question, answer, index, inView }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b border-line py-5 transition-[opacity,transform] duration-500 ease-out"
      style={{
        transitionDelay: `${Math.min(index, 5) * 70}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(0.6rem)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-display text-base font-medium text-ink sm:text-lg">{question}</span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 text-ink-soft transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* grid-rows 0fr/1fr trick: animates the collapse without measuring
          height in JS. Only runs on a discrete click, not per-scroll-frame. */}
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <p className="pt-3 pr-8 text-sm leading-relaxed text-ink-soft sm:text-base">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ items, inView = true }) {
  return (
    <div>
      {items.map((item, index) => (
        <FaqItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          index={index}
          inView={inView}
        />
      ))}
    </div>
  );
}
