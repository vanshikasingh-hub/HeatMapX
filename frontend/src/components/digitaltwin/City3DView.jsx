import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Sparkles, Layers, Eye } from 'lucide-react';

export default function City3DView({ 
  treeCover = 25, 
  coolRoofs = 50, 
  albedo = 40, 
  zoneName = "Kanpur Central Core",
  simulatedLst = 39.8,
  baselineLst = 44.8
}) {
  const mountRef = useRef(null);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);
  const [cameraMode, setCameraMode] = useState('aerial'); // 'aerial', 'street', 'top'

  // Scene references to mutate when sliders change
  const sceneRef = useRef(null);
  const treesGroupRef = useRef(null);
  const roofsGroupRef = useRef(null);
  const groundMeshRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#e0f2fe');
    scene.fog = new THREE.FogExp2('#e0f2fe', 0.012);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(38, 28, 38);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting setup (Daylight Sun & Sky Fill)
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.25);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.6);
    sunLight.position.set(25, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Subtle blue rim light from the river
    const riverRimLight = new THREE.DirectionalLight('#38bdf8', 0.8);
    riverRimLight.position.set(-20, 10, -20);
    scene.add(riverRimLight);

    // 5. Ground Plane (Kanpur urban terrain grid)
    const groundGeo = new THREE.PlaneGeometry(60, 60, 20, 20);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#94a3b8',
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    groundMeshRef.current = ground;

    // Grid helper overlay
    const grid = new THREE.GridHelper(60, 30, '#0284c7', '#cbd5e1');
    grid.position.y = 0.05;
    scene.add(grid);

    // 6. Procedural Kanpur City Blocks & Buildings
    const buildingsGroup = new THREE.Group();
    const roofsGroup = new THREE.Group();
    scene.add(buildingsGroup);
    scene.add(roofsGroup);
    roofsGroupRef.current = roofsGroup;

    // Grid coordinates of Kanpur blocks
    const blockSize = 3.6;
    const gap = 1.6;
    const gridSize = 7;
    const buildingsList = [];

    for (let x = -gridSize; x <= gridSize; x += 2) {
      for (let z = -gridSize; z <= gridSize; z += 2) {
        // Skip central plaza / park area
        if (Math.abs(x) <= 1 && Math.abs(z) <= 1) continue;

        // Skip river corridor
        if (z < -5) continue;

        const posX = x * (blockSize / 2 + gap / 2);
        const posZ = z * (blockSize / 2 + gap / 2);

        // Building height correlated with density
        const distFromCenter = Math.sqrt(posX * posX + posZ * posZ);
        const heightMultiplier = Math.max(0.6, 2.5 - distFromCenter * 0.05);
        const bHeight = 2.5 + Math.random() * 6 * heightMultiplier;
        const bWidth = blockSize * (0.7 + Math.random() * 0.4);
        const bDepth = blockSize * (0.7 + Math.random() * 0.4);

        // Procedural thermal coloring based on height and zone density
        const buildingGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        
        // Heat color: taller dense centers are hotter
        const heatFactor = Math.min(1, (bHeight / 12) + 0.3);
        const bColor = new THREE.Color().lerpColors(
          new THREE.Color('#FF7A18'), // vibrant heat orange
          new THREE.Color('#ef4444'), // critical hotspot red
          heatFactor
        );

        const buildingMat = new THREE.MeshStandardMaterial({
          color: bColor,
          roughness: 0.6,
          metalness: 0.2
        });

        const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat);
        buildingMesh.position.set(posX, bHeight / 2, posZ);
        buildingMesh.castShadow = true;
        buildingMesh.receiveShadow = true;
        buildingMesh.userData = {
          name: `Sector ${Math.abs(x)}${Math.abs(z)} Core`,
          heightMeters: Math.round(bHeight * 3.5),
          baseTemp: Number((38 + heatFactor * 6.5).toFixed(1))
        };
        buildingsGroup.add(buildingMesh);
        buildingsList.push(buildingMesh);

        // Architectural edge definition for high-tech digital twin look
        const edgeGeo = new THREE.EdgesGeometry(buildingGeo);
        const edgeMat = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.18
        });
        const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
        wireframe.position.copy(buildingMesh.position);
        buildingsGroup.add(wireframe);

        // Cool Roof Cap Mesh on top of building
        const roofGeo = new THREE.BoxGeometry(bWidth + 0.05, 0.25, bDepth + 0.05);
        const roofMat = new THREE.MeshStandardMaterial({
          color: '#ffffff',
          roughness: 0.2,
          metalness: 0.1
        });
        const roofMesh = new THREE.Mesh(roofGeo, roofMat);
        roofMesh.position.set(posX, bHeight + 0.12, posZ);
        roofMesh.visible = false; // toggle based on coolRoofs
        roofsGroup.add(roofMesh);
      }
    }

    // 7. Ganga River Corridor Water Representation
    const riverGeo = new THREE.PlaneGeometry(60, 10);
    const riverMat = new THREE.MeshStandardMaterial({
      color: '#0284c7',
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.1, -22);
    scene.add(river);

    // Atmospheric Cooling & Thermal Particles
    const pCount = 90;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 50;
      pPos[i * 3 + 1] = 1 + Math.random() * 20;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.5,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const mistPoints = new THREE.Points(pGeo, pMat);
    scene.add(mistPoints);

    // 8. Procedural Urban Trees Group
    const treesGroup = new THREE.Group();
    scene.add(treesGroup);
    treesGroupRef.current = treesGroup;

    // 9. Interactive Drag Orbit Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = { radius: 55, theta: 0.8, phi: 1.0 };

    const updateCameraFromSpherical = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 2, 0);
    };
    updateCameraFromSpherical();

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.008));
      updateCameraFromSpherical();

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(20, Math.min(90, spherical.radius + e.deltaY * 0.05));
      updateCameraFromSpherical();
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // 10. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Subtle atmospheric rotation when idle
      if (!isDragging) {
        spherical.theta += 0.0012;
        updateCameraFromSpherical();
      }

      if (mistPoints) {
        mistPoints.rotation.y += 0.0015;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Procedural Trees when treeCover changes
  useEffect(() => {
    const treesGroup = treesGroupRef.current;
    if (!treesGroup) return;

    // Clear existing trees
    while (treesGroup.children.length > 0) {
      const obj = treesGroup.children[0];
      treesGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    // Number of trees proportional to treeCover (0 to 50% slider maps to 0-70 3D trees)
    const treeCount = Math.round((treeCover / 50) * 80);
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.25, 1.2, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#5c4033', roughness: 0.9 });
    const foliageGeo = new THREE.ConeGeometry(1.1, 2.2, 7);
    const foliageMat = new THREE.MeshStandardMaterial({ color: '#10b981', roughness: 0.6 });

    for (let i = 0; i < treeCount; i++) {
      // Scatter along streets and central park
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 22;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Don't place in river
      if (z < -17) continue;

      const treeObj = new THREE.Group();
      
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.6;
      trunk.castShadow = true;
      treeObj.add(trunk);

      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 2.0;
      foliage.castShadow = true;
      treeObj.add(foliage);

      treeObj.position.set(x, 0, z);
      const scale = 0.7 + Math.random() * 0.6;
      treeObj.scale.set(scale, scale, scale);

      treesGroup.add(treeObj);
    }
  }, [treeCover]);

  // Update Cool Roofs when coolRoofs slider changes
  useEffect(() => {
    const roofsGroup = roofsGroupRef.current;
    if (!roofsGroup) return;

    const totalRoofs = roofsGroup.children.length;
    const activeCount = Math.round((coolRoofs / 100) * totalRoofs);

    roofsGroup.children.forEach((roof, idx) => {
      roof.visible = idx < activeCount;
    });
  }, [coolRoofs]);

  // Update Ground Albedo Color when albedo changes
  useEffect(() => {
    const ground = groundMeshRef.current;
    if (!ground) return;

    // Albedo 0-100: shifts from dark slate asphalt (#64748b) to reflective concrete (#f8fafc)
    const factor = albedo / 100;
    const baseColor = new THREE.Color('#64748b');
    const highAlbedoColor = new THREE.Color('#f8fafc');
    ground.material.color.copy(baseColor).lerp(highAlbedoColor, factor);
  }, [albedo]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-gradient-to-b from-[#dbeafe] to-[#e0f2fe]">
      
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Badge Top-Left */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 bg-white/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-slate-200/90 shadow-lg text-slate-800 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <strong className="text-xs font-black tracking-wide text-slate-900 font-heading">3D Digital Twin: {zoneName}</strong>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono mt-0.5">
          <span className="text-slate-500">Baseline LST: <strong className="text-red-600 font-bold">{baselineLst}°C</strong></span>
          <span className="text-slate-400">→</span>
          <span className="text-emerald-700">Simulated: <strong className="text-emerald-600 font-bold">{simulatedLst}°C</strong></span>
        </div>
      </div>

      {/* Live Physical Parameter Overlay Top-Right */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-200/90 shadow-lg text-slate-800 text-xs space-y-1.5 hidden sm:block pointer-events-none">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500 text-[11px]">3D Trees Deployed:</span>
          <span className="font-mono text-emerald-600 font-bold">+{treeCover}% Canopy</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500 text-[11px]">Reflective Cool Roofs:</span>
          <span className="font-mono text-[#0284c7] font-bold">{coolRoofs}% Coverage</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-500 text-[11px]">Ground Albedo:</span>
          <span className="font-mono text-[#d97706] font-bold">+{albedo}% Reflectance</span>
        </div>
      </div>

      {/* Bottom Controls Info Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-xl border border-slate-200/90 text-slate-700 text-[11px] shadow-lg">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <RotateCw className="w-3.5 h-3.5 text-[#0284c7]" />
          <span>Click and drag to rotate Kanpur 3D sector • Scroll to zoom</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]" />
            <span className="text-slate-600 text-[10px] font-medium">High Absorption</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ffffff] border border-slate-300" />
            <span className="text-slate-600 text-[10px] font-medium">Cool Roof</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
            <span className="text-slate-600 text-[10px] font-medium">Canopy Cooling</span>
          </span>
        </div>
      </div>

    </div>
  );
}
