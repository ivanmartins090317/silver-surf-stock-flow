import { describe, expect, it } from "vitest";
import {
  ACCESSORIES_TABLE_SHELL_CLASS,
  APP_ATMOSPHERE_CLASS,
  APP_SHELL_CLASS,
  AUTH_HEADING_CLASS,
  AUTH_LEAD_CLASS,
  AUTH_SHELL_CLASS,
  CARD_SURFACE_CLASS,
  getAuthChromeClassNames,
  isGlassSurfaceClass,
  LISTING_EMPTY_CLASS,
  LISTING_EMPTY_COPY,
  LISTING_LOADING_COPY,
  usesLegacyLightChrome,
} from "./app-glass";

describe("app-glass", () => {
  it("promove o cartão compartilhado para vidro, sem preenchimento opaco legado", () => {
    expect(isGlassSurfaceClass(CARD_SURFACE_CLASS)).toBe(true);
    expect(CARD_SURFACE_CLASS).not.toMatch(/\bbg-card\b/);
  });

  it("mantém a tela de acesso no tema escuro da fábrica", () => {
    const chrome = getAuthChromeClassNames();

    expect(usesLegacyLightChrome(chrome.shell)).toBe(false);
    expect(usesLegacyLightChrome(chrome.heading)).toBe(false);
    expect(usesLegacyLightChrome(chrome.lead)).toBe(false);
    expect(chrome.shell).toContain(APP_SHELL_CLASS);
    expect(chrome.shell).toContain("min-h-screen");
    expect(chrome.heading).toContain("text-foreground");
    expect(AUTH_SHELL_CLASS).toBe(chrome.shell);
    expect(AUTH_HEADING_CLASS).toBe(chrome.heading);
    expect(AUTH_LEAD_CLASS).toBe(chrome.lead);
  });

  it("expõe copy de vazio e carregamento das listagens", () => {
    expect(LISTING_EMPTY_COPY.produto).toBe("Nenhum produto cadastrado");
    expect(LISTING_EMPTY_COPY.material).toBe("Nenhum material cadastrado");
    expect(LISTING_EMPTY_COPY.acessorio).toBe("Nenhum acessório cadastrado");
    expect(LISTING_EMPTY_COPY.cliente).toBe("Nenhum cliente cadastrado");
    expect(LISTING_LOADING_COPY.produto).toBe("Carregando produtos...");
    expect(LISTING_LOADING_COPY.material).toBe("Carregando materiais...");
    expect(LISTING_LOADING_COPY.acessorio).toBe("Carregando acessórios...");
    expect(LISTING_LOADING_COPY.cliente).toBe("Carregando clientes...");
    expect(isGlassSurfaceClass(LISTING_EMPTY_CLASS)).toBe(true);
  });

  it("envolve a tabela de acessórios no mesmo material de vidro", () => {
    expect(isGlassSurfaceClass(ACCESSORIES_TABLE_SHELL_CLASS)).toBe(true);
  });

  it("usa atmosfera compartilhada no casco, não um wrapper de vidro", () => {
    expect(APP_ATMOSPHERE_CLASS).toBe("app-atmosphere");
    expect(APP_SHELL_CLASS).toBe("app-shell");
    expect(isGlassSurfaceClass(APP_SHELL_CLASS)).toBe(false);
  });
});
