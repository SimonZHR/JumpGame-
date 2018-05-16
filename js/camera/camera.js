import * as THREE from '../libs/three.min'
const screenHeight = window.innerHeight
const screenWidth = window.innerWidth

const look = {
  x: -2,
  y: 1,
  z: -7
}
var frustumSize = window.innerHeight / window.innerWidth / 736 * 414 * 60
var aspect = window.innerWidth / window.innerHeight;

export default class Camera {
  constructor() {
    this.camera = new THREE.OrthographicCamera(screenHeight / -100, screenWidth / 100, screenWidth / 100, screenHeight / -100, 0, 5000)
    this.initPos = {
      x: 50,
      y: 25,
      z: 50
    }
    this.x = this.initPos.x
    this.y = this.initPos.y
    this.z = this.initPos.z
    this.camera.position.set(this.x, this.y, this.z)
    this.camera.lookAt(new THREE.Vector3(look.x, look.y, look.z))
  }

  updateCamera(curDir, dir, curP, renderer, scene, aim = 0) {
    var that = this
    var x = this.initPos.x + curP.x 
    var y = this.initPos.y + curP.y
    var z = this.initPos.z + curP.z
    if (curDir != dir) {
      if (aim < 7) {
        if (dir == "front") {
          this.x = this.x - 0.09
          this.z = this.z - 0.14
        } else {
          this.x = this.x - 0.14
          this.z = this.z - 0.09
        }
        this.camera.position.set(this.x, y, this.z)
        aim += 0.3
        //console.log(111)
      }
      renderer.render(scene, this.camera)
      requestAnimationFrame(function () {
        that.updateCamera(curDir, dir, curP, renderer, scene, aim)
      })
    } else {
      if (dir == 'front') {
        if (this.z > z) {
          this.z = this.z - 0.15
          this.camera.position.set(x, y, this.z)
          renderer.render(scene, this.camera)
          requestAnimationFrame(function () {
            that.updateCamera(curDir, dir, curP, renderer, scene)
          })
        }
      } else {
        if (this.x > x - 3) {
          this.x = this.x - 0.15
          this.camera.position.set(this.x, y, z)
          renderer.render(scene, this.camera)
          requestAnimationFrame(function () {
            that.updateCamera(curDir, dir, curP, renderer, scene)
          })
        }
      }
    }

  }
}