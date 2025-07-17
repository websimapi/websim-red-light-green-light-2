import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export class BodyTracker {
    constructor(onMovement) {
        this.onMovement = onMovement;
        this.video = document.getElementById('webcam');
        this.lastLandmarks = null;
        this.lastPredictionTime = -1;
    }

    async init() {
        const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm'
        );
        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numPoses: 1
        });
        await this.enableWebcam();
    }

    async enableWebcam() {
        const constraints = { video: { width: 640, height: 480 }, audio: false };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = stream;
            this.video.addEventListener('loadeddata', () => this.predictWebcam());
        } catch(err) {
            console.error("Error accessing webcam: ", err);
            throw err;
        }
    }

    predictWebcam() {
        if(this.video.currentTime !== this.lastPredictionTime) {
            this.poseLandmarker.detectForVideo(this.video, Date.now(), (result) => {
                if (result.landmarks && result.landmarks.length > 0) {
                    const landmarks = result.landmarks[0];
                    if (this.lastLandmarks) {
                        const movementScore = this.calculateMovement(landmarks, this.lastLandmarks);
                        this.onMovement(movementScore);
                    }
                    this.lastLandmarks = landmarks;
                }
            });
            this.lastPredictionTime = this.video.currentTime;
        }
    }
    
    update() {
        // The prediction is now driven by 'loadeddata' event, but we can call it here to ensure it runs
        if (this.poseLandmarker && this.video.srcObject) {
            this.predictWebcam();
        }
    }

    calculateMovement(current, last) {
        // Use wrists and ankles to calculate movement
        const indices = [15, 16, 27, 28]; // Left/Right Wrist, Left/Right Ankle
        let totalMovement = 0;
        for (const i of indices) {
            const dx = current[i].x - last[i].x;
            const dy = current[i].y - last[i].y;
            totalMovement += Math.sqrt(dx * dx + dy * dy);
        }
        return totalMovement;
    }
}

