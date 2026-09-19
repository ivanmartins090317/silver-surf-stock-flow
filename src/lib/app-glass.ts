export const APP_SHELL_CLASS = "app-shell";
export const APP_ATMOSPHERE_CLASS = "app-atmosphere";

export const CARD_SURFACE_CLASS = "glass-panel text-card-foreground";

export const AUTH_SHELL_CLASS =
  "app-shell relative flex min-h-screen w-full items-center justify-center px-4";
export const AUTH_HEADING_CLASS = "text-3xl font-bold text-foreground";
export const AUTH_LEAD_CLASS = "mt-2 text-muted-foreground";

export const LISTING_EMPTY_CLASS = "p-8 text-center glass-panel";
export const LISTING_LOADING_CLASS =
  "flex h-64 items-center justify-center text-lg text-foreground";
export const ACCESSORIES_TABLE_SHELL_CLASS = "glass-panel w-full overflow-x-auto";

export const LISTING_EMPTY_COPY = {
  produto: "Nenhum produto cadastrado",
  material: "Nenhum material cadastrado",
  acessorio: "Nenhum acessório cadastrado",
  cliente: "Nenhum cliente cadastrado",
} as const;

export const LISTING_LOADING_COPY = {
  produto: "Carregando produtos...",
  material: "Carregando materiais...",
  acessorio: "Carregando acessórios...",
  cliente: "Carregando clientes...",
} as const;

const LEGACY_LIGHT_CLASS = /\bbg-gray-50\b|\btext-gray-900\b|\btext-gray-600\b/;

export function usesLegacyLightChrome(className: string) {
  return LEGACY_LIGHT_CLASS.test(className);
}

export function isGlassSurfaceClass(className: string) {
  return className.split(/\s+/).includes("glass-panel");
}

export function getAuthChromeClassNames() {
  return {
    shell: AUTH_SHELL_CLASS,
    heading: AUTH_HEADING_CLASS,
    lead: AUTH_LEAD_CLASS,
  };
}
