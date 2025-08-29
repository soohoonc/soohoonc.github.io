const clock = new THREE.Clock();
const myMesh = new THREE.Mesh();

const scene = new THREE.Scene();
scene.background = new THREE.Color(1, 1, 1);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.9, 0, 0.8);
pointLight.position.set(100, 100, 400);
scene.add(pointLight);


const stlLoader = new THREE.STLLoader();

const material = new THREE.MeshStandardMaterial({
  roughness: 0.9,
  metalness: 0.0
});
material.flatShading = true;
material.side = THREE.DoubleSide;

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();

let effect;
let controls;

let characters = ' .:-+*=%@#';
const effectSize = { amount: .15 };
let ASCIIColor = 'black';

function createEffect() {
  effect = new THREE.AsciiEffect(renderer, characters, { invert: false, resolution: effectSize.amount });
  effect.setSize(sizes.width, sizes.height);
  effect.domElement.style.color = ASCIIColor;
}

createEffect();

const targetElement = document.getElementById('background');
targetElement.appendChild(effect.domElement);

stlLoader.load('/assets/models/spinosaurus.stl', function (geometry) {
  initializeSkull(geometry);
});

function initializeSkull(geometry) {
  myMesh.material = material;
  myMesh.geometry = geometry;

  geometry.computeVertexNormals();
  myMesh.geometry.center();
  myMesh.geometry.computeBoundingBox();

  const bbox = myMesh.geometry.boundingBox;
  myMesh.position.set(0, 0, 2);
  myMesh.rotation.x = 0.2;

  if (window.innerWidth < window.innerHeight) {
    myMesh.rotation.x = 0.2 - Math.PI / 2;
  }
  
  camera.position.x = bbox.max.x * (5 / Math.sqrt((Math.max(window.innerWidth, 480) * window.innerHeight) / (1440 * 1196)));
  camera.position.y = 0;
  camera.position.z = 0;
  camera.lookAt(0, 0, 0);

  scene.add(myMesh);

  function tick() {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * 0.4;
    const radius = bbox.max.x * 0.6;

    pointLight.position.x = bbox.max.x * 1 + Math.sin(angle * 0.5) * radius * 0.3;
    pointLight.position.y = Math.cos(angle) * radius;
    pointLight.position.z = Math.sin(angle) * radius * 3;

    effect.render(scene, camera);
    window.requestAnimationFrame(tick);
  }

  tick();
}

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
  
  if (window.innerWidth < window.innerHeight) {
    myMesh.rotation.x = 0.2 - Math.PI / 2;
  } else {
    myMesh.rotation.x = 0.2;
  }
});