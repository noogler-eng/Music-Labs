import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import { RecoilRoot } from "recoil";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </NextUIProvider>
);
