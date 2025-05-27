/**
 * Basic
 */

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
	Uniform,
	Vector3,
	WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const el = document.querySelector('#root') as HTMLDivElement;

const size = {
	width: window.innerWidth,
	height: window.innerHeight,
	pixelRatio: Math.min(2, window.devicePixelRatio),
};

const renderer = new WebGLRenderer({
	alpha: true,
	antialias: true,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new Color('#1e1e1e'));
el.append(renderer.domElement);

const scene = new Scene();

const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const stats = new Stats();
el.append(stats.dom);

/**
 * Scenes
 */

const uniforms: Record<string, Uniform> = {};

const sunSpherical = new Spherical(0.5, Math.PI / 2);
const sunPosition = new Vector3();

const sunGeometry = new IcosahedronGeometry(0.1, 5);
const sunMaterial = new MeshBasicMaterial({ color: 'yellow' });
const sun = new Mesh(sunGeometry, sunMaterial);

scene.add(sun);

const earthGeometry = new SphereGeometry(2, 32, 32);
const earthMaterial = new ShaderMaterial({
	uniforms,
});
const earth = new Mesh(earthGeometry, earthMaterial);

scene.add(earth);

function updateSun() {
	// Vector
	sunPosition.setFromSpherical(sunSpherical).multiplyScalar(8.0);
	// Update
	sun.position.copy(sunPosition);
}
updateSun();

/**
 * Events
 */

function render(time: number = 0) {
	// Animation Loop
	requestAnimationFrame(render);

	// Update
	stats.update();
	controls.update(time);

	// Render
	renderer.render(scene, camera);
}

render();

function resize() {
	size.width = window.innerWidth;
	size.height = window.innerHeight;
	size.pixelRatio = Math.min(2, window.devicePixelRatio);

	renderer.setSize(size.width, size.height);
	renderer.setPixelRatio(Math.min(2, size.pixelRatio));

	camera.aspect = size.width / size.height;
	camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
