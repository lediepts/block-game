import { Scene, PerspectiveCamera, REVISION, WebGLRenderer, Color, BoxGeometry, MeshNormalMaterial, Mesh, Vector3, MeshBasicMaterial, PlaneGeometry, SphereGeometry, DoubleSide, FrontSide, MeshPhongMaterial, GridHelper, Clock, MeshStandardMaterial, AmbientLight, DirectionalLightHelper, HemisphereLight, DirectionalLight, PointLight, CameraHelper } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GameBoard from "./gameBoard.js"


import dat from "dat.gui"

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }

  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }

  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}


class DegRadHelper {
  constructor(obj, prop) {
    this.obj = obj;
    this.prop = prop;
  }

  get value() {
    return MathUtils.radToDeg(this.obj[this.prop]);
  }

  set value(v) {
    this.obj[this.prop] = MathUtils.degToRad(v);
  }
}


const ROUND = Math.PI * 2
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 600;

export class Game {
  runTiming = 0
  constructor(canvas) {
    this.canvas = canvas
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createControl()
    new GameBoard(this.scene, 6, 10)

    // this.createCube();
    // this.createSphere()

    this.createAmbientLight()
    this.createHemisphereLight()
    this.createPointLight()
    this.createDirectionalLight()

    this.render();
    this.handleResize();
    const gridHelper = new GridHelper(10, 10, new Color("#f0f"));
    gridHelper.visible = false
    this.scene.add(gridHelper);
  }
  createControl() {
    this.orbitControls = new OrbitControls(this.camera, this.canvas);
    this.orbitControls.enableDamping = true;
    this.orbitControls.autoRotate = false;
    this.orbitControls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera);
    });
  }
  createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0x444444);
  }
  createCamera() {
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, far / 10);
    camera.lookAt(new Vector3(0, 0, 0));
    this.camera = camera
  }
  createRenderer() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    const pixelRatio = window.devicePixelRatio;
    const width = window.innerWidth * pixelRatio;
    const height = window.innerHeight * pixelRatio;
    this.renderer.setSize(width, height, false);

    this.renderer.shadowMap.enabled = true;
  }
  createAmbientLight() {
    this.ambientLight = new AmbientLight("#fff", 0.6);
    this.ambientLight.visible = true;
    this.scene.add(this.ambientLight);
  }
  createHemisphereLight() {
    this.hemisphereLight = new HemisphereLight(0xf0e424, 0xd41384, 0.6);
    this.hemisphereLight.visible = false;
    this.scene.add(this.hemisphereLight);
  }
  createDirectionalLight() {
    this.directionalLight = new DirectionalLight(0xeeeeee, 1.5);
    this.directionalLight.visible = true;
    this.directionalLight.castShadow = true;
    this.directionalLight.position.set(-40, 50, -40);
    this.directionalLight.shadow.mapSize.width = 512; // default
    this.directionalLight.shadow.mapSize.height = 512; // default
    this.directionalLight.shadow.camera.near = 0.5; // default
    this.directionalLight.shadow.camera.far = 500; // default

    this.directionalLightHelper = new DirectionalLightHelper(this.directionalLight);
    this.directionalLightHelper.visible = false;

    this.scene.add(
      this.directionalLight,
      this.directionalLightHelper
    );
  }
  createPointLight() {
    this.pointLight = new PointLight("#fff", 1);
    this.pointLight.visible = false;
    this.pointLight.castShadow = true;
    this.pointLight.distance = 0;
    this.pointLight.position.set(-40, 50, 0);

    this.pointLight.shadow.mapSize.width = 512; // default
    this.pointLight.shadow.mapSize.height = 512; // default
    this.pointLight.shadow.camera.near = 0.5; // default
    this.pointLight.shadow.camera.far = 500; // default

    this.scene.add(
      this.pointLight
    );
  }

  createCube() {
    const colors = [
      0x009e60,
      0x0051ba,
      0xffd500,
      0xff5800,
      0xC41E3A,
      0xffffff
    ];
    const cubeMaterials = colors.map(color => (new MeshStandardMaterial({
      color: color,
      roughness: 0,
      metalness: 0
    })));
    const cubeGeometry = new BoxGeometry(1, 1, 1);
    this.cube = new Mesh(cubeGeometry, cubeMaterials);
    this.cube.castShadow = true;
    this.cube.position.set(-3, 1, 0);
    this.cube.tick = () => {
      const anglePerSecond = this.runTiming * ROUND;
      this.cube.rotation.x = anglePerSecond * 0.1;
      this.cube.rotation.y = anglePerSecond * 0.1;
      this.cube.rotation.z = anglePerSecond * 0.1;
      this.cube.position.y = 2 + Math.cos(anglePerSecond * 0.1)
    };
    this.scene.add(this.cube);
  }
  createSphere() {
    const sphereGeometry = new SphereGeometry(0.5, 25, 25);
    const sphereMaterial = new MeshStandardMaterial({
      color: 0x7777ff,
      roughness: 0,
      metalness: 0
    });
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    this.sphere.castShadow = true; //default is false
    this.sphere.receiveShadow = false; //default
    this.sphere.position.set(4, 1, 0);
    this.sphere.tick = () => {
      const anglePerSecond = this.runTiming * ROUND;
      const temp = anglePerSecond * 0.1;
      this.sphere.position.x = 2 + (2 * (Math.cos(temp)));
      this.sphere.position.y = 0.5 + (2 * Math.abs(Math.sin(temp)));
    };
    this.scene.add(this.sphere);
  }
  update() {
    // this.cube.tick()
    // this.sphere.tick()
  }
  render(ms) {
    this.runTiming = ms / 1000
    this.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
  handleResize() {
    window.addEventListener('resize', () => {
      this.onResize();
    });
  }
  onResize() {
    const pixelRatio = window.devicePixelRatio;
    const width = window.innerWidth * pixelRatio;
    const height = window.innerHeight * pixelRatio;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    // this.trackballControls.handleResize()
  }
}