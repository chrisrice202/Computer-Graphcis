import { Gallery } from './consolidator.js';

function main() {
   // listen to the resize events (im guessing for resizing of window)
   window.addEventListener("resize", onResize, false);

   let camera;
   let renderer;
   let clock = new THREE.Clock();

   let degreeOfCamera = 45;
   let cameraDepth = 1000;
   let cameraNearPlane = 0.001;
   camera = new THREE.PerspectiveCamera(
    degreeOfCamera,
    window.innerWidth / window.innerHeight,
    cameraNearPlane,
    cameraDepth
   );

   //so i can alter later if needed. This is the original position
   camera.position.set(0, 0, (Gallery.hallLength / 2) - 1);

   //create a renderer to display the scene. Set clear color for stuff that
   //doesn't get light on it
   renderer = new THREE.WebGLRenderer();
   renderer.setClearColor(new THREE.Color(0x000000));

   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.shadowMap.enabled = true;

   //The real meat n' taters right here

   Gallery.makeMainRoom();

   //Gallery.makeWiffleBall();

   //Gallery.makeMarbleBoard();

   Gallery.makeMusicBoxes();

   //Gallery.makeUVCubes();

   Gallery.makeCoins();

   Gallery.makeMountain();

   Gallery.scene.updateMatrixWorld(true);

   Gallery.showIntersections(camera);

   let ambientLight = new THREE.AmbientLight(0x353535, 0.05); //light gray
   Gallery.scene.add(ambientLight);

   // add pointlights for the shadows
   let pointLight1 = new THREE.PointLight(0xffffff, 0.5);
   let pointLight2 = pointLight1.clone();
   let pointLightCenter = pointLight1.clone();
   let lightOffset = 0.25;
   pointLight1.position.set(
    (-1 * Gallery.hallWidth) / 2 + lightOffset,
    Gallery.hallHeight / 2 - lightOffset,
    (-1 * Gallery.hallLength) / 2 + lightOffset
   );
   pointLight2.position.set(
    Gallery.hallWidth / 2 - lightOffset, 
    Gallery.hallHeight / 2 - lightOffset, 
    Gallery.hallLength / 2 - lightOffset
   );
   pointLightCenter.position.set(
    0,
    Gallery.hallHeight / 2 - lightOffset,
    0,
   );

   pointLight1.castShadow = true;
   pointLight2.castShadow = true;
   pointLightCenter.castShadow = true;

   Gallery.scene.add(pointLight1);
   Gallery.scene.add(pointLight2);
   Gallery.scene.add(pointLightCenter);

   let flyControls = new Gallery.flyControls(camera);
   let scalarMove = 1;
   //let runningTotal = 0.0;

   // add the output of the renderer to the html element
   document.getElementById("webgl-anchor").appendChild(renderer.domElement);

   animate();

   function animate() {

      /* 24 FRAME THROTTLE
      if (runningTotal >= .04166666) {
         scalarMove = Gallery.intersectTriangles(camera, 
          flyControls.getNextFramePoint(camera, runningTotal));
         flyControls.update(runningTotal, scalarMove);
         scalarMove = 1;
         runningTotal = 0;
      }

      runningTotal += clock.getDelta();
      //console.log(runningTotal);
      */

      scalarMove = Gallery.intersectTriangles(camera, 
      flyControls.getNextFramePoint(camera, clock.getDelta()));
      flyControls.update(clock.getDelta(), scalarMove);
      scalarMove = 1;
      

      // render using requestAnimationFrame
      requestAnimationFrame(animate);
      renderer.render(Gallery.scene, camera);
   }

   //ACTUALLY RESIZE STUFF
   function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
   }
}

window.main = main();
