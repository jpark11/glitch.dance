if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, controls;
var camera, scene, renderer, light;
var clock = new THREE.Clock();
var mixers = [];

var progress;

init();

function init() {
    container = document.getElementById('container');
    document.body.appendChild(container);

    progress = document.getElementById("progress-bar");

    camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 6000);
    scene = new THREE.Scene();

    // grid
    var gridHelper = new THREE.GridHelper(28, 28, 0x303030, 0x303030);
    gridHelper.position.set(0, -0.04, 0);
    scene.add(gridHelper);

    // model
    var manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
        //console.log(item, loaded, total);
    };

    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //change this to print on screen...
            // console.log(Math.round(percentComplete, 2) + '% downloaded');
            progress.innerHTML = "Loading... " + Math.round(percentComplete, 2) + '%';
            if (percentComplete > 99) {
                progress.style.display = "none";
            }
        }
    };

    var onError = function(xhr) {
        console.error(xhr);
    };

    var loader = new THREE.FBXLoader(manager);
    loader.load('../models/lorena.fbx', function(object) {
        object.mixer = new THREE.AnimationMixer(object);
        mixers.push(object.mixer);
        var action = object.mixer.clipAction(object.animations[0]);
        action.play();
        scene.add(object);
    }, onProgress, onError);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // controls, camera
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(-2, 0, 0);
    camera.position.set(10, 5, 10); //15 15 20
    controls.update();

    window.addEventListener('resize', onWindowResize, false);

    light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 1, 0);
    scene.add(light);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//
function animate() {
    requestAnimationFrame(animate);
    if (mixers.length > 0) {
        for (var i = 0; i < mixers.length; i++) {
            mixers[i].update(clock.getDelta());
        }
    }
    render();
}

function render() {
    renderer.render(scene, camera);
}