import "@builder.io/qwik/qwikloader.js";

import { render } from "@builder.io/qwik";
import "water.css/out/light.css";
import { App } from "./app.tsx";
import "./index.css";

render(document.getElementById("app") as HTMLElement, <App />);
