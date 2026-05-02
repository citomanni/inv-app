"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function FundGallery({
  images,
}: {
  images: { id: string; url: string; alt: string | null }[];
}) {
  const [active, setActive] = React.useState(0);
  if (!images.length) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          key={images[active]?.id}
          src={images[active]?.url}
          alt={images[active]?.alt ?? "Fund image"}
          fill
          priority
          sizes="(min-width: 1024px) 700px, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-5">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border-2 transition-all",
                i === active
                  ? "border-[#1C2D49]"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={img.url}
                alt={img.alt ?? "Fund thumbnail"}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
