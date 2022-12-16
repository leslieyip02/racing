import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class GameScene extends THREE.Scene {
    debugger: GUI;

    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    orbitals: OrbitControls;

    width: number;
    height: number;

    points: Array<THREE.Vector3>;
    index: number = 0;
    timer: NodeJS.Timer;

    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // set up camera
        this.camera = new THREE.PerspectiveCamera(64, 
            this.width / this.height, .1, 1000);
        this.camera.position.z = 12;
        this.camera.position.y = 12;
        this.camera.position.x = 12;
        this.camera.lookAt(0, 0, 0);

        // set up renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("game") as HTMLCanvasElement,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);

        // set objects in the scene
        this.background = new THREE.Color(0xefefef);

        let light = new THREE.AmbientLight(0xffffff);
        this.add(light);

        this.createTrack();

        // set up debugger
        this.debugger =  new GUI();

        const cameraGroup = this.debugger.addFolder("Camera");
        cameraGroup.add(this.camera, "fov", 20, 80);
        cameraGroup.add(this.camera, "zoom", 0, 1)
        cameraGroup.open();

        // set up utilities
        // set up grid
        // this.add(new THREE.GridHelper(10, 10, "red"));

        // setup axis-helper
        // this.add(new THREE.AxesHelper(3));

        // set up camera orbital controls
        // this.orbitals = new OrbitControls(this.camera, this.renderer.domElement);
        
        // set up window resizing
        GameScene.addWindowResizing(this.camera, this.renderer);
    }

    createTrack() {
        let points: Array<THREE.Vector3> = [
            new THREE.Vector3(20, 2, 0),
            new THREE.Vector3(20, 2, -10),
            new THREE.Vector3(10, 2, -20),
            new THREE.Vector3(0, 0, -20),
            new THREE.Vector3(-10, 0, -20),
            new THREE.Vector3(-20, 0, -10),
            new THREE.Vector3(-20, 0, 0),
            new THREE.Vector3(-20, 0, 10),
            new THREE.Vector3(-10, 0, 20),
            new THREE.Vector3(0, 0, 20),
            new THREE.Vector3(10, 0, 20),
            new THREE.Vector3(20, 0, 10),
        ];

        // for (let i = 0; i < points.length; i++) {
        //     let point: THREE.Vector3 = points[i];

        //     let markerGeometry = new THREE.SphereGeometry(1, 4, 2);
        //     let marker = new THREE.Mesh(markerGeometry, lineMaterial);
        //     marker.position.set(point.x, point.y, point.z);

        //     this.add(marker);
        // }

        let track = new THREE.CatmullRomCurve3(points, true);
        this.points = track.getPoints(50);

        // let lineGeometry = new THREE.BufferGeometry()
        //     .setFromPoints(this.points);
        // let lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
        // let line = new THREE.Line(lineGeometry, lineMaterial);
        // this.add(line);

        let extrudeSettings = {
            steps: 100,
            bevelEnabled: false,
            extrudePath: track
        };

        let strip = new THREE.Shape([
            new THREE.Vector2(1, 0),
            new THREE.Vector2(-1, 0),
        ]);

        let trackGeometry = new THREE.ExtrudeGeometry(strip, extrudeSettings);
        let trackMaterial = new THREE.MeshLambertMaterial({ color: 0x000000, wireframe: true });
        let mesh = new THREE.Mesh(trackGeometry, trackMaterial);
        this.add(mesh);

        this.timer = setInterval(() => { this.moveCamera() }, 200);
    }

    moveCamera() {
        this.index = (this.index + 1) % (this.points.length);
        let nextIndex = (this.index + 1) % (this.points.length);

        let point = this.points[this.index];
        let nextPoint = this.points[nextIndex];
        
        this.camera.position.set(point.x, point.y + 0.5, point.z);
        this.camera.lookAt(nextPoint.x, nextPoint.y + 0.5, nextPoint.z);
    }

    static addWindowResizing(camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) {
        window.addEventListener("resize", () => {
            // uses the global window widths and height
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }
}