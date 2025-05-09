import { AppHeader } from "@/components/site/header";
import { Container } from "../site/container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <Container className="mt-20">{children}</Container>
    </div>
  );
}
