import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import earthTexture from '../img/earth.jpg';
import moonTexture from '../img/Moon.png';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

const refGeo = new THREE.SphereGeometry(30, 30, 30);
const refMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const ref = new THREE.Mesh(refGeo, refMat);
scene.add(ref);

function createPlanete(size, texture, position, r = 0, g = 0, b = 0) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture),
        emissive: new THREE.Color(r, g, b), // Adjust emissive brightness here
        emissiveIntensity: 0.1, // Control how much the planet 'glows'
        metalness: 0.5, // You can change metalness for a more reflective surface
        roughness: 0.6 // You can change roughness for a smoother or rougher surface
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    scene.add(obj);
    mesh.position.x = position;
    return { mesh, obj }
}
//const sun = createPlanete(16, sunTexture, 3, 255 / 255, 165 / 255, 0);
const earth = createPlanete(6, earthTexture, 200);
const moon = createPlanete(2, moonTexture, 20); // Position moon closer to Earth
earth.mesh.add(moon.obj);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 1000);
scene.add(pointLight);

function animate() {
    //Self-rotation
    //1.997 km/s
    let earthSelfRotationSpeed = 0.05; //earth rotational speed can be adjusted and all the others will be relative to a day in earth
    let moonRotationSpeed = earthSelfRotationSpeed / 30 - earthSelfRotationSpeed;
    let sunRotationSpeed = earthSelfRotationSpeed / 27;
    ref.rotateY(sunRotationSpeed);
    //Earth totation
    earth.mesh.rotateY(earthSelfRotationSpeed); // Earth's rotation
    // Moon's orbit around Earth
    moon.obj.rotateY(moonRotationSpeed);
    // Earth's orbit around the Sun
    earth.obj.rotateY(earthSelfRotationSpeed / 365);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});