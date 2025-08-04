import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { RecoilRoot } from "recoil";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </NextUIProvider>
);
