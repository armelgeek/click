import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";

interface PasswordInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  variant?: 'default' | 'search';
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(className)}
          variant={variant}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 hover:text-vapo-purple-primary transition-colors"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };