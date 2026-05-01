import React from "react";
import {Button, type ButtonProps} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface ServiceCardButtonProps extends Omit<ButtonProps, "variant"> {
  isPopular?: boolean;
}

const ServiceCardButton = React.forwardRef<
  HTMLButtonElement,
  ServiceCardButtonProps
>(({isPopular = false, className, ...props}, ref) => {
  return (
    <Button
      ref={ref}
      variant={isPopular ? "default" : "outline"}
      className={cn("w-full", className)}
      {...props}
    />
  );
});

ServiceCardButton.displayName = "ServiceCardButton";

export {ServiceCardButton};