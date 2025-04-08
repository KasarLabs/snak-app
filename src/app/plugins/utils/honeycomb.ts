import { GRID_CONFIG } from "../constants/gridConfig";
import { HoneycombConfig } from "./types";
import { Position } from "./types";

export const generateHoneycombPositions = (
  radius: number,
  width: number,
  height: number,
  config: HoneycombConfig,
) => {
  const positions: Position[] = [];
  const hexWidth = config.spacing * 2;
  const hexHeight = hexWidth * config.hexRatio;

  const gridRadius = Math.ceil(radius / hexWidth);

  for (let q = -gridRadius; q <= gridRadius; q++) {
    for (let r = -gridRadius; r <= gridRadius; r++) {
      const x = hexWidth * (q + r / 2);
      const y = hexHeight * r;

      if (Math.abs(q) + Math.abs(r) + Math.abs(-q - r) <= 2 * gridRadius) {
        const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        if (distance <= radius) {
          positions.push({ x, y });
        }
      }
    }
  }

  positions.sort((a, b) => {
    const distA = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2));
    const distB = Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2));
    return distA - distB;
  });

  const minX = Math.min(...positions.map((p) => p.x));
  const maxX = Math.max(...positions.map((p) => p.x));
  const minY = Math.min(...positions.map((p) => p.y));
  const maxY = Math.max(...positions.map((p) => p.y));

  const honeycombWidth = maxX - minX + GRID_CONFIG.RADIUS;
  const honeycombHeight = maxY - minY + GRID_CONFIG.RADIUS;
  const offsetX = (width - honeycombWidth) / 2 - minX;
  const offsetY = (height - honeycombHeight) / 2 - minY;

  return positions.map((pos) => ({
    x: pos.x + offsetX,
    y: pos.y + offsetY,
  }));
};
