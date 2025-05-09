import { getUserInPage } from "@/lib/server/get-user-in-page";
import { Client } from "./Client";
import { Suspense } from "react";

export const RumOpenobserve = async () => {
  const user = await getUserInPage();

  return (
    <Suspense fallback={null}>
      <Client user={user} />
    </Suspense>
  );
};
