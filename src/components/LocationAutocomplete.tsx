"use client";

import { useState, useEffect, useRef } from "react";
import { LocationResult } from "@/types/booking";

interface Props {
  value: string;
  onSelect?: (result: LocationResult) => void;
  placeholder?: string;
  required?: boolean;
}

export default function LocationAutocomplete({
  value,
  onSelect,
  placeholder,
  required,
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced fetch
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?location=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.result)) {
          setResults(data.result);
          setIsOpen(true);
        }
      } catch {
        // silently ignore network errors
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (result: LocationResult) => {
    setQuery(result.label);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(result);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      select(results[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-slate-500 shrink-0"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 2C7.239 2 5 4.239 5 7c0 4.5 5 11 5 11s5-6.5 5-11c0-2.761-2.239-5-5-5z"
          />
          <circle cx="10" cy="7" r="1.5" />
        </svg>

        <input
          type="text"
          className="flex-1 border-0 outline-none bg-transparent text-[0.9375rem] font-medium text-slate-900 min-w-0 placeholder:text-slate-500 placeholder:font-normal"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          required={required}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />

        {loading && (
          <span
            className="block w-3.5 h-3.5 border-2 border-slate-200 border-t-blue-600 rounded-full shrink-0 animate-spin"
            aria-hidden
          />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          className="absolute top-[calc(100%+10px)] -left-5 -right-5 bg-white border border-slate-200 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.1)] list-none z-[100] overflow-hidden max-h-80 overflow-y-auto"
          role="listbox"
        >
          {results.map((result, i) => (
            <li
              key={result.placeID}
              role="option"
              aria-selected={i === activeIndex}
              className={`flex flex-col gap-0.5 px-4 py-3 cursor-pointer transition-colors [&:not(:last-child)]:border-b [&:not(:last-child)]:border-slate-200 ${
                i === activeIndex ? "bg-blue-50" : "hover:bg-blue-50"
              }`}
              onMouseDown={(e) => {
                e.preventDefault(); // keep focus on input
                select(result);
              }}
            >
              <span
                className="text-[0.9375rem] font-medium text-slate-900 [&_b]:font-bold [&_b]:text-blue-600"
                dangerouslySetInnerHTML={{ __html: result.placeHlt }}
              />
              <span
                className="text-[0.8125rem] text-slate-500 [&_b]:font-bold [&_b]:text-blue-600"
                dangerouslySetInnerHTML={{
                  __html: `${result.cityHlt}, ${result.countryHlt}`,
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
