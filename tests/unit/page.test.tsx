import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { isValidElement } from "react";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "@/app/layout";
import BootstrapPage from "@/app/page";

describe("Bootstrap technical page and layout", () => {
  it("renders a single semantic h1 in Spanish without deck mock content", () => {
    render(<BootstrapPage />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("Base técnica inicial de OAK");

    const text = main.textContent ?? "";
    for (const forbidden of [
      "David Cano",
      "Trail del Robledal",
      "Pedales de Guadarrama",
      "10K Madrid Rio",
      "Sierra Norte Trail",
      "oak.run",
      "Decision page",
      "Conversion flow",
      "Athlete home",
      "Explorer",
      "Pathfinder",
    ]) {
      expect(text).not.toContain(forbidden);
    }
  });

  it("sets lang='es' and Spanish metadata on RootLayout", () => {
    expect(metadata.title).toBe("OAK — Base técnica inicial");

    const tree = RootLayout({ children: <span>Prueba</span> });
    expect(isValidElement(tree)).toBe(true);
    if (isValidElement(tree)) {
      expect(tree.type).toBe("html");
      expect((tree.props as { lang?: string }).lang).toBe("es");
    }
  });
});
