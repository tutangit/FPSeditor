
import { GameObject } from './types';

export const INITIAL_OBJECTS: GameObject[] = [
  // Ground
  { id: 'floor', type: 'wall', name: 'Desert Floor', position: { x: 0, y: -0.1, z: 0 }, rotation: { x: -Math.PI / 2, y: 0, z: 0 }, scale: { x: 100, y: 100, z: 1 }, color: '#c2b280' },
  
  // Walls (Dust 2 style)
  { id: 'wall1', type: 'wall', name: 'Stone Wall A', position: { x: -10, y: 2.5, z: 0 }, rotation: { x: 0, y: Math.PI / 2, z: 0 }, scale: { x: 20, y: 5, z: 1 }, color: '#d2b48c' },
  { id: 'wall2', type: 'wall', name: 'Stone Wall B', position: { x: 10, y: 2.5, z: 0 }, rotation: { x: 0, y: -Math.PI / 2, z: 0 }, scale: { x: 20, y: 5, z: 1 }, color: '#d2b48c' },
  { id: 'wall3', type: 'wall', name: 'Back Wall', position: { x: 0, y: 2.5, z: -10 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 20, y: 5, z: 1 }, color: '#d2b48c' },

  // Prop Boxes
  { id: 'box1', type: 'box', name: 'Large Crate', position: { x: -3, y: 1, z: -4 }, rotation: { x: 0, y: 0.2, z: 0 }, scale: { x: 2, y: 2, z: 2 }, color: '#8b4513' },
  { id: 'box2', type: 'box', name: 'Small Crate', position: { x: 4, y: 0.5, z: -2 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, color: '#a0522d' },
  { id: 'box3', type: 'box', name: 'Crate Stack', position: { x: 4, y: 1.5, z: -2 }, rotation: { x: 0, y: -0.4, z: 0 }, scale: { x: 1, y: 1, z: 1 }, color: '#8b4513' },

  // Pillars/Arches
  { id: 'pillar1', type: 'wall', name: 'Pillar Left', position: { x: -5, y: 3, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 6, z: 1.5 }, color: '#e3cfb4' },
  { id: 'pillar2', type: 'wall', name: 'Pillar Right', position: { x: 5, y: 3, z: 5 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1.5, y: 6, z: 1.5 }, color: '#e3cfb4' },
];

export const WEAPON_CONFIG = {
  recoil: 0.05,
  fireRate: 100, // ms
  damage: 20,
};
