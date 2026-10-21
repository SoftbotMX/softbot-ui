/** El editor clásico: lo que deja escribir, y lo que se cae al pegar.
 *
 * LO QUE IMPORTA AQUÍ NO SE VE MIRANDO LA PANTALLA. Un pegado desde Word que
 * deja pasar un `span` con su fuente se ve casi igual en el editor, y llega al
 * portal con la tipografía de otro. Por eso se mira el HTML que sale.
 */
import { type Editor, Node } from "@tiptap/core";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import EditorClasico from "./index";

// JSDOM NO TRAE `ClipboardEvent`, y `pasteHTML` lo construye.
globalThis.ClipboardEvent ??= class extends Event {
  clipboardData = null;
} as unknown as typeof ClipboardEvent;

// NI MEDIDAS: ProseMirror desplaza la vista hasta el cursor y pregunta por
// los rectángulos de un rango.
Range.prototype.getClientRects ??= () => [] as unknown as DOMRectList;
Range.prototype.getBoundingClientRect ??= () => new DOMRect();
Element.prototype.getClientRects ??= () => [] as unknown as DOMRectList;

const desactivado = (el: HTMLElement) => (el as HTMLButtonElement | HTMLSelectElement).disabled;

/** El `style` que devuelve el DOM viene normalizado (`font-size: 1.25em;`). */
const sinEspacios = (html: string) => html.replace(/style="font-size: ([\d.]+em);"/g, 'style="font-size:$1"');

// LA CUADRÍCULA DE EMOJIS NO SE PRUEBA AQUÍ: descarga sus datos y mide su
// ventana, y en jsdom no hay ni red ni medidas. Lo que se vigila es lo del
// editor: que el emoji elegido entre donde está el cursor.
vi.mock("../SelectorDeEmoji", () => ({
  default: ({ onElegir, etiqueta }: { onElegir: (e: string) => void; etiqueta: string }) => (
    <button type="button" aria-label={etiqueta} onClick={() => onElegir("🎉")} />
  ),
}));

function montar(props: Partial<React.ComponentProps<typeof EditorClasico>> = {}) {
  let editor: Editor | null = null;
  const onCambio = vi.fn();
  render(
    <EditorClasico
      etiqueta="Cuerpo de la nota"
      onListo={(e) => {
        editor = e;
      }}
      onCambio={onCambio}
      {...props}
    />,
  );
  if (editor === null) throw new Error("el editor no se montó");
  return { editor: editor as Editor, onCambio };
}

/** Pega como lo haría el navegador: por el analizador de ProseMirror, que es
 *  por donde entra lo que viene de Word o de otra página. */
function pegar(editor: Editor, html: string) {
  act(() => {
    editor.view.pasteHTML(html);
  });
}

describe("lo que se pega", () => {
  it("de Word o de otra página sólo deja lo permitido", () => {
    const { editor } = montar();

    pegar(
      editor,
      '<div class="row"><p class="s1"><span style="font-family: Arial; color: red">Hola ' +
        "<b>fuerte</b> y <i>suave</i></span></p>" +
        '<table><tr><td>celda</td></tr></table><h4 style="color:blue">Cuatro</h4>' +
        '<a href="javascript:alert(1)">malo</a> <a href="https://expreso.press/x">bueno</a>' +
        // TIPTAP DEJA ESTOS PROTOCOLOS POR OMISIÓN; el clásico sólo http, https y mailto.
        '<a href="tel:8331234567">tel</a> <a href="ftp://x.mx/a">ftp</a> <a href="mailto:a@b.mx">correo</a>' +
        // Y LO QUE EL CLÁSICO NO TIENE EN LA BARRA.
        "<p><s>tachado</s> <u>subrayado</u> <code>código</code></p><hr><pre>bloque</pre></div>",
    );

    const html = editor.getHTML();
    expect(html).toContain("<strong>fuerte</strong>");
    expect(html).toContain("<em>suave</em>");
    expect(html).toContain('<a href="https://expreso.press/x">bueno</a>');
    expect(html).toContain('<a href="mailto:a@b.mx">correo</a>');
    expect(html).toContain("tachado");
    // EL TEXTO SE QUEDA; LO QUE LO VESTÍA, NO.
    expect(html).toContain("celda");
    expect(html).toContain("Cuatro");
    for (const fuera of [
      "<span",
      "<div",
      "<table",
      "<h4",
      "class=",
      "font-family",
      "color",
      "javascript",
      "tel:",
      "ftp:",
      "<s>",
      "<u>",
      "<code",
      "<hr",
      "<pre",
    ])
      expect(html).not.toContain(fuera);
  });

  it("un enlace pegado se queda sólo con su href", () => {
    // CON `class="hidden"` ESCONDÍA TEXTO DENTRO DEL PROPIO EDITOR (codex).
    const { editor } = montar();

    pegar(
      editor,
      '<p><a href="https://expreso.press" class="text-7xl hidden" target="_top" rel="opener" title="t">nota</a></p>',
    );

    expect(editor.getHTML()).toBe('<p><a href="https://expreso.press">nota</a></p>');
    expect(JSON.stringify(editor.getJSON())).not.toMatch(/class|target|rel|title/);
  });

  it("un documento que entra como JSON tampoco saca un href ni un tamaño fuera de la lista", () => {
    // EL JSON NO PASA POR EL ANALIZADOR DE HTML: lo que se guarda se vuelve a
    // mirar al pintar (revisión de seguridad).
    const { editor } = montar({
      contenido: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            attrs: { tamano: "1px;background:url(https://x)" },
            content: [
              { type: "text", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }], text: "malo" },
            ],
          },
        ],
      },
    });

    const html = editor.getHTML();
    expect(html).not.toContain("javascript");
    expect(html).not.toContain("style");
    expect(editor.view.dom.innerHTML).not.toContain("javascript");
  });

  it("los subtítulos, citas y listas sí pasan", () => {
    const { editor } = montar();

    pegar(
      editor,
      "<h2>Dos</h2><h3>Tres</h3><blockquote><p>«Dicho»</p></blockquote>" +
        "<ul><li><p>a</p></li></ul><ol><li><p>b</p></li></ol><p>uno<br>dos</p>",
    );

    expect(editor.getHTML()).toBe(
      "<h2>Dos</h2><h3>Tres</h3><blockquote><p>«Dicho»</p></blockquote>" +
        "<ul><li><p>a</p></li></ul><ol><li><p>b</p></li></ol><p>uno<br>dos</p>",
    );
  });

  it("una sublista pegada queda como lista aparte, y cada elemento se puede convertir", async () => {
    // CON SUBLISTAS, EL PÁRRAFO DE ANTES NO SE PODÍA CONVERTIR (codex).
    const { editor } = montar();
    act(() => {
      editor.commands.setContent("<ul><li><p>a</p><ul><li><p>b</p></li></ul></li></ul>");
    });
    expect(editor.getHTML()).not.toMatch(/<li>(?:(?!<\/li>).)*<ul>/);

    act(() => {
      editor.commands.setTextSelection(3);
    });
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Formato del párrafo" }), "h2");
    expect(editor.getHTML()).toMatch(/^<h2>a<\/h2>/);
  });

  it("un tamaño de letra sólo pasa si es uno de los dos del kit", () => {
    const { editor } = montar();

    // SE CARGA, NO SE PEGA: pegado sobre el documento vacío, el primer párrafo
    // se funde con el que ya estaba y se queda con sus atributos, que es como
    // pega ProseMirror. Lo que aquí se mira es qué valores admite el analizador.
    act(() => {
      editor.commands.setContent(
      '<p style="font-size:1.25em">grande</p><p style="font-size:30px">enorme</p>' +
        '<p style="font-size:0.875em">chico</p>',
      );
    });

    expect(sinEspacios(editor.getHTML())).toBe(
      '<p style="font-size:1.25em">grande</p><p>enorme</p><p style="font-size:0.875em">chico</p>',
    );
  });
});

describe("la barra", () => {
  it("cambia el párrafo a subtítulo, a cita y de vuelta", async () => {
    const { editor } = montar({ contenido: { type: "doc", content: [p("Texto")] } });
    const formato = screen.getByRole("combobox", { name: "Formato del párrafo" });

    await userEvent.selectOptions(formato, "h2");
    expect(editor.getHTML()).toBe("<h2>Texto</h2>");
    await userEvent.selectOptions(formato, "h3");
    expect(editor.getHTML()).toBe("<h3>Texto</h3>");
    await userEvent.selectOptions(formato, "cita");
    expect(editor.getHTML()).toBe("<blockquote><p>Texto</p></blockquote>");
    // DE CITA A SUBTÍTULO SALE DE LA CITA: un subtítulo citado no existe.
    await userEvent.selectOptions(formato, "h2");
    expect(editor.getHTML()).toBe("<h2>Texto</h2>");
    await userEvent.selectOptions(formato, "cita");
    await userEvent.selectOptions(formato, "p");
    expect(editor.getHTML()).toBe("<p>Texto</p>");
  });

  it("un subtítulo sale de la cita aunque la selección empiece fuera de ella", async () => {
    // `isActive("blockquote")` ES FALSO si la selección cruza el borde de la
    // cita, y el subtítulo se quedaba citado (codex).
    const { editor } = montar();
    act(() => {
      editor.commands.setContent("<blockquote><p>Uno</p></blockquote><p>Dos</p>");
      editor.commands.selectAll();
    });

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Formato del párrafo" }), "h2");

    expect(editor.getHTML()).toBe("<h2>Uno</h2><h2>Dos</h2>");
  });

  it("y sale de una lista citada sin dejar la cita", async () => {
    const { editor } = montar();
    act(() => {
      editor.commands.setContent("<blockquote><ul><li><p>a</p></li><li><p>b</p></li></ul></blockquote>");
      editor.commands.selectAll();
    });

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Formato del párrafo" }), "h3");

    expect(editor.getHTML()).toBe("<h3>a</h3><h3>b</h3>");
  });

  it("convertir un párrafo de una cita deja citados los demás", async () => {
    const { editor } = montar();
    act(() => {
      editor.commands.setContent("<blockquote><p>a</p><p>b</p><p>c</p></blockquote>");
      editor.commands.setTextSelection(5);
    });

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Formato del párrafo" }), "h2");

    expect(editor.getHTML()).toBe(
      "<blockquote><p>a</p></blockquote><h2>b</h2><blockquote><p>c</p></blockquote>",
    );
  });

  it("el tamaño se puede elegir con una selección que cruza una lista", async () => {
    const { editor } = montar();
    act(() => {
      editor.commands.setContent("<ul><li><p>a</p></li></ul><p>b</p>");
      editor.commands.selectAll();
    });
    const tamano = screen.getByRole("combobox", { name: "Tamaño de letra" });

    expect(desactivado(tamano)).toBe(false);
    await userEvent.selectOptions(tamano, "grande");
    expect(sinEspacios(editor.getHTML())).toBe(
      '<ul><li><p style="font-size:1.25em">a</p></li></ul><p style="font-size:1.25em">b</p>',
    );
  });

  it("el tamaño va en el style del párrafo, con el valor exacto", async () => {
    const { editor } = montar({ contenido: { type: "doc", content: [p("Texto")] } });
    const tamano = screen.getByRole("combobox", { name: "Tamaño de letra" });

    await userEvent.selectOptions(tamano, "grande");
    expect(sinEspacios(editor.getHTML())).toBe('<p style="font-size:1.25em">Texto</p>');
    // Y EL ATRIBUTO GUARDA EL VALOR EXACTO, que es lo que serializa el consumidor.
    expect(editor.getJSON().content?.[0]?.attrs?.tamano).toBe("1.25em");
    await userEvent.selectOptions(tamano, "chico");
    expect(sinEspacios(editor.getHTML())).toBe('<p style="font-size:0.875em">Texto</p>');
    await userEvent.selectOptions(tamano, "normal");
    expect(editor.getHTML()).toBe("<p>Texto</p>");
  });

  it("un subtítulo no tiene tamaño que elegir", async () => {
    montar({ contenido: { type: "doc", content: [{ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "T" }] }] } });

    expect(desactivado(screen.getByRole("combobox", { name: "Tamaño de letra" }))).toBe(true);
  });

  it("negrita a través de dos párrafos, que es lo que un editor por bloque no podía", async () => {
    const { editor } = montar({ contenido: { type: "doc", content: [p("Uno"), p("Dos")] } });

    act(() => {
      editor.commands.selectAll();
    });
    await userEvent.click(screen.getByRole("button", { name: "Negrita" }));

    expect(editor.getHTML()).toBe("<p><strong>Uno</strong></p><p><strong>Dos</strong></p>");
    expect(screen.getByRole("button", { name: "Negrita" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("un enlace javascript: no se aplica; uno https sí", async () => {
    const { editor } = montar({ contenido: { type: "doc", content: [p("Nota")] } });
    act(() => {
      editor.commands.selectAll();
    });

    await userEvent.click(screen.getByRole("button", { name: "Enlace" }));
    const campo = screen.getByRole("textbox", { name: "Enlace" });
    await userEvent.type(campo, "javascript:alert(1)");
    expect(desactivado(screen.getByRole("button", { name: "Aplicar" }))).toBe(true);
    await userEvent.keyboard("{Enter}");
    expect(editor.getHTML()).toBe("<p>Nota</p>");

    await userEvent.clear(campo);
    await userEvent.type(campo, "https://expreso.press{Enter}");
    expect(editor.getHTML()).toBe('<p><a href="https://expreso.press">Nota</a></p>');
  });

  it("el panel del enlace se cierra con Escape desde cualquier botón, y devuelve el foco", async () => {
    montar({ contenido: { type: "doc", content: [p("Nota")] } });
    const boton = screen.getByRole("button", { name: "Enlace" });

    await userEvent.click(boton);
    screen.getByRole("button", { name: "Aplicar" }).focus();
    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("textbox", { name: "Enlace" })).toBeNull();
    await act(async () => {});
    expect(document.activeElement).toBe(boton);
  });

  it("y con un clic fuera", async () => {
    montar({ contenido: { type: "doc", content: [p("Nota")] } });

    await userEvent.click(screen.getByRole("button", { name: "Enlace" }));
    await userEvent.click(document.body);

    expect(screen.queryByRole("textbox", { name: "Enlace" })).toBeNull();
  });

  it("el emoji entra donde está el cursor", async () => {
    const { editor } = montar({ contenido: { type: "doc", content: [p("Hola mundo")] } });
    act(() => {
      editor.commands.setTextSelection(5);
    });

    await userEvent.click(screen.getByRole("button", { name: "Insertar emoji" }));

    expect(editor.getText()).toBe("Hola🎉 mundo");
  });

  it("en sólo lectura la barra no hace nada y el texto no se edita", () => {
    const { editor } = montar({ soloLectura: true, contenido: { type: "doc", content: [p("T")] } });

    expect(desactivado(screen.getByRole("button", { name: "Negrita" }))).toBe(true);
    expect(desactivado(screen.getByRole("combobox", { name: "Formato del párrafo" }))).toBe(true);
    expect(editor.isEditable).toBe(false);
  });
});

describe("lo del consumidor", () => {
  it("montarse o pasar a sólo lectura no avisa de un cambio", () => {
    // UN `onCambio` SIN CAMBIO MARCA LA NOTA COMO MODIFICADA (codex).
    const onCambio = vi.fn();
    const { rerender } = render(
      <EditorClasico etiqueta="C" contenido={{ type: "doc", content: [p("T")] }} onCambio={onCambio} />,
    );
    rerender(
      <EditorClasico etiqueta="C" contenido={{ type: "doc", content: [p("T")] }} onCambio={onCambio} soloLectura />,
    );

    expect(onCambio).not.toHaveBeenCalled();
  });

  it("sus nodos viven en el mismo documento, y salen en onCambio", () => {
    const Foto = Node.create({
      name: "foto",
      group: "block",
      atom: true,
      addAttributes: () => ({ id: { default: null } }),
      parseHTML: () => [{ tag: "figure[data-foto]" }],
      renderHTML: ({ HTMLAttributes }) => ["figure", { "data-foto": HTMLAttributes.id }],
    });
    const { editor, onCambio } = montar({
      extensiones: [Foto],
      contenido: { type: "doc", content: [p("Antes"), { type: "foto", attrs: { id: 7 } }, p("Después")] },
    });

    act(() => {
      editor.commands.insertContentAt(editor.state.doc.content.size, { type: "foto", attrs: { id: 8 } });
    });

    const doc = onCambio.mock.calls[onCambio.mock.calls.length - 1]![0];
    expect(doc.content.map((n: { type: string; attrs?: { id?: number } }) => n.attrs?.id ?? n.type)).toEqual([
      "paragraph",
      7,
      "paragraph",
      8,
    ]);
  });
});

function p(texto: string) {
  return { type: "paragraph", content: [{ type: "text", text: texto }] };
}
