import { useState, useCallback, useRef, useEffect } from "react";

// Compact multi-select dropdown: closed by default, opens on click,
// toggle selection by clicking option text (no checkboxes, no tick marks).
export default function MultiSelectDropdown({
  id,
  options,
  value,
  onChange,
  placeholder = "-- Ch\u1eddn --",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);

  const selectedSet = useRef(
    new Set(Array.isArray(value) ? value.filter(Boolean) : [])
  );

  const isSelected = useCallback(
    (opt) => selectedSet.current.has(opt),
    []
  );

  const toggleOption = useCallback((opt) => {
    const next = new Set(selectedSet.current);
    if (next.has(opt)) next.delete(opt);
    else next.add(opt);
    const arr = Array.from(next);
    selectedSet.current = next;
    onChange(arr);
  }, [onChange]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync selectedSet when external value changes (e.g. after save/restore).
  useEffect(() => {
    selectedSet.current = new Set(
      Array.isArray(value) ? value.filter(Boolean) : []
    );
  }, [value]);

  // Close on Escape, highlight navigation with arrow keys.
  const handleKeyDown = useCallback(
    (event) => {
      if (!isOpen) {
        if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
          event.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, options.length - 1)
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          toggleOption(options[highlightedIndex]);
        }
        return;
      }
    },
    [isOpen, options, highlightedIndex, toggleOption]
  );

  const displayValue =
    selectedSet.current.size > 0
      ? Array.from(selectedSet.current).join(", ")
      : placeholder;

  return (
    <div
      className="form-group needs-vector-field multi-select-wrapper"
      ref={selectRef}
      onKeyDown={handleKeyDown}
    >
      <div
        id={id}
        role="listbox"
        aria-multiselectable="true"
        aria-expanded={isOpen}
        className={`multi-select ${isOpen ? "multi-select--open" : ""}`}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onFocus={() => {
          if (!disabled) setIsOpen(true);
        }}
        tabIndex={0}
      >
        <div className="multi-select__trigger">
          <div className="multi-select__value">
            {displayValue}
          </div>
          <span className="multi-select__arrow">\u25BE</span>
        </div>

        {isOpen && !disabled && (
          <div className="multi-select__popup">
            {options.map((opt, idx) => {
              const sel = isSelected(opt);
              return (
                <div
                  key={opt}
                  role="option"
                  aria-selected={sel}
                  className={`multi-select__option ${
                    sel ? "multi-select__option--selected" : ""
                  } ${highlightedIndex === idx ? "multi-select__option--highlighted" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(opt);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <input
        ref={useRef(null)}
        type="hidden"
        name={id}
        value={Array.from(selectedSet.current).join(",")}
      />
    </div>
  );
}
