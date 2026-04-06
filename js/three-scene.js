/* ============================================================
   PAES TECHNOVA 2026 — Three.js 3D Background Scene
   Particle field with glowing text
   ============================================================ */

let scene, camera, renderer, composer;
let particles, particleGeometry, textMeshGroup;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let clock;
let animationFrameId;

// Configuration
const CONFIG = {
  particleCount: 1500,
  particleSpread: 1200,
  particleSize: 2.0,
  cameraZ: 600,
  mouseInfluence: 0.05,
  rotationSpeed: 0.0002,
  bloomStrength: 1.2,
  bloomRadius: 0.5,
  bloomThreshold: 0.1,
  fogNear: 400,
  fogFar: 1800,
  colors: {
    cyan: 0x00f0ff,
    blue: 0x0077ff,
    purple: 0x8b5cf6,
    bg: 0x06060e,
    fog: 0x06060e
  }
};

async function initThreeScene() {
  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
  const { EffectComposer } = await import('https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js');
  const { RenderPass } = await import('https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js');
  const { UnrealBloomPass } = await import('https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js');
  const { FontLoader } = await import('https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js');
  const { TextGeometry } = await import('https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js');

  clock = new THREE.Clock();

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(CONFIG.colors.fog, CONFIG.fogNear, CONFIG.fogFar);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = CONFIG.cameraZ;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.5;
  container.appendChild(renderer.domElement);

  // Post-processing
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    CONFIG.bloomStrength,
    CONFIG.bloomRadius,
    CONFIG.bloomThreshold
  );
  composer.addPass(bloomPass);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x111133, 0.5);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(CONFIG.colors.cyan, 2, 800);
  pointLight1.position.set(200, 200, 200);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(CONFIG.colors.purple, 1.5, 600);
  pointLight2.position.set(-200, -100, 100);
  scene.add(pointLight2);

  // Create particles
  createParticles(THREE);

  // Create floating geometry
  createFloatingGeometry(THREE);

  // Create glowing text
  createGlowingText(THREE, FontLoader, TextGeometry);

  // Events
  document.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', () => onWindowResize(THREE, bloomPass), false);

  // Start animation
  animate(THREE);
}

function createParticles(THREE) {
  const positions = [];
  const colors = [];
  const sizes = [];

  const colorOptions = [
    new THREE.Color(CONFIG.colors.cyan),
    new THREE.Color(CONFIG.colors.blue),
    new THREE.Color(CONFIG.colors.purple),
    new THREE.Color(0x00aacc),
    new THREE.Color(0x3344ff)
  ];

  for (let i = 0; i < CONFIG.particleCount; i++) {
    const x = (Math.random() - 0.5) * CONFIG.particleSpread;
    const y = (Math.random() - 0.5) * CONFIG.particleSpread;
    const z = (Math.random() - 0.5) * CONFIG.particleSpread;
    positions.push(x, y, z);

    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors.push(color.r, color.g, color.b);
    sizes.push(Math.random() * CONFIG.particleSize + 0.5);
  }

  particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    size: CONFIG.particleSize,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
}

function createFloatingGeometry(THREE) {
  // Floating wireframe shapes
  const shapes = [];

  // Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(30, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.cyan,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-350, 150, -200);
  ico.userData = { rotSpeed: 0.003, floatSpeed: 0.5, floatAmp: 20, startY: 150 };
  shapes.push(ico);

  // Octahedron
  const octGeo = new THREE.OctahedronGeometry(25, 0);
  const octMat = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.purple,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const oct = new THREE.Mesh(octGeo, octMat);
  oct.position.set(380, -120, -150);
  oct.userData = { rotSpeed: 0.004, floatSpeed: 0.7, floatAmp: 15, startY: -120 };
  shapes.push(oct);

  // Torus
  const torusGeo = new THREE.TorusGeometry(35, 3, 8, 40);
  const torusMat = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.blue,
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(300, 200, -300);
  torus.userData = { rotSpeed: 0.002, floatSpeed: 0.3, floatAmp: 25, startY: 200 };
  shapes.push(torus);

  // Dodecahedron
  const dodGeo = new THREE.DodecahedronGeometry(20, 0);
  const dodMat = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.cyan,
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });
  const dod = new THREE.Mesh(dodGeo, dodMat);
  dod.position.set(-300, -180, -100);
  dod.userData = { rotSpeed: 0.005, floatSpeed: 0.6, floatAmp: 18, startY: -180 };
  shapes.push(dod);

  shapes.forEach(s => {
    scene.add(s);
  });
  window._floatingShapes = shapes;
}

function createGlowingText(THREE, FontLoader, TextGeometry) {
  const loader = new FontLoader();
  textMeshGroup = new THREE.Group();

  loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textLines = [
      { text: 'ELECTRONICS &', y: 30, size: 22 },
      { text: 'COMPUTER ENGINEERING', y: -20, size: 18 }
    ];

    textLines.forEach(({ text, y, size }) => {
      const geometry = new TextGeometry(text, {
        font: font,
        size: size,
        depth: 3,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.3,
        bevelSegments: 3
      });

      geometry.computeBoundingBox();
      const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

      const material = new THREE.MeshBasicMaterial({
        color: CONFIG.colors.cyan,
        transparent: true,
        opacity: 0.07
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(centerOffset, y, -300);
      textMeshGroup.add(mesh);
    });

    scene.add(textMeshGroup);
  });
}

function onMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 0.5;
  mouseY = (event.clientY - windowHalfY) * 0.5;
}

function onWindowResize(THREE, bloomPass) {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  if (bloomPass) {
    bloomPass.resolution.set(window.innerWidth, window.innerHeight);
  }
}

function animate(THREE) {
  animationFrameId = requestAnimationFrame(() => animate(THREE));

  const elapsed = clock.getElapsedTime();

  // Smooth camera follow
  camera.position.x += (mouseX * CONFIG.mouseInfluence - camera.position.x) * 0.03;
  camera.position.y += (-mouseY * CONFIG.mouseInfluence - camera.position.y) * 0.03;
  camera.lookAt(scene.position);

  // Rotate particles
  if (particles) {
    particles.rotation.y += CONFIG.rotationSpeed;
    particles.rotation.x += CONFIG.rotationSpeed * 0.3;

    // Animate particle positions slightly
    const positions = particleGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(elapsed + positions[i] * 0.01) * 0.05;
    }
    particleGeometry.attributes.position.needsUpdate = true;
  }

  // Animate floating shapes
  if (window._floatingShapes) {
    window._floatingShapes.forEach(shape => {
      shape.rotation.x += shape.userData.rotSpeed;
      shape.rotation.y += shape.userData.rotSpeed * 1.3;
      shape.position.y = shape.userData.startY +
        Math.sin(elapsed * shape.userData.floatSpeed) * shape.userData.floatAmp;
    });
  }

  // Rotate text group
  if (textMeshGroup) {
    textMeshGroup.rotation.y = Math.sin(elapsed * 0.1) * 0.05;
  }

  composer.render();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThreeScene);
} else {
  initThreeScene();
}
