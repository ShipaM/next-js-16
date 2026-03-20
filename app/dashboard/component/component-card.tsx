import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FC } from "react";

type ComponentCardProps = {
  name: string;
  price: number;
  onClick?: () => void;
};

export const ComponentCard: FC<ComponentCardProps> = ({
  name,
  price,
  onClick,
}) => {
  return (
    <Card>
      <CardHeader className="min-h-0 flex-1 pb-2">
        <CardTitle className="text-base font-medium leading-tight">
          {name}
        </CardTitle>
        <CardDescription className="text-sm font-medium tabular-nums">
          {new Intl.NumberFormat("ru-RU").format(price)}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-0">
        <Button
          variant="secondary"
          size="sm"
          className="w-full gap-1.5"
          onClick={onClick}
        >
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};
