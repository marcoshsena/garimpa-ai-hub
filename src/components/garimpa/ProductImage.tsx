import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  rounded?: boolean;
}

export function ProductImage({ src, alt, className, imgClassName, rounded }: Props) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden",
        rounded && "rounded-lg",
        className,
      )}
    >
      {showFallback ? (
        <Fallback />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}

function Fallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted via-muted/60 to-muted/30 text-muted-foreground">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/70 shadow-sm ring-1 ring-border">
        <ImageOff className="h-5 w-5" />
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wide">Imagem indisponível</p>
    </div>
  );
}
