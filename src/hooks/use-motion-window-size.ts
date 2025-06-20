import { useMotionValue } from "motion/react";
import { useEffect } from "react";

export type UseMotionValueDefaults = {
  width?: number;
  height?: number;
};

export const useMotionWindowSize = (
  defaults: UseMotionValueDefaults = { width: 0, height: 0 },
) => {
  const width = useMotionValue<number>(defaults.width ?? 0);
  const height = useMotionValue<number>(defaults.height ?? 0);

  useEffect(() => {
    const resizeHandler = () => {
      width.set(window.innerWidth);
      height.set(window.innerHeight);
    };

    window.addEventListener("resize", resizeHandler, { passive: true });

    resizeHandler();

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [width, height]);

  return { width, height };
};
