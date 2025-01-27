interface FormFieldProps {
    label: string;
    value: string;
    fullWidth?: boolean;
    multiline?: boolean;
    rows?: number;
  }
  
  export function FormField({ 
    label, 
    value, 
    fullWidth = false,
    multiline = false,
    rows = 2 
  }: FormFieldProps) {
    const containerClasses = fullWidth ? "col-span-2" : "";
    
    return (
      <div className={`flex flex-col ${containerClasses}`}>
        <label className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {multiline ? (
          <textarea
            value={value}
            disabled
            className="form-textarea rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3 resize-none w-full"
            rows={rows}
          />
        ) : (
          <input
            type="text"
            value={value}
            disabled
            className="form-input rounded-md bg-gray-100 border-gray-300 text-gray-800 p-3"
          />
        )}
      </div>
    );
  }
  