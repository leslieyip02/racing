import BasicScene from "./scene";
import GameScene from "./GameScene";

// sets up the scene
// let scene = new BasicScene();
// scene.initialize();

let scene = new GameScene();

// loops updates
function animate() {
    scene.camera.updateProjectionMatrix();
    scene.renderer.render(scene, scene.camera);

    if (scene.orbitals)
        scene.orbitals.update()
    
    requestAnimationFrame(animate);
}

// runs a continuous animation loop
animate()