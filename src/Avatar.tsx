import { Component, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Group, MathUtils } from 'three'
import { AvatarFallback } from './App'

class CanvasBoundary extends Component<
    { children: ReactNode },
    { failed: boolean }
> {
    state = { failed: false }
    static getDerivedStateFromError() {
        return { failed: true }
    }
    render() {
        return this.state.failed ? <AvatarFallback /> : this.props.children
    }
}

function Robot({ excited, paused }: { excited: boolean; paused: boolean }) {
    const robot = useRef<Group>(null)
    const head = useRef<Group>(null)
    const leftArm = useRef<Group>(null)
    const rightArm = useRef<Group>(null)
    const eyes = useRef<Group>(null)
    const pointer = useRef({ x: 0, y: 0 })
    const elapsed = useRef(0)
    useEffect(() => {
        const track = (event: PointerEvent) => {
            pointer.current = {
                x: (event.clientX / window.innerWidth - 0.5) * 2,
                y: (event.clientY / window.innerHeight - 0.5) * 2,
            }
        }
        window.addEventListener('pointermove', track, { passive: true })
        return () => window.removeEventListener('pointermove', track)
    }, [])
    useFrame((_, delta) => {
        if (paused) return
        elapsed.current += Math.min(delta, 0.05)
        const time = elapsed.current
        const blend = 1 - Math.exp(-delta * 5)
        if (robot.current) {
            robot.current.position.y = Math.sin(time * 1.5) * 0.07 - 0.08
            robot.current.rotation.z = Math.sin(time * 0.7) * 0.025
        }
        if (head.current) {
            head.current.rotation.y = MathUtils.lerp(
                head.current.rotation.y,
                pointer.current.x * 0.32 - 0.13,
                blend,
            )
            head.current.rotation.x = MathUtils.lerp(
                head.current.rotation.x,
                pointer.current.y * 0.12,
                blend,
            )
        }
        if (leftArm.current)
            leftArm.current.rotation.z = MathUtils.lerp(
                leftArm.current.rotation.z,
                excited
                    ? -0.95 + Math.sin(time * 8) * 0.15
                    : -0.12 + Math.sin(time * 1.6) * 0.04,
                blend,
            )
        if (rightArm.current)
            rightArm.current.rotation.z = MathUtils.lerp(
                rightArm.current.rotation.z,
                excited ? 0.55 : 0.16 + Math.sin(time * 1.6) * 0.04,
                blend,
            )
        if (eyes.current)
            eyes.current.scale.y =
                Math.sin(time * 1.1) > 0.995 ? 0.1 : excited ? 1.18 : 1
    })
    return (
        <group ref={robot} rotation={[0.03, -0.12, 0]} position={[0, -0.08, 0]}>
            <group ref={head} position={[0, 0.65, 0]}>
                <RoundedBox
                    args={[1.58, 1.24, 1.03]}
                    radius={0.38}
                    smoothness={6}
                    castShadow
                >
                    <meshStandardMaterial
                        color="#f9fbff"
                        roughness={0.27}
                        metalness={0.1}
                    />
                </RoundedBox>
                <RoundedBox
                    args={[1.31, 0.8, 0.22]}
                    radius={0.27}
                    smoothness={6}
                    position={[0, 0.01, 0.48]}
                >
                    <meshStandardMaterial
                        color="#13202d"
                        roughness={0.22}
                        metalness={0.3}
                    />
                </RoundedBox>
                <group ref={eyes} position={[0, 0.04, 0.61]}>
                    {[-0.31, 0.31].map((position) => (
                        <RoundedBox
                            key={position}
                            args={[0.14, 0.27, 0.04]}
                            radius={0.065}
                            smoothness={4}
                            position={[position, 0, 0]}
                        >
                            <meshStandardMaterial
                                color="#79deff"
                                emissive="#36baff"
                                emissiveIntensity={1.5}
                                toneMapped={false}
                            />
                        </RoundedBox>
                    ))}
                </group>
                <mesh position={[0, -0.18, 0.607]} rotation={[0, 0, Math.PI]}>
                    <torusGeometry args={[0.08, 0.013, 8, 24, Math.PI]} />
                    <meshStandardMaterial
                        color="#80dfff"
                        emissive="#38baff"
                        emissiveIntensity={0.7}
                    />
                </mesh>
                {[-0.85, 0.85].map((position) => (
                    <group key={position} position={[position, 0, 0]}>
                        <mesh rotation={[0, 0, Math.PI / 2]}>
                            <cylinderGeometry args={[0.21, 0.21, 0.17, 32]} />
                            <meshStandardMaterial
                                color="#dce5f0"
                                roughness={0.35}
                                metalness={0.4}
                            />
                        </mesh>
                        <mesh
                            position={[position > 0 ? 0.1 : -0.1, 0, 0]}
                            rotation={[0, 0, Math.PI / 2]}
                        >
                            <cylinderGeometry args={[0.13, 0.13, 0.025, 32]} />
                            <meshStandardMaterial
                                color="#4b8eff"
                                roughness={0.3}
                                metalness={0.25}
                            />
                        </mesh>
                    </group>
                ))}
                <mesh position={[0, 0.77, 0]}>
                    <cylinderGeometry args={[0.025, 0.035, 0.32, 16]} />
                    <meshStandardMaterial
                        color="#abbcd2"
                        metalness={0.5}
                        roughness={0.4}
                    />
                </mesh>
                <mesh position={[0, 0.97, 0]}>
                    <sphereGeometry args={[0.09, 24, 24]} />
                    <meshStandardMaterial
                        color="#4b8eff"
                        emissive="#2563eb"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </group>
            <mesh position={[0, -0.07, 0]}>
                <cylinderGeometry args={[0.22, 0.26, 0.3, 32]} />
                <meshStandardMaterial
                    color="#becbdd"
                    metalness={0.5}
                    roughness={0.35}
                />
            </mesh>
            <RoundedBox
                args={[1.06, 0.99, 0.76]}
                radius={0.29}
                smoothness={6}
                position={[0, -0.47, 0]}
                castShadow
            >
                <meshStandardMaterial
                    color="#f5f8ff"
                    roughness={0.32}
                    metalness={0.08}
                />
            </RoundedBox>
            <mesh position={[0, -0.37, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.19, 0.19, 0.03, 32]} />
                <meshStandardMaterial color="#e3edff" roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.37, 0.425]}>
                <torusGeometry args={[0.115, 0.018, 12, 32]} />
                <meshStandardMaterial
                    color="#4e85ed"
                    emissive="#3979f2"
                    emissiveIntensity={0.2}
                />
            </mesh>
            <RoundedBox
                args={[0.027, 0.13, 0.015]}
                radius={0.01}
                position={[0, -0.37, 0.44]}
            >
                <meshStandardMaterial color="#4e85ed" />
            </RoundedBox>
            <group ref={leftArm} position={[-0.66, -0.2, 0]} rotation={[0, 0, -0.12]}>
                <mesh>
                    <sphereGeometry args={[0.16, 24, 24]} />
                    <meshStandardMaterial
                        color="#b3c5df"
                        roughness={0.4}
                        metalness={0.3}
                    />
                </mesh>
                <RoundedBox
                    args={[0.26, 0.65, 0.34]}
                    radius={0.12}
                    position={[-0.05, -0.26, 0]}
                >
                    <meshStandardMaterial color="#f4f7fe" roughness={0.3} />
                </RoundedBox>
                <mesh position={[-0.05, -0.6, 0]}>
                    <sphereGeometry args={[0.145, 24, 24]} />
                    <meshStandardMaterial color="#d9e4f4" roughness={0.3} />
                </mesh>
            </group>
            <group ref={rightArm} position={[0.66, -0.2, 0]} rotation={[0, 0, 0.16]}>
                <mesh>
                    <sphereGeometry args={[0.16, 24, 24]} />
                    <meshStandardMaterial
                        color="#b3c5df"
                        roughness={0.4}
                        metalness={0.3}
                    />
                </mesh>
                <RoundedBox
                    args={[0.26, 0.65, 0.34]}
                    radius={0.12}
                    position={[0.05, -0.26, 0]}
                >
                    <meshStandardMaterial color="#f4f7fe" roughness={0.3} />
                </RoundedBox>
                <mesh position={[0.05, -0.6, 0]}>
                    <sphereGeometry args={[0.145, 24, 24]} />
                    <meshStandardMaterial color="#d9e4f4" roughness={0.3} />
                </mesh>
            </group>
            {[-0.29, 0.29].map((position) => (
                <group key={position} position={[position, -1.04, 0]}>
                    <RoundedBox args={[0.3, 0.31, 0.33]} radius={0.09}>
                        <meshStandardMaterial color="#c9d8ec" roughness={0.4} />
                    </RoundedBox>
                    <RoundedBox
                        args={[0.39, 0.23, 0.59]}
                        radius={0.1}
                        position={[0, -0.2, 0.09]}
                    >
                        <meshStandardMaterial color="#f7faff" roughness={0.3} />
                    </RoundedBox>
                </group>
            ))}
        </group>
    )
}

export default function Avatar({
    excited,
    paused,
}: {
    excited: boolean
    paused: boolean
}) {
    const [contextLost, setContextLost] = useState(false)
    if (contextLost) return <AvatarFallback />
    return (
        <CanvasBoundary>
            <Canvas
                frameloop={paused ? 'demand' : 'always'}
                dpr={[1, 1.75]}
                camera={{ position: [0, 0.12, 6.3], fov: 36 }}
                gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
                onCreated={({ gl }) => {
                    gl.domElement.addEventListener(
                        'webglcontextlost',
                        () => setContextLost(true),
                        { once: true },
                    )
                }}
                role="img"
                aria-label="A friendly white digital robot that follows your cursor and waves when you hover over the hero buttons"
            >
                <ambientLight intensity={1.8} />
                <hemisphereLight args={['#ffffff', '#a1b9dd', 1.4]} />
                <directionalLight
                    position={[3, 5, 5]}
                    intensity={3.8}
                    color="#ffffff"
                />
                <directionalLight
                    position={[-4, 1, -2]}
                    intensity={2.2}
                    color="#a5c8ff"
                />
                <Robot excited={excited} paused={paused} />
            </Canvas>
        </CanvasBoundary>
    )
}
