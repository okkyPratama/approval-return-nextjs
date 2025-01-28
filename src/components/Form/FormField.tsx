interface FormFieldProps {
  label: string;
  value: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  isBold?: boolean
}

export function FormField({ 
  label, 
  value, 
  fullWidth = false,
  multiline = false,
  rows = 2,
  isBold = false 
}: FormFieldProps) {
  const containerClasses = fullWidth ? "col-span-2" : "";
  const  textBold = isBold ? "font-bold" : "font-medium";
  return (
    <div className={`grid grid-cols-4 gap-2 ${containerClasses}`}>
      <label className={`text-sm text-gray-700 flex items-center col-span-1 ${textBold}`}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          disabled
          className={`form-textarea rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3 resize-none col-span-3`}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          value={value}
          disabled
          className={`form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3 col-span-3`}
        />
      )}
    </div>
  );
}