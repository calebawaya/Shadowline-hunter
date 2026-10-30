// Shadowline Hunter — visible large connected environment
// Environment and exploration only. Combat systems are untouched.

(() => {
  if (typeof scene === 'undefined' || typeof THREE === 'undefined') return;
  if (window.ShadowlineLargeWorldLoaded) return;
  window.ShadowlineLargeWorldLoaded = true;

  const world = new THREE.Group();
  world.name = 'ShadowlineVisibleWorld';
  scene.add(world);

  const mat = (color, roughness = 0.9, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });

  const asphalt = mat(0x25282d);
  const sidewalk = mat(0x55575b);
  const building = mat(0x3a3b42);
  const brick = mat(0x4b3b3b);
  const roof = mat(0x17191e);
  const glass = new THREE.MeshStandardMaterial({ color: 0x263b4b, roughness: 0.28, metalness: 0.15 });
  const treeTrunk = mat(0x3a281c);
  const leaf = mat(0x263b2b);
  const lampMat = mat(0x16181b, 0.7, 0.4);
  const carBody = mat(0x343941, 0.55, 0.35);
  const tireMat = mat(0x090a0b);
  const signMat = mat(0x777064);

  function mesh(geometry, material, x, y, z, cast = true) {
    const m = new THREE.Mesh(geometry, material);
    m.position.set(x, y, z);
    m.castShadow = cast;
    m.receiveShadow = cast;
    world.add(m);
    return m;
  }

  function box(x, y, z, w, h, d, material, cast = true) {
    return mesh(new THREE.BoxGeometry(w, h, d), material, x, y, z, cast);
  }

  function cylinder(x, y, z, radius, height, material, radial = 10) {
    return mesh(new THREE.CylinderGeometry(radius, radius, height, radial), material, x, y, z);
  }

  // Main roads and sidewalks.
  box(0, -0.12, 250, 30, 0.25, 680, asphalt, false);
  box(-90, -0.11, 250, 18, 0.22, 680, asphalt, false);
  box(90, -0.11, 250, 18, 0.22, 680, asphalt, false);
  box(-15, 0.02, 250, 2, 0.06, 680, sidewalk, false);
  box(15, 0.02, 250, 2, 0.06, 680, sidewalk, false);

  // Cross streets.
  for (const z of [-55, 55, 155, 255, 375, 510]) {
    box(0, -0.1, z, 220, 0.22, 18, asphalt, false);
    box(0, 0.02, z - 12, 220, 0.18, 3, sidewalk, false);
    box(0, 0.02, z + 12, 220, 0.18, 3, sidewalk, false);
  }

  // Victorian-style buildings with doors, windows and roofs.
  function buildingBlock(x, z, w, d, h, material = building) {
    box(x, h / 2, z, w, h, d, material);
    box(x, h + 0.35, z, w + 0.6, 0.7, d + 0.6, roof);

    const floors = Math.max(2, Math.floor(h / 4));
    const columns = Math.max(2, Math.floor(w / 5));
    for (let f = 0; f < floors; f++) {
      const y = 2.2 + f * 4;
      for (let c = 0; c < columns; c++) {
        const px = x - w / 2 + 2.5 + c * ((w - 5) / Math.max(1, columns - 1));
        box(px, y, z - d / 2 - 0.035, 1.55, 1.8, 0.08, glass, false);
        box(px, y, z + d / 2 + 0.035, 1.55, 1.8, 0.08, glass, false);
      }
    }
    box(x, 1.25, z - d / 2 - 0.05, 2.1, 2.5, 0.12, roof);
  }

  const blocks = [
    [-58, -55, 48, 34, 13], [58, -55, 48, 34, 16],
    [-58, 55, 48, 34, 11], [58, 55, 48, 34, 14],
    [-58, 155, 48, 36, 15], [58, 155, 48, 36, 12],
    [-58, 255, 48, 38, 17], [58, 255, 48, 38, 14],
    [-55, 375, 60, 42, 18], [55, 375, 60, 42, 15],
    [-58, 510, 62, 44, 20], [58, 510, 62, 44, 18]
  ];
  blocks.forEach((b, i) => buildingBlock(...b, i % 3 === 0 ? brick : building));

  // A large central landmark.
  box(0, 13, 375, 28, 26, 28, mat(0x30323a));
  box(0, 27, 375, 34, 2, 34, roof);
  cylinder(0, 37, 375, 5, 18, roof, 12);
  cylinder(0, 47, 375, 7, 1.5, stoneLike(), 12);

  function stoneLike() { return mat(0x45464c); }

  // Trees: trunk + layered foliage, placed beside roads rather than on them.
  function tree(x, z, scale = 1) {
    cylinder(x, 2.2 * scale, z, 0.7 * scale, 4.4 * scale, treeTrunk, 8);
    cylinder(x, 5.3 * scale, z, 2.5 * scale, 4.5 * scale, leaf, 9);
    cylinder(x, 7.8 * scale, z, 1.9 * scale, 3.4 * scale, leaf, 9);
  }

  for (const z of [-45, 5, 105, 205, 315, 440, 565]) {
    tree(-27, z, 1.0);
    tree(27, z + 12, 0.85);
  }
  for (const z of [25, 125, 225, 345, 475, 545]) {
    tree(-105, z, 0.9);
    tree(105, z + 18, 1.0);
  }

  // Park areas.
  for (const z of [105, 315, 520]) {
    box(-55, 0.03, z, 45, 0.12, 35, mat(0x27372b), false);
    tree(-65, z - 12, 1.2);
    tree(-45, z + 12, 1.0);
    tree(-75, z + 10, 0.9);
  }

  // Static parked cars: recognizable silhouettes, no driving/combat behavior.
  function car(x, z, rotation = 0) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotation;
    world.add(group);

    const body = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.05, 2.15), carBody);
    body.position.y = 1.0;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.85, 1.85), glass);
    cabin.position.set(-0.15, 1.75, 0);
    cabin.castShadow = true;
    group.add(cabin);

    for (const wx of [-1.7, 1.7]) {
      for (const wz of [-1.12, 1.12]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.32, 12), tireMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.55, wz);
        wheel.castShadow = true;
        group.add(wheel);
      }
    }
  }

  car(-8, -25, 0);
  car(8, 35, Math.PI);
  car(-100, 85, Math.PI / 2);
  car(100, 185, -Math.PI / 2);
  car(-8, 285, 0);
  car(8, 465, Math.PI);
  car(-100, 525, Math.PI / 2);

  // Street lamps.
  function lamp(x, z) {
    cylinder(x, 4, z, 0.16, 8, lampMat, 8);
    box(x, 8, z, 1.4, 0.16, 0.16, lampMat);
    const light = new THREE.PointLight(0xffd9a0, 1.0, 28, 2);
    light.position.set(x, 7.8, z);
    world.add(light);
  }
  for (const z of [-35, 65, 165, 265, 385, 520]) {
    lamp(-19, z);
    lamp(19, z + 30);
  }

  // Road signs and benches give the streets more visual identity.
  for (const z of [55, 255, 440]) {
    cylinder(-20, 1.5, z, 0.08, 3, lampMat, 6);
    box(-20, 3.0, z, 2.4, 1.2, 0.12, signMat);
    box(20, 1.0, z + 20, 3.5, 0.25, 0.8, woodMat());
  }
  function woodMat() { return mat(0x4a3527); }

  // Distant skyline silhouettes make the world feel large without heavy geometry.
  for (let x = -100; x <= 100; x += 20) {
    const h = 12 + ((Math.abs(x) * 7) % 20);
    box(x, h / 2, 600, 15, h, 10, darkFarMat(), false);
  }
  function darkFarMat() { return mat(0x20232a); }

  if (typeof camera !== 'undefined') {
    camera.far = Math.max(camera.far || 0, 1800);
    camera.updateProjectionMatrix();
  }

  window.ShadowlineWorld = {
    districts: 10,
    description: 'Ten connected districts with visible buildings, roads, trees, parked cars, lamps and landmarks.',
    bounds: { minX: -125, maxX: 125, minZ: -95, maxZ: 620 }
  };

  console.log('Shadowline Hunter visible city environment loaded.');
})();
