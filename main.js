import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { createScene, world, player } from './scene.js';
import { Game } from './game.js';
import { BodyTracker } from './body-tracker.js';

class App {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#game-canvas'),
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        this.scene = createScene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 15);
        this.camera.lookAt(0, 2, 0);

        this.game = new Game(this.scene.getObjectByName('doll'));
        this.bodyTracker = new BodyTracker(this.handleMovement.bind(this));
        
        this.clock = new THREE.Clock();

        this.setupUI();
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.animate();
    }
    
    setupUI() {
        const startButton = document.getElementById('start-button');
        const messageEl = document.getElementById('message');
        
        startButton.textContent = 'Loading...';
        startButton.disabled = true;

        this.bodyTracker.init().then(() => {
            messageEl.textContent = 'Ready!';
            startButton.textContent = 'Start Game';
            startButton.disabled = false;
        }).catch(err => {
            messageEl.textContent = 'Error: Webcam not found or permission denied.';
            console.error(err);
        });

        startButton.addEventListener('click', () => {
            document.getElementById('ui-overlay').style.display = 'none';
            this.game.start();
        });
    }

    handleMovement(movementScore) {
        if (this.game.state === 'GREEN_LIGHT' || this.game.state === 'WAITING') {
            const speed = movementScore * 0.2;
            player.position.z -= speed;
        }

        if (this.game.isPlayerMoving(movementScore)) {
            this.game.playerEliminated();
            player.position.y = 1; // Simulate falling
            player.rotation.x = -Math.PI / 2;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const deltaTime = this.clock.getDelta();
        
        TWEEN.update();
        this.bodyTracker.update();
        this.game.update(deltaTime);

        // Update camera to follow player
        this.camera.position.z = player.position.z + 15;

        this.renderer.render(this.scene, this.camera);
    }
}

new App();

