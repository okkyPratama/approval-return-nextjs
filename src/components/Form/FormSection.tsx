interface FormSectionProps {
    title: string;
    children: React.ReactNode;
  }
  
  export function FormSection({ title, children }: FormSectionProps) {
    return (
      <div>
        <h3 className="text-lg font-bold pb-2">
          <span className="inline-block border-b-[3px] border-[#F7AD00]">
            {title}
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {children}
        </div>
      </div>
    );
  }