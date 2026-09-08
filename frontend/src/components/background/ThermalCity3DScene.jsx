import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThermalCity3DScene
 * High-performance, lightweight Three.js WebGL background rendering a living 3D thermal city.
 * Supports section-specific themes: 'dashboard' | 'forecast' | 'heat-equity' | 'login' | 'location' | 'map' | 'default'
 */
export default function ThermalCity3DScene({ theme = 'dashboard' }) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let isVisible = true;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = null; // transparent background so dark CSS backdrop gradients show through

    // Atmospheric depth fog tailored to daytime sky
    const fogColor = theme === 'heat-equity' ? 0xf1f5f9 : theme === 'forecast' ? 0xe0f2fe : 0xe2e8f0;
    scene.fog = new THREE.FogExp2(fogColor, theme === 'login' ? 0.008 : 0.011);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 600);
    
    // Set camera position based on theme perspective
    if (theme === 'login') {
      camera.position.set(0, 38, 52);
      camera.lookAt(0, 5, 0);
    } else if (theme === 'forecast') {
      camera.position.set(0, 18, 65);
      camera.lookAt(0, 8, -20);
    } else if (theme === 'heat-equity') {
      camera.position.set(28, 34, 48);
      camera.lookAt(0, 4, 0);
    } else if (theme === 'location') {
      camera.position.set(0, 42, 45);
      camera.lookAt(0, 0, 0);
    } else {
      // dashboard & default elevated aerial perspective
      camera.position.set(24, 30, 45);
      camera.lookAt(0, 2, 0);
    }

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Bright Daylight Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    // Primary warm sunlight source
    const thermalSun = new THREE.DirectionalLight(0xfffaed, 1.75);
    thermalSun.position.set(35, 55, 25);
    scene.add(thermalSun);

    // Secondary blue sky fill light
    const coolFill = new THREE.DirectionalLight(0x38bdf8, 0.95);
    coolFill.position.set(-30, 30, -30);
    scene.add(coolFill);

    // 4. Clean Perspective Grid
    const gridHelper = new THREE.GridHelper(
      130, 
      42, 
      theme === 'heat-equity' ? 0xea580c : 0x0284c7, 
      0x94a3b8
    );
    gridHelper.position.y = -0.1;
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach(m => { m.transparent = true; m.opacity = 0.32; });
    } else {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.32;
    }
    scene.add(gridHelper);

    // 5. Procedural 3D City Blocks with Bright Daylight Thermal Materials
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    // Daytime architectural thermal materials
    const materials = {
      cool: new THREE.MeshStandardMaterial({
        color: 0xe0f2fe, // Light sky cyan
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.28
      }),
      safe: new THREE.MeshStandardMaterial({
        color: 0xdcfce7, // Light mint emerald
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0x059669,
        emissiveIntensity: 0.32
      }),
      moderate: new THREE.MeshStandardMaterial({
        color: 0xfef9c3, // Light warm amber
        roughness: 0.35,
        metalness: 0.1,
        emissive: 0xd97706,
        emissiveIntensity: 0.38
      }),
      high: new THREE.MeshStandardMaterial({
        color: 0xffedd5, // Soft peach/orange
        roughness: 0.3,
        metalness: 0.15,
        emissive: 0xea580c,
        emissiveIntensity: 0.48
      }),
      critical: new THREE.MeshStandardMaterial({
        color: 0xfee2e2, // Soft coral rose
        roughness: 0.25,
        metalness: 0.2,
        emissive: 0xdc2626,
        emissiveIntensity: 0.65
      })
    };

    // Shared building geometry prototypes for performance
    const boxGeometries = [
      new THREE.BoxGeometry(2.6, 1, 2.6),
      new THREE.BoxGeometry(3.4, 1, 2.8),
      new THREE.BoxGeometry(2.4, 1, 3.8),
      new THREE.BoxGeometry(4.2, 1, 4.2)
    ];

    const citySpread = theme === 'login' ? 12 : 14;
    const step = 4.2;

    for (let x = -citySpread; x <= citySpread; x += 2) {
      for (let z = -citySpread; z <= citySpread; z += 2) {
        // Leave central open corridor for unobstructed content reading
        const distFromCenter = Math.sqrt(x * x + z * z);
        if (distFromCenter < 2.5) continue;

        // Skip random plots to simulate organic streets/plazas
        if ((x + z) % 3 === 0 && Math.random() > 0.4) continue;

        const posX = x * (step * 0.5);
        const posZ = z * (step * 0.5);

        // Building height profile
        let heightMultiplier = Math.max(0.8, 4.2 - distFromCenter * 0.18);
        if (theme === 'forecast') {
          // Silhouette horizon effect
          heightMultiplier = 1.2 + Math.sin(x * 0.5) * 1.5 + Math.cos(z * 0.4) * 1.2;
        }
        const bHeight = 1.8 + Math.random() * 5.5 * heightMultiplier;

        // Determine thermal zone based on spatial quadrant
        let bMat = materials.moderate;
        if (theme === 'heat-equity') {
          // Highlight distinct priority blocks
          if (x > 2 && z < 2) bMat = materials.critical;
          else if (x < -2 && z > 0) bMat = materials.high;
          else if (z < -4) bMat = materials.safe;
          else bMat = materials.cool;
        } else {
          // Organic thermal gradient across city
          const thermalIndex = Math.sin(posX * 0.15) + Math.cos(posZ * 0.18) + (distFromCenter > 8 ? -0.5 : 0.8);
          if (thermalIndex > 1.2) bMat = materials.critical;
          else if (thermalIndex > 0.6) bMat = materials.high;
          else if (thermalIndex > -0.2) bMat = materials.moderate;
          else if (thermalIndex > -0.8) bMat = materials.safe;
          else bMat = materials.cool;
        }

        const geoIndex = Math.floor(Math.random() * boxGeometries.length);
        const building = new THREE.Mesh(boxGeometries[geoIndex], bMat);
        
        building.scale.y = bHeight;
        building.position.set(posX, bHeight / 2, posZ);
        buildingsGroup.add(building);

        // Roof glowing outline for futuristic edge definition
        const edgeGeo = new THREE.EdgesGeometry(boxGeometries[geoIndex]);
        const edgeMat = new THREE.LineBasicMaterial({
          color: bMat.emissive,
          transparent: true,
          opacity: 0.35
        });
        const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
        wireframe.scale.y = bHeight;
        wireframe.position.copy(building.position);
        buildingsGroup.add(wireframe);
      }
    }

    // 6. Floating Atmospheric Thermal Particles
    const particleCount = theme === 'forecast' ? 220 : 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 80;
      particlePositions[i * 3 + 1] = Math.random() * 35;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      particleSpeeds[i] = 0.02 + Math.random() * 0.04;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle material with soft thermal glow
    const particleMat = new THREE.PointsMaterial({
      color: theme === 'forecast' ? 0xffb300 : 0xff7a18,
      size: 0.65,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Location Beacon (For 'location' theme)
    let beaconRings = [];
    if (theme === 'location') {
      for (let r = 0; r < 3; r++) {
        const ringGeo = new THREE.RingGeometry(1.5 + r * 3, 1.8 + r * 3, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xff7a18,
          transparent: true,
          opacity: 0.5 - r * 0.12,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.2;
        scene.add(ring);
        beaconRings.push(ring);
      }
    }

    // 8. Mouse Parallax Handler
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX * 4;
      mouseRef.current.targetY = normY * 3;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 9. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 10. Page Visibility Optimization (Pause rendering when tab is hidden)
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 11. Render Loop with Smooth Damped Camera Motion
    let clock = new THREE.Clock();
    const originCameraPos = camera.position.clone();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      camera.position.x = originCameraPos.x + mouseRef.current.x + Math.sin(elapsedTime * 0.15) * 1.2;
      camera.position.y = originCameraPos.y + mouseRef.current.y + Math.cos(elapsedTime * 0.12) * 0.8;
      camera.position.z = originCameraPos.z + Math.sin(elapsedTime * 0.08) * 0.8;

      // Slow orbital drift of city elements
      buildingsGroup.rotation.y = elapsedTime * 0.012;
      gridHelper.rotation.y = elapsedTime * 0.012;

      // Ascending thermal particle convection
      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += particleSpeeds[i];
        // Wrap around when particle rises above ceiling
        if (posArr[i * 3 + 1] > 32) {
          posArr[i * 3 + 1] = 0.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Expand location beacon rings
      if (theme === 'location' && beaconRings.length > 0) {
        beaconRings.forEach((ring, idx) => {
          const s = 1 + ((elapsedTime * 0.8 + idx * 0.6) % 2.5);
          ring.scale.set(s, s, s);
          ring.material.opacity = Math.max(0, 0.6 - (s / 2.5) * 0.6);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup & Memory Disposal on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      boxGeometries.forEach(g => g.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      gridHelper.geometry.dispose();
      Object.values(materials).forEach(m => m.dispose());
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      style={{ opacity: 0.62 }}
      aria-hidden="true"
    />
  );
}
