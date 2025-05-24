<template>
	<div ref="container" class="viewer"></div>
</template>

<script setup>
	import { onMounted, ref } from 'vue'
	import * as THREE from 'three'
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

	const container = ref(null)

	onMounted(() => {
		const scene = new THREE.Scene()
		scene.background = new THREE.Color(0x1e1e1e)

		const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
		camera.position.set(0, 1.5, 4)

		const renderer = new THREE.WebGLRenderer({ antialias: true })
		renderer.setSize(window.innerWidth, window.innerHeight)
		container.value.appendChild(renderer.domElement)

		// Свет
		const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5)
		scene.add(light)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
		directionalLight.position.set(5, 10, 7)
		scene.add(directionalLight)

		// Управление мышью
		const controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true

		// Часы и миксер для анимации
		const clock = new THREE.Clock()
		let mixer = null

		// Загрузка модели
		const loader = new GLTFLoader()
		loader.load('/models/book.glb', (gltf) => {
			const model = gltf.scene
			model.scale.set(0.3, 0.3, 0.3)
			scene.add(model)

			// Подключение анимаций
			if (gltf.animations && gltf.animations.length > 0) {
				mixer = new THREE.AnimationMixer(model)
				gltf.animations.forEach((clip) => {
					mixer.clipAction(clip).play()
				})
			}
		})

		// Цикл анимации
		function animate() {
			requestAnimationFrame(animate)

			const delta = clock.getDelta()
			if (mixer) mixer.update(delta)

			controls.update()
			renderer.render(scene, camera)
		}

		animate()

		// Обработка ресайза окна
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight
			camera.updateProjectionMatrix()
			renderer.setSize(window.innerWidth, window.innerHeight)
		})
	})
</script>

<style scoped>
	.viewer {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #000;
	}
</style>
