import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Threejs() {
  return (
    <Canvas className="h-96">
      <ambientLight intensity={Math.PI / 2} />
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
