"use server";

import { type ReactNode } from "react";
import { Container } from "../container";
import { TitorelliLogo } from "../titorelli-logo";
import Link from "next/link";
import { cn, transparentHeader } from "@/lib";

export async function BaseHeader({ navNode = null }: { navNode?: ReactNode }) {
  const headerClassName = cn(
    "fixed top-0 left-0 right-0 z-50 border-b",
    transparentHeader
      ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      : "bg-white",
  );

  return (
    <header className={headerClassName}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <TitorelliLogo />
            </Link>
            {/* <span className="text-xl font-bold">Titorelli</span> */}
          </div>
          {navNode}
        </div>
      </Container>
    </header>
  );
}
