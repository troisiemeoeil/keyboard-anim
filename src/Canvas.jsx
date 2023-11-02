import { useEffect } from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function Canvas() {

// eslint-disable-next-line react-hooks/exhaustive-deps
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

useEffect(()=> {
    const context = document.getElementById('context')

context.appendChild(renderer.domElement);
},[renderer])

const scene = new THREE.Scene();
renderer.setClearColor( 0xffffff);
const camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(5, 5, -10);
orbit.update();


let mixer;
const loader = new GLTFLoader();
 loader.load(
	// resource URL
	'./scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {
        const model = gltf.scene
		scene.add( gltf.scene );
    
        mixer = new THREE.AnimationMixer(model);
        const clips = gltf.animations;
        model.traverse((child)=> {
            if (child instanceof THREE.Mesh) {
            
                child.material.metalness = 0
            }
        })
        // Play a certain animation
        // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
        // const action = mixer.clipAction(clip);
        // action.play();
    
        // Play all animations at the same time
     window.addEventListener('click', ()=> {
        clips.forEach(function(clip) {
            const action = mixer.clipAction(clip);
            action.play();
        });
    
     })
        // mixer = new THREE.AnimationMixer(model)
        // const clips = gltf.animations;
        
        // const clip = THREE.AnimationClip.findByName(clips, "Open")
        // console.log("animation", clip);
        // const actions = mixer.clipAction(clip)
        // actions.play()
     
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	
);


const clock = new THREE.Clock()
function animate() {
    if(mixer)
    mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
  return (
    <div id='context'>
      
    </div>
  )
}
