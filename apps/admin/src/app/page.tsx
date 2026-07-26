import { Suspense } from "react";
import { LoginGate } from "@/components/login-gate";

export default function Home() {
  return (
    <Suspense>
      <LoginGate />
    </Suspense>
  );
}
