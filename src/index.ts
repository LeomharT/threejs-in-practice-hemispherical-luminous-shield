/**
 * Basic
 */

import {
	AxesHelper,
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
import { Pane } from 'tweakpane';
import earthFragmentShader from './shader/earth/fragment.glsl?raw';
import earthVertexShader from './shader/earth/vertex.glsl?raw';

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
 * Loaders
 */

const textureLoader = new TextureLoader();
textureLoader.setPath('/src/assets/texture/');

/**
 * Textures
 */

const earthDayMapTexture = textureLoader.load('2k_earth_daymap.jpg');
const earthNightMapTexture = textureLoader.load('2k_earth_nightmap.jpg');

/**
 * Scenes
 */

const uniforms = {
	uSunDirection: new Uniform(new Vector3(0, 0, 1.0)),

	uEarthDayMapTexture: new Uniform(earthDayMapTexture),
	uEarthNightMapTexture: new Uniform(earthNightMapTexture),
};

const sunSpherical = new Spherical(1.0, Math.PI / 2, 0.5);
const sunPosition = new Vector3();

const sunGeometry = new IcosahedronGeometry(0.1, 2);
const sunMaterial = new MeshBasicMaterial({ color: 'yellow' });
const sun = new Mesh(sunGeometry, sunMaterial);

scene.add(sun);

function updateSun() {
	// Vector
	sunPosition.setFromSpherical(sunSpherical);

	// Update
	sun.position.copy(sunPosition).multiplyScalar(3.0);

	//Uniform
	uniforms.uSunDirection.value.copy(sun.position);
}
updateSun();

const earthGeometry = new SphereGeometry(1, 64, 64);
const earthMaterial = new ShaderMaterial({
	uniforms,
	vertexShader: earthVertexShader,
	fragmentShader: earthFragmentShader,
	transparent: true,
});
const earth = new Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const axesHelper = new AxesHelper(3);
scene.add(axesHelper);

/**
 * Pane
 */

const pane = new Pane();
pane.element.parentElement!.style.width = '320px';
const sunPane = pane.addFolder({ title: '☀️ SUN' });
sunPane
	.addBinding(sunSpherical, 'theta', {
		step: 0.01,
		min: -Math.PI,
		max: Math.PI,
	})
	.on('change', updateSun);
sunPane
	.addBinding(sunSpherical, 'phi', {
		step: 0.01,
		min: 0,
		max: Math.PI,
	})
	.on('change', updateSun);

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
