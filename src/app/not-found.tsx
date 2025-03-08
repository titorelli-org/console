import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Search className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-3xl">404 Страница не найдена</CardTitle>
          <CardDescription className="text-base">
            Запрашиваемая страница не существует
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Страница, которую вы ищете, была удалена, перемещена или никогда не
            существовала. Проверьте URL-адрес или попробуйте найти нужную
            информацию с помощью поиска.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
