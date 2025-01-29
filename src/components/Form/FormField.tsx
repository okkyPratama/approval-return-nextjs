interface FormFieldProps {
  label: string;
  value: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  isBold?: boolean;
}

export function FormField({
  label,
  value,
  fullWidth = false,
  multiline = false,
  rows = 2,
  isBold = false,
}: FormFieldProps) {
  const textBold = isBold ? "font-bold" : "font-medium";

  return (
    <div className={`grid grid-cols-4 gap-2 items-center w-full`}>
      <label
        className={`text-xs text-gray-700 col-span-1 ${textBold} min-w-[120px]`}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          disabled
          className="form-textarea rounded-md bg-gray-100 border-gray-300 text-gray-800 p-2 resize-none col-span-3 text-sm"
          rows={rows}
        />
      ) : (
        <input
          type="text"
          value={value}
          disabled
          className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-2 col-span-3 text-sm"
        />
      )}
    </div>
  );
}
