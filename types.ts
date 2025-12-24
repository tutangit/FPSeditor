
export type AppMode = 'PLAY' | 'EDIT';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface GameObject {
  id: string;
  type: 'wall' | 'box' | 'door' | 'enemy' | 'spawn';
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  color?: string;
  name: string;
  metadata?: Record<string, any>;
}

export interface GameState {
  objects: GameObject[];
  selectedId: string | null;
  mode: AppMode;
  health: number;
  ammo: number;
  maxAmmo: number;
}
