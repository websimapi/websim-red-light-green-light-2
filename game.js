import TWEEN from '@tweenjs/tween.js';
import { AudioManager } from './audio.js';

export class Game {
    constructor(doll) {
        this.doll = doll;
        this.dollHead = this.doll.getObjectByName('head');
        this.state = 'WAITING'; // WAITING, GREEN_LIGHT, RED_LIGHT, GAME_OVER
        this.timer = 0;
        this.turnDuration = 0;
        this.audioManager = new AudioManager();
    }

    start() {
        this.state = 'RED_LIGHT'; // Start facing player
        this.dollHead.rotation.y = Math.PI; // Face player
        setTimeout(() => this.greenLight(), 2000);
    }

    update(deltaTime) {
        if (this.state === 'GREEN_LIGHT') {
            this.timer -= deltaTime;
            if (this.timer <= 0) {
                this.redLight();
            }
        }
    }

    greenLight() {
        this.state = 'GREEN_LIGHT';
        this.turnDuration = Math.random() * 7 + 3; // 3-10 seconds
        this.timer = this.turnDuration;

        this.audioManager.playSound('chant');
        
        // Turn to tree
        new TWEEN.Tween(this.dollHead.rotation)
            .to({ y: 0 }, this.turnDuration * 1000 * 0.9) // Takes most of the time to turn away
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }

    redLight() {
        this.state = 'RED_LIGHT';
        this.audioManager.stopSound('chant');
        
        // Snap back to player
        new TWEEN.Tween(this.dollHead.rotation)
            .to({ y: Math.PI }, 500) // Fast turn back
            .easing(TWEEN.Easing.Bounce.Out)
            .onComplete(() => {
                if (this.state !== 'GAME_OVER') {
                    setTimeout(() => this.greenLight(), 2000); // Wait 2s before next round
                }
            })
            .start();
    }
    
    isPlayerMoving(movementScore) {
        const movementThreshold = 0.05;
        if (this.state === 'RED_LIGHT' && movementScore > movementThreshold) {
            return true;
        }
        return false;
    }

    playerEliminated() {
        if (this.state !== 'GAME_OVER') {
            this.state = 'GAME_OVER';
            this.audioManager.playSound('shot');
            console.log("You moved! Game Over.");
            const messageEl = document.getElementById('message');
            messageEl.textContent = 'Game Over!';
            document.getElementById('ui-overlay').style.display = 'flex';
            document.getElementById('start-button').style.display = 'none'; // Or change to "Restart"
        }
    }
}

