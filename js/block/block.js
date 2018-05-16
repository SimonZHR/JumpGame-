import * as THREE from '../libs/three.min'

export default class Block {
  constructor () {
    this.x = 3
    this.y = 0.7
    this.z = 3
    this.color = 0xbebebe
  }

  createBlock (px, py, pz) {
    //var textureLoader = new THREE.TextureLoader()
    //var material1 = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('http://wow.techbrood.com/uploads/1702/crate.jpg') })
    var texture = new THREE.TextureLoader().load('http://wow.techbrood.com/uploads/1702/crate.jpg')
    var material1 = new THREE.MeshLambertMaterial({
      map: texture
    })
    var x = (Math.random() + 0.5) * 2
    var z = x
    var y = Math.random() * 3
    var material = new THREE.MeshLambertMaterial({ color: this.color })
    var geometry = new THREE.CubeGeometry(x, 1, z)
    var block = new THREE.Mesh(geometry, material1)
    //block.castShadow = true
    block.position.x = px
    block.position.y = py
    block.position.z = pz
    return block
  }
}

//import './js/libs/weapp-adapter'
//import * as THREE from './js/libs/three'

//weapp-adapter 会提供全局 canvas
//let canvas = document.querySelector('canvas');
//if (!canvas) {
//	canvas = wx.createCanvas()
//}

/*const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
scene.add(cube)
camera.position.z = 5

function render() {
  cube.rotation.x += 0.05
  cube.rotation.y += 0.05
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}

render()*/