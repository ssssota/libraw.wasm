import { qwikVite } from "@builder.io/qwik/optimizer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		qwikVite({
			csr: true,
		}),
	],
});
