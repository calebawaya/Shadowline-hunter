const canvas=document.getElementById('gameCanvas');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x080b12);scene.fog=new THREE.FogExp2(0x10141d,0.018);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.1,300);camera.position.set(0,1.7,16);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const hemi=new THREE.HemisphereLight(0x68738b,0x090909,.48);scene.add(hemi);
const moon=new THREE.DirectionalLight(0x9aa9d6,1.35);moon.position.set(-35,45,20);moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);scene.add(moon);
function box(x,y,z,w,h,d,color){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.88,metalness:.05}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
function cyl(x,y,z,r,h,color){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),new THREE.MeshStandardMaterial({color,roughness:.82}));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,220),new THREE.MeshStandardMaterial({color:0x24262a,roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
for(let x=-24;x<=24;x+=6)for(let z=-55;z<=25;z+=6){const p=box(x,.012,z,5.7,.025,5.7,(Math.random()>.5?0x303236:0x292b2f));p.rotation.y=(Math.random()-.5)*.04}
function building(x,z,w,d,h){box(x,h/2,z,w,h,d,0x25262b);for(let y=3;y<h;y+=3){for(let xx=x-w/2+2;xx<x+w/2-1;xx+=3){const win=box(xx,y,z-d/2-.035,1.15,1.5,.08,0x151a22);win.material.emissive=new THREE.Color(0x05070b)}}}
building(-13,-12,12,18,13);building(13,-22,12,24,16);building(-14,-38,14,22,15);building(14,-49,14,24,18);
for(const x of [-7,7]){cyl(x,2,-8,.14,4,0x17181b);cyl(x,4.15,-8,.42,.35,0x181a1f);const l=new THREE.PointLight(0xffc77d,2.2,12);l.position.set(x,4,-8);l.castShadow=true;scene.add(l)}
// Cemetery gate
for(const x of [-5,-3,-1,1,3,5])cyl(x,1.8,-38,.07,3.6,0x101216);box(0,3.6,-38,12,.15,.15,0x101216);box(-6,1.8,-38,.18,3.8,.18,0x101216);box(6,1.8,-38,.18,3.8,.18,0x101216);
// Cathedral silhouette
box(0,10,-78,24,20,16,0x1b1d24);cyl(0,23,-78,5,26,0x191b22);box(-10,14,-78,5,28,5,0x191b22);box(10,14,-78,5,28,5,0x191b22);
const targets=[];function target(x,z){const g=new THREE.Group();g.position.set(x,1.5,z);const body=new THREE.Mesh(new THREE.CylinderGeometry(.38,.5,1.8,10),new THREE.MeshStandardMaterial({color:0x343a45,roughness:.8}));body.castShadow=true;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.38,12,8),new THREE.MeshStandardMaterial({color:0x515865,roughness:.75}));head.position.y=1.15;head.castShadow=true;g.add(head);scene.add(g);targets.push(g)}
target(-4,-27);target(5,-43);target(-3,-58);
const weapon=new THREE.Group();const wm=new THREE.MeshStandardMaterial({color:0x15171b,metalness:.65,roughness:.35});const receiver=new THREE.Mesh(new THREE.BoxGeometry(.24,.2,.85),wm);receiver.position.set(.32,-.27,-.75);weapon.add(receiver);const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.75,10),wm);barrel.rotation.x=Math.PI/2;barrel.position.set(.32,-.25,-1.22);weapon.add(barrel);camera.add(weapon);scene.add(camera);
let ammo=30,health=100,stamina=100,xp=0,locked=false;const keys={};
const ammoEl=document.getElementById('ammo'),healthEl=document.getElementById('health'),staminaEl=document.getElementById('stamina'),xpEl=document.getElementById('xp'),threatsEl=document.getElementById('threats'),healthBar=document.getElementById('healthBar'),staminaBar=document.getElementById('staminaBar'),prompt=document.getElementById('prompt');
function update(){ammoEl.textContent=ammo;healthEl.textContent=health;staminaEl.textContent=Math.round(stamina);xpEl.textContent=xp;healthBar.style.width=health+'%';staminaBar.style.width=stamina+'%';threatsEl.textContent=targets.filter(t=>t.visible).length+' DETECTED'}
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='r')reload()});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
canvas.addEventListener('click',()=>{if(!locked){canvas.requestPointerLock();locked=true;prompt.textContent='WASD MOVE · MOUSE AIM · CLICK FIRE · SHIFT SPRINT · R RELOAD';}});
addEventListener('mousemove',e=>{if(document.pointerLockElement!==canvas)return;camera.rotation.y-=e.movementX*.002;camera.rotation.x-=e.movementY*.002;camera.rotation.x=Math.max(-1.35,Math.min(1.35,camera.rotation.x))});
addEventListener('mousedown',e=>{if(e.button!==0||document.pointerLockElement!==canvas)return;fire()});
function fire(){if(ammo<=0){prompt.textContent='MAGAZINE EMPTY · PRESS R';return}ammo--;const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),camera);const hits=ray.intersectObjects(targets,true);if(hits.length){let g=hits[0].object;while(g.parent&&!targets.includes(g))g=g.parent;if(targets.includes(g)){g.visible=false;xp+=100;prompt.textContent='TARGET CLEARED · +100 XP'}}update()}
function reload(){ammo=30;prompt.textContent='RELOADED';update()}
document.getElementById('reload').onclick=reload;document.getElementById('reset').onclick=()=>location.reload();
const clock=new THREE.Clock();function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05);let speed=keys.shift?9:5.2;if(keys.shift&&stamina>0)stamina-=35*dt;else stamina=Math.min(100,stamina+18*dt);const dir=new THREE.Vector3();if(keys.w)dir.z-=1;if(keys.s)dir.z+=1;if(keys.a)dir.x-=1;if(keys.d)dir.x+=1;if(dir.lengthSq()){dir.normalize();dir.applyEuler(new THREE.Euler(0,camera.rotation.y,0));camera.position.addScaledVector(dir,speed*dt)}camera.position.x=Math.max(-9,Math.min(9,camera.position.x));camera.position.z=Math.max(-66,Math.min(20,camera.position.z));update();renderer.render(scene,camera)}loop();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});update();