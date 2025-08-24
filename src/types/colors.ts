export interface ColorInfo {
  hex: string;
  rgb: string;
}

export interface HoverColor extends ColorInfo {
  hoverHex: string;
  hoverRgb: string;
}

export interface ColorData {
  id: string;
  name?: string;
  color: ColorInfo;
  isHoverCard?: boolean;
  hoverState?: HoverColor;
}

export interface ModeColors {
  mode: string;
  colors: ColorData[];
}

export interface ColorsConfig {
  modes: Record<string, ModeColors>;
  // Backwards compatibility - deprecated but still supported
  darkMode?: ModeColors;
  lightMode?: ModeColors;
}
