import GameScene from "./GameScene";

// set up scene
let scene = new GameScene();

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