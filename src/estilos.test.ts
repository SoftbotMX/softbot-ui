/** Ninguna regla del kit lleva a pelo el nombre de una utilidad de Tailwind.
 *
 * Una regla así no se queda en el componente: sale en `dist/styles.css` y se suma
 * a la utilidad del mismo nombre en cada pantalla que consume el kit. Rating tenía
 * `.text-neutral { background-color: … }` y en MDX `<span class="text-neutral">`
 * salía como una barra negra (issue #12). El texto sigue en el DOM, así que ninguna
 * prueba de componente lo ve; esta mira la hoja.
 *
 * Dentro de un componente sí vale (`.rating .text-neutral`): ahí no alcanza a nadie más.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = import.meta.dirname;

const UTILIDAD =
  /^(text|bg|border|ring|outline|fill|stroke|shadow|divide|decoration|caret|placeholder)-/;

/** Un selector alcanza la página entera si nombra una utilidad y ninguna clase del
 * kit que lo acote (`.rating`, `.avatar`…). Lo que está dentro de `:not()` no acota. */
function esUtilidadSuelta(selector: string): boolean {
  const clases = [...selector.replace(/:not\([^)]*\)/g, "").matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(
    (m) => m[1],
  );
  return clases.some((c) => UTILIDAD.test(c)) && clases.every((c) => UTILIDAD.test(c));
}

/** Parte la lista de selectores por las comas de arriba, no por las de `:is(a, b)`. */
function partir(lista: string): string[] {
  const partes: string[] = [];
  let hondo = 0;
  let actual = "";
  for (const c of lista) {
    if (c === "(") hondo++;
    if (c === ")") hondo--;
    if (c === "," && hondo === 0) {
      partes.push(actual.trim());
      actual = "";
    } else actual += c;
  }
  return [...partes, actual.trim()];
}

function hojas(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? hojas(join(dir, e.name)) : e.name.endsWith(".css") ? [join(dir, e.name)] : [],
  );
}

/** Los selectores que no están anidados en otra regla (sí puede haber @media o
 * @layer encima): ésos son los que valen en toda la página. */
function selectoresDeArriba(css: string): string[] {
  // Sin comentarios ni cadenas: una llave dentro de `content: "{"` no abre nada.
  const limpio = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""');
  const pila: ("regla" | "arroba")[] = [];
  const fuera: string[] = [];
  let previo = "";
  for (const c of limpio) {
    if (c === "{") {
      const p = previo.trim();
      const esArroba = p.startsWith("@");
      if (!esArroba && pila.every((t) => t === "arroba")) fuera.push(p);
      pila.push(esArroba ? "arroba" : "regla");
      previo = "";
    } else if (c === "}") {
      pila.pop();
      previo = "";
    } else if (c === ";") {
      previo = "";
    } else {
      previo += c;
    }
  }
  return fuera.flatMap(partir);
}

describe("hojas del kit", () => {
  it("encuentra las hojas y sus selectores", () => {
    // Si el recorrido dejara de ver archivos, la prueba de abajo pasaría en vacío.
    const todas = hojas(SRC);
    expect(todas.length).toBeGreaterThan(20);
    expect(todas.flatMap((h) => selectoresDeArriba(readFileSync(h, "utf8")))).toContain(".rating");
  });

  it("detecta una utilidad suelta y deja pasar una acotada", () => {
    expect(
      selectoresDeArriba(
        ".text-error{color:red}@media (x){.bg-primary:hover{a:b}}.rating{.text-info{a:b}}",
      ).filter(esUtilidadSuelta),
    ).toEqual([".text-error", ".bg-primary:hover"]);
    // Lo que encontró la revisión: llaves entre comillas y utilidades dentro de :is().
    expect(
      selectoresDeArriba(
        '.icon::before{content:"{"}.text-neutral{a:b}:is(.text-info){a:b}.text-error:is(:hover, :focus){a:b}',
      ).filter(esUtilidadSuelta),
    ).toEqual([".text-neutral", ":is(.text-info)", ".text-error:is(:hover, :focus)"]);
    expect(selectoresDeArriba(".rating .text-error{a:b}").filter(esUtilidadSuelta)).toEqual([]);
  });

  it("no define utilidades de Tailwind fuera de su componente", () => {
    const sueltas = hojas(SRC).flatMap((h) =>
      selectoresDeArriba(readFileSync(h, "utf8"))
        .filter(esUtilidadSuelta)
        .map((s) => `${relative(SRC, h)}: ${s}`),
    );
    expect(sueltas).toEqual([]);
  });
});
