import { Button } from "@/components/ui/button";
import { useCopy } from "@/lib/garimpa/store";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  label = "Copiar",
  size = "sm",
  variant = "outline",
  className,
}: {
  value: string;
  label?: string;
  size?: "sm" | "default";
  variant?: "outline" | "default" | "secondary" | "ghost";
  className?: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={() => copy(value)}
      className={cn(copied && "border-success text-[oklch(0.4_0.12_150)]", className)}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copiado!" : label}
    </Button>
  );
}
