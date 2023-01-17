import GameScene from "./scenes/GameScene";

// get the speeder index from the menu page
let parameters = new URLSearchParams(window.location.search);
let speederIndex = parseInt(parameters.get("speeder"));

// set up scene
let scene = new GameScene(speederIndex);

// keep track of time
let currentTime = 0;

// loops updates
function animate(timestamp?: number) {
    let dt = timestamp - currentTime;
    currentTime = timestamp;

    scene.camera.updateProjectionMatrix();
    scene.composer.render();

    if (scene.orbitals)
        scene.orbitals.update()

    scene.update(dt);

    requestAnimationFrame(animate);
}

// runs a continuous animation loop
animate()