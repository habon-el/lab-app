import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';
import { useCustomizerStore } from '../store/useCustomizerStore';

const positions: Record<string, [number, number, number]> = {
  'front center': [0, 0.15, 0.58],
  'left side': [-0.48, 0.1, 0.12],
  'right side': [0.48, 0.1, 0.12],
  'brim top': [0, -0.03, 0.85],
  'brim underside': [0, -0.12, 0.8],
  back: [0, 0.1, -0.55]
};

function DecalPlane({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  const { placement, transform } = useCustomizerStore();
  const decalPosition = positions[placement];
  return (
    <mesh position={[decalPosition[0] + transform.x, decalPosition[1] + transform.y, decalPosition[2]]} rotation={[0, 0, transform.rotation]}>
      <planeGeometry args={[0.28 * transform.scale, 0.18 * transform.scale]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}

function CapModel() {
  const group = useRef<THREE.Group>(null);
  const { placement, customText, imageUrl, autoRotate } = useCustomizerStore();
  useFrame((_s, d) => {
    if (group.current && autoRotate) group.current.rotation.y += d * 0.25;
  });

  const decalPosition = positions[placement];

  return (
    <group ref={group}>
      <mesh name="crown_front" position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.6, 48, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>
      <mesh name="brim_top" position={[0, -0.06, 0.65]} rotation={[-0.35, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.52, 0.02, 40, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>
      <mesh name="stitching" position={[0, -0.03, 0.64]} rotation={[-0.35, 0, 0]}>
        <torusGeometry args={[0.43, 0.005, 8, 80, Math.PI]} />
        <meshStandardMaterial color="#d4d4d8" />
      </mesh>
      <mesh name="button" position={[0, 0.63, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#27272a" />
      </mesh>

      {imageUrl && <DecalPlane imageUrl={imageUrl} />}

      {customText && (
        <Text position={[decalPosition[0], decalPosition[1] - 0.12, decalPosition[2]]} color="white" fontSize={0.06} anchorX="center">
          {customText}
        </Text>
      )}
    </group>
  );
}

function SnapshotButton() {
  const { gl, scene, camera } = useThree();
  return (
    <mesh
      position={[0, -1.5, 0]}
      onClick={() => {
        gl.render(scene, camera);
        const url = gl.domElement.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hat-design.png';
        a.click();
      }}
    >
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

export function HatCanvas() {
  const { autoRotate } = useCustomizerStore();
  return (
    <div className="h-[520px] w-full rounded-xl border border-white/10 bg-black">
      <Canvas camera={{ position: [0, 0.3, 2.2], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight intensity={1.3} position={[2, 2, 2]} />
        <CapModel />
        <OrbitControls enablePan={false} autoRotate={autoRotate} />
        <SnapshotButton />
      </Canvas>
    </div>
  );
}
