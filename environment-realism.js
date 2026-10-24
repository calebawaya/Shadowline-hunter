// Shadowline Hunter — realistic environment pass
// Environment-only upgrade: architecture, materials, lighting and street detail.

if (typeof renderer !== 'undefined') {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
}

const envMat = (color, roughness = 0.8, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

function envBox(x, y, z, w, h, d, color, roughness = 0.85, metalness = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), envMat(color, roughness, metalness));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function envCylinder(x, y, z, r, h, color, roughness = 0.8, metalness = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), envMat(color, roughness, metalness));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

// Better cinematic depth without animated scenery.
scene.fog = new THREE.FogExp2(0x111722, 0.014);
scene.background = new THREE.Color(0x070a10);

// Sidewalks and raised curbs make the street feel built rather than flat.
for (const x of [-11.2, 11.2]) {
  envBox(x, 0.12, -20, 3.2, 0.24, 92, 0x34363a, 0.96);
  envBox(x * 0.83, 0.22, -20, 0.18, 0.2, 92, 0x55575b, 0.9);
}

// Individual pavement slabs with subtle variation.
for (let z = 17; z >= -64; z -= 4) {
  envBox(-11.05, 0.27, z, 2.9, 0.08, 0.055, 0x4a4b4f, 1);
  envBox(11.05, 0.27, z, 2.9, 0.08, 0.055, 0x4a4b4f, 1);
}

// Storm drains and utility covers.
for (const z of [-6, -24, -42, -58]) {
  envBox(-8.8, 0.055, z, 0.9, 0.035, 1.8, 0x17191d, 0.7, 0.55);
  envBox(8.8, 0.055, z + 3, 0.9, 0.035, 1.8, 0x17191d, 0.7, 0.55);
}
envCylinder(0, 0.075, -18, 0.65, 0.06, 0x303238, 0.72, 0.45);

// Building entrances: recessed doors, stone surrounds and steps.
function entrance(x, z, side) {
  const y = 1.45;
  envBox(x, y, z, 2.1, 2.9, 0.18, 0x0d0f13, 0.6, 0.05);
  envBox(x, 2.95, z, 2.7, 0.28, 0.45, 0x555158, 0.92);
  envBox(x, 0.18, z + side * 0.35, 2.9, 0.18, 1.0, 0x46474b, 0.95);
  envCylinder(x + side * 0.65, 1.45, z - 0.12, 0.045, 1.0, 0x8a7658, 0.45, 0.65);
}
entrance(-6.95, -10, -1);
entrance(6.95, -25, 1);
entrance(-6.95, -40, -1);
entrance(6.95, -51, 1);

// Vertical drainpipes and roof gutters add believable building detail.
for (const x of [-18.5, -7.2, 7.2, 18.5]) {
  envCylinder(x, 6.5, -25, 0.08, 13, 0x202126, 0.62, 0.35);
}

// Window frames with recessed glass.
function windowBand(x, z, side = 1) {
  for (let y = 3.2; y <= 10.2; y += 3.5) {
    const glass = envBox(x, y, z, 1.45, 1.75, 0.07, 0x182433, 0.28, 0.12);
    glass.material.emissive = new THREE.Color(0x050b14);
    envBox(x - 0.82, y, z, 0.08, 1.95, 0.13, 0x14161a, 0.65, 0.45);
    envBox(x + 0.82, y, z, 0.08, 1.95, 0.13, 0x14161a, 0.65, 0.45);
    envBox(x, y, z - side * 0.08, 1.75, 0.08, 0.13, 0x14161a, 0.65, 0.45);
  }
}
windowBand(-6.85, -17, -1);
windowBand(6.85, -30, 1);
windowBand(-6.85, -45, -1);
windowBand(6.85, -56, 1);

// Non-moving street props: crates, benches and posts for scale.
function streetProp(x, z) {
  envBox(x, 0.45, z, 0.9, 0.9, 0.9, 0x3a3027, 0.92);
  envBox(x, 0.92, z, 0.96, 0.06, 0.96, 0x17191d, 0.7, 0.2);
}
streetProp(-8.1, -15);
streetProp(8.1, -35);
streetProp(-8.1, -55);

for (const z of [-12, -31, -50]) {
  envCylinder(-9.1, 0.75, z, 0.09, 1.5, 0x24262a, 0.7, 0.35);
  envCylinder(9.1, 0.75, z + 4, 0.09, 1.5, 0x24262a, 0.7, 0.35);
}

// Warm pools of static light at key street corners.
for (const [x, z] of [[-7, -8], [7, -8], [-7, -34], [7, -48]]) {
  const lamp = new THREE.PointLight(0xffc47a, 0.65, 11, 2);
  lamp.position.set(x, 4.1, z);
  lamp.castShadow = true;
  scene.add(lamp);
}

// Cathedral approach: stone strips, pillars and a heavy entrance threshold.
if (typeof level2Built !== 'undefined') {
  for (const z of [-94, -102, -110, -118, -126, -134, -142, -150]) {
    envBox(-13.2, 0.16, z, 1.0, 0.32, 5.8, 0x303139, 0.95);
    envBox(13.2, 0.16, z, 1.0, 0.32, 5.8, 0x303139, 0.95);
  }
}

// Keep the scene grounded with stronger contact shadows.
if (typeof moon !== 'undefined') {
  moon.shadow.bias = -0.00015;
  moon.shadow.normalBias = 0.025;
}

console.log('Shadowline Hunter realistic environment pass loaded.');
