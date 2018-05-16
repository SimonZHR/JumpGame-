import * as THREE from '../libs/three.min'

const screenHeight = window.innerHeight
const screenWidth = window.innerWidth

const size = {
  x: 0.7,
  y: 1,
  z: 0.7
}

export default class Player {
	constructor(color) {
    this.x = size.x
    this.y = size.y
    this.z = size.z
    this.color = color
    this.cube = this.createCube()

    this.fell = false
    this.ready = false  //does finger release
    this.xSpeed = -0.36
    this.ySpeed = 0
    this.nextDir = "front"
    this.distance = 0 //distance to the next block
	}

  createCube () {
    var material = new THREE.MeshLambertMaterial({ color: this.color })
    var geometry = new THREE.BoxGeometry(this.x, this.y, this.z)
    geometry.translate(0, 1, 0)
    var cube = new THREE.Mesh(geometry, material)
    //jumper.position.y = 1
    return cube
  }

  rotateZ(state) {
    var that = this
    if (state == "fell8") {
      if (this.cube.rotation.z > -1.57) {
        this.cube.rotation.z -= 0.025
      }
    } else {
      if (this.cube.rotation.z < 1.57) {
        this.cube.rotation.z += 0.025
      }
    }
    //renderer.render(scene, camera)
    window.requestAnimationFrame(function () {
      if (!that.fell) {
        that.rotateZ(state)
      }
    })
  }

  rotateX(state) {
    var that = this
    if (state == "fell3") {
      if (this.cube.rotation.x > -1.57) {
        this.cube.rotation.x += 0.025
      }
    } else {
      if (this.cube.rotation.x < 1.57) {
        this.cube.rotation.x -= 0.025
      }
    }
    //renderer.render(scene, camera)
    window.requestAnimationFrame(function () {
      if (!that.fell) {
        that.rotateX(state)
      }
    })
  }

  fall() {
    var that = this
    if (this.cube.position.y > -1) {
      this.cube.translateY(-0.05)
    }
    window.requestAnimationFrame(function () {
      if (!that.fell) {
        that.fall()
      }
    })
  }
}