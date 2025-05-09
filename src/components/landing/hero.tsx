"use client";

import { type FC } from "react";
import { Container } from "../site/container";
import heroImage from "./assets/hero-image.png";
import { motion, useTransform } from "motion/react";
import { useMotionWindowSize } from "@/hooks/use-motion-window-size";

export const Hero: FC = () => {
  const { width } = useMotionWindowSize({ width: 1024 });
  const backgroundSize = useTransform(width, [0, 2048], ["180%", "30%"]);

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted"
      style={{
        backgroundImage: `url("${heroImage.src}")`,
        backgroundPosition: "center center",
        backgroundSize,
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container>
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-bold mb-4 bg-white p-2 inline-block">
            Антиспам для телеграмма
          </h1>
          <p className="text-xl text-muted-foreground bg-white p-2 inline-block">
            Движок и хостинг ботов
          </p>
        </div>
      </Container>
    </motion.section>
  );
};
