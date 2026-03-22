import type { FC, Ref } from "react";
import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  message: string;
  className?: string;
  tabIndex?: number;
  ref?: Ref<HTMLParagraphElement>;
};

export const ErrorMessage: FC<ErrorMessageProps> = ({
  message,
  className,
  tabIndex,
  ref,
}) => {
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
};
