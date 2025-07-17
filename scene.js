import * as THREE from 'three';

export const scene = new THREE.Scene();
export let world = {}; // Placeholder for physics world
export let player;

export function createScene() {
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 50, 200);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(10, 20, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(100, 400);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x996633 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Finish Line
    const lineGeo = new THREE.PlaneGeometry(30, 1);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const finishLine = new THREE.Mesh(lineGeo, lineMat);
    finishLine.position.set(0, 0.01, -180);
    finishLine.rotation.x = -Math.PI / 2;
    scene.add(finishLine);

    // Tree
    const treeTrunkGeo = new THREE.CylinderGeometry(1, 1, 10);
    const treeTrunkMat = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const treeTrunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
    treeTrunk.position.set(0, 5, -200);
    treeTrunk.castShadow = true;
    scene.add(treeTrunk);

    const treeLeavesGeo = new THREE.ConeGeometry(5, 15, 8);
    const treeLeavesMat = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    const treeLeaves = new THREE.Mesh(treeLeavesGeo, treeLeavesMat);
    treeLeaves.position.set(0, 15, -200);
    treeLeaves.castShadow = true;
    scene.add(treeLeaves);

    // Doll
    const doll = createDoll();
    doll.position.set(0, 0, -195);
    doll.name = "doll";
    scene.add(doll);

    // Player
    player = createPlayer();
    player.position.set(0, 2.5, 10);
    scene.add(player);

    return scene;
}

function createDoll() {
    const dollGroup = new THREE.Group();

    // Body
    const bodyGeo = new THREE.CylinderGeometry(1, 1.5, 4);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xffa07a });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2;
    body.castShadow = true;
    dollGroup.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(1.2, 32, 16);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffdab9 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 5;
    head.name = "head";
    head.castShadow = true;
    dollGroup.add(head);

    return dollGroup;
}

function createPlayer() {
    const playerGroup = new THREE.Group();
    const playerMat = new THREE.MeshLambertMaterial({ color: 0x006400 });

    // Body
    const bodyGeo = new THREE.CapsuleGeometry(1, 3);
    const body = new THREE.Mesh(bodyGeo, playerMat);
    body.castShadow = true;
    playerGroup.add(body);
    
    return playerGroup;
}

