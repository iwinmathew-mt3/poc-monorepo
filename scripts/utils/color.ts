export function normalizeHexColor(color: string): string | null {
  const trimmed = color.trim().toLowerCase();
  const hex = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed;

  if (!/^[0-9a-f]+$/.test(hex)) return null;

  if (hex.length === 3) {
    return `#${hex
      .split("")
      .map((value) => value + value)
      .join("")}`;
  }

  if (hex.length === 6) return `#${hex}`;
  if (hex.length === 8) return `#${hex.slice(0, 6)}`;

  return null;
}

export function isDarkColor(color: string): boolean {
  const normalized = normalizeHexColor(color);
  if (!normalized) return false;

  const hex = normalized.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance < 0.5;
}


