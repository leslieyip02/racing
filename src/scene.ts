import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * A class to set up some basic scene elements to minimize code in the
 * main execution file.
 */
export default class BasicScene extends THREE.Scene {

    // A dat.gui class debugger that is added by default
    debugger: GUI | null = null;

    // Setups a scene camera
    camera: THREE.PerspectiveCamera | null = null;

    // setup renderer
    renderer: THREE.Renderer | null = null;

    // setup Orbitals
    orbitals: OrbitControls | null = null;

    // Holds the lights for easy reference
    lights: Array<THREE.Light> = [];

    // Number of PointLight objects around origin
    lightCount: number = 6;

    // Distance above ground place
    lightDistance: number = 3;

    // Get some basic params
    width = window.innerWidth;
    height = window.innerHeight;

    /**
     * Initializes the scene by adding lights, and the geometry
     */
    initialize(debug: boolean = true, addGridHelper: boolean = true){

        // setup camera
        this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, .1, 1000);
        this.camera.position.z = 12;
        this.camera.position.y = 12;
        this.camera.position.x = 12;

        // setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("app") as HTMLCanvasElement,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);

        // add window resizing
        BasicScene.addWindowResizing(this.camera, this.renderer);

        // sets up the camera's orbital controls
        this.orbitals = new OrbitControls(this.camera, this.renderer.domElement)

        // Adds an origin-centered grid for visual reference
        if (addGridHelper){

            // Adds a grid
            this.add(new THREE.GridHelper(10, 10, 'red'));

            // Adds an axis-helper
            this.add(new THREE.AxesHelper(3))
        }

        // set the background color
        this.background = new THREE.Color(0xefefef);

        // create the lights
        for (let i = 0; i < this.lightCount; i++){

            // Positions evenly in a circle pointed at the origin
            const light = new THREE.PointLight(0xffffff, 1);
            let lightX = this.lightDistance * Math.sin(Math.PI * 2 / this.lightCount * i);
            let lightZ = this.lightDistance * Math.cos(Math.PI * 2 / this.lightCount * i);

            // Create a light
            light.position.set(lightX, this.lightDistance, lightZ)
            light.lookAt(0, 0, 0)
            this.add(light);
            this.lights.push(light);

            // Visual helpers to indicate light positions
            this.add(new THREE.PointLightHelper(light, .5, 0xff9900));
        }

        // Creates the geometry + materials
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({color: 0xff9900});
        let cube = new THREE.Mesh(geometry, material);
        cube.position.y = .5;

        // add to scene
        this.add(cube);

        // setup Debugger
        if (debug) {
            this.debugger =  new GUI();

            // Debug group with all lights in it.
            const lightGroup = this.debugger.addFolder("Lights");
            for(let i = 0; i < this.lights.length; i++){
                lightGroup.add(this.lights[i], 'visible', true);
            }
            lightGroup.open();

            // Add the cube with some properties
            const cubeGroup = this.debugger.addFolder("Cube");
            cubeGroup.add(cube.position, 'x', -10, 10);
            cubeGroup.add(cube.position, 'y', .5, 10);
            cubeGroup.add(cube.position, 'z', -10, 10);
            cubeGroup.open();

            // Add camera to debugger
            const cameraGroup = this.debugger.addFolder('Camera');
            cameraGroup.add(this.camera, 'fov', 20, 80);
            cameraGroup.add(this.camera, 'zoom', 0, 1)
            cameraGroup.open();

        }
    }

    /**
     * Given a ThreeJS camera and renderer, resizes the scene if the
     * browser window is resized.
     * @param camera - a ThreeJS PerspectiveCamera object.
     * @param renderer - a subclass of a ThreeJS Renderer object.
     */
    static addWindowResizing(camera: THREE.PerspectiveCamera, renderer: THREE.Renderer){
        window.addEventListener( 'resize', onWindowResize, false );
        function onWindowResize(){

            // uses the global window widths and height
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
}