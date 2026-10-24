// Shadowline Hunter — large connected story-world layer
// Environment and exploration only. No combat changes.

(() => {
  if (typeof scene === 'undefined' || typeof THREE === 'undefined') return;

  const world = new THREE.Group();
  world.name = 'ShadowlineLargeWorld';
  scene.add(world);

  const mat = (color, roughness = .9) => new THREE.MeshStandardMaterial({ color, roughness });
  const stone = mat(0x303139, .96);
  const darkStone = mat(0x1d2027, .98);
  const roof = mat(0x15171d, .92);
  const road = mat(0x292b30, 1);
  const glass = new THREE.MeshStandardMaterial({ color:0x162331, roughness:.28, metalness:.1 });

  function block(x,y,z,w,h,d,material) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true; world.add(m); return m;
  }

  function district(x,z,w,d,label) {
    block(x,.05,z,w,.1,d,road);
    block(x,5,z-d/2,w,10,.7,stone);
    block(x,5,z+d/2,w,10,.7,stone);
    block(x-w/2,5,z,.7,10,d,stone);
    block(x+w/2,5,z,.7,10,d,stone);

    for(let px=x-w/2+3; px<x+w/2-2; px+=4){
      for(const side of [-1,1]){
        const window=block(px,4.8,z+side*(d/2+.38),1.35,1.7,.08,glass);
        window.material.emissive=new THREE.Color(0x05080d);
      }
    }
  }

  // A large, static connected map. Districts overlap through roads and gates.
  district(-55,-45,70,70,'Victorian Quarter');
  district(35,-55,75,75,'Cathedral District');
  district(-48,55,75,70,'Old Cemetery District');
  district(48,55,80,70,'Manor District');
  district(-55,150,85,75,'Underground Entrance District');
  district(45,155,90,80,'Forgotten Docks');
  district(-50,255,90,85,'Highland Ruins');
  district(55,260,100,90,'Ancient Valley');
  district(0,375,150,100,'Outer Kingdom');
  district(0,510,170,105,'Final Shadowline');

  // Long connecting roads.
  for(const z of [-5,105,205,315,440,570]) block(0,.02,z,18,.05,75,road);
  for(const x of [-105,0,105]) block(x,.025,250,80,.05,16,road);

  // Large landmark silhouettes for navigation.
  block(-55,12,-45,18,24,18,darkStone);
  block(35,18,-55,26,36,22,darkStone);
  block(48,20,55,28,40,24,darkStone);
  block(-50,16,255,24,32,24,darkStone);
  block(55,22,260,30,44,26,darkStone);
  block(0,25,510,40,50,32,darkStone);

  // Static gates between major regions.
  for(const z of [45,105,205,315,440]){
    block(0,4,z,22,8,.6,roof);
    block(-11,5,z,.8,10,.8,stone);
    block(11,5,z,.8,10,.8,stone);
  }

  // Camera far plane for the full connected map.
  if(typeof camera !== 'undefined'){
    camera.far = 1800;
    camera.updateProjectionMatrix();
  }

  window.ShadowlineWorld = {
    districts: 10,
    description: 'Ten connected story districts forming the large Shadowline world.',
    bounds: { minX:-115, maxX:115, minZ:-90, maxZ:565 }
  };

  console.log('Shadowline Hunter large connected world loaded.');
})();
