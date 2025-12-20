import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import { useRouter } from 'next/router';
import * as THREE from 'three';

const GlobeModel = ({ nextLocale }) => {
    const meshRef = useRef();
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    const texture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += hovered ? 0.05 : 0.005;
        }
    });

    return (
        <Sphere
            ref={meshRef}
            args={[1, 64, 64]} 
            scale={1.8} 
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
                e.stopPropagation();
                router.push(router.pathname, router.asPath, { locale: nextLocale });
            }}
        >
            <meshStandardMaterial 
                map={texture} 
                metalness={0.0} // Reduced metalness to keep the colors bright
                roughness={0.9} // Higher roughness stops harsh black reflections
                
                // VIBRANCY FIX: We increase emissive intensity to make the texture "pop"
                emissive={new THREE.Color("#ffffff")}
                emissiveMap={texture}
                emissiveIntensity={0.4} // Bumped from 0.15 to 0.4
            />
        </Sphere>
    );
};

export default function GlobeIcon() {
    const router = useRouter();
    const { locale, locales } = router;
    if (!locales) return null;

    const currentIndex = locales.indexOf(locale);
    const nextLocale = locales[(currentIndex + 1) % locales.length];

    return (
        <div className="w-16 h-16 relative flex items-center justify-center group z-50">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                style={{ width: '64px', height: '64px', background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* 1. HEMISPHERE LIGHT: Acts like a wrap-around light source (Sky/Ground) */}
                <hemisphereLight intensity={1.0} color="#ffffff" groundColor="#444444" />

                {/* 2. AMBIENT LIGHT: Higher base light level */}
                <ambientLight intensity={1.8} /> 
                
                {/* 3. DIRECTIONAL LIGHT: Strong sunlight from the front */}
                <directionalLight position={[10, 10, 10]} intensity={2.5} />

                {/* 4. POINT LIGHT: Secondary fill light to remove any remaining dark spots */}
                <pointLight position={[-10, -5, 5]} intensity={1.5} color="#ffffff" />

                <Suspense fallback={null}>
                    <GlobeModel nextLocale={nextLocale} />
                </Suspense>
            </Canvas>
            
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-dark/80 text-light px-2 py-0.5 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity uppercase pointer-events-none font-bold">
                {nextLocale}
            </span>
        </div>
    );
}