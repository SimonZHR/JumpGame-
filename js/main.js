import * as THREE from './libs/three.min'
import Player from './player/player'
import Block from './block/block'
import TouchInfo from './player/touchInfo'
import Camera from './camera/camera.js'
import './libs/weapp-adapter'

let ctx = canvas.getContext('webgl')

const screenHeight = window.innerHeight
const screenWidth = window.innerWidth

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, preserveDrawingBuffer: true })

const backgroundColor = 0xEEE685
const lightColor = 0xffffff

const blockFactory = new Block()
var blocksPos = []

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.init()
  }

  setLight() {
    this.directionalLight.position.set(0, 15, 10)
    this.scene.add(this.directionalLight)
    this.scene.add(this.light)
  }

  setRenderer() {
    renderer.setSize(screenWidth, screenHeight)
    renderer.setClearColor(backgroundColor)
  }

  render() {
    renderer.render(this.scene, this.camera.camera)
  }

  init() {
    /* 
    * The whole game includes a scene, a camera, a renderer 
    *
    *
    */
    var that = this

    this.scene = new THREE.Scene()
    this.camera = new Camera()
    this.directionalLight = new THREE.DirectionalLight(lightColor, 0.28)
    this.light = new THREE.AmbientLight(lightColor, 0.8)

    this.setLight()

    this.player = new Player(0xC1FFC1)
    this.touchInfo = new TouchInfo()

    blocksPos = []

    var block1 = blockFactory.createBlock(0, 0, 0)
    this.curBlock = block1
    this.scene.add(block1)
    blocksPos.push(block1.position)
    var block2 = blockFactory.createBlock(0, 0, -5)
    this.nextBlock = block2
    this.scene.add(block2)
    blocksPos.push(block2.position)
    this.curDir = "front"

    this.jumper = this.player.cube //the cube of the jumper 
    this.scene.add(this.jumper)

    //this.showScore()

    this.move()
    this.isOver = false
    this.score = 0
    that.setRenderer()
    //that.render()
    setTimeout(function () {             //delay rendering
      that.render()
    }, 700)
  }

  press() {
    var that = this
    //console.log(that.jumper.scale)
    if(that.touchInfo.touched == true) {
      if (that.jumper.scale.y > 0.75) {
        that.jumper.scale.y -= 0.005
        that.jumper.scale.x += 0.005
        that.jumper.scale.z += 0.005
      }
      if (that.curBlock.scale.y > 0.85) {
        that.curBlock.scale.y -= 0.005
        //that.curBlock.scale.x += 0.005
        //that.curBlock.scale.z += 0.005
      }
      that.render()
      requestAnimationFrame(function () {
        that.press()
      })
    }
  }

  showScore() {
    var that = this
    if(this.text != null) {
      that.scene.remove(that.text)
    }
    this.text = null
    var loader = new THREE.FontLoader()
    var url = 'https://shinexiche.com/static/fonts/MR.json'
    loader.load(url, function(fon) {
      var geometry = new THREE.TextGeometry(that.score, {
        font: fon,
        size: 0.6,
        height: 0.05
      })
      var material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true })
      that.text = new THREE.Mesh(geometry, material)
      that.text.position.y = that.curBlock.position.y + 5
      that.text.position.z = that.curBlock.position.z
      that.text.position.x = that.curBlock.position.x
      that.text.rotation.y += Math.PI / 4 
      that.scene.add(that.text)
    })

  }

  createRedEnvelope() {
    var spriteMap = new THREE.TextureLoader().load('http://i1.bvimg.com/629739/fed9f14dc66df4ca.png')
    var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff })
    this.sprite = new THREE.Sprite(spriteMaterial)
    this.sprite.position.y = 2
    this.scene.add(this.sprite)
  }

  showRedEnvelope() {
    //绘制精灵，贴二维图片
    var that = this
    this.sprite.position.z = this.curBlock.position.z
    this.sprite.position.x = this.curBlock.position.x
    //sprite.scale.set(1, 2, 1)
    if(this.sprite.position.y < 2.5) {
      this.sprite.position.y += 0.008
    }
    this.render()
    requestAnimationFrame(function () {
      that.showRedEnvelope()
    })
  }

  restore() {
    var that = this
    if(that.touchInfo.touched == false) {
      if (that.jumper.scale.y < 1) {
        that.jumper.scale.y += 0.02
      }
      if (that.jumper.scale.x > 1) {
        that.jumper.scale.x -= 0.01
      }
      if (that.jumper.scale.z > 1) {
        that.jumper.scale.z -= 0.01
      }
      if (that.curBlock.scale.y < 1) {
        that.curBlock.scale.y += 0.01
      }
      that.render()
      requestAnimationFrame(function () {
        that.restore()
      })
    }
  }

  jump(dis) {
    var that = this
    //console.log(jumperPos)
    //console.log(this.speed)
    var destinationZ = this.player.cube.position.z - dis
    var destinationX = this.player.cube.position.x - dis
    if(this.jumper.position.y >= 0 ) {
      this.jumper.translateY(this.player.ySpeed)
      this.player.ySpeed -= 0.018
      if(that.player.nextDir == "front" && this.jumper.position.z > destinationZ) {
        this.jumper.translateZ(this.player.xSpeed)
        //this.jumper.rotation.x += 0.1
        //this.jumper.rotation.z += 0.1
      } else if (that.player.nextDir == "left" && this.jumper.position.x > destinationX){
        this.jumper.translateX(this.player.xSpeed)
      }
      that.render()
      requestAnimationFrame(function () {
        that.jump(dis)
      })
    } else {
      that.jumper.position.y = 0
      that.render()
      console.log(this.jumper.position)
      //console.log(blocksPos[1])
      if(!that.isOver) {
        var result = that.checkIsNext()
        if (result == "next") {
          let random = Math.random()
          let dir = random > 0.3 ? 'front' : 'left'
          let preP = blocksPos.shift()
          let curP = blocksPos[0]
          console.log(11)
          that.camera.updateCamera(that.curDir, dir, curP, renderer, that.scene)
          that.curDir = dir
          that.curBlock = that.nextBlock
          that.createNext(dir, curP)
          //let nextPos = blocksPos[1]
          that.score++
          //that.showScore()
          if(that.sprite) {
            that.scene.remove(that.sprite)
          }
          if(Math.random() > 0.5) {
            that.createRedEnvelope()
            that.showRedEnvelope()
          }
          setTimeout(function() {
            that.scene.remove(that.sprite)
          }, 1000)
          setTimeout(function () {
            let texture = new THREE.TextureLoader().load('http://i1.bvimg.com/629739/fed9f14dc66df4ca.png')
            that.curBlock.material.setValues({
              map: texture
            })
            that.render()
          }, 3000) 
          //console.log(that.score)
          //console.log(that.jumper.rotation)
        } else if (result != "this") {
          setTimeout(function () {
            that.isOver = true
            that.player.fell = true
            wx.showModal({
              title: '游戏结束',
              showCancel: false,
              confirmText: "重新开始",
              content: "分数： " + that.score.toString(),
              success: function (res) {
                if (res.confirm) {
                  setTimeout(function () {
                    that.init()
                  }, 1000)
                }
              }
            })
          }, 1000)
        }
      }
    }
  }

  checkIsNext() {
    var that = this
    var temp = this.jumper.position
    var state = ""
    if (this.player.nextDir == "front") {
      //console.log(that.curBlock)
      let curBlockDepth = that.curBlock.geometry.parameters.depth / 2
      let nextBlockDepth = that.nextBlock.geometry.parameters.depth / 2
      let plength = that.player.x / 2
      switch(true) {
        case temp.z >= blocksPos[0].z - curBlockDepth: 
          state = "this"
          break
        case temp.z < blocksPos[0].z - curBlockDepth && temp.z >= blocksPos[0].z - curBlockDepth - plength:
          state = "fell1"
          this.player.rotateX(state)
          break
        case temp.z < blocksPos[0].z - curBlockDepth - plength && temp.z >= blocksPos[1].z + nextBlockDepth + plength:
          state = "fell2"
          this.player.fall()
          break
        case temp.z < blocksPos[1].z + nextBlockDepth + plength && temp.z >= blocksPos[1].z + nextBlockDepth:
          state = "fell3"
          this.player.rotateX(state)
          break
        case temp.z < blocksPos[1].z + nextBlockDepth && temp.z >= blocksPos[1].z - nextBlockDepth:
          state = "next"
          break
        case temp.z < blocksPos[1].z - nextBlockDepth && temp.z >= blocksPos[1].z - nextBlockDepth - plength:
          state = "fell4"
          this.player.rotateX(state)
          break
        case temp.z < blocksPos[1].z - nextBlockDepth - plength:
          state = "fell5"
          this.player.fall()
          break
      }
    } else {
      let curBlockWidth = that.curBlock.geometry.parameters.width / 2
      let nextBlockWidth = that.nextBlock.geometry.parameters.width / 2
      let plength = that.player.x / 2
      switch (true) {
        case temp.x >= blocksPos[0].x - curBlockWidth:
          state = "this"
          break
        case temp.x < blocksPos[0].x - curBlockWidth && temp.x >= blocksPos[0].x - plength - curBlockWidth:
          state = "fell6"
          this.player.rotateZ(state)
          break
        case temp.x < blocksPos[0].x - plength - curBlockWidth && temp.x >= blocksPos[1].x + plength + nextBlockWidth:
          state = "fell7"
          this.player.fall()
          break
        case temp.x < blocksPos[1].x + plength + nextBlockWidth && temp.x >= blocksPos[1].x + nextBlockWidth:
          state = "fell8"
          this.player.rotateZ(state)
          break
        case temp.x < blocksPos[1].x + nextBlockWidth && temp.x >= blocksPos[1].x - nextBlockWidth:
          state = "next"
          break
        case temp.x < blocksPos[1].x - nextBlockWidth && temp.x >= blocksPos[1].x - plength - nextBlockWidth:
          state = "fell9"
          this.player.rotateZ(state)
          break
        case temp.x < blocksPos[1].x - plength - nextBlockWidth:
          state = "fell10"
          this.player.fall()
          break
      }
    }
    console.log(state)
    return state
  }

  move() {
    var that = this
    if(!that.isOver) {
      wx.onTouchStart(function (res) {
        that.touchInfo.start = new Date().getTime()
        that.touchInfo.touched = true
        //console.log(that.jumper.scale)
        that.press()
      })
      wx.onTouchEnd(function (res) {
        that.touchInfo.end = new Date().getTime()
        that.touchInfo.duration = that.touchInfo.end - that.touchInfo.start
        that.player.ySpeed = that.touchInfo.duration / 3000
        let distance = that.touchInfo.duration / 100
        console.log(that.player.ySpeed)
        that.touchInfo.touched = false
        that.restore()
        //that.jumper.position.y = 0

        that.jump(distance)
      })
    }
  }

  createDistance() {
    var ran = Math.random()
    //console.log(ran)
    var distance = 0
    //console.log(distance)
    if(0 <= ran && ran < 0.2) {
      distance = 3
    } else if(0.2 <= ran && ran < 0.4) {
      distance = 4
    } else if (0.4 <= ran && ran < 0.6) {
      distance = 5
    } else if (0.6 <= ran && ran < 0.8) {
      distance = 6
    } else {
      distance = 6
    }
    //console.log(distance)
    return distance
  }

  createNext(dir, curP) {
    var nextBlock
    var dis = this.createDistance()
    //console.log(dis)
    if(dir == 'front') {
      nextBlock = blockFactory.createBlock(curP.x, curP.y, curP.z-dis)
    } else {
      nextBlock = blockFactory.createBlock(curP.x-dis, curP.y, curP.z)
    }
    //console.log(nextBlock)
    this.nextBlock = nextBlock
    this.player.nextDir = dir
    this.scene.add(nextBlock)
    blocksPos.push(nextBlock.position)
    this.render()
  }
}
