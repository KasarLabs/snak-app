export interface Placeholder {
  id: string;
  name: string;
  image?: string;
  color?: string;
}

export interface ActionParameter {
  name: string;
  type: string | string[];
  description: string;
  required: boolean;
}

export interface Action {
  name: string;
  description: string;
  parameters?: ActionParameter[];
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  image: string;
  internal?: boolean;
  githubUrl?: string;
  actions: Action[];
  _varName?: string;
}

export type GridItem = (Plugin | Placeholder) & {
  x: number;
  y: number;
  color?: string;
};

export interface Position {
  x: number;
  y: number;
}

export interface HoneycombConfig {
  spacing: number;
  hexRatio: number;
}
