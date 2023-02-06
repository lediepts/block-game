import * as THREE from "three"

const size = 4
class GameBoard {
  constructor(scene, w, h) {
    this.scene = scene
    this.w = w * size
    this.h = h * size
    this.init()
  }
  init() {
    for (let i = 0; i < this.w; i += size) {
      for (let j = 0; j < this.h; j += size) {
        const box = this.createBox()
        box.position.x = i + size / 2 - this.w / 2
        box.position.y = j + size / 2 - this.h / 2
        this.scene.add(box)
      }

    }
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
    const geometry = new THREE.BoxGeometry(size - size / 20, size - size / 20, 1);
    const cubeMaterials = colors.map(color => (new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0,
      metalness: 0,
      transparent: true,
    })));
    const cube = new THREE.Mesh(geometry, cubeMaterials);
    cube.castShadow = true;
    return cube
  }
}
export default GameBoard