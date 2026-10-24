// Shadowline Hunter — static architecture realism pass
// Environment-only: facades, masonry, balconies, rooflines, alleys and signs.
// No animation and no gameplay/combat changes.

if (typeof scene !== 'undefined' && typeof THREE !== 'undefined') {
  const archMat = (color, roughness = 0.82, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });

  function archBox(x, y, z, w, h, d, color, roughness = 0.82, metalness = 0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), archMat(color, roughness, metalness));
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  function facadeDetails(x, z, side) {
    const wall = 0x25262b;
    const stone = 0x59545a;
    const dark = 0x111318;

    // Vertical masonry pilasters.
    for (const dx of [-2.9, 2.9]) {
      archBox(x + dx, 5.2, z, 0.34, 10.4, 0.5, stone, 0.92);
    }

    // Floor bands and cornices.
    for (const y of [3.0, 6.3, 9.7]) {
      archBox(x, y, z, 6.4, 0.18, 0.62, stone, 0.9);
    }

    // Window recesses and sills.
    for (const y of [4.4, 7.6, 10.4]) {
      archBox(x, y, z + side * 0.28, 1.7, 1.95, 0.16, dark, 0.65);
      archBox(x, y - 1.08, z + side * 0.38, 2.05, 0.14, 0.34, stone, 0.9);
      archBox(x, y + 1.08, z + side * 0.38, 2.05, 0.14, 0.34, stone, 0.9);
    }

    // Shallow roofline parapet.
    archBox(x, 12.2, z, 6.8, 0.5, 0.72, wall, 0.9);
    archBox(x, 12.55, z, 6.9, 0.14, 0.8, stone, 0.9);
  }

  function balcony(x, y, z, side) {
    archBox(x, y, z + side * 0.48, 2.8, 0.18, 1.15, 0x4a4648, 0.78, 0.25);
    archBox(x - 1.28, y + 0.52, z + side * 0.48, 0.08, 1.05, 0.08, 0x15171a, 0.55, 0.6);
    archBox(x, y + 0.52, z + side * 0.48, 0.08, 1.05, 0.08, 0x15171a, 0.55, 0.6);
    archBox(x + 1.28, y + 0.52, z + side * 0.48, 0.08, 1.05, 0.08, 0x15171a, 0.55, 0.6);
    archBox(x, y + 0.52, z + side * 0.48, 2.65, 0.08, 0.08, 0x15171a, 0.55, 0.6);
  }

  function doorway(x, z, side) {
    archBox(x, 1.45, z + side * 0.24, 2.25, 2.9, 0.22, 0x0b0d11, 0.62);
    archBox(x, 3.05, z + side * 0.31, 2.9, 0.22, 0.48, 0x6a6266, 0.9);
    archBox(x - 1.25, 1.55, z + side * 0.32, 0.18, 3.05, 0.48, 0x6a6266, 0.9);
    archBox(x + 1.25, 1.55, z + side * 0.32, 0.18, 3.05, 0.48, 0x6a6266, 0.9);
    archBox(x, 0.15, z + side * 0.55, 3.0, 0.22, 1.1, 0x4b4a4e, 0.95);
  }

  function streetSign(x, y, z, side, label) {
    const pole = archBox(x, y * 0.5, z, 0.07, y, 0.07, 0x26282d, 0.55, 0.5);
    pole.castShadow = true;
    archBox(x, y, z + side * 0.04, 1.5, 0.42, 0.06, 0x151820, 0.55, 0.25);
    // Simple raised letter-like bars: static geometry, no text texture dependency.
    const widths = [0.18, 0.08, 0.22, 0.1, 0.16];
    let offset = -0.48;
    for (const width of widths) {
      archBox(x + offset, y, z + side * 0.09, width, 0.06, 0.025, 0xb7aa8e, 0.5, 0.2);
      offset += width + 0.08;
    }
  }

  // Victorian blocks along the main quarter.
  facadeDetails(-6.95, -17, -1);
  facadeDetails(6.95, -30, 1);
  facadeDetails(-6.95, -45, -1);
  facadeDetails(6.95, -56, 1);

  balcony(-6.95, 6.9, -20, -1);
  balcony(6.95, 6.9, -33, 1);
  balcony(-6.95, 6.9, -48, -1);
  balcony(6.95, 6.9, -59, 1);

  doorway(-6.95, -17, -1);
  doorway(6.95, -30, 1);
  doorway(-6.95, -45, -1);
  doorway(6.95, -56, 1);

  streetSign(-9.45, 2.2, -18, -1, 'NORTH');
  streetSign(9.45, 2.2, -38, 1, 'EAST');
  streetSign(-9.45, 2.2, -54, -1, 'OLD');

  // Static alley mouths deepen the street silhouette.
  for (const [x, z, side] of [[-9.0, -27, -1], [9.0, -44, 1]]) {
    archBox(x, 2.8, z, 3.1, 5.6, 0.5, 0x0a0c10, 0.7);
    archBox(x, 5.9, z, 3.8, 0.3, 0.7, 0x555158, 0.92);
    archBox(x, 0.18, z + side * 0.45, 3.8, 0.22, 1.2, 0x45464b, 0.95);
  }

  // Cathedral entrance silhouette, positioned for the existing Level 2 area.
  const cathedralStone = 0x45434a;
  archBox(0, 8.5, -158, 30, 17, 1.6, cathedralStone, 0.9);
  archBox(0, 17.2, -158, 31, 0.55, 1.9, 0x5a555d, 0.92);
  archBox(-9.5, 7.0, -157.0, 3.0, 14, 2.0, 0x34343a, 0.9);
  archBox(9.5, 7.0, -157.0, 3.0, 14, 2.0, 0x34343a, 0.9);

  // Tall gothic window recesses.
  for (const x of [-6, 0, 6]) {
    archBox(x, 9.5, -156.95, 2.8, 8.0, 0.25, 0x101722, 0.35, 0.12);
    archBox(x, 13.6, -156.7, 3.2, 0.18, 0.5, 0x777078, 0.9);
  }

  // Central cathedral doorway and stone steps.
  archBox(0, 3.7, -156.7, 5.2, 7.4, 0.3, 0x0b0d12, 0.6);
  archBox(-3.0, 3.8, -156.55, 0.32, 7.8, 0.65, 0x706a70, 0.92);
  archBox(3.0, 3.8, -156.55, 0.32, 7.8, 0.65, 0x706a70, 0.92);
  for (let i = 0; i < 4; i++) {
    archBox(0, 0.18 + i * 0.22, -157.2 + i * 0.32, 7.8 - i * 0.6, 0.18, 1.8, 0x4b4a50, 0.96);
  }

  console.log('Shadowline Hunter static architecture pass loaded.');
}
