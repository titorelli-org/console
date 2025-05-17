import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function SignOutPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Успешно выполнен выход</CardTitle>
          <CardDescription>
            Вы были безопасно выведены из своей учетной записи.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-zinc-600 dark:text-zinc-400">
          <p>
            Спасибо за использование нашего сервиса. Надеемся увидеть вас снова
            в ближайшее время!
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href="/auth/signin">Вернуться к Входу</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
