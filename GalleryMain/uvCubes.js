import {Gallery} from './consolidator.js';


function makeUVCubes() {

   let loader = new THREE.GLTFLoader();

   // Load a glTF resource
   loader.load(
      // resource URL
      "./Blender/brickStandardCube.glb",
      // called when the resource is loaded
      function (brickStandardCube) {
         //not me
         brickStandardCube.scene.traverse((o) => {
            if (o.isMesh) {
               Gallery.scene.add(o);
            }
         });
      }
   );

   loader.load(
      // resource URL
      "./Blender/brickPerspective.glb",
      // called when the resource is loaded
      function (brickPerspective) {
         //not me
         brickPerspective.scene.traverse((o) => {
            if (o.isMesh) {
               o.position.set(0, 0, Gallery.hallLength / 4)
               Gallery.scene.add(o);
            }
         });
      }
   );

   loader.load(
      // resource URL
      "./Blender/brickFullCube.glb",
      // called when the resource is loaded
      function (brickFullCube) {
         //not me
         brickFullCube.scene.traverse((o) => {
            if (o.isMesh) {
               o.position.set(0, 0, -1 * Gallery.hallLength / 4)
               Gallery.scene.add(o);
            }
         });
      }
   );

}



export default function() {makeUVCubes()}