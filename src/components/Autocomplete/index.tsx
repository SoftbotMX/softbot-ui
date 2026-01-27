import clsx from "clsx";
import * as React from "react";

export type AutocompleteSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AutocompleteTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AutocompleteProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "value" | "defaultValue" | "onChange"
  > {
  options: AutocompleteOption[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  onInputChange?: (value: string) => void;
  multiple?: boolean;
  size?: AutocompleteSize;
  tone?: AutocompleteTone;
  ghost?: boolean;
  placeholder?: string;
  clearable?: boolean;
  openOnFocus?: boolean;
  noOptionsText?: string;
  filter?: (option: AutocompleteOption, inputValue: string) => boolean;
  containerClassName?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const defaultFilter = (option: AutocompleteOption, inputValue: string) => {
  if (!inputValue.trim()) return true;
  return option.label.toLowerCase().includes(inputValue.trim().toLowerCase());
};

const Autocomplete = (props: AutocompleteProps) => {
  const {
    options,
    value,
    defaultValue = null,
    onChange,
    onInputChange,
    multiple = false,
    size = "md",
    tone,
    ghost = false,
    placeholder,
    clearable = true,
    openOnFocus = true,
    noOptionsText = "No options",
    filter = defaultFilter,
    className,
    containerClassName,
    disabled,
    readOnly,
    id,
    ref,
    autoComplete,
    ...rest
  } = props;

  const isControlled = value !== undefined;
  const [innerValue, setInnerValue] = React.useState<string | string[] | null>(defaultValue);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const [isFocused, setIsFocused] = React.useState(false);
  const [placement, setPlacement] = React.useState<"bottom" | "top">("bottom");

  const selectedValue = isControlled ? value : innerValue;
  const selectedArray = React.useMemo(() => {
    if (multiple) {
      if (Array.isArray(selectedValue)) return selectedValue;
      if (typeof selectedValue === "string") return [selectedValue];
      return [];
    }
    return [];
  }, [multiple, selectedValue]);

  const selectedSingle = React.useMemo(() => {
    if (multiple) return null;
    if (Array.isArray(selectedValue)) return selectedValue[0] ?? null;
    return selectedValue ?? null;
  }, [multiple, selectedValue]);

  const optionMap = React.useMemo(() => {
    return new Map(options.map((opt) => [opt.value, opt]));
  }, [options]);

  const selectedOptions = React.useMemo(() => {
    if (multiple) {
      return selectedArray
        .map((val) => optionMap.get(val))
        .filter(Boolean) as AutocompleteOption[];
    }
    if (!selectedSingle) return [];
    const opt = optionMap.get(selectedSingle);
    return opt ? [opt] : [];
  }, [multiple, optionMap, selectedArray, selectedSingle]);

  const displayedValue = selectedOptions[0]?.label ?? "";

  React.useEffect(() => {
    if (multiple) return;
    if (isFocused) return;
    setQuery(displayedValue);
  }, [displayedValue, isFocused, multiple]);

  const filteredOptions = React.useMemo(() => {
    const base = options.filter((opt) => filter(opt, query));
    if (!multiple) return base;
    const selectedSet = new Set(selectedArray);
    return base.filter((opt) => !selectedSet.has(opt.value));
  }, [filter, multiple, options, query, selectedArray]);

  React.useEffect(() => {
    if (!open) return;
    if (highlightedIndex >= filteredOptions.length) {
      setHighlightedIndex(filteredOptions.length ? 0 : -1);
    }
  }, [filteredOptions.length, highlightedIndex, open]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const mergeRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (!ref) return;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [ref],
  );

  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (!containerRef.current?.contains(target)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const updatePlacement = React.useCallback(() => {
    const container = containerRef.current;
    const popover = popoverRef.current;
    if (!container || !popover) return;
    const rect = container.getBoundingClientRect();
    const popoverHeight = popover.offsetHeight || 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) setPlacement("top");
    else setPlacement("bottom");
  }, []);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePlacement();
  }, [open, filteredOptions.length, updatePlacement]);

  React.useEffect(() => {
    if (!open) return;
    const handle = () => updatePlacement();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handle, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handle, true);
    };
  }, [open, updatePlacement]);

  const updateValue = (next: string | string[] | null) => {
    if (!isControlled) setInnerValue(next);
    onChange?.(next);
  };

  const handleSelectOption = (opt: AutocompleteOption) => {
    if (opt.disabled) return;
    if (multiple) {
      const nextSet = new Set(selectedArray);
      if (nextSet.has(opt.value)) nextSet.delete(opt.value);
      else nextSet.add(opt.value);
      const next = Array.from(nextSet);
      updateValue(next.length ? next : null);
      setQuery("");
      setOpen(true);
      inputRef.current?.focus();
    } else {
      updateValue(opt.value);
      setQuery(opt.label);
      setOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    }
  };

  const handleRemoveValue = (val: string) => {
    const next = selectedArray.filter((item) => item !== val);
    updateValue(next.length ? next : null);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    updateValue(null);
    setQuery("");
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const next = event.currentTarget.value;
    setQuery(next);
    onInputChange?.(next);
    if (!open) setOpen(true);
    if (highlightedIndex < 0) setHighlightedIndex(0);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (disabled || readOnly) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      if (!filteredOptions.length) return;
      setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      if (!filteredOptions.length) return;
      setHighlightedIndex((prev) => (prev <= 0 ? filteredOptions.length - 1 : prev - 1));
      return;
    }
    if (event.key === "Enter") {
      if (!open || highlightedIndex < 0) return;
      event.preventDefault();
      const opt = filteredOptions[highlightedIndex];
      if (opt) handleSelectOption(opt);
      return;
    }
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
        setHighlightedIndex(-1);
      }
      return;
    }
    if (event.key === "Backspace" && multiple && !query && selectedArray.length) {
      handleRemoveValue(selectedArray[selectedArray.length - 1]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (openOnFocus && !disabled && !readOnly) {
      setOpen(true);
      if (highlightedIndex < 0) setHighlightedIndex(0);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!multiple) setQuery(displayedValue);
  };

  const handleControlMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (disabled || readOnly) return;
    if (event.target === inputRef.current) return;
    event.preventDefault();
    inputRef.current?.focus();
    if (openOnFocus) setOpen(true);
  };

  const reactId = React.useId();
  const inputId = id ?? reactId;
  const listboxId = `${inputId}-listbox`;
  const hasValue = multiple ? selectedArray.length > 0 : Boolean(selectedSingle);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "autocomplete",
        multiple && "autocomplete-multiple",
        size && `autocomplete-${size}`,
        tone && `autocomplete-${tone}`,
        ghost && "autocomplete-ghost",
        disabled && "autocomplete-disabled",
        containerClassName,
      )}
    >
      <div className="autocomplete-control" onMouseDown={handleControlMouseDown}>
        {multiple && selectedOptions.length > 0 && (
          <div className="autocomplete-tags">
            {selectedOptions.map((opt) => (
              <span key={opt.value} className="autocomplete-tag">
                {opt.label}
                <button
                  type="button"
                  className="autocomplete-tag-remove"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleRemoveValue(opt.value)}
                  aria-label={`Remove ${opt.label}`}
                  disabled={disabled || readOnly}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          {...rest}
          id={inputId}
          ref={mergeRef}
          className={clsx("autocomplete-input", className)}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete ?? "off"}
          disabled={disabled}
          readOnly={readOnly}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
          }
        />
        {clearable && hasValue && !readOnly && !disabled && (
          <button
            type="button"
            className="autocomplete-clear"
            onMouseDown={(event) => event.preventDefault()}
            onClick={handleClear}
            aria-label="Clear"
          >
            ×
          </button>
        )}
        <span className="autocomplete-chevron" aria-hidden="true">
          ▾
        </span>
      </div>

      {open && !disabled && !readOnly && (
        <div
          ref={popoverRef}
          className={clsx("autocomplete-popover", placement === "top" && "is-top")}
          role="presentation"
        >
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable={multiple || undefined}
            className="autocomplete-options"
          >
            {filteredOptions.length ? (
              filteredOptions.map((opt, index) => {
                const isActive = index === highlightedIndex;
                const isSelected =
                  (!multiple && selectedSingle === opt.value) ||
                  (multiple && selectedArray.includes(opt.value));
                return (
                  <li
                    key={opt.value}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    className={clsx(
                      "autocomplete-option",
                      isActive && "is-active",
                      isSelected && "is-selected",
                      opt.disabled && "is-disabled",
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelectOption(opt)}
                  >
                    {opt.label}
                  </li>
                );
              })
            ) : (
              <li className="autocomplete-empty">{noOptionsText}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
