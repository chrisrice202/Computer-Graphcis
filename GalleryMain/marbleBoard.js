import {Gallery} from './consolidator.js';

function makeBaseBoard(boardSize, tubeSize, baseCylMaterial) {
   let baseCylSegs = 30; let baseCylHeight = 0.1;
   let baseCylGeo = new THREE.CylinderGeometry(
   boardSize / 2,
    boardSize / 2,
    baseCylHeight,
    baseCylSegs,
    baseCylSegs
   );
   let baseCyl = new THREE.Mesh(baseCylGeo, baseCylMaterial);
   let baseTorSegs = 20;
   let baseTorGeo = new THREE.TorusGeometry(
    boardSize / 2, 
    tubeSize / 2, 
    baseTorSegs, 
    baseTorSegs
   );
   let baseTor = new THREE.Mesh(baseTorGeo, baseCylMaterial);
   let topCylRad = 0.75;
   let topCylGeo = new THREE.CylinderGeometry(
    topCylRad, 
    topCylRad, 
    tubeSize / 2, 
    baseTorSegs, 
    baseTorSegs
   );
   let topCyl = new THREE.Mesh(topCylGeo, baseCylMaterial);

   baseTor.position.set(0, baseCylHeight / 2, 0);
   baseTor.rotateX(Math.PI / 2);

   //tubeRemove's radius is basecyl's - some fluff so the tube is placed right
   let tubeRemoveRad = (boardSize / 2) - (baseCylHeight / 2);
   let tubeRemoveSegs = 15;
   let tubeRemoveGeo = new THREE.TorusGeometry(
    tubeRemoveRad, 
    (baseCylHeight / 2), 
    tubeRemoveSegs, 
    tubeRemoveSegs
   );
   let tubeRemove = new THREE.Mesh(tubeRemoveGeo, baseCylMaterial);
   tubeRemove.rotateX(Math.PI / 2);
   //posisiton's 0.005 is a small offset
   tubeRemove.position.set(0, (baseCylHeight / 2) + 0.005, 0);

   topCyl.position.set(0, 0.088, 0); //couldn't do math for the y, brute forced

   let boardBsp = new ThreeBSP(baseCyl);
   let baseTorBsp = new ThreeBSP(baseTor);
   let tubeRemoveBsp = new ThreeBSP(tubeRemove);
   let topCylBsp = new ThreeBSP(topCyl);

   boardBsp = boardBsp.union(baseTorBsp);
   boardBsp = boardBsp.subtract(tubeRemoveBsp);
   return (boardBsp = boardBsp.subtract(topCylBsp)); //base board done
}

function makeMarbles(arr, modelMarble, marbleOffset, randValues, marblePosArr) {
   let count = 0;
   let xStart = 0 - marbleOffset * Math.floor(arr.length / 2) - marbleOffset;
   let tempMarble;
   let marbleBSP;
   let tempBSP;
   let marbleGroup = new THREE.Group();
   let baseCylHeight = 0.1;

   for (let col = 0; col < marblePosArr.length; col++) {
      for (let row = 0; row < marblePosArr[col]; row++) {
         tempMarble = modelMarble.clone();

         tempMarble.material = arr[Math.floor(Math.random() * arr.length)];

         if ((row + 1) % 2 === 1) {
            tempMarble.position.set(
               xStart + marbleOffset * col,
               baseCylHeight / 2,
               0 + Math.floor((row + 1) / 2) * marbleOffset
            );
         } 
         else {
            tempMarble.position.set(
               xStart + marbleOffset * col,
               baseCylHeight / 2,
               -1 * (0 + Math.floor((row + 1) / 2) * marbleOffset)
            );
         }

         if (randValues.indexOf(count) != -1) {
            if (marbleBSP === undefined) {
               marbleBSP = new ThreeBSP(tempMarble);
            } 
            else {
               tempBSP = new ThreeBSP(tempMarble);
               marbleBSP = marbleBSP.union(tempBSP);
            }
         } 
         else {
            marbleGroup.add(tempMarble);
         }
         count++;
      }
   }

   let retArr = [marbleGroup, marbleBSP];

   return retArr;
}

function makeMarbleBoard() {
   let boardSize = 1;
   let tubeSize = 0.15;
   let baseCylMaterial = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
   let boardBsp = makeBaseBoard(boardSize, tubeSize, baseCylMaterial);

   //make marble holes + fill with marbles
   let marbleDivider = 30; let marbleScale = 0.25; let marbleSegs = 10;
   let modelMarbleGeo = new THREE.SphereGeometry(
    boardSize / marbleDivider,
    marbleSegs,
    marbleSegs
   );
   let modelMarbleText = Gallery.textures.marble;
   let modelMarble = new THREE.Mesh(modelMarbleGeo, modelMarbleText);
   let marblePositionArray = [3, 5, 7, 7, 7, 5, 3];
   let marbleOffset = (boardSize - tubeSize) / (marblePositionArray.length + 1);
   let numOfMarbles = 18;
   let totalSpots = 0;
   let marbleBSP;
   let marbleMaterialArr = [
    Gallery.textures.blackMarble,
    Gallery.textures.creamMarble,
    Gallery.textures.greenMarble,
    Gallery.textures.redMarble,
   ];
   let marbleGroup = new THREE.Group();

   for (let i = 0; i < marblePositionArray.length; i++) {
      totalSpots += marblePositionArray[i];
   }

   let randValues = [];
   //found this next segment of code online, and modified it to work here
   while (randValues.length < numOfMarbles + 1) {
      let r = Math.floor(Math.random() * totalSpots) + 1;
      if (randValues.indexOf(r) === -1) {
         randValues.push(r);
      }
   }

   let tempArr = makeMarbles(
    marbleMaterialArr,
    modelMarble,
    marbleOffset,
    randValues,
    marblePositionArray
   );
   marbleGroup = tempArr[0];
   marbleBSP = tempArr[1];

   boardBsp = boardBsp.subtract(marbleBSP);
   marbleGroup.add(boardBsp.toMesh(baseCylMaterial));

   marbleGroup.scale.set(marbleScale, marbleScale, marbleScale);

   marbleGroup.position.set(
    (Gallery.hallWidth / 4) * -1,
    0.1375, //colTop height + (3/8 of latheGeo)
    -1 * (Gallery.hallLength / 2 - (Gallery.hallLength / 8) * 2)
   );

   Gallery.scene.add(marbleGroup);
}

export default function() {makeMarbleBoard()};