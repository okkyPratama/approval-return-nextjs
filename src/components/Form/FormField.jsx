import React from "react";

export function FormField({
  label,
  value,
  fullWidth = false,
  multiline = false,
  rows = 2,
}) {

  return (
    <div className="flex w-full items-start py-0.5">
      <label
        className={`text-xs text-gray-700 font-normal w-[140px] pt-1`}
      >
        {label}
      </label>
      <div className="flex-1">
        {multiline ? (
          <textarea
            value={value}
            disabled
            className="w-full form-textarea rounded bg-gray-100 border-gray-200 text-gray-800 py-1 px-2 resize-none text-xs min-h-[40px]"
            rows={rows}
          />
        ) : (
          <input
            type="text"
            value={value}
            disabled
            className="w-full form-input rounded bg-gray-100 border-gray-200 text-gray-800 py-1 px-2 text-xs h-6"
          />
        )}
      </div>
    </div>
  );
}