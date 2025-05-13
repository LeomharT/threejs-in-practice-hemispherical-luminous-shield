import {
	Color,
	IcosahedronGeometry,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	ShaderMaterial,
	SphereGeometry,
	Spherical,
	TextureLoader,
	Uniform,
	Vector3,
	WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import './index.css';
import fragmentShader from './shader/fragment.glsl?raw';
import vertexShader from './shader/vertex.glsl?raw';

const el = document.querySelector('#app') as HTMLDivElement;

const size = {
	width: window.innerWidth,
	height: window.innerHeight,
	pixelRatio: Math.min(2, window.devicePixelRatio),
};

/**
 * Basic
 */

const renderer = new WebGLRenderer({
	antialias: true,
	alpha: true,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(size.pixelRatio);
renderer.setClearColor(new Color('#1e1e1e'));
el.append(renderer.domElement);

const scene = new Scene();

const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
camera.position.set(2, 2, 2);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const stats = new Stats();
el.append(stats.dom);

/**
 * Loaders
 */

const textureLoader = new TextureLoader();
textureLoader.setPath('/src/assets/texture');

/**
 * Textures
 */

const specularCloudsTexture = textureLoader.load('/specularClouds.jpg');

/**
 * Scene
 */

const uniforms = {
	uTime: new Uniform(0.0),

	uSunPosition: new Uniform(new Vector3()),

	uSpecularCloudsTexture: new Uniform(specularCloudsTexture),
};

const sunSpherical = new Spherical(1.0, Math.PI / 2, 0.5);
const sunPosition = new Vector3();

const sunGeometry = new IcosahedronGeometry(0.1, 7);
const sunMaterial = new MeshBasicMaterial({ color: 'yellow' });
const sun = new Mesh(sunGeometry, sunMaterial);

function updateSun() {
	// Position
	sunPosition.setFromSpherical(sunSpherical);

	// Sun
	sun.position.copy(sunPosition.multiplyScalar(5.0));

	// Uniform
	uniforms.uSunPosition.value.copy(sunPosition);
}
updateSun();

scene.add(sun);

const sphereGeometry = new SphereGeometry(1, 32, 32);
const sphereMaterial = new ShaderMaterial({
	fragmentShader,
	vertexShader,
	uniforms,
});
const sphereShield = new Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereShield);

/**
 * Events
 */

function render(time: number = 0) {
	// Loop
	requestAnimationFrame(render);

	// Update
	controls.update(time);
	stats.update();

	// Uniform
	uniforms.uTime.value += 0.01;

	//Render
	renderer.render(scene, camera);
}
render();

function resize() {
	size.width = window.innerWidth;
	size.height = window.innerHeight;
	size.pixelRatio = Math.min(2, window.devicePixelRatio);

	renderer.setSize(size.width, size.height);

	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

// Test
const obj = new Proxy(
	{
		name: 'Leo',
		age: 24,
	},
	{
		get: function (target, propKey, receiver) {
			console.log(`getting ${propKey}!`);
			return Reflect.get(target, propKey, receiver);
		},
		set: function (target, propKey, value, receiver) {
			console.log(`setting ${propKey}!`);
			return Reflect.set(target, propKey, value, receiver);
		},
	}
);

console.log(obj.age);
