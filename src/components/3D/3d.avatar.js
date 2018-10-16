const THREE =  require("three");
import React from "react";
import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

// var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);
MTLLoader(THREE);

import objAvatar from "../../ui/assets/obj/goku real4armature.obj";
import mtlAvatar from "../../ui/assets/mtl/goku real4armature.mtl";

class DemoScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scene: {}
    };
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    //ADD SCENE
    let scene = new THREE.Scene();

    //ADD CAMERA
    let camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.z = 4;

    var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    scene.add( ambientLight );

    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    camera.add( pointLight );

    //ADD RENDERER
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor('#000000');
    renderer.setSize(width, height);
    this.mount.appendChild(renderer.domElement);

    //LOAD OBJ & MTL
    // let mtlLoader = new THREE.MTLLoader();
    // let objLoader = new THREE.OBJLoader();

    let mtlLoader = new MTLLoader();
    let objLoader = new OBJLoader();


    var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    let mesh = new THREE.Mesh( geometry );
    scene.add( mesh );

    mtlLoader.load(mtlAvatar,
      (mtl) => {
        mtl.preload();
        objLoader.setMaterials(mtl);
        objLoader.load(objAvatar,
          (obj) => {
          scene.add(obj);
          }, function(xhr) {
          console.log('Obj:', (xhr.loaded / xhr.total * 100) + '% loaded' );
          }, function(err) {
          console.log(err);
        });
        }, function(xhr) {
        console.log('Mtl:', (xhr.loaded / xhr.total * 100) + '% loaded' );
      }, function(err) {
        console.log(err);
    });

    this.setState({camera, scene, renderer});
    this.start();
  }

  componentWillUnmount(){
    this.stop();
    this.mount.removeChild(this.state.renderer.domElement)
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId)
  };

  animate = () => {
    // this.avatar.rotation.x += 0.01;
    // this.avatar.rotation.y += 0.01;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    const {camera, scene, renderer} = this.state;
    if(camera && scene && renderer){
      camera.lookAt( scene.position );
      renderer.render(scene, camera)
    }
  };


  render() {
    return (
      <div
        style={{ width: '400px', height: '400px' }}
        ref={(mount) => { this.mount = mount }}>
      </div>
    );
  }
}
export default DemoScene;
