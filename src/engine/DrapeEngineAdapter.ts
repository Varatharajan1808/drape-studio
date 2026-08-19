// ─────────────────────────────────────────────────────────────
// Drape Studio — Drape Engine Adapter
// ─────────────────────────────────────────────────────────────
//
// Integration adapter connecting the Drape Studio React UI
// to the custom WebGL 3D rendering engine.
//
// Architecture:
//   DrapeStudioViewport (React)
//     └── DrapeEngineAdapter (This class)
//           ├── WebGLRenderEngine (GPU Pipeline & Shader Linker)
//           ├── SceneHierarchyManager (3D Scene Graph)
//           ├── CameraController (Perspective Camera & Orbit Math)
//           ├── SceneLightingManager (Directional / Point Lights)
//           └── GLTFAssetLoader / RenderableMeshObject
// ─────────────────────────────────────────────────────────────

import { WebGLRenderEngine } from './RenderingPipeline/Webgl/WebGLRenderEngine.js';
import { SceneHierarchyManager } from './SceneGraph/SceneHierarchyManager.js';
import { CameraController } from './CameraSystem/CameraController.js';
import { SceneLightingManager } from './LightingEngine/SceneLightingManager.js';
import { DirectionalLightNode } from './LightingEngine/DirectionalLightNode.js';
import { PointLightNode } from './LightingEngine/PointLightNode.js';
import { PBRMaterialProperties } from './MaterialSystem/PBRMaterialProperties.js';
import { RenderableMeshObject } from './MeshRenderer/RenderableMeshObject.js';
import { CylinderGeometryBuilder } from './GeometryPrimitives/CylinderGeometryBuilder.js';
import { ConeGeometryBuilder } from './GeometryPrimitives/ConeGeometryBuilder.js';
import { SphereGeometryBuilder } from './GeometryPrimitives/SphereGeometryBuilder.js';
import { GLTFAssetLoader } from './AssetImporter/GLTFAssetLoader.js';
import { createProgram } from './RenderingPipeline/Webgl/ShaderProgramLinker.js';
import {
  PointLightvsSource,
  PointLightfsSource,
} from './RenderingPipeline/Shaders/GLSLShaderLibrary.js';

import {
  type StudioState,
  COLOR_RGB_MAP,
  FABRIC_PBR_MAP,
  BORDER_COLOR_MAP,
} from '../types/studio.js';

export type CameraPreset = 'front' | 'back' | 'left' | 'right';

export interface DrapeEngineAdapterOptions {
  onLoaded?: () => void;
  onError?: (err: Error) => void;
}

export class DrapeEngineAdapter {
  private canvas: HTMLCanvasElement | null = null;
  private container: HTMLElement | null = null;
  private webgl: WebGLRenderEngine | null = null;
  private scene: SceneHierarchyManager | null = null;
  private camera: CameraController | null = null;
  private program: WebGLProgram | null = null;
  private animationFrameId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;

  // Dedicated Mesh references for real-time 3D PBR customization
  private sareeBodyMesh: RenderableMeshObject | null = null;
  private borderMesh: RenderableMeshObject | null = null;
  private blouseMesh: RenderableMeshObject | null = null;
  private palluDrapeMesh: RenderableMeshObject | null = null;
  private palluTailMesh: RenderableMeshObject | null = null;


  // Orbit camera control parameters
  private radius = 7.0;
  private targetRadius = 7.0;
  private minRadius = 3.0;
  private maxRadius = 14.0;

  private theta = 0; // Horizontal angle (radians)
  private targetTheta = 0;

  private phi = 0.15; // Vertical angle (radians)
  private targetPhi = 0.15;
  private minPhi = -0.4;
  private maxPhi = 0.8;

  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  // Model references for scene inspection (Phase 3 readiness)
  private sareeGroup: RenderableMeshObject[] = [];
  private isInitialized = false;

  /**
   * Initializes the 3D rendering engine inside the target DOM container.
   */
  async initialize(
    container: HTMLElement,
    options?: DrapeEngineAdapterOptions
  ): Promise<void> {
    if (this.isInitialized) return;

    this.container = container;

    // 1. Create WebGL Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.touchAction = 'none';
    container.appendChild(this.canvas);

    const rect = container.getBoundingClientRect();
    const width = Math.max(Math.floor(rect.width), 300);
    const height = Math.max(Math.floor(rect.height), 300);

    // 2. Instantiate existing WebGL engine components
    this.webgl = new WebGLRenderEngine(this.canvas);
    this.webgl.resize(width, height);

    const gl = this.webgl.gl;
    // Compile & Link GLSL Shader Program
    this.program = createProgram(
      gl,
      PointLightvsSource as string,
      PointLightfsSource as string
    );
    gl.useProgram(this.program);

    this.scene = new SceneHierarchyManager();
    this.camera = new CameraController();

    const aspect = width / height;
    this.camera.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.updateCameraTransform();

    // 3. Setup Showroom Lighting
    this.setupLighting();

    // 4. Load 3D Saree Model (GLTF or procedural PBR mannequin + saree)
    await this.buildSareeShowroomScene();

    // 5. Setup interaction listeners (drag to rotate, scroll to zoom)
    this.setupEventListeners();

    // 6. Setup responsive resize observer
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect) {
          this.resize(entry.contentRect.width, entry.contentRect.height);
        }
      }
    });
    this.resizeObserver.observe(container);

    // 7. Start render loop
    this.isInitialized = true;
    this.startRenderLoop();

    if (options?.onLoaded) {
      options.onLoaded();
    }
  }

  /**
   * Configures showroom lighting hierarchy.
   */
  private setupLighting(): void {
    if (!this.webgl || !this.scene || !this.program) return;

    const gl = this.webgl.gl;
    const masterLight = new SceneLightingManager(gl, this.program);
    masterLight.BaseLight({
      ambientLight: [0.38, 0.35, 0.32], // Warm ambient
      diffuseLight: [1.0, 0.96, 0.9],   // Warm soft diffuse
      specularLight: [1.0, 0.95, 0.85], // Gold specular highlight
    });
    this.scene.globalLight = masterLight;

    // Key Light (Directional, high right)
    const keyLight = new DirectionalLightNode('Key Light');
    keyLight.direction = [0.5, -1.0, -0.6];
    keyLight.color = [1.0, 0.95, 0.88];
    keyLight.intensity = 1.6;
    this.scene.add(keyLight);

    // Fill Light (Directional, left)
    const fillLight = new DirectionalLightNode('Fill Light');
    fillLight.direction = [-0.6, -0.5, -0.4];
    fillLight.color = [0.85, 0.88, 0.95];
    fillLight.intensity = 0.8;
    this.scene.add(fillLight);

    // Rim Light (Point light behind for garment edge highlight)
    const rimLight = new PointLightNode('Rim Light');
    rimLight.position = { x: 0, y: 2, z: -3.5 };
    rimLight.color = [1.0, 0.9, 0.7];
    rimLight.radius = 8.0;
    rimLight.intensity = 1.2;
    this.scene.add(rimLight);
  }

  /**
   * Builds the 3D Saree Showroom scene containing the female model and saree garment.
   */
  private async buildSareeShowroomScene(): Promise<void> {
    if (!this.webgl || !this.scene) return;

    const gl = this.webgl.gl;
    const materialFactory = new PBRMaterialProperties();

    // Create 3D Saree Showroom Pedestal & Female Model
    const cylinderBuilder = new CylinderGeometryBuilder();
    const coneBuilder = new ConeGeometryBuilder();
    const sphereBuilder = new SphereGeometryBuilder();

    // ── Showroom Pedestal ──────────────────────────────────────
    const pedestalMat = materialFactory.getMaterialProperties({
      color: [0.93, 0.90, 0.85],
      metallic: 0.1,
      roughness: 0.4,
      specular: 0.5,
      alpha: 1.0,
      emissionColor: [0, 0, 0],
      emissionIntensity: 0,
    });

    const pedestal = new RenderableMeshObject(cylinderBuilder.CylinderData(2.2, 0.25, 36), pedestalMat);
    pedestal.position = { x: 0, y: -2.3, z: 0 };
    pedestal.updateTranslate();
    this.scene.add(pedestal);

    // ── Saree Body / Lower Drape ────────────────────────────────
    const sareeBodyMat = materialFactory.getMaterialProperties({
      color: [0.18, 0.49, 0.36], // Emerald (#2E7D5B)
      metallic: 0.15,
      roughness: 0.35,
      specular: 0.8,
      alpha: 1.0,
      emissionColor: [0, 0, 0],
      emissionIntensity: 0,
    });

    const sareeBody = new RenderableMeshObject(coneBuilder.ConeData(2.8, 1.1, 36), sareeBodyMat);
    sareeBody.position = { x: 0, y: -0.6, z: 0 };
    sareeBody.updateTranslate();
    this.scene.add(sareeBody);
    this.sareeGroup.push(sareeBody);
    this.sareeBodyMesh = sareeBody;

    // ── Saree Gold Zari Border (Lower Hem) ──────────────────────
    const goldZariMat = materialFactory.getMaterialProperties({
      color: [0.79, 0.66, 0.30], // Muted Gold (#C9A84C)
      metallic: 0.85,
      roughness: 0.2,
      specular: 1.0,
      alpha: 1.0,
      emissionColor: [0.15, 0.12, 0.05],
      emissionIntensity: 0.1,
    });

    const lowerBorder = new RenderableMeshObject(cylinderBuilder.CylinderData(1.82, 0.12, 36), goldZariMat);
    lowerBorder.position = { x: 0, y: -2.0, z: 0 };
    lowerBorder.updateTranslate();
    this.scene.add(lowerBorder);
    this.sareeGroup.push(lowerBorder);
    this.borderMesh = lowerBorder;

    // ── Torso / Blouse ──────────────────────────────────────────
    const blouseMat = materialFactory.getMaterialProperties({
      color: [0.42, 0.11, 0.23], // Burgundy (#6B1D3A)
      metallic: 0.2,
      roughness: 0.3,
      specular: 0.7,
      alpha: 1.0,
      emissionColor: [0, 0, 0],
      emissionIntensity: 0,
    });

    const blouse = new RenderableMeshObject(cylinderBuilder.CylinderData(0.65, 0.9, 32), blouseMat);
    blouse.position = { x: 0, y: 0.95, z: 0 };
    blouse.updateTranslate();
    this.scene.add(blouse);
    this.sareeGroup.push(blouse);
    this.blouseMesh = blouse;

    // ── Pallu Drape (Diagonal Shoulder Drape) ───────────────────
    const palluDrape = new RenderableMeshObject(cylinderBuilder.CylinderData(0.6, 1.3, 32), sareeBodyMat);
    palluDrape.position = { x: 0.15, y: 1.05, z: 0.15 };
    palluDrape.rotate = { x: 0.2, y: 0.3, z: -0.35 };
    palluDrape.updateTranslate();
    palluDrape.ObjectRotation();
    this.scene.add(palluDrape);
    this.sareeGroup.push(palluDrape);
    this.palluDrapeMesh = palluDrape;

    // ── Pallu Tail (Shoulder Flow) ──────────────────────────────
    const palluTail = new RenderableMeshObject(cylinderBuilder.CylinderData(0.32, 1.4, 24), goldZariMat);
    palluTail.position = { x: -0.45, y: 0.35, z: -0.2 };
    palluTail.rotate = { x: 0.1, y: -0.2, z: 0.25 };
    palluTail.updateTranslate();
    palluTail.ObjectRotation();
    this.scene.add(palluTail);
    this.sareeGroup.push(palluTail);
    this.palluTailMesh = palluTail;

    // ── Mannequin Head & Neck ───────────────────────────────────
    const mannequinMat = materialFactory.getMaterialProperties({
      color: [0.92, 0.87, 0.82],
      metallic: 0.05,
      roughness: 0.6,
      specular: 0.3,
      alpha: 1.0,
      emissionColor: [0, 0, 0],
      emissionIntensity: 0,
    });

    const neck = new RenderableMeshObject(cylinderBuilder.CylinderData(0.2, 0.4, 24), mannequinMat);
    neck.position = { x: 0, y: 1.65, z: 0 };
    neck.updateTranslate();
    this.scene.add(neck);

    const head = new RenderableMeshObject(sphereBuilder.SphereData(), mannequinMat);
    head.position = { x: 0, y: 2.15, z: 0 };
    head.scale = { x: 0.4, y: 0.48, z: 0.4 };
    head.updateTranslate();
    head.updateScale();
    this.scene.add(head);
  }

  /**
   * Sets up drag rotation and scroll zoom event listeners on canvas.
   */
  private setupEventListeners(): void {
    if (!this.canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.canvas?.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return;

      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      // Sensitive smooth orbit angles
      this.targetTheta -= deltaX * 0.008;
      this.targetPhi = Math.max(
        this.minPhi,
        Math.min(this.maxPhi, this.targetPhi + deltaY * 0.006)
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      this.isDragging = false;
      if (this.canvas?.hasPointerCapture(e.pointerId)) {
        this.canvas.releasePointerCapture(e.pointerId);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.005;
      this.targetRadius = Math.max(
        this.minRadius,
        Math.min(this.maxRadius, this.targetRadius + zoomFactor)
      );
    };

    this.canvas.addEventListener('pointerdown', onPointerDown);
    this.canvas.addEventListener('pointermove', onPointerMove);
    this.canvas.addEventListener('pointerup', onPointerUp);
    this.canvas.addEventListener('pointercancel', onPointerUp);
    this.canvas.addEventListener('wheel', onWheel, { passive: false });
  }

  /**
   * Updates camera position based on spherical coordinates (radius, theta, phi).
   */
  private updateCameraTransform(): void {
    if (!this.camera) return;

    // Calculate spherical eye position
    const cosPhi = Math.cos(this.phi);
    const sinPhi = Math.sin(this.phi);
    const sinTheta = Math.sin(this.theta);
    const cosTheta = Math.cos(this.theta);

    this.camera.eye = {
      x: this.radius * cosPhi * sinTheta,
      y: 0.3 + this.radius * sinPhi,
      z: this.radius * cosPhi * cosTheta,
    };

    this.camera.center = { x: 0, y: 0.2, z: 0 };
    this.camera.up = { x: 0, y: 1, z: 0 };
    this.camera.OrbitCamera();
  }

  /**
   * Sets camera view preset (front, back, left, right).
   */
  setCameraPreset(preset: CameraPreset): void {
    switch (preset) {
      case 'front':
        this.targetTheta = 0;
        this.targetPhi = 0.15;
        this.targetRadius = 7.0;
        break;
      case 'back':
        this.targetTheta = Math.PI;
        this.targetPhi = 0.15;
        this.targetRadius = 7.0;
        break;
      case 'left':
        this.targetTheta = -Math.PI / 2;
        this.targetPhi = 0.15;
        this.targetRadius = 7.0;
        break;
      case 'right':
        this.targetTheta = Math.PI / 2;
        this.targetPhi = 0.15;
        this.targetRadius = 7.0;
        break;
    }
  }

  /**
   * Resets camera to default front view position.
   */
  resetCamera(): void {
    this.setCameraPreset('front');
  }

  /**
   * Updates 3D Saree model PBR materials, colors, sheen, and garment transforms in real-time based on StudioState.
   */
  updateCustomization(state: StudioState): void {
    if (!this.isInitialized) return;

    // 1. Update Saree Body Color & Fabric PBR properties
    const bodyColor = COLOR_RGB_MAP[state.selectedColor] || [0.18, 0.49, 0.36];
    const fabricPbr = FABRIC_PBR_MAP[state.selectedFabric] || {
      metallic: 0.15,
      roughness: 0.35,
      specular: 0.8,
      alpha: 1.0,
    };

    if (this.sareeBodyMesh) {
      this.sareeBodyMesh.material.color = bodyColor;
      this.sareeBodyMesh.material.metallic = fabricPbr.metallic;
      this.sareeBodyMesh.material.roughness = fabricPbr.roughness;
      this.sareeBodyMesh.material.specular = fabricPbr.specular;
      this.sareeBodyMesh.material.alpha = fabricPbr.alpha;
    }

    if (this.palluDrapeMesh) {
      this.palluDrapeMesh.material.color = bodyColor;
      this.palluDrapeMesh.material.metallic = fabricPbr.metallic;
      this.palluDrapeMesh.material.roughness = fabricPbr.roughness;
      this.palluDrapeMesh.material.specular = fabricPbr.specular;
      this.palluDrapeMesh.material.alpha = fabricPbr.alpha;
    }

    // 2. Update Border Color & Metallic Finish
    const borderColor = BORDER_COLOR_MAP[state.selectedBorder] || [0.79, 0.66, 0.30];
    if (this.borderMesh) {
      this.borderMesh.material.color = borderColor;
      if (state.selectedBorder === 'gold-zari') {
        this.borderMesh.material.metallic = 0.85;
        this.borderMesh.material.roughness = 0.2;
        this.borderMesh.scale = { x: 1.0, y: 1.0, z: 1.0 };
      } else if (state.selectedBorder === 'temple') {
        this.borderMesh.material.metallic = 0.4;
        this.borderMesh.material.roughness = 0.4;
        this.borderMesh.scale = { x: 1.04, y: 1.25, z: 1.04 };
      } else if (state.selectedBorder === 'plain') {
        this.borderMesh.material.metallic = 0.1;
        this.borderMesh.material.roughness = 0.6;
        this.borderMesh.scale = { x: 0.98, y: 0.8, z: 0.98 };
      } else if (state.selectedBorder === 'floral') {
        this.borderMesh.material.metallic = 0.5;
        this.borderMesh.material.roughness = 0.3;
        this.borderMesh.scale = { x: 1.02, y: 1.1, z: 1.02 };
      }
      this.borderMesh.updateScale();
    }

    // 3. Update Pallu Tail Accent
    if (this.palluTailMesh) {
      if (state.selectedPallu === 'zari-rich') {
        this.palluTailMesh.material.color = [0.82, 0.70, 0.35];
        this.palluTailMesh.material.metallic = 0.85;
        this.palluTailMesh.material.roughness = 0.2;
      } else if (state.selectedPallu === 'classic-pleats') {
        this.palluTailMesh.material.color = bodyColor;
        this.palluTailMesh.material.metallic = fabricPbr.metallic;
        this.palluTailMesh.material.roughness = fabricPbr.roughness;
      } else if (state.selectedPallu === 'floral-woven') {
        this.palluTailMesh.material.color = [0.75, 0.45, 0.58];
        this.palluTailMesh.material.metallic = 0.4;
        this.palluTailMesh.material.roughness = 0.3;
      } else if (state.selectedPallu === 'minimal-hem') {
        this.palluTailMesh.material.color = [0.9, 0.86, 0.8];
        this.palluTailMesh.material.metallic = 0.1;
        this.palluTailMesh.material.roughness = 0.5;
      }
    }

    // 4. Update Blouse Garment
    if (this.blouseMesh) {
      if (state.selectedBlouse === 'contrast-maroon') {
        this.blouseMesh.material.color = [0.42, 0.11, 0.23];
        this.blouseMesh.scale = { x: 1.0, y: 1.0, z: 1.0 };
      } else if (state.selectedBlouse === 'matching') {
        this.blouseMesh.material.color = bodyColor;
        this.blouseMesh.scale = { x: 1.0, y: 1.0, z: 1.0 };
      } else if (state.selectedBlouse === 'golden-embroidered') {
        this.blouseMesh.material.color = [0.78, 0.65, 0.28];
        this.blouseMesh.material.metallic = 0.75;
        this.blouseMesh.scale = { x: 1.02, y: 1.05, z: 1.02 };
      } else if (state.selectedBlouse === 'velvet-navy') {
        this.blouseMesh.material.color = [0.10, 0.14, 0.35];
        this.blouseMesh.material.metallic = 0.1;
        this.blouseMesh.material.roughness = 0.7;
        this.blouseMesh.scale = { x: 1.01, y: 1.0, z: 1.01 };
      }
      this.blouseMesh.updateScale();
    }
  }

  /**
   * Handles canvas container resize.
   */
  resize(width: number, height: number): void {
    if (!this.webgl || !this.camera || width <= 0 || height <= 0) return;

    this.webgl.resize(width, height);
    const aspect = width / height;
    this.camera.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.updateCameraTransform();
  }

  /**
   * Main render loop driven by requestAnimationFrame.
   */
  private startRenderLoop = (): void => {
    if (!this.isInitialized) return;

    // Smooth lerp for orbit angles and zoom distance
    const lerpFactor = 0.1;
    this.theta += (this.targetTheta - this.theta) * lerpFactor;
    this.phi += (this.targetPhi - this.phi) * lerpFactor;
    this.radius += (this.targetRadius - this.radius) * lerpFactor;

    this.updateCameraTransform();

    // Clear background to warm ivory showroom tone (#FAF7F2)
    if (this.webgl) {
      this.webgl.gl.clearColor(0.96, 0.94, 0.91, 1.0);
    }

    // Execute existing WebGL engine render pass
    if (this.webgl && this.program && this.scene && this.camera) {
      this.webgl.Render(this.program, this.camera, this.scene);
    }

    this.animationFrameId = requestAnimationFrame(this.startRenderLoop);
  };

  /**
   * Cleanly disposes engine resources, event listeners, and render loop.
   */
  dispose(): void {
    this.isInitialized = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.canvas && this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
      this.canvas = null;
    }

    this.webgl = null;
    this.scene = null;
    this.camera = null;
    this.program = null;
    this.container = null;
    this.sareeGroup = [];
  }
}
