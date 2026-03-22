import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ErrorMessageProps = {
  message: string;
  className?: string;
  tabIndex?: number;
};

export const ErrorMessage = forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  function ErrorMessage({ message, className, tabIndex }, ref) {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-destructive", className)}
        role="alert"
        aria-live="assertive"
        tabIndex={tabIndex}
      >
        {message}
      </p>
    );
  },
);
