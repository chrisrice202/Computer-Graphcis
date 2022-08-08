import {Gallery} from './consolidator.js';

function makeFibSpiralHoles(numPoints, modelCyl, holesBsp) {
   
   let theta;
   let phi = Math.PI * (3 - Math.sqrt(5)); //golden angle
   
   //I have no idea why this fib spiral works but it does.
   for (let i = 1; i < numPoints - 1; i++) {
      let y = 1 - (i / (numPoints - 1)) * 2;
      let radius = Math.sqrt(1 - y * y);
      let tempCyl = modelCyl.clone();
      let tempBsp;
      theta = phi * i; //golden angle offset
      tempCyl.position.set(
      (Math.cos(theta) * radius) / 2,
      y / 2,
      (Math.sin(theta) * radius) / 2
      );
      tempCyl.lookAt(0, 0, 0);
      tempCyl.rotateX(Math.PI / 2);
      tempBsp = new ThreeBSP(tempCyl);
      holesBsp = holesBsp.union(tempBsp);
   }

   return holesBsp;
}


function makeWiffleBall() {
   let wiffRad = 0.5; let wiffSegs = 10;
   let wiffleBallGeo = new THREE.SphereGeometry(wiffRad, wiffSegs, wiffSegs);
   let wiffleBallMaterial = new THREE.MeshLambertMaterial({ color: 0xf5b041 });
   let wiffleBall = new THREE.Mesh(wiffleBallGeo, wiffleBallMaterial);
   let modelCylRad = 0.075; let modelCylHeight = 0.25; let modelCylSegs = 10;
   let modelCylGeo = new THREE.CylinderGeometry(
    modelCylRad, 
    modelCylRad, 
    modelCylHeight, 
    modelCylSegs, 
    modelCylSegs
   );
   let modelCyl = new THREE.Mesh(modelCylGeo, wiffleBallMaterial);
   let numPoints = 30;
   let subSphereMesh = new THREE.Mesh(new THREE.SphereGeometry(
    wiffRad - 0.01, 
    modelCylSegs, 
    modelCylSegs
    )
   );
   let holesBsp = new ThreeBSP(subSphereMesh);

   holesBsp = makeFibSpiralHoles(numPoints, modelCyl, holesBsp);

   let ballBsp = new ThreeBSP(wiffleBall);
   let wiffleBallBsp = ballBsp.subtract(holesBsp);
   let wiffleBallScaler = 0.25;
   wiffleBall = wiffleBallBsp.toMesh(wiffleBallMaterial);
   wiffleBall.scale.set(wiffleBallScaler, wiffleBallScaler, wiffleBallScaler);
   wiffleBall.position.set(
    (Gallery.hallWidth / 4) * -1,
    wiffRad / 2, //half of ball radius
    -1 * (Gallery.hallLength / 2 - Gallery.hallLength / 8)
   );

   Gallery.scene.add(wiffleBall);
}

export default function() {makeWiffleBall()};