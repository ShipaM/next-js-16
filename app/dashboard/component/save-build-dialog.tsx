"use client";

import { Component } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveBuildAction, SaveBuildFromState } from "../actions";

type SaveBuildFromStateProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedByCategory: Record<string, Component | null>;
  defaultName?: string;
  redirectPath?: string;
};

const initialState: SaveBuildFromState = { status: "idle" };

export const SaveBuildDialog = ({
  open,
  onOpenChange,
  selectedByCategory,
  defaultName,
  redirectPath,
}: SaveBuildFromStateProps) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [state, formAction] = useActionState(saveBuildAction, initialState);

  const componentIds = useMemo(
    () =>
      Object.values(selectedByCategory)
        .filter((componnet): componnet is Component => componnet !== null)
        .map((component) => component.id),
    [selectedByCategory],
  );
  console.log("componentIds", componentIds);

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Build saved successfully");
      formRef.current?.reset();

      onOpenChange(false);

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        router.refresh();
      }
    }
  }, [onOpenChange, redirectPath, router, state.status]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      formRef.current?.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save build</DialogTitle>
          <DialogDescription>Enter build name</DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          <Input
            name="name"
            placeholder="Example: PC"
            defaultValue={defaultName}
            required
          />
          <input
            type="hidden"
            name="componentIds"
            value={componentIds.join(",")}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={pending || componentIds.length === 0}
            >
              {pending ? "Saving.." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
