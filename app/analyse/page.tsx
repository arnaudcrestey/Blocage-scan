import { Suspense } from "react";
import AnalyseClient from "./AnalyseClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AnalyseClient />
    </Suspense>
  );
}
