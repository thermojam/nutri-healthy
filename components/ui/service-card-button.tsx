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
      className={cn(
        "w-full font-semibold transition-all duration-300",
        isPopular
          ? "bg-linear-to-r from-accent to-orange-500 text-white hover:shadow-lg hover:shadow-accent/40 hover:scale-105 active:scale-95"
          : "border-2 border-accent text-accent hover:bg-accent/10 hover:shadow-md active:scale-95"
        ,
        className
      )}
      {...props}
    />
  );
});

ServiceCardButton.displayName = "ServiceCardButton";

export {ServiceCardButton};
