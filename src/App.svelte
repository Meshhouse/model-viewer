<svelte:options tag="model-viewer" />

<div
  bind:this={viewer}
  class="model-viewer__container"
>
  {#if modeltitle !== ''}
  <div
    class="model-viewer__info"
    class:faded={hideUI === true}
  >
    <b class="title">{modeltitle}</b>
    {#if author !== ''}
      {#if authorlink !== ''}
      <p class="author">By <a href={authorlink}>{author}</a></p>
      {:else}
      <p class="author">By {author}</p>
      {/if}
    {/if}
  </div>
  {/if}
  <div
    class="model-viewer__controls"
    class:faded={hideUI === true}
  >
    <div class="logo">
      <slot name="logo">
      </slot>
    </div>
    <div class="stats">
      <dd>Triangles: {triangles}</dd>
      <dd>Vertices: {vertices}</dd>
    </div>
    <nav class="button-group">
      <div class="dropdown">
        <button
          class="button active"
          on:click={() => dropdownToggle = !dropdownToggle}
        >
          <div class="button__badge">
            {modelMaterials[selectedMaterial].shortTitle}
          </div>
          <slot name="material-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M467 60h-19c-37-80-347-80-384 0H45C20 60 0 80 0 105v90c0 55 24 105 61 140v-45c28 39 72 65 123 69 6-17 23-29 42-29h60c19 0 36 12 42 29 51-4 95-30 123-70V132c-28 23-72 36-120 43v80a45 45 0 11-90 0v-30c0-9-7-15-15-15s-15 6-15 15v60a45 45 0 11-90 0V162c-24-7-44-17-60-30v157c-19-26-31-59-31-94v-90c0-9 7-15 15-15h19c18 39 106 60 192 60s174-21 192-60h19c8 0 15 6 15 15v90c0 35-12 68-31 94v46c37-35 61-85 61-140v-90c0-25-20-45-45-45z"/><path d="M256 180c-35 0-72-3-105-10v115a15 15 0 0030 0v-60a45 45 0 0190 0v30a15 15 0 0030 0v-77l-45 2zM328 389c-6 18-22 31-42 31h-60c-20 0-36-13-42-31-48-3-91-23-123-54v102c0 49 98 75 195 75s195-26 195-75V335c-32 31-75 51-123 54z"/><path d="M286 360h-60a15 15 0 000 30h60a15 15 0 000-30z"/></svg>
          </slot>
        </button>
        <div
          class="dropdown__menu"
          class:show={dropdownToggle}
        >
          {#each modelMaterials as material, index}
          <a
            class="dropdown__menu-item"
            class:active={selectedMaterial === index}
            on:click={() => selectMaterial(material.title)}
          >
            {material.title}
          </a>
          {/each}
        </div>
      </div>
      <button
        class="button"
        class:active="{autoRotate}"
        on:click={switchAutoRotate}
      >
        <div class="button__badge">Auto</div>
        <slot name="rotate-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M481 376c0-8-6-15-15-15h-45a15 15 0 100 31h14A226 226 0 0138 200a15 15 0 00-29-8 257 257 0 00247 320c76 0 146-35 194-91a15 15 0 1031 0v-43-2zM256 0C180 0 110 35 62 91a15 15 0 10-31 0v45c0 10 8 16 17 15h43c8 1 15-7 15-15 0-9-6-16-15-16H77a226 226 0 01404 136c0 19-3 38-7 56a15 15 0 0029 8A257 257 0 00256 0z"/><path d="M263 108c-4-3-10-3-14 0l-113 59 120 72 120-72-113-59zM271 264v135l113-70c4-3 7-8 7-13V192l-120 72zM121 192v124c0 5 3 10 7 13l113 70V264l-120-72z"/></svg>
        </slot>
      </button>
      <button
        class="button"
        class:active="{fullScreen}"
        on:click={switchFullscreen}
      >
        <div class="button__badge">Full</div>
        <slot name="fullscreen-button">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M146 423h-37l85-84-21-21-85 84v-36H58v87h88zm0 0M366 423v30h88v-87h-30v36l-85-84-21 21 85 84zm0 0M88 110l85 84 21-21-85-84h37V59H58v87h30zm0 0M339 194l85-84v36h30V59h-88v30h37l-85 84zm0 0"/><path d="M0 0v512h512V0zm482 482H30V30h452zm0 0"/></svg>
        </slot>
      </button>
    </nav>
  </div>
  <div
    class="model-viewer__loader"
    class:loaded="{modelLoadStatus === true}"
  >
    {#if thumbnail !== ''}
      <img
        src={thumbnail}
        alt={modeltitle}
        class="model-viewer__loader-thumbnail"
      >
    {/if}
    <div class="model-viewer__loader-info">
      <div class="model-viewer__loader-slot">
        <slot name="loader">
          <h2>Loading</h2>
        </slot>
      </div>
      <div class="model-viewer__loader-bar">
        <span
          class="model-viewer__loader-progress"
          style="width: {loadStatus}"
        />
      </div>
    </div>
  </div>
  <div
    class="model-viewer__error"
    class:visible="{modelErrored === true}"
  >
    <slot name="error">
      <h2>Can't load model :(</h2>
    </slot>
  </div>
</div>


<style lang="sass">
@import './sass/main';
</style>

<script lang="ts">
import { onMount, onDestroy, tick } from 'svelte'
// Tree shaking three.js
import { Box3 } from 'three/src/math/Box3'
import { Color } from 'three/src/math/Color'
import { DirectionalLight } from 'three/src/lights/DirectionalLight'
import { PointLight } from 'three/src/lights/PointLight'
import { HemisphereLight } from 'three/src/lights/HemisphereLight'
import { Fog } from 'three/src/scenes/Fog'
import { Mesh } from 'three/src/objects/Mesh'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial'
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { BoxBufferGeometry } from 'three/src/geometries/BoxGeometry'
import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry'
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator'
import { Scene } from 'three/src/scenes/Scene'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import { WebGLRenderTarget } from 'three/src/renderers/WebGLRenderTarget'

import {
  sRGBEncoding,
  UnsignedByteType,
  BackSide,
  Uncharted2ToneMapping
} from 'three/src/constants'
import { OrbitControls } from './three/OrbitControls'
import { GLTFLoader } from './three/GLTFLoader'
import { RGBELoader } from './three/RGBELoader'

// Variables
export let model = ''
export let hdri = ''
export let modeltitle = ''
export let author = ''
export let authorlink = ''
export let thumbnail = ''
export let resizable = true
export let autohide = false
export let skycolor = '#dbeeff'
export let groundcolor = '#597a9c'

let dropdownToggle = false
let hideTimer: number
let timerRAF: number
let triangles = 0
let vertices = 0

let loadStatus = "0%"
let hdriLoadProgress = 0
let hdriLoadStatus = false
let modelLoadProgress = 0
let modelLoadStatus = false
let modelErrored = false

let viewer: HTMLElement
let autoRotate = true
let fullScreen = false
let selectedMaterial = 0
let hideUI = false
let mouseUpdate = true
// Scene placeholders
let scene: Scene
let camera: PerspectiveCamera
let renderer: WebGLRenderer
let frameId: number
let controls: OrbitControls
let hdrMap: WebGLRenderTarget
let ground: Mesh

let meshHeight = 0

const modelMaterials: modelMaterial[] = [
  {
    title: "PBR",
    shortTitle: "PBR",
    material: null
  },
  {
    title: "Albedo",
    shortTitle: "Alb",
    material: null
  },
  {
    title: "Normal",
    shortTitle: "Nrm",
    material: null
  },
  {
    title: "Metalness",
    shortTitle: "Metal",
    material: null
  },
  {
    title: "Ambient Occlusion",
    shortTitle: "AO",
    material: null
  },
  {
    title: "Roughness",
    shortTitle: "Rough",
    material: null
  },
  {
    title: "Wireframe",
    shortTitle: "Wire",
    material: null
  }
]

onMount(async () => {
  // Workaround to zero-valued width and height
  await tick()
  const width = viewer.offsetWidth
  const height = viewer.offsetHeight
  // Add renderer
  renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'low-power'
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor('#000000')
  renderer.setSize(width, height)
  renderer.physicallyCorrectLights = true
  renderer.toneMapping = Uncharted2ToneMapping
  renderer.toneMappingExposure = 2.0
  renderer.outputEncoding = sRGBEncoding
  renderer.shadowMap.enabled = true
  viewer.appendChild(renderer.domElement)

  initScene(width, height)
  addLights()
  addGround()
  if (hdri !== '') {
    loadHDRI()
  } else {
    generateHDRI()
  }
  if (model !== '') {
    loadModel(model)
  } else {
    modelErrored = true
  }
  if (resizable === true) {
    viewerResizeObserver()
  }
  if (!frameId) {
    frameId = requestAnimationFrame(animate)
  }
  viewer.onclick = ((event: any) => dropdownAutoClose(event))
  if (Boolean(autohide) === true) {
    autoHideUI()
    viewer.addEventListener('mousemove', trackMouse)
})

onDestroy(() => {
  controls.dispose()
  scene.dispose()
  cancelAnimationFrame(frameId)
  cancelAnimationFrame(timerRAF)
  viewer.removeEventListener('mousemove', trackMouse)
  viewer.removeChild(renderer.domElement)
})

function animate() {
  renderScene()
  frameId = window.requestAnimationFrame(animate)
}

function renderScene() {
  controls.update()
  renderer.render(scene, camera)
}

function initScene(width: number, height: number) {
  // Add scene
  scene = new Scene()
  scene.background = new Color(skycolor)
  scene.fog = new Fog(skycolor, 1, 50)
  // Add camera
  camera = new PerspectiveCamera(45, width / height, 0.1, 5000)
  camera.position.set(0, 5, 5)
  // Add controls
  controls = new OrbitControls(camera, viewer)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enablePan = false
  controls.autoRotate = autoRotate
}

function addLights() {
  const ambient = new HemisphereLight(skycolor, groundcolor, 0.8)
  const keyLight = new DirectionalLight('#ffffff', 2.0)
  keyLight.position.set(-100, 100, 100)
  keyLight.position.multiplyScalar(1)
  keyLight.castShadow = true

  keyLight.shadow.mapSize.width = 1024
  keyLight.shadow.mapSize.height = 1024

  keyLight.shadow.camera.near = 0.01
  keyLight.shadow.camera.far = 10000
  keyLight.shadow.bias = 0.01

  scene.add(ambient)
  scene.add(keyLight)
}

function addGround() {
  const groundGeo = new PlaneBufferGeometry(1000, 1000)
  const groundMat = new MeshStandardMaterial({ color: groundcolor })

  ground = new Mesh(groundGeo, groundMat)
  ground.position.set(0, 0, 0)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)
}

function loadHDRI() {
  new RGBELoader()
    .setDataType(UnsignedByteType)
    .load(hdri, (texture: any) => {
      const pmremGenerator = new PMREMGenerator(renderer)
      hdrMap = pmremGenerator.fromEquirectangular(texture)

      texture.dispose()
      pmremGenerator.dispose()
      hdriLoadStatus = true
    }, (xhr: any) => {
      hdriLoadProgress = Math.round(xhr.loaded / xhr.total * 100)
      loadStatus = hdriLoadProgress / 2 + '%'
    })
}

function generateHDRI() {
  const pmremGenerator = new PMREMGenerator(renderer)
  hdrMap = pmremGenerator.fromScene(getEnvScene(), 0.04)
  pmremGenerator.dispose()
  hdriLoadStatus = true
}

function loadModel(url: string) {
  const loader = new GLTFLoader()
  loader.load(url, (gltf: any) => {
    gltf.scene.traverse(async (child: any) => {
      if (child.isMesh) {
        child.scale.set(100, 100, 100)
        child.geometry.center()

        meshHeight = new Box3().setFromObject(child).max.y
        // Reposition camera and ground
        ground.position.y = -meshHeight
        camera.position.y = meshHeight * 2
        camera.position.z = meshHeight * 5
        // Adjust scene fog
        scene.fog = new Fog(skycolor, 1, meshHeight * 75)

        child.castShadow = true
        child.receiveShadow = true
        child.material.map.anisotropy = 16
        if (hdriLoadStatus === true) {
          child.material.envMap = hdrMap.texture
        }
        // Fill materials
        modelMaterials[0].material = new MeshStandardMaterial(child.material)
        modelMaterials[1].material = new MeshBasicMaterial({color: 0xffffff, map: child.material.map})
        modelMaterials[2].material = new MeshBasicMaterial({color: 0x999999, map: child.material.normalMap})
        modelMaterials[3].material = new MeshBasicMaterial({color: 0x0000ff, map: child.material.metalnessMap})
        modelMaterials[4].material = new MeshBasicMaterial({color: 0xff0000, map: child.material.aoMap})
        modelMaterials[5].material = new MeshBasicMaterial({color: 0x00ff00, map: child.material.roughnessMap})
        modelMaterials[6].material = new MeshBasicMaterial({color: 0xe0e0ff, wireframe: true})

        vertices = child.geometry.index.count
        triangles = vertices / 3

        child.name = 'Imported model'
        scene.add(child)
      }
    })
  }, (xhr: any) => {
    const { loaded, total } = xhr
    modelLoadProgress = Math.round(loaded / total * 100)
    if (hdri !== '' && hdriLoadStatus === true) {
      loadStatus = ((hdriLoadProgress + modelLoadProgress) / 2) + '%'
    } else {
      loadStatus = modelLoadProgress + '%'
    }

    if (xhr.loaded === xhr.total) {
      modelLoadStatus = true
    }
  }, () => {
    modelErrored = true
  })
}

function getEnvScene() {
  const envScene = new Scene()

  const geometry = new BoxBufferGeometry()
  geometry.deleteAttribute('uv')

  const roomMaterial = new MeshStandardMaterial({ metalness: 0, side: BackSide })
  const room = new Mesh(geometry, roomMaterial)
  room.scale.setScalar(10)
  envScene.add(room)

  const mainLight = new PointLight(skycolor, 20, 0, 2)
  envScene.add(mainLight)

  const lightMaterial = new MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveIntensity: 8 })

  const light1 = new Mesh(geometry, lightMaterial)
  light1.position.set(-5, 2, 0)
  light1.scale.set(0.1, 1, 1)
  envScene.add(light1)

  const light2 = new Mesh(geometry, lightMaterial)
  light2.position.set(0, 5, 0)
  light2.scale.set(1, 0.1, 1)
  envScene.add(light2)

  const light3 = new Mesh(geometry, lightMaterial)
  light3.position.set(2, 1, 5)
  light3.scale.set(1.5, 2, 0.1)
  envScene.add(light3)

  return envScene
}

function selectMaterial(newMaterial: string) {
  const index = modelMaterials.findIndex((val: any) => val.title === newMaterial)
  const model = scene.getObjectByName('Imported model')
  selectedMaterial = index
  model!.material = newMaterial !== 'PBR'
    ? modelMaterials[selectedMaterial].material
    : modelMaterials[0].material
}

function switchAutoRotate() {
  autoRotate = !autoRotate
  controls.autoRotate = autoRotate
}

function switchFullscreen() {
  if (fullScreen === false) {
    fullScreen = true
    viewer.requestFullscreen().then(() => updateRenderer())
  } else {
    fullScreen = false
    document.exitFullscreen().then(() => updateRenderer())
  }
}

function updateRenderer() {
  const width = fullScreen === false ? viewer.clientWidth : window.innerWidth
  const height = fullScreen === false ? viewer.clientHeight : window.screen.height

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

function viewerResizeObserver() {
  if(ResizeObserver) {
    const observer = new ResizeObserver(() => updateRenderer())
    observer.observe(viewer)
  } else {
    window.onresize = (() => updateRenderer())
  }
}

function dropdownAutoClose(event: any) {
  let isClickedOutside = false
  if (typeof event.target.className === 'string') {
    isClickedOutside = !event.target.className.includes('dropdown__menu-item')
  }
  if (isClickedOutside === true) {
    dropdownToggle = false
  }
}

function trackMouse(event: any) {
  event.preventDefault()
  if(mouseUpdate === true) {
    mouseUpdate = false
    timerRAF = requestAnimationFrame(autoHideUI)
  }
}

function autoHideUI() {
  mouseUpdate = true
  hideUI = false
  clearTimeout(hideTimer)
  hideTimer = window.setTimeout(() => { hideUI = true }, 5000)
}
</script>
