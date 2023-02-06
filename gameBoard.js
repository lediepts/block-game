import * as THREE from "three"

class GameBoard {
  constructor(scene, w, h) {
    this.scene = scene
    this.w = w
    this.h = h
    this.init()
    this.createBox()
  }
  init() {

  }
  createBox() {
    const colors = [
      0x009e60,
      0x0051ba,
      0xffd500,
      0xff5800,
      0xC41E3A,
      0xffffff
    ];
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterials = colors.map(color => (new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0,
      metalness: 0,
      transparent: true,
    })));
    const cube = new THREE.Mesh(geometry, cubeMaterials);
    cube.castShadow = true;
    this.scene.add(cube)
  }
}
export default GameBoard