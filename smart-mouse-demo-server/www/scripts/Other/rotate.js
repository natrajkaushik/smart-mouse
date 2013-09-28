var wd = window;
if (!wd.requestAnimationFrame) {
    wd.requestAnimationFrame =
        wd.webkitRequestAnimationFrame ||
        wd.mozRequestAnimationFrame    ||
        wd.oRequestAnimationFrame      ||
        wd.msRequestAnimationFrame     ||
        function(cb, element) {wd.setTimeout(cb, 1000 / 30);};
}

var ctnEl;
var camera, scene, renderer;
var cube, plane;

var tgtRot      = 0;
var tgtRotMouse = 0;

var mouseX      = 0;
var mouseXMouse = 0;

var winDims;
var winHalfW;

function init() {
    ctnEl = document.getElementById('ctn');
    winDims = [ctnEl.offsetWidth, ctnEl.offsetHeight];
    winHalfW = winDims[0] / 2;

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(70, winDims[0] / winDims[1], 1, 1000);
    camera.position.y = 150;
    camera.position.z = 500;
    camera.lookAt(new THREE.Vector3(0, 150, 0));   
    scene.add(camera);
    
    
    // cube mats and cube
    var mats = [];
    for (var i = 0; i < 6; i ++) {
        mats.push(new THREE.MeshBasicMaterial({color:Math.random()*0xffffff}));
    }
    
    cube = new THREE.Mesh(
        new THREE.CubeGeometry(100, 100, 100, 1, 1, 1, mats),
        new THREE.MeshFaceMaterial()
    );
    
    cube.castShadow = true;
    cube.matrixAutoUpdate = false;
    scene.add(cube);
    
    // plane
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000),
        new THREE.MeshLambertMaterial( {color: 0xe0e0e0} )
    );
    plane.receiveShadow = true;

    scene.add(plane);

    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 1500, 0 );
    
    spotLight.castShadow = true;
    
    spotLight.shadowMapWidth = 1024;
    spotLight.shadowMapHeight = 1024;
    
    spotLight.shadowCameraNear = 500;
    spotLight.shadowCameraFar = 4000;
    spotLight.shadowCameraFov = 30;
    
    scene.add( spotLight );
    

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMapEnabled = true;
    
    renderer.setSize(winDims[0], winDims[1]);
    ctnEl.appendChild(renderer.domElement);
}

function animate() {
    //requestAnimationFrame(animate);
    angle = 45 * Math.PI/180;
    render();
}
    
var y = 0, x = 0, angle = 40;
function render() {
  cube.updateMatrix();

  var updateMatrix = cube.matrix.clone();
  
  updateMatrix.rotateZ(angle);   
  updateMatrix.translate(new THREE.Vector3(0, 150, 0));
  
  cube.matrix.multiplySelf(updateMatrix);
    
  renderer.render(scene, camera);
    
  console.log(cube.matrix.getColumnX().clone());
  console.log(cube.matrix.getColumnY().clone());
  console.log(cube.matrix.getColumnZ().clone());
}


window.onload = function(){
    init();
    animate();

};