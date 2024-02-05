import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
var loader = new FontLoader();
var font = undefined;
let set = false


import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
const objLoader = new OBJLoader();
let stem = undefined;
let bud = undefined;


const settings = {fov: 60, aspect: 16/9, near: 1.0, far: 900.0, speed: 0.3};
const movs = {f: 0, b: 0, mr: 0, ml: 0, up: 0, down: 0, l: 0, r: 0}
const p = {x: -1, y: -1};
const raycaster = new THREE.Raycaster();
let uTime = new THREE.Uniform( 0 )
class InfoBox{
    constructor(){
      
      this.addText("hello");
      this.chngTxt = this.addText
      this.textObj.position.set(0, -10, 0);
      
      this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 5, 10, 10),
        new THREE.MeshPhongMaterial({
          color: 0xff99cc,
          opacity: 0.3,
          transparent: true,
        }));
      this.plane.position.set(0, -10, 0);
      this.offsx = 0
      this.offsy = 0
    }

    addText(txt){
      // console.log(font)
      let textGeo = new TextGeometry( txt, {
  
        font: font,
        size: 0.5,
        height: 0.3,
        curveSegments: 12,
    
        bevelThickness: 0,
        bevelSize: 0,
        bevelEnabled: false
  
      } );
      textGeo.computeBoundingBox();
    
      let textMaterial = new THREE.MeshPhongMaterial( { color: 0xD6EEFC});
    
      this.offsx =  0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
      this.offsy =  0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );
      // console.log(this.offsy)
      this.textObj =  new THREE.Mesh( textGeo, textMaterial);
      // this.textObj.position.x -=

      // this.textObj

    }

}


const _VS = `
    
    ${THREE.ShaderChunk.common}
    ${THREE.ShaderChunk.batching_pars_vertex}
    ${THREE.ShaderChunk.uv_pars_vertex}
    ${THREE.ShaderChunk.displacementmap_pars_vertex}

    ${THREE.ShaderChunk.envmap_pars_vertex}
    ${THREE.ShaderChunk.color_pars_vertex}
    ${THREE.ShaderChunk.fog_pars_vertex}
    ${THREE.ShaderChunk.normal_pars_vertex}
    ${THREE.ShaderChunk.morphtarget_pars_vertex}

    ${THREE.ShaderChunk.skinning_pars_vertex}
    ${THREE.ShaderChunk.shadowmap_pars_vertex}
    ${THREE.ShaderChunk.clipping_planes_pars_vertex}
    ${THREE.ShaderChunk.logdepthbuf_pars_vertex}


    varying vec3 vViewPosition;
    uniform float uTime;
    uniform float xOffset;
    uniform float yOffset;
    uniform float zOffset;
    vec4 tmp;
    void main( void ) {
      ${THREE.ShaderChunk.uv_vertex}
      ${THREE.ShaderChunk.color_vertex}
      ${THREE.ShaderChunk.morphcolor_vertex}
      ${THREE.ShaderChunk.batching_vertex}
      ${THREE.ShaderChunk.beginnormal_vertex}
      ${THREE.ShaderChunk.morphnormal_vertex}
      ${THREE.ShaderChunk.skinbase_vertex}
      ${THREE.ShaderChunk.skinnormal_vertex}
      ${THREE.ShaderChunk.defaultnormal_vertex}
      ${THREE.ShaderChunk.normal_vertex}
      ${THREE.ShaderChunk.begin_vertex}
      ${THREE.ShaderChunk.morphtarget_vertex}
      ${THREE.ShaderChunk.skinning_vertex}
      ${THREE.ShaderChunk.displacementmap_vertex}
      ${THREE.ShaderChunk.project_vertex}
      ${THREE.ShaderChunk.logdepthbuf_vertex}
      ${THREE.ShaderChunk.clipping_planes_vertex}
      vViewPosition = - mvPosition.xyz;
      tmp.x = 1.0;
      tmp.y = 0.0;
      tmp.z = 0.0;
      tmp.w = 1.0;
      tmp = projectionMatrix * modelViewMatrix * tmp;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(xOffset, yOffset, zOffset),1.0);
      gl_Position.x +=  position.y * 0.2 * (exp(sin (uTime + 1.2*tmp.x/tmp.w ))-1.0) ;
      ${THREE.ShaderChunk.worldpos_vertex}
      ${THREE.ShaderChunk.envmap_vertex}
      ${THREE.ShaderChunk.shadowmap_vertex}
      ${THREE.ShaderChunk.fog_vertex}
      
     
      
       
    }
`;


class Tulip{
  constructor(col, x, z, rot, txt){
    this.phongShader = THREE.ShaderLib.phong;
    this.uniforms = THREE.UniformsUtils.clone(this.phongShader.uniforms);
    this.uniforms.diffuse.value = new THREE.Color( 0x9BCCB5 );
    this.uniforms.uTime = uTime;
   
    
    this.material_stem = new THREE.ShaderMaterial({
      
      uniforms: this.uniforms,
      vertexShader: _VS,
      fragmentShader: this.phongShader.fragmentShader,
      lights:true,
      fog: true,
      
    });
    // console.log(this.material_stem)
    this.uniforms2 = THREE.UniformsUtils.clone(this.phongShader.uniforms);
    this.uniforms2.diffuse.value = new THREE.Color( col );
    this.uniforms2.uTime = uTime;
    this.material_stem.uniformsNeedUpdate = true
    this.material_bud = new THREE.ShaderMaterial({
      uniforms: this.uniforms2,
      vertexShader: _VS,
      fragmentShader: this.phongShader.fragmentShader,
      lights:true,
      fog: true,
      
    
      
    });
    this.stem = stem.clone()
    this.bud = bud.clone()

    for(const chld in this.stem.children){
          
      this.stem.children[chld].material = this.material_stem
      this.stem.children[chld].castShadow = true
      
      this.stem.children[chld].userData.txt = txt
    }

    for(const chld in this.bud.children){
          
      this.bud.children[chld].material = this.material_bud
      this.bud.children[chld].castShadow = true
      this.bud.children[chld].userData.txt = txt
    }
    
    this.txt = txt;
    this.stem.position.set(x,0,z);
    
    this.bud.position.set(x,0,z);
    this.stem.rotation.y = rot;
    this.bud.rotation.y = rot;
    this.x = x;
    this.z = z;
  }

  getStem(){
    return this.stem;
  }
  getBud(){
    return this.bud;
  }
}
class Map{
  constructor(scene){
    this.objs = [];
    this.scene = scene;
  }
  addTulip(x, z, rot, txt, col){
    if(txt.length > 12){
      let splt = txt.split(" ")
      txt = "";
      let curr = 0;
      for(let i = 0; i < splt.length; i++){
        if(curr == 0){
          txt += splt[i];
          curr+=splt[i].length
          continue;
        }
        if(curr+splt[i].length > 12){
          txt+="\n"
          curr = splt[i].length;
          txt+= splt[i];
        }else{
          curr += splt[i].length;
          txt+=" ";
          txt+= splt[i];
          
        }
      }
    }
    let tmp = new Tulip(col, x, z, rot, txt)
    // console.log("tulip at", x, z)
    this.objs.push(tmp)
    this.scene.add(tmp.getBud())
    this.scene.add(tmp.getStem())
  }
  update(x, z){
   
    for(let i = 0; i < this.objs.length; i++){
      let tmp = this.objs[i];
      console.log(Math.abs(x - tmp.x) , Math.abs(z - tmp.z), tmp.x)
      if(Math.abs(x - tmp.x) > 90 || Math.abs(z - tmp.z) > 90){
        // console.log("remove", x, z, tmp.x, tmp.z)
        this.scene.remove(tmp.getStem());
        this.scene.remove(tmp.getBud());
        this.objs.splice(i, 1);
        i--;
      }
    }
    
  }

  add_x(x, y, chng){
    x = x + 4*chng;
    for(let i = -4; i < 5; i++){
      let ret =  getFromDict(x,y + i);
      this.addTulip(x*20 + ret.x, (y+i)*20 + ret.y,ret.rot, ret.txt,ret.col);
    }
  }

  add_y(x, y, chng){
    y = y + 4*chng;
    for(let i = -4; i < 5; i++){
      let ret =  getFromDict(x + i,y);
      this.addTulip((x + i)*20 + ret.x, y*20 + ret.y,ret.rot, ret.txt,ret.col);
    }
  }

}

class World {
  constructor(settings) {
    this.scene_lights = {};
    this.counts = 0;
    this.v_counts = 0;
    this.objs = {};
    this.x_mod = 0;
    this.z_mod = 0;
    this.start_time = Date.now()
    this.init(settings);
  }
  
  
  addLight(col, int, x, y, z, anglx, angly, anglz, shadows){
    let light = new THREE.DirectionalLight(col, int);
    light.position.set(x, y, z);
    light.target.position.set(anglx, angly, anglz);
    light.castShadow = shadows;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this.scene.add(light);
    this.scene_lights[this.counts] = light;
    this.counts += 1;
  }


  init(settings) {
    this.threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.threejs.shadowMap.enabled = true;
    this.threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this.threejs.setPixelRatio(window.devicePixelRatio);
    console.log(document.getElementById("wrap").offsetWidth)
    this.threejs.setSize(document.getElementById("wrap").offsetWidth , document.getElementById("wrap").offsetHeight);
    document.getElementById("wrap").appendChild(this.threejs.domElement);
    this.threejs.domElement.addEventListener( 'click', (e) => {
      set = true
      let rect = this.threejs.domElement.getBoundingClientRect();
      // console.log(e.x, e.y)
      if(e.y < rect.top || e.x < rect.left || e.y > rect.bottom || e.x > rect.right) return;
      p.x = ((e.x - rect.left)/ (rect.right - rect.left) ) * 2 - 1;
      p.y = -((e.y - rect.top)/(rect.bottom - rect.top)) * 2 + 1;
      
    } );

    
    this.cam = new THREE.PerspectiveCamera(settings.fov, document.getElementById("wrap").offsetWidth/(document.getElementById("wrap").offsetHeight), settings.near, settings.far);
    this.cam.position.set(0, 8, 0);

    this.scene = new THREE.Scene();
    this.addLight(0xFFFFFF, 0.3, 0, 100, 0, 0, 0, 0, true)
    this.addLight(0xFFFFFF, 0.3, 50, 100, 0, 0, 0, 0, true)
    this.addLight(0xFFFFFF, 0.3, 0, 100, 50, 0, 0, 0, true)
    // this.addLight(0xFFFFFF, 0.3, -50, 100, 50, 0, 0, 0, true)
    // this.addLight(0xFFFFFF, 0.3, -50, 100, -50, 0, 0, 0, true)
    // this.addLight(0xFFFFFF, 0.3, 50, 100, -50, 0, 0, 0, true)
    this.addLight(0xFFFFFF, 0.3, -50, 100, 0, 0, 0, 0, true)
    this.addLight(0xFFFFFF, 0.3, 0, 100, -50, 0, 0, 0, true)
    // this.addLight(0xFFFFFF, 0.3, 50, 100, 50, 0, 0, 0, true)
    let light = new THREE.AmbientLight(0x151515);
    this.scene.add(light);

    // let controls = new OrbitControls(
    //   this.cam, this.threejs.domElement);
    
    this.scene.background = new THREE.Color( 0xff99cc );
    // controls.target.set(0, 20, 0);
    // controls.update();
    // this.controls = controls;
    this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(360, 360, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x77DD76,
          }));
    this.plane.castShadow = false;
    this.plane.receiveShadow = true;
    this.plane.rotation.x = -Math.PI / 2;
    this.scene.add(this.plane);
    this.scene.fog = new THREE.FogExp2( 0xff99cc, 0.02 );
    
    
    const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    const skybox = new THREE.Mesh(skyboxGeo);
    this.scene.add(skybox);
    
    
    this.up = new THREE.Vector3(0,1,0);
    this.right = new THREE.Vector3(1,0,0);
    
    window.onkeydown = (event) => {
        
        if(event.key == "w"){
            movs.f = 1
        }
        else if(event.key == "s"){
            movs.b = 1;
        }else if(event.key == "i"){
          movs.up = 1;
        }else if(event.key == "a"){
            movs.ml = 1;
        }else if(event.key == "d"){
          movs.mr = 1;
        }else if(event.key == "k"){
            movs.down = 1;
        }else if(event.key == "j" || event.key == "q"){
            movs.l = 1;
        }else if(event.key == "l" || event.key == "e"){
            movs.r = 1;
        }
    }
    window.onkeyup = (event) => {
        if(event.key == "w"){
            movs.f = 0;
        }else if(event.key == "s"){
            movs.b = 0;
        }else if(event.key == "a"){
          movs.ml = 0;
        }else if(event.key == "d"){
          movs.mr = 0;
        }else if(event.key == "i"){
            movs.up = 0;
        }else if(event.key == "k"){
            movs.down = 0;
        }else if(event.key == "j" || event.key == "q"){
            movs.l = 0;
        }else if(event.key == "l" || event.key == "e"){
            movs.r = 0;
        }
    }
    this.boxinfo = new InfoBox();
    this.scene.add(this.boxinfo.textObj);
    this.scene.add(this.boxinfo.plane)
    this.map = new Map(this.scene);
    for(let y = -4; y < 5; y ++){
      for(let x = -4; x < 5; x++){
        this.map.addTulip(x*20 + getFromDict(x,y).x, y*20 + getFromDict(x,y).y,getFromDict(x,y).rot, getFromDict(x,y).txt, getFromDict(x,y).col);
      }
    }
    // var tlp = new Tulip(0xFFFFFF, 0, 0, 0, "Hi");
    // this.scene.add(tlp.getBud())
    // this.scene.add(tlp.getStem())
    this.render();
  }

  euclidDist(v1, v2){
    return (v1.x - v2.x)**2 + (v1.z - v2.z)**2
  }
  render() {
    requestAnimationFrame(() => {
      // if(Date.now() - this.start_time < 10000){

      // }
      let prev_x = this.x_mod;
      let prev_z = this.z_mod;
      
      uTime.value = (Date.now()/400) % 3000;
      this.threejs.render(this.scene, this.cam);
      
      this.cam.position.addScaledVector(new THREE.Vector3(0,1,0).cross(this.right), movs.f*settings.speed - movs.b*settings.speed);
      
      this.cam.position.addScaledVector(this.right, movs.mr*settings.speed - movs.ml*settings.speed);
      this.x_mod = Math.floor(this.cam.position.x / 20);
      this.z_mod = Math.floor(this.cam.position.z / 20);
      console.log(prev_x, this.x_mod, prev_z, this.z_mod)
      if(this.z_mod != prev_z && this.x_mod != prev_x){
        this.map.update( this.cam.position.x, this.cam.position.z);
        this.map.add_x(this.x_mod, this.z_mod, this.x_mod - prev_x);
        this.map.add_y(this.x_mod, this.z_mod, this.z_mod - prev_z);
      }else if(this.z_mod != prev_z){
        this.map.update( this.cam.position.x, this.cam.position.z);
        this.map.add_y(this.x_mod, this.z_mod, this.z_mod - prev_z);
      }else if(this.x_mod != prev_x){
        this.map.update( this.cam.position.x, this.cam.position.z);
        this.map.add_x(this.x_mod, this.z_mod, this.x_mod - prev_x);
      }
      for(const l in this.scene_lights.dictionary){
        l.position.addScaledVector(this.right, movs.mr*settings.speed - movs.ml*settings.speed);
        l.position.addScaledVector(new THREE.Vector3(0,1,0).cross(this.right), movs.f*settings.speed - movs.b*settings.speed);
      }
      this.plane.position.addScaledVector(this.right, movs.mr*settings.speed - movs.ml*settings.speed);
      this.plane.position.addScaledVector(new THREE.Vector3(0,1,0).cross(this.right), movs.f*settings.speed - movs.b*settings.speed);
      var qm = new THREE.Quaternion();
    
      qm.setFromAxisAngle ( new THREE.Vector3(0,1,0),(movs.l - movs.r) *0.03 );

      this.cam.applyQuaternion(qm);
      this.up.applyQuaternion(qm)
      this.right.applyQuaternion(qm);

      qm.setFromAxisAngle ( this.right,(movs.up - movs.down) *0.03 );
      this.cam.applyQuaternion(qm);
      this.up.applyQuaternion(qm)
      this.right.applyQuaternion(qm);
      if(set){
        set = false;
        console.log("going")
        raycaster.setFromCamera( p, this.cam );
        const intersects = raycaster.intersectObjects( this.scene.children );
        console.log("gone")
        if(intersects.length>0){
          
          if(intersects[0].object != this.plane && intersects[ 0 ].object.userData.txt != undefined){
            
            this.boxinfo.textObj.remove(this.boxinfo.plane)
            this.scene.remove(this.boxinfo.textObj)
            
            this.boxinfo.addText(intersects[ 0 ].object.userData.txt)
            this.boxinfo.textObj.position.set(intersects[ 0 ].object.getWorldPosition(new THREE.Vector3).x - this.boxinfo.offsx, intersects[ 0 ].object.getWorldPosition(new THREE.Vector3).y+7  +this.boxinfo.offsy, intersects[ 0 ].object.getWorldPosition(new THREE.Vector3).z);
            this.boxinfo.plane.position.set(intersects[ 0 ].object.getWorldPosition(new THREE.Vector3).x, intersects[ 0 ].object.getWorldPosition(new THREE.Vector3).y+7, intersects[ 0 ].object.getWorldPosition(new THREE.Vector3).z);
            this.boxinfo.textObj.attach(this.boxinfo.plane)
            this.scene.add(this.boxinfo.textObj);
          }
        }
      }
      
      
      
      
      this.boxinfo.textObj.rotation.y = Math.atan2( ( this.cam.position.x - this.boxinfo.offsx - this.boxinfo.textObj.position.x ), (  this.cam.position.z - this.boxinfo.textObj.position.z ) );
      
      this.render();
    });
  }
}


let _APP = null;


window.addEventListener('DOMContentLoaded', () => {
  loader.load('blobs/font.json', (f) => {
    objLoader.load('blobs/bud.obj', (budl) => {
      font = f
      bud = budl
      // let material_bud = new THREE.MeshPhongMaterial({
      //   color: 0x0000FF,    
      //   flatShading: true,
      // });

      
      
      
     
      objLoader.load('blobs/stem.obj', (steml) => {
        
        stem = steml
        stem.scale.multiplyScalar(5)
        bud.scale.multiplyScalar(5)
        
        _APP = new World(settings);
      });
      
    });
    
  })
  
});