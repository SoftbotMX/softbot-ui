import clsx from "clsx";
import * as React from "react";

export type FieldInputTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

export type FieldInputSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface FileInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "color" | "type" | "onChange"
  > {
  tone?: FieldInputTone;
  size?: FieldInputSize;
  ghost?: boolean;
  showNames?: boolean;
  nameSeparator?: string;
  clearable?: boolean;
  clearLabel?: string;
  wrapperClassName?: string;
  onFilesChange?: (files: FileList | null) => void;
  id?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const FileInput = (props: FileInputProps) => {
  const {
    tone,
    size = "md",
    ghost,
    showNames = false,
    nameSeparator = ", ",
    clearable = false,
    clearLabel = "Clear",
    wrapperClassName,
    className,
    multiple,
    disabled,
    onFilesChange,
    id,
    ...rest
  } = props;
  const internalId = React.useId();
  const inputId = id ?? `file-input-${internalId}`;
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [names, setNames] = React.useState<string[]>([]);

  const sizeCls = size ? `file-input-${size}` : undefined;
  const toneCls = tone ? `file-input-${tone}` : undefined;
  const ghostCls = ghost ? "file-input-ghost" : undefined;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.currentTarget.files;
    const list = files && files.length ? Array.from(files).map((f) => f.name) : [];
    setNames(list);
    onFilesChange?.(files && files.length ? files : null);
  };

  const clear = () => {
    if (!inputRef.current) return;
    inputRef.current.value = "";
    setNames([]);
    onFilesChange?.(null);
    inputRef.current.focus();
  };

  return (
    <label htmlFor={inputId} className={clsx("inline-flex items-center gap-2", wrapperClassName)}>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        className={clsx("file-input", sizeCls, toneCls, ghostCls, className)}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />

      {showNames && names.length > 0 && (
        <span className="text-sm opacity-80 truncate max-w-[24ch]">
          {names.join(nameSeparator)}
        </span>
      )}

      {clearable && names.length > 0 && !disabled && (
        <button
          type="button"
          className="btn btn-xs btn-ghost"
          aria-label={clearLabel}
          onClick={clear}
        >
          <span className="icon-symbols">close</span>
        </button>
      )}
    </label>
  );
};
FileInput.displayName = "FileInput";
export default FileInput;
