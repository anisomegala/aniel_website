import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, useTexture } from '@react-three/drei';
import { useRouter } from 'next/router';
import * as THREE from 'three';
import en from '../../locales/en.json';
import es from '../../locales/es.json';
import pt from '../../locales/pt.json';
import pl from '../../locales/pl.json';

const GlobeModel = ({ isHovered }) => {
    const meshRef = useRef();
    const texture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += isHovered ? 0.04 : 0.005;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.8}>
            <meshStandardMaterial 
                map={texture} 
                metalness={0.0} 
                roughness={0.9}
                emissive={new THREE.Color("#ffffff")}
                emissiveMap={texture}
                emissiveIntensity={0.4}
            />
        </Sphere>
    );
};

export default function GlobeIcon() {
    const router = useRouter();
    const { locale, locales, pathname, asPath } = router;
    const [isHovered, setIsHovered] = useState(false);

    if (!locales) return null;

    const handleLanguageChange = (newLocale) => {
        router.push(pathname, asPath, { locale: newLocale });
        setIsHovered(false); 
    };

    return (
        /* FIX: The hover is managed by this parent div. 
           We use 'pb-4' to create a hidden bridge so the mouse 
           never "leaves" the container when moving toward the menu. */
        <div 
            className="relative flex flex-col items-center z-50 pb-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The 3D Trigger */}
            <div className="w-16 h-16 cursor-pointer">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    style={{ width: '64px', height: '64px', background: 'transparent' }}
                    gl={{ antialias: true, alpha: true }}
                >
                    <hemisphereLight intensity={1.0} color="#ffffff" groundColor="#444444" />
                    <ambientLight intensity={1.8} /> 
                    <directionalLight position={[10, 10, 10]} intensity={2.5} />
                    <Suspense fallback={null}>
                        <GlobeModel isHovered={isHovered} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Dropdown Menu */}
            <div className={`
                absolute top-full w-32 bg-white/90 dark:bg-dark/90 
                backdrop-blur-md rounded-xl shadow-xl border border-white/20 
                transition-all duration-300 flex flex-col items-center gap-1
                ${isHovered ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-[-10px] invisible pointer-events-none'}
            `}>
                {locales.map((l) => (
                    <button
                        key={l}
                        onClick={() => handleLanguageChange(l)}
                        className={`
                            w-full px-4 py-2 flex items-center justify-between text-sm font-bold transition-colors
                            hover:bg-primary/10 rounded-lg
                            ${locale === l ? 'text-primary' : 'text-dark dark:text-light'}
                        `}
                    >
                        <span className="uppercase">{l}</span>
                        <span className="text-lg">
                           {l === 'en' ? '🇺🇸' : l === 'es' ? '🇪🇸' : l === 'pt' ? '🇵🇹' : '🇵🇱'}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}