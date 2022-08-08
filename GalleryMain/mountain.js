import {Gallery} from './consolidator.js';

function makeMountain() {

   //Makes landscape using diamond-square fractal method
   //Valid grids are 2^n + 1 size
   const levelOfDetail = 7; //also called n
   const mountainSize = 50; //(scale)
   const firstPoint = 25;
   let randomVal = firstPoint;
   let hVal = -0.7
   

   //also Incriments Random
   function getIncRand() {
      if (randomVal === firstPoint) {
         randomVal *= (2 ** hVal)
         return firstPoint;
      }
      return getRandValue(randomVal *= (2 ** hVal) * //val
       (Math.round(Math.random()) ? 1 : -1));        //+or-
   }

   function getRandValue(max) {
      return Math.floor(Math.random() * max)
   }

   function diamondStep(arr, squareSize, width) {
      const half = squareSize / 2;
      for (let i = half; i < width; i += squareSize) {
         for (let j = half; j < width; j += squareSize) {
            arr[i][j] = setDiamondPoint(arr, i, j, half);
         }
      }
   }

   function setDiamondPoint(arr, x, y, half) {
      return (
         (arr[x - half][y - half] +      //top left
         arr[x - half][y + half] +      //bot left
         arr[x + half][y - half] +      //top right
         arr[x + half][y + half]        //bot right
      ) / 4) + getIncRand();  
   }
   
   function squareStep(arr, squareSize, width) {
      let half = squareSize / 2;

      for (let i = half; i <= width; i += squareSize) {
         for (let j = 0; j <= width; j += squareSize) {
            //check if this side of the mountain is facing window
            if (i === width / 2 && j === 0) {
               arr[i][j] = firstPoint / 5;
               arr[j][i] = setSquarePoint(arr, j, i, squareSize, width);
               continue
            }
            arr[i][j] = setSquarePoint(arr, i, j, squareSize, width);
            arr[j][i] = setSquarePoint(arr, j, i, squareSize, width);
         }
      }
   }

   //uses wrap around!
   //might have a problem with wrap around default being set to 0 and still
   //doing a divide by 4 instead of 3
   function setSquarePoint(arr, x, y, squareSize, width) {
      let half = squareSize / 2;

      return ((
       arr[x === 0 ? width - half : x - half][y] + //up
       arr[x === width ? half : x + half][y] + //down
       arr[x][y === 0 ? width - half : y - half] + //left
       arr[x][y === width ? half : y + half]   //right
      ) / 4) + getIncRand();
   }

   const width = (2 ** levelOfDetail);
   let squareSize = (2 ** levelOfDetail); 

   // + 1 since valid grids are 2^n + 1
   let vertexArr = [];

   //initialize all of the arr with NaN
   for (let i = 0; i < width + 1; i++) {
      let tempArr = []
      for (let j = 0; j < width + 1; j++) {
         tempArr.push(NaN);
      }
      vertexArr.push(tempArr);
   }

   //init corners
   vertexArr[0][0] = 0; //top left corner
   vertexArr[0][width] = 0; //top right corner
   vertexArr[width][0] = 0; // bot left corner
   vertexArr[width][width] = 0; //bot right corner

   while (squareSize !== 1) {
      diamondStep(vertexArr, squareSize, width);
      randomVal /= 2;
      squareStep(vertexArr, squareSize, width);
      randomVal /= 2;
      squareSize /= 2;
   }

   //normalize arr values to range 0 - 1
   for (let i = 0; i < width + 1; i++) {
      for (let j = 0; j < width + 1; j++) {
         vertexArr[i][j] /= (firstPoint / mountainSize);
      }
   }

   //set positions
   let triPosArr = [];
   const sizePerTri = mountainSize / width;
   const pointsPerVert = 3;

   for (let i = 0; i < width + 1; i++) {
      for (let j = 0; j < width + 1; j++) {
         triPosArr.push(i * sizePerTri); //xVal
         triPosArr.push(vertexArr[i][j]); //yVal
         triPosArr.push(j * -sizePerTri); //zVal (negative since that's away)
      }
   }

   //set indicies
   let indexArr = [];

   //start is equivalent to triIdx, width ** 2 + width - 1 for 
   for (let start = 0; start < (width ** 2) + width - 1; start++) {
      if ((start + 1) % (width + 1) === 0) continue;
      indexArr.push(start, start + width + 1, start + width + 2,  //bot tri
       start, start + width + 2, start + 1);                      //top tri
   }

   //make and set Buff Geo
   let mountainBuffGeo = new THREE.BufferGeometry();
   mountainBuffGeo.setAttribute( 'position', new THREE.BufferAttribute(
    new Float32Array(triPosArr),
    pointsPerVert
   ));
   mountainBuffGeo.setIndex(indexArr);
   mountainBuffGeo.computeVertexNormals();
   
   //make mesh and throw into the scene!
   let mountainMesh = new THREE.Mesh(mountainBuffGeo, Gallery.textures.plaster);
   mountainMesh.geometry.center(); //center the obj

   //position the mountain
   mountainMesh.position.set(0, 0, -Gallery.hallLength - mountainSize);
   Gallery.scene.add(mountainMesh);

   //make sunlight to light up mountain!
   //const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
   //directionalLight.castShadow = true;

   //Gallery.scene.add(directionalLight);

}



export default function() {makeMountain()};