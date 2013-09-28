window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function animate(lastTime, angularSpeed, three){
    // update
    var date = new Date();
    var time = date.getTime();
    var timeDiff = time - lastTime;
    var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
    //three.cube.rotation.y += angleChange;
    //three.cube.rotation.x += angleChange;
    three.cube.rotation.z += angleChange;
    //three.cube.scale.x += angleChange;
    lastTime = time;
                
    // render
    three.renderer.render(three.scene, three.camera);
                
    // request new frame
    requestAnimFrame(function(){
        animate(lastTime, angularSpeed, three);
    });
}
            
window.onload = function(){
    var angularSpeed = 0.2; // revolutions per second
    var lastTime = 0;
                
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
                
    // camera
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 700;
                
    // scene
    var scene = new THREE.Scene();
                
    // cube
    var colors = [0x0000ff, 0x00ff00, 0x00ffff, 0xff0000, 0xff00ff, 0xffff00];
    var materials = [];
                
    for (var n = 0; n < 6; n++) {
        materials.push([new THREE.MeshBasicMaterial({
            color: colors[n]
        })]);
    }
                
    var cube = new THREE.Mesh(new THREE.CubeGeometry(300, 300, 300, 1, 1, 1, materials), new THREE.MeshFaceMaterial());
    cube.overdraw = true;
    scene.add(cube);
                
    // create wrapper object that contains three.js objects
    var three = {
        renderer: renderer,
        camera: camera,
        scene: scene,
        cube: cube
    };
                
    animate(lastTime, angularSpeed, three);
};
