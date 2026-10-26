export interface SceneStats {
  frames: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  pixels: number;
  moving: boolean;
  overview: number;
  cameraMoving: boolean;
  lift: number;
}
export interface ArchiveScene {
  configure(items: SceneItem[], kind: "overview" | "matrix"): void;
  anchors(indices: number[]): void;
  pulse(index: number): void;
  select(
    index: number | null,
    expanded?: boolean,
    navigation?: SceneNavigation,
  ): void;
  hover(index: number | null): void;
  reduce(value: boolean): void;
  pause(value: boolean): void;
  dispose(): void;
}
export interface SceneNavigation {
  axis: "column" | "row";
  direction: number;
}
export interface SceneItem {
  label: string;
  title?: string;
  section?: string;
  column: number;
  row: number;
  portfolio?: number;
}
export interface SceneOptions {
  host: HTMLElement;
  items: SceneItem[];
  kind: "overview" | "matrix";
  reduced: boolean;
  anchors: number[];
  onAnchors(points: { x: number; y: number; visible: boolean }[]): void;
  onSelect(index: number): void;
  onOpen(index: number): void;
  onHover(index: number | null, x?: number, y?: number): void;
  onFailure(): void;
  onStats(stats: SceneStats): void;
}
import type { Vector3, Quaternion } from "three";
export interface ScenePose {
  position: Vector3;
  rotation: Quaternion;
}
