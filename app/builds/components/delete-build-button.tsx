"use client";

import { Button } from "@/components/ui/button";
import { FC, useTransition } from "react";

type DeleteBuildButtonProps = {
  buildId: string;
  deleteAction: (formData: FormData) => void;
};

export const DeleteBuildButton: FC<DeleteBuildButtonProps> = ({
  buildId,
  deleteAction,
}) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm("Delete build?")) {
      return;
    }

    const fd = new FormData();
    fd.set("buildId", buildId);

    startTransition(() => deleteAction(fd));
  };

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
    >
      Remove
    </Button>
  );
};
