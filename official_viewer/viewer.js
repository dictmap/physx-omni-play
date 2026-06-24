import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const partColors = [0xd8aa3b, 0x456d9f, 0x647f4f, 0xb65a45, 0x8b6bb3, 0x2e8b95, 0xd9853b];

const officialInfo = {
  object_name: "Dumpster",
  category: "Waste Container",
  dimension: "180*120*150",
  parts: [
    {
      label: 0,
      name: "Caster Wheel (Front Right)",
      material: "Steel with Rubber",
      density: 4.45,
      Basic_description: "A caster wheel attached to the bottom of the dumpster, made of steel and rubber.",
    },
    {
      label: 1,
      name: "Main Body",
      material: "Steel",
      density: 7.8,
      Basic_description: "The main container structure of the dumpster, made of steel.",
    },
    {
      label: 2,
      name: "Lid",
      material: "Plastic (HDPE)",
      density: 0.95,
      Basic_description: "A hinged plastic lid covering the dumpster.",
    },
    {
      label: 3,
      name: "Caster Wheel (Front Left)",
      material: "Steel with Rubber",
      density: 4.45,
      Basic_description: "A caster wheel attached to the bottom of the dumpster, made of steel and rubber.",
    },
    {
      label: 4,
      name: "Front Bar Handle",
      material: "Steel",
      density: 7.8,
      Basic_description: "A steel bar handle located at the front of the dumpster.",
    },
    {
      label: 5,
      name: "Right Rear Wheel",
      material: "Steel with Rubber",
      density: 4.45,
      Basic_description: "Wheels located at the rear right side of the garbage truck.",
    },
    {
      label: 6,
      name: "Caster Wheel (Rear Left)",
      material: "Steel with Rubber",
      density: 4.45,
      Basic_description: "A caster wheel attached to the rear left bottom of the dumpster.",
    },
  ],
};

const sceneDefinitions = {
  official: {
    title: "Official 7-part demo",
    meta: "Dumpster | GLB / OBJ / URDF / MuJoCo XML closed loop",
    image: "./assets/cond_img.png",
    info: officialInfo,
    soloPart: 1,
    parts: Array.from({ length: 7 }, (_, id) => ({
      id,
      url: `./assets/parts/${id}.glb`,
    })),
  },
  mms: {
    title: "M&M's yellow high can",
    meta: "body-focus VLM | 3 non-empty lowmem TRELLIS parts",
    image: "./assets/mms/cond_img.png",
    soloPart: 1,
    parts: [
      {
        id: 1,
        name: "Jar Base",
        url: "./assets/mms/parts/1.glb",
        material: "generated mesh-only",
        density: "n/a",
        Basic_description: "2866 voxels, 93656 vertices, bbox 42 x 41 x 10. This part still looks too short.",
      },
      {
        id: 2,
        name: "Jar Lid",
        url: "./assets/mms/parts/2.glb",
        material: "generated mesh-only",
        density: "n/a",
        Basic_description: "1759 voxels, 55025 vertices, thin upper lid.",
      },
      {
        id: 3,
        name: "Jar Neck/Shoulder",
        url: "./assets/mms/parts/3.glb",
        material: "generated mesh-only",
        density: "n/a",
        Basic_description: "1563 voxels, 53610 vertices, upper neck/shoulder structure.",
      },
    ],
  },
};

const canvas = document.querySelector("#scene");
const statusEl = document.querySelector("#status");
const partListEl = document.querySelector("#partList");
const objectNameEl = document.querySelector("#objectName");
const objectMetaEl = document.querySelector("#objectMeta");
const assetTitleEl = document.querySelector("#assetTitle");
const assetMetaEl = document.querySelector("#assetMeta");
const sourceImageEl = document.querySelector("#sourceImage");
const opacityInput = document.querySelector("#opacity");
const autoRotateInput = document.querySelector("#autoRotate");
const wireframeInput = document.querySelector("#wireframe");
const sceneButtons = document.querySelectorAll("[data-scene]");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0b0d10, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

scene.add(new THREE.AmbientLight(0xffffff, 1.15));
scene.add(new THREE.HemisphereLight(0xffffff, 0x30343f, 2.7));

const key = new THREE.DirectionalLight(0xffffff, 2.8);
key.position.set(3, 4, 5);
scene.add(key);

const fill = new THREE.DirectionalLight(0xe5d2a2, 1.15);
fill.position.set(-4, 2, -3);
scene.add(fill);

const root = new THREE.Group();
scene.add(root);

const grid = new THREE.GridHelper(4, 16, 0x454b55, 0x252a30);
grid.position.y = -0.55;
scene.add(grid);

const loader = new GLTFLoader();
const state = {
  activeDefinition: sceneDefinitions.official,
  info: officialInfo,
  models: new Map(),
  partNodes: new Map(),
  bounds: new THREE.Box3(),
  loadToken: 0,
};

function setStatus(text) {
  statusEl.textContent = text;
}

function setSceneButtonState(sceneKey) {
  sceneButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scene === sceneKey);
  });
}

function partInfo(id) {
  const manual = state.activeDefinition.parts.find((part) => Number(part.id) === id);
  const parts = state.info?.parts ?? [];
  return parts.find((part) => Number(part.label) === id) ?? parts[id] ?? manual ?? { name: `Part ${id}` };
}

function applyMaterial(object, id) {
  object.traverse((child) => {
    if (!child.isMesh) return;
    const color = partColors[Math.abs(id) % partColors.length];
    child.material = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: Number(opacityInput.value) < 0.999,
      opacity: Number(opacityInput.value),
      wireframe: wireframeInput.checked,
    });
  });
}

function updateMaterials() {
  for (const [id, model] of state.models) applyMaterial(model, id);
}

function clearModels() {
  for (const model of state.models.values()) {
    model.traverse((child) => {
      if (!child.isMesh) return;
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) child.material.forEach((material) => material.dispose?.());
      else child.material?.dispose?.();
    });
    root.remove(model);
  }
  state.models.clear();
  state.partNodes.clear();
  root.position.set(0, 0, 0);
}

function fitCamera() {
  root.position.set(0, 0, 0);
  state.bounds.makeEmpty();
  for (const model of state.models.values()) state.bounds.expandByObject(model);
  if (state.bounds.isEmpty()) return;

  const center = new THREE.Vector3();
  const size = new THREE.Vector3();
  state.bounds.getCenter(center);
  state.bounds.getSize(size);
  root.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.1);
  const distance = maxDim / Math.tan((camera.fov * Math.PI) / 360);
  camera.position.set(distance * 0.62, distance * 0.42, distance * 0.82);
  camera.near = Math.max(distance / 200, 0.001);
  camera.far = distance * 8;
  camera.updateProjectionMatrix();
  controls.target.set(0, 0, 0);
  controls.update();
}

function createPartRow(id) {
  const info = partInfo(id);
  const row = document.createElement("label");
  row.className = "part";
  row.title = info.Basic_description ?? info.name ?? `Part ${id}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;
  checkbox.addEventListener("change", () => {
    const model = state.models.get(id);
    if (model) model.visible = checkbox.checked;
  });

  const swatch = document.createElement("span");
  swatch.className = "swatch";
  swatch.style.backgroundColor = `#${partColors[Math.abs(id) % partColors.length].toString(16).padStart(6, "0")}`;

  const name = document.createElement("span");
  name.className = "part-name";
  name.textContent = `${id}: ${info.name ?? `Part ${id}`}`;

  const meta = document.createElement("span");
  meta.className = "part-meta";
  const density = info.density == null ? "density n/a" : `density ${info.density}`;
  meta.textContent = `${info.material ?? "material n/a"} | ${density}`;

  row.append(checkbox, swatch, name, meta);
  state.partNodes.set(id, { row, checkbox });
  return row;
}

function buildPartList() {
  partListEl.replaceChildren();
  for (const { id } of state.activeDefinition.parts) partListEl.appendChild(createPartRow(Number(id)));
}

function loadModel(part, token) {
  return new Promise((resolve, reject) => {
    loader.load(
      part.url,
      (gltf) => {
        if (token !== state.loadToken) {
          resolve();
          return;
        }
        const model = gltf.scene;
        applyMaterial(model, Number(part.id));
        root.add(model);
        state.models.set(Number(part.id), model);
        setStatus(`${state.models.size}/${state.activeDefinition.parts.length}`);
        resolve();
      },
      undefined,
      reject,
    );
  });
}

async function activateScene(sceneKey) {
  const definition = sceneDefinitions[sceneKey];
  if (!definition) return;

  state.activeDefinition = definition;
  state.info = definition.info ?? { parts: definition.parts };
  state.loadToken += 1;
  const token = state.loadToken;

  setSceneButtonState(sceneKey);
  setStatus("Loading");
  clearModels();
  partListEl.replaceChildren();

  assetTitleEl.textContent = definition.title;
  assetMetaEl.textContent = definition.meta;
  objectNameEl.textContent = definition.title;
  objectMetaEl.textContent = definition.meta;
  sourceImageEl.src = definition.image;

  try {
    buildPartList();
    await Promise.all(definition.parts.map((part) => loadModel(part, token)));
    if (token !== state.loadToken) return;
    fitCamera();
    setStatus("Ready");
  } catch (error) {
    console.error(error);
    setStatus("Error");
  }
}

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  controls.autoRotate = autoRotateInput.checked;
  controls.autoRotateSpeed = 1.6;
  controls.update();
  renderer.render(scene, camera);
}

function showAllParts() {
  for (const [id, model] of state.models) {
    model.visible = true;
    const node = state.partNodes.get(id);
    if (node) node.checkbox.checked = true;
  }
}

function soloBodyPart() {
  const target = Number(state.activeDefinition.soloPart ?? state.activeDefinition.parts[0]?.id ?? 0);
  for (const [id, model] of state.models) {
    const visible = id === target;
    model.visible = visible;
    const node = state.partNodes.get(id);
    if (node) node.checkbox.checked = visible;
  }
}

document.querySelector("#showAll").addEventListener("click", showAllParts);
document.querySelector("#soloBody").addEventListener("click", soloBodyPart);
document.querySelector("#resetView").addEventListener("click", fitCamera);
opacityInput.addEventListener("input", updateMaterials);
wireframeInput.addEventListener("change", updateMaterials);
window.addEventListener("resize", resize);

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => activateScene(button.dataset.scene));
});

resize();
await activateScene("official");
animate();
