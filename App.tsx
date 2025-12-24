
import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Sky, Stars, Environment } from '@react-three/drei';
import Scene from './components/Scene';
import EditorUI from './components/EditorUI';
import HUD from './components/HUD';
import { AppMode, GameObject, GameState } from './types';
import { INITIAL_OBJECTS } from './constants';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('PLAY');
  const [objects, setObjects] = useState<GameObject[]>(INITIAL_OBJECTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [health, setHealth] = useState(100);
  const [ammo, setAmmo] = useState(30);

  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'PLAY' ? 'EDIT' : 'PLAY');
  }, []);

  const updateObject = (id: string, updates: Partial<GameObject>) => {
    setObjects(prev => prev.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
  };

  const deleteObject = (id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addObject = (type: GameObject['type']) => {
    const newObj: GameObject = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: `${type}_${objects.length}`,
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: type === 'box' ? '#8b4513' : '#d2b48c'
    };
    setObjects([...objects, newObj]);
    setSelectedId(newObj.id);
  };

  return (
    <div className="w-screen h-screen relative bg-black select-none">
      <Canvas shadows camera={{ fov: 75, position: [0, 2, 5] }}>
        <Sky sunPosition={[100, 20, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="sunset" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        
        <Scene 
          mode={mode} 
          objects={objects} 
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={updateObject}
          setAmmo={setAmmo}
        />

        {mode === 'PLAY' && <PointerLockControls />}
      </Canvas>

      {/* UI OVERLAYS */}
      <div className="absolute top-4 left-4 z-50 flex gap-4">
        <button 
          onClick={toggleMode}
          className={`px-4 py-2 rounded font-bold uppercase tracking-wider transition-colors ${
            mode === 'PLAY' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white shadow-lg border-b-4 border-black/30 active:translate-y-1`}
        >
          {mode === 'PLAY' ? 'Switch to Editor' : 'Back to Game'}
        </button>
      </div>

      {mode === 'PLAY' ? (
        <HUD health={health} ammo={ammo} maxAmmo={90} />
      ) : (
        <EditorUI 
          objects={objects}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdate={updateObject}
          onDelete={deleteObject}
          onAdd={addObject}
        />
      )}

      {/* Editor helper tooltips */}
      {mode === 'EDIT' && (
        <div className="absolute bottom-4 left-4 text-white/50 text-xs pointer-events-none">
          [W,E,R] Transform Tools | [G] Add Box | [Del] Delete | [Esc] Deselect
        </div>
      )}
    </div>
  );
};

export default App;
