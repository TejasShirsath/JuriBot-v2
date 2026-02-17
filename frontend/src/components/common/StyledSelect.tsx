import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface StyledSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
  placeholder?: string;
}

export const StyledSelect: React.FC<StyledSelectProps> = ({
  value,
  onChange,
  options,
  className,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between text-left appearance-none cursor-pointer",
          className
        )}
      >
        <span className={cn("block truncate", !value && "text-charcoal/50")}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-charcoal/50 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 overflow-hidden bg-ivory border border-coffee/10 rounded-xl shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-60 overflow-auto py-1 custom-scrollbar">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={cn(
                  "relative w-full cursor-pointer select-none py-2.5 pl-4 pr-9 text-left text-sm transition-colors",
                  option === value
                    ? "bg-coffee/10 text-coffee font-medium"
                    : "text-charcoal hover:bg-coffee/5 hover:text-coffee"
                )}
              >
                <span className="block truncate">{option}</span>
                {option === value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-coffee">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
