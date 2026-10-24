// Shadowline Hunter — safe large connected story-world layer
// Environment and exploration only. No combat changes.
// This version uses lightweight landmark geometry so the existing game remains stable.

(() => {
  if (typeof scene === 'undefined' || typeof THREE === 'undefined') return;
  if (window.ShadowlineLargeWorldLoaded) return;
  window.ShadowlineLargeWorldLoaded = true;

  const world = new THREE.Group();
  world.name = 'ShadowlineLargeWorld';
  scene.add(world);

  const makeMat = (color, roughness = .92) =>
    new THREE.MeshStandardMaterial({ color, roughness });

  const stone = makeMat(0x303139);
  const darkStone = makeMat(0x1d2027);
  const roof = makeMat(0x15171d);
  const road = makeMat(0x292b30);
  const glass = new THREE.MeshStandardMaterial({
    color: 0x162331,
    roughness: .35,
    metalness: .05
  });

  function box(x, y, z, w, h, d, material, shadows = true) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      material
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = shadows;
    mesh.receiveShadow = shadows;
    world.add(mesh);
    return mesh;
  }

  function landmark(x, z, w, h, d) {
    box(x, h / 2, z, w, h, d, darkStone);
    box(x, h + 0.15, z, w * .72, .3, d * .72, roof);
  }

  function district(x, z, w, d) {
    // Low boundary walls instead of enclosing the player.
    box(x, .35, z - d / 2, w, .7, .6, stone);
    box(x, .35, z + d / 2, w, .7, .6, stone);
    box(x - w / 2, .35, z, .6, .7, d, stone);
    box(x + w / 2, .35, z, .6, .7, d, stone);

    // Sparse static windows for visual scale.
    for (let px = x - w / 2 + 5; px < x + w / 2 - 3; px += 10) {
      for (const side of [-1, 1]) {
        const window = box(px, 3.2, z + side * (d / 2 + .34), 1.8, 1.5, .08, glass, false);
        window.material.emissive = new THREE.Color(0x020408);
      }
    }
  }

  // Ten connected regions, kept lightweight and open for traversal.
  district(-55, -45, 70, 70);
  district(35, -55, 75, 75);
  district(-48, 55, 75, 70);
  district(48, 55, 80, 70);
  district(-55, 150, 85, 75);
  district(45, 155, 90, 80);
  district(-50, 255, 90, 85);
  district(55, 260, 100, 90);
  district(0, 375, 150, 100);
  district(0, 510, 170, 105);

  // Main travel corridors.
  for (const z of [0, 105, 205, 315, 440, 565]) {
    box(0, .02, z, 16, .04, 70, road, false);
  }
  for (const x of [-105, 0, 105]) {
    box(x, .025, 250, 70, .05, 14, road, false);
  }

  // One restrained landmark per major region.
  landmark(-55, -45, 16, 18, 16);
  landmark(35, -55, 22, 28, 18);
  landmark(-48, 55, 18, 20, 18);
  landmark(48, 55, 22, 30, 20);
  landmark(-55, 150, 20, 24, 18);
  landmark(45, 155, 24, 26, 20);
  landmark(-50, 255, 22, 26, 20);
  landmark(55, 260, 24, 30, 22);
  landmark(0, 375, 30, 34, 24);
  landmark(0, 510, 34, 40, 26);

  // Simple open gates between regions.
  for (const z of [45, 105, 205, 315, 440]) {
    box(-11, 4, z, .7, 8, .7, stone);
    box(11, 4, z, .7, 8, .7, stone);
    box(0, 8, z, 22, .6, .7, roof);
  }

  if (typeof camera !== 'undefined') {
    camera.far = Math.max(camera.far || 0, 1800);
    camera.updateProjectionMatrix();
  }

  window.ShadowlineWorld = {
    districts: 10,
    description: 'Ten connected story districts forming the large Shadowline world.',
    bounds: { minX: -115, maxX: 115, minZ: -90, maxZ: 565 }
  };

  console.log('Shadowline Hunter safe large connected world loaded.');
})();
