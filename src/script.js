import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import gsap from 'gsap';

/**
 * Debug
 */

const gui = new dat.GUI();
gui.hide()


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

const textureLoader = new THREE.TextureLoader();
// Scene
const scene = new THREE.Scene()

const material = new THREE.MeshStandardMaterial({
    vertexColors: THREE.FaceColors
});
material.roughness = 1
material.metalness = .2

const geometry = new THREE.BoxGeometry(1, 1, 1);


const facesDictionary = {
    'front': [8, 9],
    'back': [10, 11],
    'right': [0, 1],
    'left': [2, 3],
    'up': [4, 5],
    'down': [6, 7]
};

const facesColors = {
    'front': 'green',
    'back': 'yellow',
    'right': 'red',
    'left': 'orange',
    'up': 'pink',
    'down': 'blue'
};

const faceColorPlacement = (mesh) => {
    for (let i = 0; i < facesDictionary['right'].length; i++) {
        const triangle = facesDictionary['right'][i];
        mesh.geometry.faces[triangle].color.setColorName(facesColors['right'])
    }

    for (let i = 0; i < facesDictionary['down'].length; i++) {
        const triangle = facesDictionary['down'][i];
        mesh.geometry.faces[triangle].color.setColorName(facesColors['down'])
    }

    for (let i = 0; i < facesDictionary['front'].length; i++) {
        const triangle = facesDictionary['front'][i];
        mesh.geometry.faces[triangle].color.setColorName(facesColors['front'])
    }

    for (let i = 0; i < facesDictionary['left'].length; i++) {
        const triangle = facesDictionary['left'][i];
        mesh.geometry.faces[triangle].color.setColorName(facesColors['left'])
    }
    for (let i = 0; i < facesDictionary['up'].length; i++) {
        const triangle = facesDictionary['up'][i];
        mesh.geometry.faces[triangle].color.setColorName(facesColors['up'])
    }
    for (let i = 0; i < facesDictionary['back'].length; i++) {
        const triangle = facesDictionary['back'][i];
        mesh.geometry.faces[triangle].color.setColorName(facesColors['back'])
    }
}

const level1XGroup = new THREE.Group();
const level2XGroup = new THREE.Group();
const level3XGroup = new THREE.Group();

const dancingCube = new THREE.Group();

const addInLevels = (mesh, level) => {
    switch (level) {
        case -1:
            level1XGroup.add(mesh);
            break;
        case 0:
            level2XGroup.add(mesh);
            break;
        case 1:
            level3XGroup.add(mesh);
            break;
        default:
            break;
    }
}

const matrix = [];

for (let level = -1; level < 2; level++) {
    const lvl = [];
    for (let row = -1; row < 2; row++) {
        const column = [];
        for (let col = -1; col < 2; col++) {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.y = level * (Math.random() * 20);
            mesh.position.z = row * (Math.random() * 20);
            mesh.position.x = col * (Math.random() * 20);

            faceColorPlacement(mesh);

            column.push(mesh);

            addInLevels(mesh, level);
        }
        lvl.push(column);
    }
    matrix.push(lvl);
}

dancingCube.add(level1XGroup, level2XGroup, level3XGroup)

scene.add(dancingCube)

const lvl1 = gui.addFolder('lvl1')

lvl1.add(level1XGroup.position, 'x').min(0).max(2).step(1)
lvl1.add(level1XGroup.position, 'y').min(0).max(2).step(1)
lvl1.add(level1XGroup.position, 'z').min(0).max(2).step(1)
lvl1.add(level1XGroup.rotation, 'y').min(0).max(Math.PI * 2).step(Math.PI / 4).name('rotationY')

const lvl2 = gui.addFolder('lvl2');
lvl2.add(level2XGroup.rotation, 'y').min(0).max(Math.PI * 2).step(Math.PI / 4).name('rotationY')

const lvl3 = gui.addFolder('lvl3');
lvl3.add(level3XGroup.rotation, 'y').min(0).max(Math.PI * 2).step(Math.PI / 4).name('rotationY')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const ambientLight = new THREE.AmbientLight('#fff', 0.5)
scene.add(ambientLight);

const pointLight = new THREE.PointLight('#fff', 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight);

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    console.log(window.pageXOffset)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 53
camera.position.y = 50
camera.position.z = 100
scene.add(camera)



const cameraFolder = gui.addFolder('camera');
cameraFolder.add(camera.position, 'x').min(-100).max(100).step(1);
cameraFolder.add(camera.position, 'y').min(-100).max(100).step(1);
cameraFolder.add(camera.position, 'z').min(-100).max(100).step(1);
cameraFolder.add(camera.rotation, 'z').min(0).max(1).step(.01).name('rotationZ');



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enabled = false;
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    level1XGroup.rotation.y = elapsedTime * Math.PI * 0.5
    level2XGroup.rotation.y = -(elapsedTime * Math.PI * 0.5)
    level3XGroup.rotation.y = elapsedTime * Math.PI * 0.5

    gsap.to(camera.position, {
        duration: 1,
        delay: .5,
        x: 5
    });

    gsap.to(camera.position, {
        duration: .5,
        delay: .5,
        y: 5
    });

    gsap.to(camera.position, {
        duration: 1.5,
        delay: .5,
        z: 10
    });

    // if(camera.position.x < 20 && camera.position.y < 20) {
    //     for (let level = 0; level < 3; level++) {
    //         for (let row = 0; row < 3; row++) {
    //             for (let col = 0; col < 3; col++) {
    //                 const cube = matrix[level][row][col];
    //                 // cube.position.y = (cube.position.y / 10) * 1.2;
    //                 // cube.position.z = (cube.position.z / 10) * 1.2;
    //                 // cube.position.x = (cube.position.x /10) * 1.2;


    //             }
    //         }
    //     }
    // }
    let levelI = -1;
    for (let level = 0; level < 3; level++) {
        let rowI = -1;
        for (let row = 0; row < 3; row++) {
            let colI = -1;
            for (let col = 0; col < 3; col++) {
                const cube = matrix[level][row][col];
                cube.rotation.x = elapsedTime * Math.PI * 0.5;

                gsap.to(cube.position, {
                    duration: 2,
                    delay: .5,
                    x: colI * 1.2
                });

                gsap.to(cube.position, {
                    duration: 2,
                    delay: .5,
                    y: levelI * 1.2
                });

                gsap.to(cube.position, {
                    duration: 2,
                    delay: .5,
                    z: rowI * 1.2
                });

                colI++;
            }
            rowI++;
        }
        levelI++
    }


    dancingCube.rotation.z = -(elapsedTime * Math.PI * 0.5)

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()