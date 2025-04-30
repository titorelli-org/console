"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "../site/container";
import { useDemoClassify } from "@/hooks/use-demo-classify";

export function SpamChecker() {
  const [input, setInput] = useState("");

  const { data, mutate } = useDemoClassify();

  const checkSpam = () => {
    mutate({ text: input });
  };

  return (
    <section className="py-24 bg-muted">
      <Container className="max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Попробуйте антиспам-движок на практике
        </h2>
        <Textarea
          placeholder="Вставьте спам-сообщение сюда..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="mb-4 bg-white"
          rows={5}
        />
        <Button onClick={checkSpam} className="w-full mb-4">
          Проверить
        </Button>
        {data && (
          <Card>
            <CardHeader>
              <CardTitle>Результат</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                <p>Label: {data.label}</p>
                <p>Reason: {data.reason}</p>
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </Container>
    </section>
  );
}
