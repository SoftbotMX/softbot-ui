/** El selector de emojis: que abra, que cierre y que, apagado, no abra.
 *
 * La cuadrícula es de `frimousse` y aquí no se prueba: descarga sus datos y
 * mide su ventana. Lo que se vigila es lo que pone el kit alrededor.
 */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import SelectorDeEmoji from "./index";

// La cuadrícula mide su ventana con `ResizeObserver`, que jsdom no trae, y
// pide sus datos: sin red, se queda en «Cargando…», que aquí basta.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
globalThis.fetch = vi.fn(() => new Promise<Response>(() => {}));

describe("el selector de emojis", () => {
  it("abre con el buscador y cierra con Escape", async () => {
    render(<SelectorDeEmoji onElegir={vi.fn()} urlDeDatos="/sin-red" />);
    const boton = screen.getByRole("button", { name: "Insertar emoji" });
    expect(screen.queryByPlaceholderText("Buscar emoji…")).toBeNull();

    await userEvent.click(boton);
    expect(screen.getByPlaceholderText("Buscar emoji…")).not.toBeNull();
    expect(boton.getAttribute("aria-expanded")).toBe("true");

    // CON EL FOCO EN EL BUSCADOR, que es donde está quien busca un emoji.
    await userEvent.click(screen.getByPlaceholderText("Buscar emoji…"));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByPlaceholderText("Buscar emoji…")).toBeNull();
    // Y EL FOCO VUELVE AL BOTÓN, no a `body` (codex).
    await act(async () => {});
    expect(document.activeElement).toBe(boton);
  });

  it("al abrir, el foco está en el buscador", async () => {
    render(<SelectorDeEmoji onElegir={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Insertar emoji" }));

    expect(document.activeElement).toBe(screen.getByPlaceholderText("Buscar emoji…"));
  });

  it("apagado con el panel abierto, no reaparece al encenderse", async () => {
    const { rerender } = render(<SelectorDeEmoji onElegir={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Insertar emoji" }));

    rerender(<SelectorDeEmoji onElegir={vi.fn()} disabled />);
    rerender(<SelectorDeEmoji onElegir={vi.fn()} />);

    expect(screen.queryByPlaceholderText("Buscar emoji…")).toBeNull();
  });

  it("un clic fuera lo cierra", async () => {
    render(<SelectorDeEmoji onElegir={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Insertar emoji" }));
    await userEvent.click(document.body);

    expect(screen.queryByPlaceholderText("Buscar emoji…")).toBeNull();
  });

  it("después de Escape se vuelve a abrir con un clic", async () => {
    // EL FOCO VUELVE AL BOTÓN, y la hoja del `Dropdown` le quita los clics al
    // disparador mientras tiene el foco dentro. jsdom no aplica la hoja: se
    // comprueba que este panel lleve la clase que lo exime, y que la regla
    // exista y le gane (codex).
    const { container } = render(<SelectorDeEmoji onElegir={vi.fn()} />);
    expect(container.querySelector(".dropdown")!.classList.contains("panel-controlado")).toBe(true);
    const hoja = readFileSync(join(import.meta.dirname, "../Dropdown/styles.css"), "utf8");
    expect(hoja).toMatch(
      /\.dropdown\.panel-controlado\.panel-controlado > \[tabindex\]:first-child \{\s*pointer-events: auto;/,
    );

    const boton = screen.getByRole("button", { name: "Insertar emoji" });
    await userEvent.click(boton);
    await userEvent.keyboard("{Escape}");
    await userEvent.click(boton);
    expect(screen.getByPlaceholderText("Buscar emoji…")).not.toBeNull();
  });

  it("se abre hacia arriba cuando abajo no cabe, dentro de lo que recorta", async () => {
    // EN EL DIÁLOGO REDES, la red de abajo dejaba la cuadrícula cortada por la
    // caja del diálogo (codex). jsdom no mide: se le dan las medidas a mano.
    const rect = (top: number, bottom: number) =>
      ({ top, bottom, left: 0, right: 0, width: 0, height: bottom - top, x: 0, y: top }) as DOMRect;
    const { container } = render(
      <div data-caja style={{ overflowY: "auto" }}>
        <SelectorDeEmoji onElegir={vi.fn()} />
      </div>,
    );
    const caja = container.querySelector<HTMLElement>("[data-caja]")!;
    const raiz = container.querySelector<HTMLElement>(".dropdown")!;
    // LA CAJA, NO LA VENTANA: contra los 768 px de jsdom el disparador de
    // abajo cabría (codex), contra la caja no.
    caja.getBoundingClientRect = () => rect(50, 500);

    raiz.getBoundingClientRect = () => rect(400, 430);
    await userEvent.click(screen.getByRole("button", { name: "Insertar emoji" }));
    expect(raiz.classList.contains("dropdown-top")).toBe(true);

    await userEvent.keyboard("{Escape}");
    raiz.getBoundingClientRect = () => rect(150, 180);
    await userEvent.click(screen.getByRole("button", { name: "Insertar emoji" }));
    expect(raiz.classList.contains("dropdown-bottom")).toBe(true);
  });

  it("apagado no abre", async () => {
    render(<SelectorDeEmoji onElegir={vi.fn()} disabled />);

    await userEvent.click(screen.getByRole("button", { name: "Insertar emoji" }));

    expect(screen.queryByPlaceholderText("Buscar emoji…")).toBeNull();
  });
});
