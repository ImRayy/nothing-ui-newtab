import { Icon } from "@iconify/react"
import { cva, type VariantProps } from "class-variance-authority"
import React, { useState } from "react"
import { cn } from "../../utils"
import Button from "./button"

const input = cva(
  "w-full py-2 border-2 focus:border-transparent border-transparent rounded-xl px-4 focus:outline-none focus:ring-2 disabled:opacity-40 text-sm",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground focus:ring-foreground placeholder:text-foreground placeholder:opacity-60",
        secondary: "bg-card text-card-foreground focus:ring-foreground",
      },
      outline: {
        ghost: "focus:ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof input> {
  isError?: boolean
  errorTxt?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      id,
      className,
      label,
      variant,
      outline,
      isError,
      errorTxt,
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = useState(false)

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={id} className="ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            type={type === "password" ? (show ? "text" : "password") : type}
            className={cn(
              input({ variant, outline, className }),
              type === "file" &&
                "input relative px-2 file:rounded-md file:border-none file:bg-destructive file:px-3 file:py-1.5 file:text-destructive-foreground focus:border-none",
              isError && "border-destructive focus:ring-destructive",
            )}
            ref={ref}
            {...props}
          />
          {type === "password" && (
            <Button
              variant={variant === "default" ? "primary" : "secondary"}
              size="icon"
              className="absolute top-1 right-1 size-8 shrink-0 rounded-lg"
              onClick={() => setShow((prev) => !prev)}
            >
              <Icon
                icon={show ? "ri:eye-off-fill" : "ri:eye-fill"}
                fontSize={20}
              />
            </Button>
          )}
        </div>
        {isError && errorTxt && (
          <span className="ml-1 text-destructive text-sm">{errorTxt}</span>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input
