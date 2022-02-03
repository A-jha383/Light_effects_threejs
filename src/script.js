import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { SpotLightHelper } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x00fffc,0.3)
scene.add(directionalLight)
directionalLight.position.set(1,0.25,0)
const hemisphereLight = new THREE.HemisphereLight(0xff0000,0x0000ff,0.5)
scene.add(hemisphereLight)

const pointLight = new THREE.PointLight(0xff9000, 0.5,4)
pointLight.position.x = 1
pointLight.position.y = -0.5
pointLight.position.z = 1
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff,2,1,1)
scene.add(rectAreaLight)
rectAreaLight.position.set(-1.5,0,1.5)
rectAreaLight.lookAt(new THREE.Vector3())

const spotLight = new THREE.SpotLight(0x78ff00,0.5,10,Math.PI*0.1,0.25,1)
spotLight.position.set(0,3,1)
scene.add(spotLight)
scene.add(spotLight.target)

gui.add(ambientLight,'intensity').max(1).min(0).step(0.0001).name('amb_intensity')
gui.add(directionalLight,'intensity').max(1).min(0).step(0.0001).name('dir_intensity')
gui.add(hemisphereLight,'intensity').max(1).min(0).step(0.0001).name('hemi_intensity')
gui.add(pointLight,'intensity').max(1).min(0).step(0.0001).name('point_intensity')
gui.add(rectAreaLight,'intensity').max(10).min(0).step(0.0001).name('rectarea_intensity')
gui.add(spotLight,'intensity').max(1).min(0).step(0.0001).name('spotLight_intensity')
gui.add(spotLight.target.position,'x').max(2).min(-2).step(0.0001).name('move_spotLight')
/**
 * Objects
 */
/**
 * helper
//  */
// const hLHelper = new THREE.HemisphereLightHelper()
// scene.add(hLHelper)

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
gui.add(material,'roughness').max(1).min(0).step(0.001)
gui.add(material,'metalness').max(1).min(0).step(0.001)

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font)=>{
        const textGeometery = new THREE.TextBufferGeometry(
            'LIGHT',{
                font: font,
                size:0.5,
                height:0.2,
                curveSegments:12,
                bevelEnabled: true,
                bevelThickness:0.03,
                bevelSize:0.02,
                bevelOffset:0,
                bevelSegments:5
            }
        )
        textGeometery.center()
    const text = new THREE.Mesh(textGeometery,material)
    text.position.y=1
    scene.add(text)})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()