/** Las pruebas de unidad del kit.
 *
 * POR QUÉ EXISTE ESTE ARCHIVO, Y NO SE APOYA EN EL DE STORYBOOK
 * ────────────────────────────────────────────────────────────
 * El `addon-vitest` de Storybook corre las historias en un navegador de verdad
 * con Playwright: sirve para lo visual, tarda, y necesita descargar navegadores.
 * Lo que hace falta aquí es otra cosa —comprobar que un componente CONSERVA el
 * estado correcto al reordenar— y eso se mide en jsdom en milisegundos.
 *
 * QUÉ SE PRUEBA AQUÍ Y QUÉ NO
 * ───────────────────────────
 * NO se prueba que los botones se vean bien: para eso está el Storybook. Aquí
 * van las garantías que no se ven mirando la pantalla y que, cuando se rompen,
 * no dan ningún error — la identidad de las filas es el ejemplo, y es la que
 * obligó a escribir esto.
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "jsdom",
    globals: true,
    // Las historias quedan fuera: las corre el navegador de Storybook.
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
