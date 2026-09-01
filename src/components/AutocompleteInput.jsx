import { useEffect, useRef, useState } from "react";

export default function AutocompleteInput({
  id,
  value,
  onChange,
  suggestions = [],
  placeholder,
  ariaLabel,
  maxSuggestions = 8,
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef(null);

  const filtered = (
    value ? suggestions.filter((s) => s.toLowerCase().startsWith(value.toLowerCase())) : suggestions
  ).slice(0, maxSuggestions);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectValue(v) {
    onChange(v);
    setOpen(false);
    setHighlighted(-1);
  }

  function handleKeyDown(event) {
    if (!open || filtered.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && highlighted >= 0) {
      event.preventDefault();
      selectValue(filtered[highlighted]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        autoComplete="off"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setOpen(true);
          setHighlighted(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-line bg-bg-alt py-1 shadow-lg">
          {filtered.map((item, i) => (
            <li key={item}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectValue(item)}
                className={`block w-full px-4 py-2 text-left text-sm transition-colors duration-100 ${
                  i === highlighted ? "bg-ink text-bg" : "text-ink hover:bg-ink/10"
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
