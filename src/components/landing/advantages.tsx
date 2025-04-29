import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Container } from "../site/container";

const advantages = [
  {
    title: "No-code платформа",
    description: "Интуитивно понятный интерфейс для всех пользователей.",
    image: "/images/landing/advantages/adv-1.png",
  },
  {
    title: "Высокая эффективность",
    description: "Использование машинного обучения для удаления спама",
    image: "/images/landing/advantages/adv-2.png",
  },
  {
    title: "REST API",
    description: "Адаптация решения решения под индивидуальную задачу",
    image: "/images/landing/advantages/adv-3.png",
  },
];

export function Advantages() {
  return (
    <section className="py-24 bg-muted">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Преимущества</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {advantages.map((advantage, index) => (
            <Card key={index}>
              <CardHeader className="p-0 pb-6 h-[400px]">
                <Image
                  src={advantage.image}
                  alt={advantage.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{advantage.title}</CardTitle>
                <CardDescription>{advantage.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
