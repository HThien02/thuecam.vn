'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Box, Eye, RotateCw } from 'lucide-react';
import * as THREE from 'three';

interface Product3DViewerProps {
  productName: string;
  fallbackImage: string;
}

export default function Product3DViewer({
  productName,
  fallbackImage,
}: Product3DViewerProps) {
  const [is3DActive, setIs3DActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!is3DActive || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1, 4.5);

    // Renderer with progressive antialias
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    directionalLight.position.set(5, 8, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.PointLight(0x818cf8, 1.5, 10);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Camera Body Mesh (Pocket Camera aesthetic)
    const group = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.8, 0.6);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.8,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Screen
    const screenGeometry = new THREE.PlaneGeometry(0.65, 0.9);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.1,
      metalness: 0.9,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, -0.2, 0.31);
    group.add(screen);

    // Gimbal Head
    const gimbalHeadGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 32);
    const gimbalMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9,
    });
    const gimbalHead = new THREE.Mesh(gimbalHeadGeometry, gimbalMaterial);
    gimbalHead.position.set(0, 1.15, 0);
    group.add(gimbalHead);

    // Camera Lens Ring
    const lensGeometry = new THREE.TorusGeometry(0.18, 0.05, 16, 100);
    const lensRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.5,
    });
    const lensRing = new THREE.Mesh(lensGeometry, lensRingMaterial);
    lensRing.position.set(0, 1.15, 0.26);
    group.add(lensRing);

    // Lens Glass
    const glassGeometry = new THREE.SphereGeometry(0.16, 32, 16);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111827,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.5,
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(0, 1.15, 0.22);
    group.add(glass);

    scene.add(group);

    // Interaction controls (mouse drag)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      group.rotation.y += deltaX * 0.01;
      group.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) container.innerHTML = '';
    };
  }, [is3DActive]);

  return (
    <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30 border border-pink-100 shadow-cute">
      {/* 1. Instant Static Fallback Image (Guarantees fast LCP and Server Render) */}
      {!is3DActive ? (
        <Image
          src={fallbackImage}
          alt={`${productName} - Ảnh tĩnh sản phẩm cho thuê`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
      ) : (
        /* 2. Three.js Canvas Container (Enhanced 3D interaction) */
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing bg-pink-50/30"
          title="Kéo chuột để xoay thiết bị 3D 360 độ"
        />
      )}

      {/* Mode Switcher Button */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIs3DActive(!is3DActive)}
          className={`px-4 py-2 rounded-full text-xs font-black backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-cute ${
            is3DActive
              ? 'bg-[#0284c7] text-white border-sky-400'
              : 'bg-white/90 text-[#0284c7] hover:bg-white border-sky-200'
          }`}
        >
          {is3DActive ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Xem Ảnh Chụp Thật</span>
            </>
          ) : (
            <>
              <Box className="w-3.5 h-3.5" />
              <span>Bật Xem Mô Hình 3D 360°</span>
            </>
          )}
        </button>

        {is3DActive && (
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-white/95 px-3 py-1.5 rounded-full backdrop-blur-md border border-sky-100 shadow-sm">
            <RotateCw className="w-3 h-3 text-[#0284c7] animate-spin" />
            Giữ chuột xoay 360°
          </span>
        )}
      </div>
    </div>
  );
}
