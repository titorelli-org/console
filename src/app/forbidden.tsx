import Link from "next/link"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-3xl">403 Доступ запрещен</CardTitle>
          <CardDescription className="text-base">У вас нет разрешения на доступ к этому ресурсу</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>
            Страница, к которой вы пытаетесь получить доступ, ограничена и требует дополнительных разрешений. Если вы
            считаете, что это ошибка, пожалуйста, свяжитесь с вашим администратором.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/contact">Связаться с поддержкой</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

