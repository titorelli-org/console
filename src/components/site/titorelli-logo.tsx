import Image from "next/image";

import headerLogoPng from "./assets/header-logo.png";

// export function TitorelliLogo(props: Record<string, unknown>) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="h-6 w-6"
//       {...props}
//     >
//       <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
//     </svg>
//   );
// }

export function TitorelliLogo(props: Record<string, unknown>) {
  return (
    <Image
      src={headerLogoPng.src}
      width={headerLogoPng.width}
      height={headerLogoPng.height}
      alt="Titorelli logo"
      {...props}
      style={{ width: 120 }}
    />
  );
}
