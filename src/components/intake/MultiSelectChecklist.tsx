"use client";

import { useState } from "react";

interface MultiSelectChecklistProps {
  suggestions: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  customPlaceholder?: string;
}

export function MultiSelectChecklist({
  suggestions,
  value,
  onChange,
  customPlaceholder = "Add your own...",
}: MultiSelectChecklistProps) {
  const [customInput, setCustomInput] = useState("");

  const customValues = value.filter((v) => !suggestions.includes(v));

  function toggle(item: string) {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  }

  function addCustom() {
    const trimmed = customInput.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setCustomInput("");
  }

  function removeCustom(item: string) {
    onChange(value.filter((v) => v !== item));
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 rounded-none border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <input
              type="checkbox"
              checked={value.includes(item)}
              onChange={() => toggle(item)}
              className="h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
            />
            {item}
          </label>
        ))}
      </div>

      {customValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customValues.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent-hover"
            >
              {item}
              <button
                type="button"
                onClick={() => removeCustom(item)}
                aria-label={`Remove ${item}`}
                className="text-slate-400 hover:text-slate-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder={customPlaceholder}
          className="w-full rounded-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="button"
          onClick={addCustom}
          className="shrink-0 rounded-none border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
