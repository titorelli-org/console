import { Container } from "../site/container";
import heroImage from "./assets/hero-image.png";

export function Hero() {
  return (
    <section
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted"
      style={{
        backgroundImage: `url("${heroImage.src}")`,
        backgroundPosition: "center center",
        backgroundSize: "50%",
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
    </section>
  );
}
