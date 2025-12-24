
import React from 'react';
import { GameObject } from '../types';

interface EditorUIProps {
  objects: GameObject[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<GameObject>) => void;
  onDelete: (id: string) => void;
  onAdd: (type: GameObject['type']) => void;
}

const EditorUI: React.FC<EditorUIProps> = ({ objects, selectedId, onSelect, onUpdate, onDelete, onAdd }) => {
  const selected = objects.find(o => o.id === selectedId);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const data = JSON.parse(e.target.value);
      if (selectedId) onUpdate(selectedId, data);
    } catch (err) {
      // Ignore invalid JSON while typing
    }
  };

  return (
    <div className="absolute top-0 right-0 w-80 h-full bg-zinc-900/95 border-l border-zinc-700 p-4 text-zinc-300 flex flex-col gap-4 overflow-y-auto">
      <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Level Editor</h2>
        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">v1.0</span>
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase font-semibold text-zinc-500">Add Object</label>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onAdd('box')} className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded text-sm transition-colors border border-zinc-700">+ Box</button>
          <button onClick={() => onAdd('wall')} className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded text-sm transition-colors border border-zinc-700">+ Wall</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <label className="text-xs uppercase font-semibold text-zinc-500">Scene Hierarchy</label>
        <div className="bg-black/50 rounded border border-zinc-800 p-2 max-h-48 overflow-y-auto space-y-1">
          {objects.map(obj => (
            <div 
              key={obj.id} 
              onClick={() => onSelect(obj.id)}
              className={`text-sm px-2 py-1 cursor-pointer rounded transition-colors ${selectedId === obj.id ? 'bg-blue-600 text-white' : 'hover:bg-zinc-800'}`}
            >
              {obj.name}
            </div>
          ))}
        </div>

        {selected && (
          <div className="space-y-4 animate-in slide-in-from-right duration-200">
             <div className="flex justify-between items-center">
              <label className="text-xs uppercase font-semibold text-zinc-500">Properties: {selected.name}</label>
              <button onClick={() => onDelete(selected.id)} className="text-xs text-red-500 hover:text-red-400">Delete</button>
            </div>

            <div className="space-y-3 bg-zinc-800/50 p-3 rounded border border-zinc-700">
                {/* Transform Controls Sidebar (Manual inputs) */}
                <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase">Position</span>
                    <div className="grid grid-cols-3 gap-2">
                        {['x','y','z'].map(axis => (
                            <input 
                                key={axis}
                                type="number" 
                                step="0.1"
                                value={(selected.position as any)[axis].toFixed(2)} 
                                onChange={(e) => onUpdate(selected.id, { position: { ...selected.position, [axis]: parseFloat(e.target.value) } })}
                                className="bg-black border border-zinc-700 p-1 text-xs w-full text-center"
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase">Scale</span>
                    <div className="grid grid-cols-3 gap-2">
                        {['x','y','z'].map(axis => (
                            <input 
                                key={axis}
                                type="number" 
                                step="0.1"
                                value={(selected.scale as any)[axis].toFixed(2)} 
                                onChange={(e) => onUpdate(selected.id, { scale: { ...selected.scale, [axis]: parseFloat(e.target.value) } })}
                                className="bg-black border border-zinc-700 p-1 text-xs w-full text-center"
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase">Appearance</span>
                    <input 
                        type="color" 
                        value={selected.color || '#ffffff'}
                        onChange={(e) => onUpdate(selected.id, { color: e.target.value })}
                        className="w-full h-8 bg-transparent cursor-pointer"
                    />
                </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase font-semibold text-zinc-500">Object Code (JSON)</label>
              <textarea 
                className="w-full h-48 bg-black text-green-500 font-mono text-[10px] p-2 rounded border border-zinc-700 outline-none focus:border-blue-500"
                value={JSON.stringify(selected, null, 2)}
                onChange={handleJsonChange}
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 text-[10px] text-zinc-600 border-t border-zinc-800">
        FPS ENGINE v0.9 | THREE.JS + REACT
      </div>
    </div>
  );
};

export default EditorUI;
