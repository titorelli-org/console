import { type FC, type ReactNode } from "react";
import Image from "next/image";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export type CoverImageVariants = "signin" | "signup" | "restore";

const getCoverSrc = (variant: CoverImageVariants) => {
  switch (variant) {
    case "signin":
      return "/images/authorization/signin-cover.jpeg";
    case "signup":
      return "/images/authorization/signup-cover.jpeg";
    case "restore":
      return "/images/authorization/restore-cover.jpeg";
    default:
      throw "--unreachable--";
  }
};

export const AuthorizationLayout: FC<{
  coverImageVariant: CoverImageVariants;
  children: ReactNode;
}> = ({ coverImageVariant, children }) => (
  <div className="grid min-h-svh lg:grid-cols-2">
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Titorelli
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">{children}</div>
      </div>
    </div>
    <div className="relative hidden bg-muted lg:block">
      <Image
        priority
        width={960}
        height={1080}
        src={getCoverSrc(coverImageVariant)}
        alt="Image"
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
);
