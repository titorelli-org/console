import { PrismaInstrumentation } from "@prisma/instrumentation";
import { registerOTel, OTLPHttpJsonTraceExporter } from "@vercel/otel";

export function register() {
  registerOTel({
    serviceName: "console",
    traceExporter: new OTLPHttpJsonTraceExporter({
      url: `${process.env.OO_BASE_URL}/v1/traces`,
      headers: {
        Authorization: `Basic ${process.env.OO_AUTH_CRED}`,
      },
    }),
    instrumentations: [
      new PrismaInstrumentation({
        middleware: true,
      }),
    ],
  });
}
