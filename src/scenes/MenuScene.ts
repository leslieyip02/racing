import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { speeders } from "../../data/vehicles/vehicles";

export default class MenuScene extends THREE.Scene {
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    filter: UnrealBloomPass;

    models: Array<THREE.Group>;

    width: number;
    height: number;

    constructor() {
        super();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.render();

        // set up window resizing
        window.addEventListener("resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        }, false);
    }

    loadGLTF(position: THREE.Vector3, data: GLTF) {
        let model = data.scene;
        model.position.set(position.x, position.y, position.z);

        let haloGeometry = new THREE.CircleGeometry(1.2, 20);
        let haloMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        let halo = new THREE.Mesh(haloGeometry, haloMaterial);
        
        halo.position.set(0, -1, 0);
        halo.rotateX(-Math.PI / 2);
        model.add(halo);
        
        let glowMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
        halo = new THREE.Mesh(haloGeometry, glowMaterial);
        halo.position.set(0, -1.1, 0);
        halo.rotateX(-Math.PI / 2);
        model.add(halo);

        this.models.push(model);
        this.add(model);
    }

    async render() {
        this.camera = new THREE.OrthographicCamera(this.width / -180, this.width / 180, 
            this.height / 180, this.height / -180, 0, 100);
        this.camera.position.set(0, 10, 25);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("menu") as HTMLCanvasElement,
            alpha: true
        });

        this.renderer.setSize(this.width, this.height);

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this, this.camera));
        this.filter = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1.6, 0.1, 0.9);
        this.composer.addPass(this.filter);

        let light = new THREE.AmbientLight(0xffffff, 1);
        this.add(light);

        this.models = [];
        let loader = new GLTFLoader();
        for (let i = 0; i < 3; i++) {
            await loader.loadAsync(speeders[i].modelPath)
                .then(data => this.loadGLTF(new THREE.Vector3((i - 1) * 4.2, 0, 0), data));
            document.getElementById(`speeder_${i}`)
                .addEventListener("click", () => this.startGame(i));
        }
    }

    startGame(speederIndex: number) {
        let curtain = document.getElementById("curtain");
        curtain.classList.add("fade-to-black");

        setTimeout(() => {
            window.location.href = `game.html?speeder=${speederIndex}`;
        }, 800);
    }

    update(dt: number) {
        for (let model of this.models)
            model.rotateY(0.0004 * dt);
    }
}