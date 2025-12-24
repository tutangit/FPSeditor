
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { WEAPON_CONFIG } from '../constants';

interface PlayerControllerProps {
  active: boolean;
  setAmmo: React.Dispatch<React.SetStateAction<number>>;
}

const PlayerController: React.FC<PlayerControllerProps> = ({ active, setAmmo }) => {
  const { camera, mouse, scene } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const weaponRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.PointLight>(null);
  
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const lastShot = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: true }));
    const handleKeyUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.code]: false }));
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const shoot = () => {
    const now = Date.now();
    if (now - lastShot.current < WEAPON_CONFIG.fireRate) return;
    lastShot.current = now;

    setAmmo(prev => Math.max(0, prev - 1));

    // Flash effect
    if (flashRef.current) flashRef.current.intensity = 5;

    // Recoil effect
    if (weaponRef.current) {
        weaponRef.current.position.z += WEAPON_CONFIG.recoil;
        camera.rotation.x += 0.01;
    }

    // Impact effect (Simple Raycast)
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        // Here you would spawn bullet hole decals or sparks
        // For simplicity, we just log it
    }
  };

  useFrame((state, delta) => {
    if (!active) return;

    // Movement
    const speed = keys['ShiftLeft'] ? 15 : 8;
    const moveZ = (keys['KeyW'] ? -1 : 0) + (keys['KeyS'] ? 1 : 0);
    const moveX = (keys['KeyA'] ? -1 : 0) + (keys['KeyD'] ? 1 : 0);

    direction.current.set(moveX, 0, moveZ).normalize();
    
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const side = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    forward.y = 0;
    side.y = 0;
    forward.normalize();
    side.normalize();

    velocity.current.set(0, velocity.current.y, 0);
    velocity.current.addScaledVector(forward, -moveZ * speed);
    velocity.current.addScaledVector(side, moveX * speed);

    // Gravity & Jump
    if (keys['Space'] && camera.position.y <= 2.1) {
      velocity.current.y = 10;
    }
    velocity.current.y -= 30 * delta; // Gravity

    camera.position.addScaledVector(velocity.current, delta);
    if (camera.position.y < 2) {
      camera.position.y = 2;
      velocity.current.y = 0;
    }

    // Shooting
    const isFiring = state.mouse.buttons === 1; // Left Click
    if (isFiring) shoot();

    // Reset Flash
    if (flashRef.current && flashRef.current.intensity > 0) {
      flashRef.current.intensity *= 0.8;
    }

    // Weapon sway and recoil recovery
    if (weaponRef.current) {
      const swayAmount = 0.001;
      const swaySpeed = 5;
      const t = state.clock.getElapsedTime();
      
      const targetZ = 0;
      weaponRef.current.position.z += (targetZ - weaponRef.current.position.z) * 0.1;

      // Bobbing
      const bob = Math.sin(t * swaySpeed * (moveZ !== 0 || moveX !== 0 ? 2 : 1)) * 0.01;
      weaponRef.current.position.y = -0.3 + bob;
      weaponRef.current.position.x = 0.4 + Math.cos(t * swaySpeed * 0.5) * 0.005;
    }
  });

  return (
    <group ref={weaponRef} position={[0.4, -0.3, -0.6]}>
      {/* Visual representation of M4A1 style carbine using blocks */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.12, 0.8]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Barrel */}
      <mesh position={[0, 0.02, -0.6]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Magazine */}
      <mesh position={[0, -0.15, -0.1]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.06, 0.2, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Scope */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.3]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <pointLight ref={flashRef} position={[0, 0.02, -0.9]} intensity={0} color="#ffaa44" distance={5} />
    </group>
  );
};

export default PlayerController;
