import * as THREE from "three";
//import GLTFLoader from 'three-gltf-loader-wtower';
import Stats from "three/examples/jsm/libs/stats.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {Nav,NavbarContainer,NavLogo,MobileIcon,NavMenu,NavItem,NavLinks,NavBtn,NavBtnLink} from './Navbarelements'
import Navbar from "./index";
//import GLTF2Loader from "three-gltf2-loader"
var dat = require("three/examples/jsm/libs/dat.gui.module");
//var sunGtfl = require("./model/sun/sun.gltf");

//var GLTFLoader = require('./js/GLTFLoader')

const SolarS = ({reload}) => {
  // Load 3D Scene
  var scene = new THREE.Scene();
  var scene2 = new THREE.Scene();
  var stats;
  var innerw, height;
  var stars = [];
  var guic,
    controlConfig = {
      freezState: false,
      revolveSpeed: 24,
    };
   reload=true;
  // For orbit
  var marker, spline;
  var matrix = new THREE.Matrix4();
  var up = new THREE.Vector3(0, 1, 0);
  var axis = new THREE.Vector3();

  // Planet Orbit Variable Declaration
  var mercpath,
    venpath,
    earthpath,
    moonpath,
    marspath,
    juppath,
    satpath,
    urapath,
    neppath;

  var planobj = [];
  var pathobj = [];
  // the getPoint starting variable - !important - You get me ;)
  var mt = 0,
    vet = 0,
    eat = 0,
    mat = 0,
    jupt = 0,
    satt = 0,
    urat = 0,
    nept = 0;
  // Ellipse class, which extends the virtual base class Curve
  function Ellipse(xRadius, yRadius) {
    THREE.Curve.call(this);
    // add radius as a property
    this.xRadius = xRadius;
    this.yRadius = yRadius;
  }

  Ellipse.prototype = Object.create(THREE.Curve.prototype);
  Ellipse.prototype.constructor = Ellipse;

  // define the getPoint function for the subClass
  Ellipse.prototype.getPoint = function (t) {
    var radians = 2 * Math.PI * t;

    return new THREE.Vector3(
      this.xRadius * Math.cos(radians),
      0,
      this.yRadius * Math.sin(radians)
    );
  };

  // Load Camera Perspective
  var camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(10, 30, 100);

  // RayCaster
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  // Load a Renderer
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  innerw = window.innerWidth;
  height = window.innerHeight;
  document.body.appendChild(renderer.domElement);

  // Load the Orbitcontroller
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 500;
  // Load Light
  var ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 1, 1).normalize();
  scene.add(directionalLight);

  // Stars
  function addSphere() {
    // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position.
    for (var z = -1000; z < 1000; z += 20) {
      // Make a sphere (exactly the same as before).
      var geometry = new THREE.SphereGeometry(0.5, 32, 32);
      var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var sphere = new THREE.Mesh(geometry, material);
      sphere.position.x = Math.random() * innerw - Math.random() * innerw * 2;
      sphere.position.y = Math.random() * height - Math.random() * height * 2;
      // Then set the z position to where it is in the loop (distance of camera)
      sphere.position.z = z;
      // scale it up a bit
      sphere.scale.x = sphere.scale.y = 1;
      //add the sphere to the scene
      scene.add(sphere);
      //finally push it to the stars array
      stars.push(sphere);
    }
  }
  function animateStars() {
    // loop through each star
    for (var i = 0; i < stars.length; i++) {
      var star = stars[i];
      // and move it forward dependent on the mouseY position.
      star.position.z += i / 10;
      // if the particle is too close move it to the back
      if (star.position.z > 2000) star.position.z -= 3000;
    }
  }

  // params
  var pathSegments = 128;
  var tubeRadius = 0.03;
  var radiusSegments = 3;
  var closed = true;

  // material
  var material = new THREE.MeshPhongMaterial({
    color: "white",
  });

  // mercury orbit mesh
  mercpath = new Ellipse(15, 10);
  var mercgeometry = new THREE.TubeBufferGeometry(
    mercpath,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );
  var mesh = new THREE.Mesh(mercgeometry, material);
  scene.add(mesh);
  pathobj.push(mesh);

  // venus orbit mesh
  venpath = new Ellipse(22, 15);
  var venusgeometry = new THREE.TubeBufferGeometry(
    venpath,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );
  mesh = new THREE.Mesh(venusgeometry, material);
  scene.add(mesh);
  pathobj.push(mesh);
  // Earth Orbit
  earthpath = new Ellipse(28, 22);
  var earthgeometry = new THREE.TubeBufferGeometry(
    earthpath,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );
  mesh = new THREE.Mesh(earthgeometry, material);
  scene.add(mesh);
  pathobj.push(mesh);
  // Moon
  moonpath = new Ellipse(5, 3);
  var moongeometry = new THREE.TubeBufferGeometry(
    moonpath,
    pathSegments,
    0.0001,
    radiusSegments,
    closed
  );
  mesh = new THREE.Mesh(moongeometry, material);
  scene.add(mesh);
  pathobj.push(mesh);
  // Mars Orbit
  marspath = new Ellipse(35, 28);
  var marsgeometry = new THREE.TubeBufferGeometry(
    marspath,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );
  mesh = new THREE.Mesh(marsgeometry, material);
  scene.add(mesh);
  pathobj.push(mesh);
  // Jupiter Orbit
  juppath = new Ellipse(46, 34);
  var jupgeometry = new THREE.TubeBufferGeometry(
    juppath,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );
  mesh = new THREE.Mesh(jupgeometry, material);
  scene.add(mesh);
  pathobj.push(mesh);
  // Saturn Orbit
  satpath = new Ellipse(57, 42);
  var satgeometry = new THREE.TubeBufferGeometry(
    satpath,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );
  mesh = new THREE.Mesh(satgeometry, material);
  scene.add(mesh);
  pathobj.push(mesh);
  // Uranus Orbit
  urapath = new Ellipse(69, 49);
  var urageometry = new THREE.TubeBufferGeometry(
    urapath,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );
  mesh = new THREE.Mesh(urageometry, material);
  scene.add(mesh);
  pathobj.push(mesh);
  // Neptune Orbit
  neppath = new Ellipse(79, 59);
  var nepgeometry = new THREE.TubeBufferGeometry(
    neppath,
    pathSegments,
    tubeRadius,
    radiusSegments,
    closed
  );
  mesh = new THREE.Mesh(nepgeometry, material);
  scene.add(mesh);
  pathobj.push(mesh);
  // glTf 2.0 Loader
  
   
    
        const loader = new GLTFLoader();
    
  // Planets variables;
  var sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune;

  var moonorbit;

  loader.load("model/sun/sun.gltf", function (gltf) {
    //   <<--------- Model Path
    console.log(gltf);
    sun = gltf.scene;
    gltf.scene.scale.set(18, 18, 18);
    gltf.scene.position.x = 0; //Position (x = right+ left-)
    gltf.scene.position.y = -2; //Position (y = up+, down-)
    gltf.scene.position.z = -3; //Position (z = front +, back-)
    //gltf.animations;
    scene.add(gltf.scene);
    planobj.push(sun);
  });

  loader.load("model/mercury/mercury.gltf", function (gltf) {
    //   <<--------- Model Path
    mercury = gltf.scene;
    gltf.scene.scale.set(2, 2, 2);
    var pt = mercpath.getPoint(mt);
    gltf.scene.position.set(pt.x, pt.y, pt.z);
    scene.add(gltf.scene);
    console.log("lets c if this works");
    planobj.push(mercury);
  });

  loader.load("model/venus/venus.gltf", function (gltf) {
    //   <<--------- Model Path
    venus = gltf.scene;
    gltf.scene.scale.set(2, 2, 2);
    var pt = venpath.getPoint(vet);
    gltf.scene.position.set(pt.x, pt.y, pt.z);
    scene.add(gltf.scene);
    planobj.push(venus);
  });

  loader.load("model/earth/earth.gltf", function (gltf) {
    //   <<--------- Model Path
    earth = gltf.scene;
    gltf.scene.scale.set(2, 2, 2);
    var pt = earthpath.getPoint(eat);
    moonorbit = earthpath.getPoint(eat);
    gltf.scene.position.set(pt.x, pt.y, pt.z);
    scene.add(gltf.scene);
    planobj.push(earth);
  });

  /*loader.load( 'model/moon/moon.gltf', function ( gltf ) {           //   <<--------- Model Path
	moon = gltf.scene;			
	gltf.scene.scale.set( 1, 1, 1 );			   
	//var pt = moonpath.getPoint( eat );
	gltf.scene.position.set(moonorbit.x+2,moonorbit.y+2,moonorbit.z);
	scene.add( gltf.scene);
	});
	*/
  loader.load("model/mars/mars.gltf", function (gltf) {
    //   <<--------- Model Path
    mars = gltf.scene;
    gltf.scene.scale.set(2, 2, 2);
    var pt = marspath.getPoint(mat);
    gltf.scene.position.set(pt.x, pt.y, pt.z);
    scene.add(gltf.scene);
    planobj.push(mars);
  });

  loader.load("model/jupiter/jupiter.gltf", function (gltf) {
    //   <<--------- Model Path
    jupiter = gltf.scene;
    gltf.scene.scale.set(8, 8, 8);
    var pt = juppath.getPoint(jupt);
    gltf.scene.position.set(pt.x, pt.y, pt.z);
    scene.add(gltf.scene);
    planobj.push(jupiter);
  });

  loader.load("model/saturn/saturn.gltf", function (gltf) {
    //   <<--------- Model Path
    saturn = gltf.scene;
    gltf.scene.scale.set(7, 7, 7);
    var pt = satpath.getPoint(satt);
    gltf.scene.position.set(pt.x, pt.y, pt.z);
    scene.add(gltf.scene);
    planobj.push(saturn);
  });

  loader.load("model/uranus/uranus.gltf", function (gltf) {
    //   <<--------- Model Path
    uranus = gltf.scene;
    gltf.scene.scale.set(3, 3, 3);
    var pt = urapath.getPoint(urat);
    gltf.scene.position.set(pt.x, pt.y, pt.z);
    scene.add(gltf.scene);
    planobj.push(uranus);
  });

  loader.load("model/neptune/neptune.gltf", function (gltf) {
    //   <<--------- Model Path
    neptune = gltf.scene;
    gltf.scene.scale.set(3, 3, 3);
    var pt = neppath.getPoint(nept);
    gltf.scene.position.set(pt.x, pt.y, pt.z);
    scene.add(gltf.scene);
    planobj.push(neptune);
  });

  // FPS stats
  stats = new Stats();
  //document.body.appendChild(stats.dom);
  window.addEventListener("resize", onWindowResize, false);

  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );

  guic = new dat.GUI({ width: 350 });

  // Controls
  var controlGUI = guic.addFolder("Controls");
  //controlGUI.add(controlConfig.freezState,'Freeze State').listen();

  controlGUI.add(controlConfig, "freezState");

  controlGUI.add(controlConfig, "revolveSpeed", 1, 24).onChange(function () {
    //sunLight.shadow.camera.near = shadowConfig.shadowCameraNear;
    //sunLight.shadow.camera.updateProjectionMatrix();
    //shadowCameraHelper.update();
  });

  function onWindowResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //controls.handleResize();
  }

  function onDocumentTouchStart(event) {
    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);
  }

  function onDocumentMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(pathobj);

    if (intersects.length > 0) {
      var pt = intersects[0].getPoint(mt);
    }
  }
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //if (!guic.freezState) return;
    animateStars();
    // TO freeze Planet State

    if (!controlConfig.freezState) revolvePlanet();
    console.log(controlConfig.revolveSpeed);
    //stats.update();
  }

  function revolvePlanet() {
    if (mercury) {
      //mercury.rotation.y+=0.05;
      var pt = mercpath.getPoint(mt);
      var tangent = mercpath.getTangent(mt).normalize();
      mercury.position.set(pt.x, pt.y, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      mt = mt >= 1 ? 0 : (mt += 0.005 / controlConfig.revolveSpeed);
    }
    if (venus) {
      //venus.rotation.y+=0.04;
      var pt = venpath.getPoint(vet);
      var tangent = venpath.getTangent(vet).normalize();
      venus.position.set(pt.x, pt.y, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      vet = vet >= 1 ? 0 : (vet += 0.001 / controlConfig.revolveSpeed);
    }
    if (earth) {
      earth.rotation.y += 0.02;
      var pt = earthpath.getPoint(eat);
      var tangent = earthpath.getTangent(eat).normalize();
      earth.position.set(pt.x, pt.y, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      eat = eat >= 1 ? 0 : (eat += 0.0003 / controlConfig.revolveSpeed);
    }
    if (moon) {
      moon.rotation.y += 0.02;
      var pt = earthpath.getPoint(eat);
      var tangent = earthpath.getTangent(eat).normalize();
      moon.position.set(pt.x + 2, pt.y + 2, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      eat = eat >= 1 ? 0 : (eat += 0.0003 / controlConfig.revolveSpeed);
    }
    if (mars) {
      //mars.rotation.z+=0.02;
      var pt = marspath.getPoint(mat);
      var tangent = marspath.getTangent(mat);
      mars.position.set(pt.x, pt.y, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      mat = mat >= 1 ? 0 : (mat += 0.0001 / controlConfig.revolveSpeed);
    }
    if (jupiter) {
      jupiter.rotation.y += 0.004;
      var pt = juppath.getPoint(jupt);
      var tangent = juppath.getTangent(jupt).normalize();
      jupiter.position.set(pt.x, pt.y, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      jupt = jupt >= 1 ? 0 : (jupt += 0.00006 / controlConfig.revolveSpeed);
    }
    if (saturn) {
      saturn.rotation.y += 0.009;
      var pt = satpath.getPoint(satt);
      var tangent = satpath.getTangent(satt).normalize();
      saturn.position.set(pt.x, pt.y, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      satt = satt >= 1 ? 0 : (satt += 0.00003 / controlConfig.revolveSpeed);
    }
    if (uranus) {
      uranus.rotation.y += 0.0004;
      var pt = urapath.getPoint(urat);
      var tangent = urapath.getTangent(urat).normalize();
      uranus.position.set(pt.x, pt.y, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      urat = urat >= 1 ? 0 : (urat += 0.000009 / controlConfig.revolveSpeed);
    }
    if (neptune) {
      neptune.rotation.y += 0.0004;
      var pt = neppath.getPoint(nept);
      var tangent = neppath.getTangent(nept).normalize();
      neptune.position.set(pt.x, pt.y, pt.z);
      // calculate the axis to rotate around
      axis.crossVectors(up, tangent).normalize();
      // calcluate the angle between the up vector and the tangent
      var radians = Math.acos(up.dot(tangent));
      nept = nept >= 1 ? 0 : (nept += 0.0000059 / controlConfig.revolveSpeed);
    }
  }
  
  return (<>


  
  {(addSphere(), animate())}
  
  
  </>);
};

export default SolarS;

