import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { LockKeyhole, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <LockKeyhole className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-3xl">401 Не авторизован</CardTitle>
          <CardDescription className="text-base">Для доступа к этому ресурсу требуется аутентификация</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Вам необходимо войти в систему, чтобы просмотреть эту страницу. Пожалуйста, войдите, используя свои учетные
            данные, или создайте новую учетную запись, если у вас её нет.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/login">Войти</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

