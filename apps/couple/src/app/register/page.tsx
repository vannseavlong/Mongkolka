import { Suspense } from "react";
import { RegisterGate } from "@/components/register-gate";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterGate />
    </Suspense>
  );
}
