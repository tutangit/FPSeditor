
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { TransformControls, MeshReflectorMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { AppMode, GameObject } from '../types';
import PlayerController from './PlayerController';

interface SceneProps {
  mode: AppMode;
  objects: GameObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<GameObject>) => void;
  setAmmo: React.Dispatch<React.SetStateAction<number>>;
}

const Scene: React.FC<SceneProps> = ({ mode, objects, selectedId, onSelect, onUpdate, setAmmo }) => {
  const transformRef = useRef<any>(null);
  const { camera, raycaster, mouse, scene } = useThree();
  const [controlMode, setControlMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  // Handle hotkeys for transform mode
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (mode !== 'EDIT') return;
      if (e.key === 'w') setControlMode('translate');
      if (e.key === 'e') setControlMode('rotate');
      if (e.key === 'r') setControlMode('scale');
      if (e.key === 'Escape') onSelect(null);
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [mode, onSelect]);

  const handlePointerDown = (e: any) => {
    if (mode !== 'EDIT') return;
    e.stopPropagation();
    
    // If clicking the gizmo, don't change selection
    if (e.intersections && e.intersections[0]?.object.type === 'Line') return;

    const clicked = e.object.userData.id;
    if (clicked) onSelect(clicked);
  };

  const onTransformChange = () => {
    if (transformRef.current && selectedId) {
      const obj = transformRef.current.object;
      onUpdate(selectedId, {
        position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
        rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
        scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
      });
    }
  };

  return (
    <>
      {/* Player in PLAY mode, FlyCam logic otherwise or static camera */}
      <PlayerController active={mode === 'PLAY'} setAmmo={setAmmo} />

      {/* World Objects */}
      {objects.map((obj) => (
        <mesh
          key={obj.id}
          position={[obj.position.x, obj.position.y, obj.position.z]}
          rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
          scale={[obj.scale.x, obj.scale.y, obj.scale.z]}
          onPointerDown={handlePointerDown}
          userData={{ id: obj.id }}
          castShadow
          receiveShadow
        >
          {obj.id === 'floor' ? (
             <planeGeometry args={[1, 1]} />
          ) : (
            <boxGeometry args={[1, 1, 1]} />
          )}
          <meshStandardMaterial 
            color={obj.color} 
            roughness={0.8}
            metalness={0.2}
            emissive={selectedId === obj.id ? '#ffffff' : '#000000'}
            emissiveIntensity={selectedId === obj.id ? 0.2 : 0}
          />
        </mesh>
      ))}

      {/* Editor Transformation Gizmo */}
      {mode === 'EDIT' && selectedId && (
        <TransformControls 
          ref={transformRef}
          mode={controlMode}
          object={scene.children.find(c => c.type === 'Mesh' && (c as any).userData.id === selectedId)}
          onMouseUp={onTransformChange}
        />
      )}

      {/* Grid Helper for Editor */}
      {mode === 'EDIT' && (
        <gridHelper args={[100, 50, '#333', '#222']} position={[0, -0.05, 0]} />
      )}
    </>
  );
};

export default Scene;
