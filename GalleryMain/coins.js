import {mergeBufferGeometries} from '../examples/jsm/utils/BufferGeometryUtils.js';
import {Gallery} from './consolidator.js';

function generateCoinFacePoints(steps, radius, depthOffset) {

   const totalRadians = 2 * Math.PI;
   const singleStep = totalRadians / steps;
   let pointArray = []
   let tempRadian = 0.0;
   const centerZ = 0.0;

   //9 values per step (triangle) (3 vert and 3 points per vert)
   for (let i = 0; tempRadian < totalRadians; ) {

      if (i === 0) { //every time uses 0
         pointArray[i] = centerZ;
         pointArray[i + 1] = centerZ;
         pointArray[i + 2] = depthOffset;

         i += 3; //next Vert (only used once, never reused)

         pointArray[i] = Math.cos(tempRadian) * radius;
         pointArray[i + 1] = Math.sin(tempRadian) * radius;
         pointArray[i + 2] = depthOffset;
   
         i += 3; //next Vert
      }

      tempRadian += singleStep;

      pointArray[i] = Math.cos(tempRadian) * radius;
      pointArray[i + 1] = Math.sin(tempRadian) * radius;
      pointArray[i + 2] = depthOffset;

      i += 3; //next Vert

   }

   let indexArr = []
   let totalVerticies = 0;

   //steps * 3 because there are 60 trianges with 3 verts each
   for (let i = 0; i < steps * 3; i += 3) {
      if (i === 0) {
         indexArr[i] = totalVerticies;
         indexArr[i + 1] = totalVerticies + 1;
         indexArr[i + 2] = totalVerticies + 2;
         totalVerticies += 2;
      } 
      else {
         indexArr[i] = 0;
         indexArr[i + 1] = totalVerticies;
         indexArr[i + 2] = totalVerticies + 1;
         totalVerticies++;
      }
   }

   return [pointArray, indexArr];

}

function generateCoinSidePoints(steps, radius, depthOffset) {

   const totalRadians = 2 * Math.PI;
   const singleStep = totalRadians / steps;
   let pointArray = []
   let tempRadian = 0.0;

   //18 values per step (sqaure) (3 points per vert * 3 vert * 2 triangles)
   for (let i = 0; tempRadian < totalRadians; ) {

      if (i === 0) {
         // vert 1 (which on subsequent loops is vert 4)
         pointArray[i] = Math.cos(tempRadian) * radius;
         pointArray[i + 1] = Math.sin(tempRadian) * radius;
         pointArray[i + 2] = depthOffset;

         i += 3; //next Vert

         //vert 2 (which on subsequent loops is vert 3)
         pointArray[i] = Math.cos(tempRadian) * radius;
         pointArray[i + 1] = Math.sin(tempRadian) * radius;
         pointArray[i + 2] = -1 * depthOffset;

         i += 3; //next Vert
      }

      tempRadian += singleStep;

      //vert 3
      pointArray[i] = Math.cos(tempRadian) * radius;
      pointArray[i + 1] = Math.sin(tempRadian) * radius;
      pointArray[i + 2] = -1 * depthOffset;

      i += 3; //next Vert (next Triangle too)

      //vert 4
      pointArray[i] = Math.cos(tempRadian) * radius;
      pointArray[i + 1] = Math.sin(tempRadian) * radius;
      pointArray[i + 2] = depthOffset;

      i += 3; //next Vert

   }

   let indexArr = []
   let totalVerticies = 0;

   //steps * (3 * 2) is because its 2 triangles per square
   for (let i = 0; i < steps * (3 * 2); i += 6) {

      if (i === 0) {
         indexArr[i] = totalVerticies;
         indexArr[i + 1] = totalVerticies + 1;
         indexArr[i + 2] = totalVerticies + 2;
         indexArr[i + 3] = totalVerticies + 2;
         indexArr[i + 4] = totalVerticies + 3;
         indexArr[i + 5] = totalVerticies;
         totalVerticies += 3;
      } 
      else {
         indexArr[i] = totalVerticies;
         indexArr[i + 1] = totalVerticies - 1;
         indexArr[i + 2] = totalVerticies + 1;
         indexArr[i + 3] = totalVerticies + 1;
         indexArr[i + 4] = totalVerticies + 2;
         indexArr[i + 5] = totalVerticies;
         totalVerticies += 2;
      }
   }

   return [pointArray, indexArr];

}

// 0 1 2, 0 2 3, 0 3 4

function generateFaceNormals(pointArr) {

   let normalArr = []
   let normCount = 0;

   for (let i = 0; i < pointArr.length; ) {

      for (let j = 0; j < 3; j++) {
         normalArr[normCount] = 0;
         normalArr[normCount + 1] = 0;
         normalArr[normCount + 2] = 1;
         normCount += 3;
      }

      i += 9;
   }

   return normalArr

}

function generateCoinSideNormals(numSquares) {

   let normalArr = []
   let singleStep = ((2 * Math.PI) / numSquares);
   let tempRad = 0;
   let squareCount = 0;
   

   for (let i = 0; squareCount < numSquares + 1; ) {

      normalArr[i] = Math.cos(tempRad);
      normalArr[i + 1] = Math.sin(tempRad);
      normalArr[i + 2] = 0
      i += 3;

      normalArr[i] = Math.cos(tempRad);
      normalArr[i + 1] = Math.sin(tempRad);
      normalArr[i + 2] = 0
      i += 3;

      tempRad += singleStep;
      squareCount++;

   }

   return normalArr

}

function generateCoinFaceUVs (steps) {

   const centerX = .5;
   const centerY = .5;
   let UVArr = [];

   const totalRadians = 2 * Math.PI;
   const singleStep = totalRadians / steps;
   let tempRadian = 0.0;

   //6 values per step (triangle) (3 vert and 2 points per vert)
   for (let i = 0; tempRadian < totalRadians; ) {

      if (i === 0) { //every time uses 0
         UVArr[i] = centerX;
         UVArr[i + 1] = centerY;

         i += 2; //next Vert (only used once, never reused)

         // divide by two to get change from offset (which is centerX or Y)
         UVArr[i] = Math.cos(tempRadian) / 2 + centerX;
         UVArr[i + 1] = Math.sin(tempRadian) / 2 + centerY;
   
         i += 2; //next Vert
      }

      tempRadian += singleStep;

      UVArr[i] = Math.cos(tempRadian) / 2 + centerX;
      UVArr[i + 1] = Math.sin(tempRadian) / 2 + centerY;

      i += 2; //next Vert

   }

   return UVArr;

}

function generateRidgeUVs(numRidges, numStepsPerRidge) { 

   let UVArr = [];

   const total = 1;
   const singleStep = total / (numRidges * numStepsPerRidge);
   const midY = total / 2;
   const offset = singleStep;
   let tempPos = 0;

   //0 1 2, 2 3 0 | 3 2 4, 4 5 3 | 5 4 6, 6 7 5 | (indicies)
   
   for (let i = 0; tempPos < total; ) {
      if (i === 0) {
         UVArr[i] = tempPos;
         UVArr[i + 1] = midY;

         i += 2;

         UVArr[i] = tempPos;
         UVArr[i + 1] = midY - offset;

         i += 2;
      }

      tempPos += singleStep;

      UVArr[i] = tempPos;
      UVArr[i + 1] = midY - offset;

      i += 2;

      UVArr[i] = tempPos;
      UVArr[i + 1] = midY;

      i += 2;
      
   }

   return UVArr;

}

function generateRidgeDisplacementTexture(numRidges) { 
   let ridgeCanvas = document.getElementById("ridgeCanvasDisplacement");
   let ridgeContext = ridgeCanvas.getContext("2d");
   let singleStep = (1 / numRidges);
   let quarterStep = singleStep / 4;
   const white = "rgb(255, 255, 255)";
   const lightGray = "rgb(191.25, 191.25, 191.25)";
   const darkGray = "rgb(63.75, 63.75, 63.75)";
   const black = "rgb(0, 0, 0)";

   let ridgeGradient = ridgeContext.createLinearGradient(
    0, 0, 
    ridgeCanvas.width, 0
   );
   
   for (let pos = 0; pos < 1; ) {
      if (pos + quarterStep < 1) {
         ridgeGradient.addColorStop(pos, white);
         pos += quarterStep;
         ridgeGradient.addColorStop(pos, lightGray);
         ridgeGradient.addColorStop(pos, darkGray);
         pos += quarterStep;
         ridgeGradient.addColorStop(pos, black);
         pos += quarterStep;
         ridgeGradient.addColorStop(pos, darkGray);
         ridgeGradient.addColorStop(pos, lightGray);
         pos += quarterStep;
         ridgeGradient.addColorStop(pos, white);
      }
      else {
         pos += quarterStep;
      }
   }

   ridgeContext.fillStyle = ridgeGradient;
   ridgeContext.fillRect(0, 0, ridgeCanvas.width, ridgeCanvas.height);

}

function generateSideNormalTexture(numRidges, numStepsPerRidge) {

   let ridgeCanvas = document.getElementById("ridgeCanvasNormals");
   let ridgeContext = ridgeCanvas.getContext("2d");
   let singleStep = (ridgeCanvas.width / (numRidges * numStepsPerRidge));
   let radArr = [
      Math.PI / 2,
      Math.PI / 4,
      0,
      Math.PI / 4,
      Math.PI / 2,
      (Math.PI / 2) + (Math.PI / 4),
      Math.PI,
      (Math.PI / 2) + (Math.PI / 4),
      Math.PI / 2
   ]
   let tempString = "";

   for (let pos = 0; pos < ridgeCanvas.width; ) {

      for (let tempRad in radArr) {
         let r = Math.floor((.5 + (Math.cos(radArr[tempRad]) / 2)) * 255);
         let g = 128;
         let b = Math.floor(Math.sin(radArr[tempRad]) * 255);
   
         tempString = "rgb(" + r + ", " + g + ", " + b + ")";

         ridgeContext.fillStyle = tempString;
         ridgeContext.fillRect(pos, 0, singleStep, ridgeCanvas.height);

         pos += singleStep;
      }

   }

}

function repeatArray(arr, timesRepeated) {

   let tempArr = [];

   for (let i = 0; i < timesRepeated; i++) {
      for (let j = 0; j < arr.length; j++) {
         tempArr[j + i*arr.length] = arr[j];
      }
   }

   return tempArr;

}

function generateFaceBuffGeo(pntArr, UVArr, pntsPerVert, pntsPerUV, indicies) {

   let tempBufferGeo = new THREE.BufferGeometry();

   tempBufferGeo.setAttribute( 'position', new THREE.BufferAttribute(
    new Float32Array(pntArr),
    pntsPerVert
   ));
   tempBufferGeo.setAttribute( 'normal', new THREE.BufferAttribute(
    new Float32Array(generateFaceNormals(pntArr)),
    pntsPerVert
   ));
   tempBufferGeo.setAttribute( 'uv', new THREE.BufferAttribute(
    new Float32Array(UVArr),
    pntsPerUV
   ));
   tempBufferGeo.setIndex(indicies);

   return tempBufferGeo

}

function generateSideBuffGeo(pntArr, UVArr, PPVert, PPUV, indicies, numTri) {

   let tempBufferGeo = new THREE.BufferGeometry();

   tempBufferGeo.setAttribute( 'position', new THREE.BufferAttribute(
    new Float32Array(pntArr),
    PPVert
   ));
   tempBufferGeo.setAttribute( 'normal', new THREE.BufferAttribute(
    new Float32Array(generateCoinSideNormals(numTri)),
    PPVert
   ));
   tempBufferGeo.setAttribute( 'uv', new THREE.BufferAttribute(
    new Float32Array(UVArr),
    PPUV
   ));
   tempBufferGeo.setIndex(indicies);

   return tempBufferGeo

}

function makeBuffGeos(timesRepeated) {

   const coinSteps = 60; const numRidges = 120; const numStepsPerRidge = 9;
   const radius = .25; const coinDepth = .035;
   const depthOffset = coinDepth / 2;
   const uvPointsPerVert = 2;

   const [coinTopFacePoints, coinTopFaceIndexes] = 
    generateCoinFacePoints(coinSteps, radius, depthOffset);
   const [coinBotFacePoints, coinBotFaceIndexes] = 
    generateCoinFacePoints(coinSteps, radius, depthOffset);
   const UVFacePoints = generateCoinFaceUVs(coinSteps);
   let UVSidePoints = generateRidgeUVs(
    numRidges /timesRepeated, numStepsPerRidge);
   UVSidePoints = repeatArray(UVSidePoints,timesRepeated);

   //make coinTop (front)
   const coinPointsPerVert = 3;
   let coinTopBufferGeo = generateFaceBuffGeo(
   coinTopFacePoints, UVFacePoints, 
   coinPointsPerVert, uvPointsPerVert, coinTopFaceIndexes);

   //make coinBot (back)
   let coinBotBufferGeo = generateFaceBuffGeo(
   coinBotFacePoints, UVFacePoints, 
   coinPointsPerVert, uvPointsPerVert, coinBotFaceIndexes);
   coinBotBufferGeo.rotateY(Math.PI);

   //make coinSide
   let [coinSidePoints, coinSideIndexes] = 
   generateCoinSidePoints(numStepsPerRidge * numRidges, radius, depthOffset);
   coinSidePoints = repeatArray(coinSidePoints, timesRepeated);
   coinSideIndexes = repeatArray(coinSideIndexes, timesRepeated);

   let coinSideBufferGeo = generateSideBuffGeo(
   coinSidePoints, UVSidePoints, coinPointsPerVert, 
   uvPointsPerVert, coinSideIndexes, numRidges * numStepsPerRidge)

   return mergeBufferGeometries(
    [coinTopBufferGeo, coinBotBufferGeo, coinSideBufferGeo], true)

}

function makeCoins() {

   const numRidges = 120; 
   const numStepsPerRidge = 9;
   const timesRepeated = numRidges / numStepsPerRidge;

   const loader = new THREE.TextureLoader();
   const smokeyFaceMaterial = new THREE.MeshPhongMaterial(
    {map: loader.load('./Phase5/Quarter/smokeyFaceBetter.jpg')}
   );
   const headsFaceMaterial = new THREE.MeshPhongMaterial(
    {map: loader.load('./Phase5/Quarter/headsFaceBetter.jpg')}
   );
   generateRidgeDisplacementTexture(numRidges /timesRepeated); 
   generateSideNormalTexture(numRidges / timesRepeated, numStepsPerRidge);
   let ridgeCanvasDisplacement = document.getElementById("ridgeCanvasDisplacement");
   let ridgeCanvasDisplacementTexture = new THREE.CanvasTexture(ridgeCanvasDisplacement);
   let ridgeCanvasNormal = document.getElementById("ridgeCanvasNormals");
   let ridgeCanvasNormalTexture = new THREE.CanvasTexture(ridgeCanvasNormal);
   const coinSideMaterial = new THREE.MeshStandardMaterial(
    {
     displacementMap: ridgeCanvasDisplacementTexture,
     normalMap: ridgeCanvasNormalTexture,
     map: loader.load('./Phase5/Quarter/albedo.png'),
     displacementScale: 0.005,
     displacementBias: -0.005,
     metalness: 0.8,
     roughness: 0.5
    }
   );

   //Combine buffergeo's together, and make them into a mesh!
   let materialArr = [smokeyFaceMaterial, headsFaceMaterial, coinSideMaterial]
   let fullCoin = makeBuffGeos(timesRepeated);
   let fullCoinMesh = new THREE.Mesh(fullCoin, materialArr);
   fullCoinMesh.name = "Full Coin"

   fullCoinMesh.position.set(
    (Gallery.hallWidth / 4) * -1,
    0.375, //colTop height + (3/8 of latheGeo)
    Gallery.hallLength / 2 - (Gallery.hallLength / 8) * 3
   );
   fullCoinMesh.rotateY(Math.PI / 2);

   Gallery.scene.add(fullCoinMesh);
   
}

export default function() {makeCoins()}