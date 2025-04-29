import Image from "next/image";
import { Container } from "../site/container";

export function DataSafety() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Безопасность ваших данных</h2>
          <p className="text-xl text-muted-foreground">
            Titorelli гарантирует надежную защиту вашей информации.
          </p>
        </div>
        <div className="flex align-center justify-center">
          <Image
            width={512}
            height={512}
            src="/images/landing/data-safety/ill.png"
            alt=""
          />
        </div>
      </Container>
    </section>
  );
}
