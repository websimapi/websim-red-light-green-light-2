export class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {};
        this.sources = {};
        this.loadSounds();
    }

    resumeContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    async loadSound(name, url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            this.sounds[name] = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error(`Failed to load sound: ${name}`, error);
        }
    }

    loadSounds() {
        this.loadSound('chant', './doll_chant.mp3');
        this.loadSound('shot', './shot.mp3');
    }

    playSound(name) {
        if (this.sounds[name]) {
            if (this.sources[name]) {
                this.sources[name].stop();
            }
            const source = this.audioContext.createBufferSource();
            source.buffer = this.sounds[name];
            source.connect(this.audioContext.destination);
            source.start(0);
            this.sources[name] = source;
        }
    }
    
    stopSound(name) {
        if (this.sources[name]) {
            this.sources[name].stop();
        }
    }
}