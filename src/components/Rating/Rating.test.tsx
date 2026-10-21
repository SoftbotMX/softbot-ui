import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Rating } from "../index";

describe("Rating", () => {
  it("pinta el tono con una clase propia, no con la utilidad text-<tono>", () => {
    // `text-<tono>` es de Tailwind: si el kit le pone fondo, lo tapa en toda la app (#12).
    const { container } = render(<Rating tone="warning" defaultValue={3} />);
    const estrellas = container.querySelectorAll("input");
    expect(estrellas.length).toBe(5);
    for (const e of estrellas) {
      expect(e.classList.contains("rating-warning")).toBe(true);
      expect(e.classList.contains("text-warning")).toBe(false);
    }
  });
});
