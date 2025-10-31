import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

export default function PanoramaViewer({ imageUrl, onClose }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const sphereRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere so we see inside

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      imageUrl,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        sphereRef.current = sphere;
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading panorama:', error);
        setIsLoading(false);
      }
    );

    // Mouse controls
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    let lat = 0;
    let lon = 0;
    let phi = 0;
    let theta = 0;

    const onMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseMove = (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      mouseX = event.clientX;
      mouseY = event.clientY;

      lon -= deltaX * 0.1;
      lat += deltaY * 0.1;

      lat = Math.max(-85, Math.min(85, lat));
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (event) => {
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const onTouchMove = (event) => {
      event.preventDefault();
      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

      lon -= deltaX * 0.1;
      lat += deltaY * 0.1;

      lat = Math.max(-85, Math.min(85, lat));
    };

    // Mouse wheel zoom
    const onWheel = (event) => {
      event.preventDefault();
      const fov = camera.fov + event.deltaY * 0.05;
      camera.fov = Math.max(30, Math.min(100, fov));
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      camera.position.x = 0.1 * Math.sin(phi) * Math.cos(theta);
      camera.position.y = 0.1 * Math.cos(phi);
      camera.position.z = 0.1 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
    };
  }, [imageUrl]);

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.max(30, cameraRef.current.fov - 5);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = Math.min(100, cameraRef.current.fov + 5);
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">360° Virtual Tour</h2>
            <p className="text-gray-400 text-sm">Drag to look around • Scroll to zoom</p>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={onClose}
          >
            ✕ Close
          </Button>
        </div>
      </div>

      {/* 360° Viewer */}
      <div className="flex-1 relative" ref={containerRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
              <p className="text-white">Loading 360° view...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/80 backdrop-blur-sm p-3 rounded-full border border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={zoomIn}
        >
          <ZoomIn className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={zoomOut}
        >
          <ZoomOut className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full"
          onClick={resetView}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Instructions for mobile */}
      <div className="md:hidden absolute top-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full">
        <p className="text-white text-sm">👆 Swipe to explore</p>
      </div>
    </div>
  );
}
