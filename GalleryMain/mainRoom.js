import CSG from '../CSG/three-csg.js';
import {Gallery} from './consolidator.js';

function makeColumns() {
   let lathePoints = [];
   let tempInc = 0.02604;
   let numPoints = 24;
   let numColumns = 14;

   for (let i = 0; i < numPoints; i++) {
      lathePoints[i] = new THREE.Vector2(
       Math.cos(-0.5 + tempInc * i) / (numColumns / 2),
       Math.sin(-0.5 + tempInc * i) / (numColumns / 2)
      );
   }

   let latheGeo = new THREE.LatheGeometry(lathePoints, numPoints);
   let latheMaterial = Gallery.textures.gold;
   let topLathe = new THREE.Mesh(latheGeo, latheMaterial);
   let botLathe = new THREE.Mesh(latheGeo.clone(), latheMaterial);
   let colTopWidth = 0.5; let colTopDepth = 0.1; let colTopLength = 0.5;
   let colTopGeo = new THREE.BoxGeometry(colTopWidth,colTopDepth,colTopLength);
   let columnTop = new THREE.Mesh(colTopGeo, Gallery.textures.marble);
   let colMidRadTop = 0.125; let colMidRadBot = 0.125; let colMidHeight = 1.3;
   let colMidRadSegments = 16;
   let columnMiddle = new THREE.Mesh(
    new THREE.CylinderGeometry(
     colMidRadTop, 
     colMidRadBot, 
     colMidHeight, 
     colMidRadSegments
    ),
    Gallery.textures.marble
   );
   let columnBot = new THREE.Mesh(colTopGeo.clone(), Gallery.textures.marble);

   let modelGroup = new THREE.Group();
   modelGroup.add(columnTop, columnMiddle, columnBot, topLathe, botLathe);
   modelGroup.position.set(
    (Gallery.hallWidth / 4) * -1,
    -1 * (Gallery.hallHeight / 4) + colTopDepth / 2,
    Gallery.hallLength / 2 - Gallery.hallLength / 8
   );

   let offset = 0;
   let side = -1; //left

   for (let i = 0; i < numColumns; i++) {
      //.clone uses a shallow copy of the geometry
      let tempColumn = realClone(modelGroup, colMidHeight);
      tempColumn.position.set(
       (Gallery.hallWidth / 4) * side,
       -1 * (Gallery.hallHeight / 4) + colTopDepth / 2,
       Gallery.hallLength / 2 - Gallery.hallLength / 8
      );
      tempColumn.position.z -= (Gallery.hallLength / 8) * offset;
      offset++;
      nameCol(tempColumn);
      Gallery.scene.add(tempColumn);

      if (i === numColumns / 2 - 1) {
         side = 1; //right
         offset = 0;
      }
   }
}

/*cloning a group will make them share the same world pos in the geometry level,
so I am forced to make this realClone method. I've tried update the vertex info
but can't find a way threejs allows that works, so here we are.*/
function realClone(modelGroup, colMidHeight) {
   let tempGroup = new THREE.Group();

   modelGroup.traverse( (obj) => {
      if (obj.geometry != undefined) {
         tempGroup.add(new THREE.Mesh(obj.geometry.clone(), obj.material));
      }
   });
   nameColParts(tempGroup.children);

   tempGroup.getObjectByName("botLathe").rotateX(Math.PI);
   tempGroup.getObjectByName("topLathe").position.y += Gallery.hallHeight / 4;
   tempGroup.getObjectByName("botLathe").position.y -= Gallery.hallHeight / 4;
   tempGroup.getObjectByName("columnTop").position.y += colMidHeight / 2;
   tempGroup.getObjectByName("columnBot").position.y -= colMidHeight / 2;

   return tempGroup;
}

function nameColParts(childArr) {
   childArr[0].name = "columnTop";
   childArr[1].name = "columnMiddle";
   childArr[2].name = "columnBot";
   childArr[3].name = "topLathe";
   childArr[4].name = "botLathe";
}

function nameCol(tempCol) {
   tempCol.name = `Column(${tempCol.position.x}, ${tempCol.position.z})`;
}

function makeBricks() {
   let planeSegments = 5;
   let planeGeometrySide = new THREE.PlaneGeometry(
    Gallery.brickWidth,
    Gallery.brickHeight,
    planeSegments,
    planeSegments
   );
   let wallBlock = new THREE.Mesh(planeGeometrySide, Gallery.textures.bricks);
   let xStart = Gallery.hallWidth / 2;
   let count = 0;
   let wallRotation = -0.5 * Math.PI;
   let leftWall = new THREE.Group();
   leftWall.name = "Left Wall";
   let rightWall = new THREE.Group();
   rightWall.name = "Right Wall";
   let backWall = new THREE.Group();
   backWall.name = "Back Wall";

   //fill the left and right walls with blocks
   for (let i = 0; i < (Gallery.hallLength / Gallery.brickWidth) * 2; i++) {
      let zStart = -1 * (Gallery.hallLength / 2) + Gallery.brickWidth / 2;
      let zOffset = Gallery.brickWidth * count;
      let tempBlock = wallBlock.clone();
      tempBlock.position.add(new THREE.Vector3(xStart, 0, zStart + zOffset));
      tempBlock.rotateY(wallRotation);
      if (i === Gallery.hallLength / Gallery.brickWidth - 1) {
         xStart *= -1;
         count = 0;
         wallRotation *= -1;
      } 
      else {
         count++;
      }
      if (i < Gallery.hallLength / Gallery.brickWidth) {
         rightWall.add(tempBlock);
      }
      else {
         leftWall.add(tempBlock);
      }
   }
   Gallery.scene.add(rightWall);
   Gallery.scene.add(leftWall);

   //fill back wall with blocks
   count = 0;
   for (let i = 0; i < Gallery.hallWidth / Gallery.brickWidth; i++) {
      let zStart = Gallery.hallLength / 2;
      let xStart = -1 * (Gallery.hallWidth / 4);
      let xOffset = Gallery.brickWidth * count;
      let tempBlock = wallBlock.clone();
      tempBlock.position.add(new THREE.Vector3(xStart + xOffset, 0, zStart));
      tempBlock.rotateY(Math.PI);
      count++;
      backWall.add(tempBlock);
   }
   Gallery.scene.add(backWall);
}

function makeFlats() {
   // create the planes for the ceiling and floor
   let planeSegments = 10;
   let planeGeometryFlat = new THREE.PlaneGeometry(
    Gallery.hallWidth,
    Gallery.hallLength,
    planeSegments,
    planeSegments
   );
   let floorMaterial = Gallery.textures.oakPlank;
   setRotation(floorMaterial, Math.PI / 2);
   setRepeatCount(floorMaterial, 8, 4);
   //If you don't .clone(), the geometry is shared, 
   //and the matrixWorld is the same. 
   let floor = new THREE.Mesh(planeGeometryFlat.clone(), floorMaterial);
   floor.name = "Floor";
   floor.rotateX(-0.5 * Math.PI);
   let ceilingMaterial = Gallery.textures.plasterCeiling;
   setRepeatCount(ceilingMaterial, 8, 16);
   let ceiling = new THREE.Mesh(planeGeometryFlat.clone(), ceilingMaterial);
   ceiling.name = "Ceiling";
   ceiling.rotateX(0.5 * Math.PI);

   //position and rotate all box planes.
   floor.position.set(0, -1 * (Gallery.hallHeight / 2), 0);
   ceiling.position.set(0, Gallery.hallHeight / 2, 0);

   Gallery.scene.add(floor);
   Gallery.scene.add(ceiling);
   floor.receiveShadow = true;
   ceiling.receiveShadow = true;

   let frontWallDepth = 0.1;
   let frontWallCubeGeometry = new THREE.BoxGeometry(
    Gallery.hallWidth,
    Gallery.hallHeight,
    frontWallDepth
   );
   let frontWallMaterial = Gallery.textures.plaster;
   setRepeatCount(frontWallMaterial, 4, 1);

   let frontWallWindowGeo = new THREE.BoxGeometry(
    Gallery.hallWidth / 2,
    Gallery.hallHeight / 2,
    0.1
   );

   let frontWall = new THREE.Mesh(frontWallCubeGeometry, frontWallMaterial);
   let frontWallWindow = new THREE.Mesh(frontWallWindowGeo, frontWallMaterial);
   let csgBig = new CSG.fromMesh(frontWall);
   let csgSmall = new CSG.fromMesh(frontWallWindow);
   let csgFinal = csgBig.subtract(csgSmall);
   frontWall = CSG.toMesh(csgFinal, frontWall.matrix, Gallery.textures.plaster);
   frontWall.name = "Front Wall";

   frontWall.position.set(0, 0,
     -1 * (Gallery.hallLength / 2) - (frontWallDepth / 4));

   Gallery.scene.add(frontWall);
}

function makeTrim() {
   //making of the trim
   let trimSideWidth = 0.1; let trimSideDepth = 0.02;
   let trimGeometrySide = new THREE.BoxGeometry(
    trimSideWidth, 
    Gallery.hallHeight / 2, 
    trimSideDepth
   );
   let trimVertLenth = Gallery.hallWidth / 2 - 0.2; 
   let trimGeometryVert = new THREE.BoxGeometry(
    trimVertLenth,
    trimSideWidth,
    trimSideDepth
   );
   let trimMaterialVert = Gallery.textures.oakVeneerVert;
   setRepeatCount(trimMaterialVert, 0.3, 6);
   let trimMaterialHoriz = Gallery.textures.oakVeneerHoriz;
   setRepeatCount(trimMaterialHoriz, 0.3, 3);
   setRotation(trimMaterialVert, Math.PI / 2);

   /*When you do something like trimRight.clone(), it's a deep copy EXCEPT for
   the geometry, whose worldposition is SHARED. Becuase in intersections.js I
   am using the unique world positions, I need to create a new mesh in which
   clones the geometry.*/
   let trimRight = new THREE.Mesh(trimGeometrySide, trimMaterialHoriz);
   trimRight.name = "Trim Right";
   let trimLeft = new THREE.Mesh(trimGeometrySide.clone(), trimMaterialHoriz);;
   trimLeft.name = "Trim Left";
   let trimTop = new THREE.Mesh(trimGeometryVert, trimMaterialVert);
   trimTop.name = "Trim Top";
   let trimBot = new THREE.Mesh(trimGeometryVert.clone(), trimMaterialVert);
   trimBot.name = "Trim Bot";

   trimRight.position.set(
    Gallery.hallWidth / 4 - (trimSideWidth / 2),
    0,
    (-1 * Gallery.hallLength) / 2 - (trimSideWidth / 4)
   );
   trimLeft.position.set(
    -1 * (Gallery.hallWidth / 4 - (trimSideWidth / 2)),
    0,
    (-1 * Gallery.hallLength) / 2 - (trimSideWidth / 4)
   );
   trimTop.position.set(
    0,
    Gallery.hallHeight / 4 - (trimSideWidth / 2),
    (-1 * Gallery.hallLength) / 2 - (trimSideWidth / 4)
   );
   trimBot.position.set(
    0,
    -1 * (Gallery.hallHeight / 4 - (trimSideWidth / 2)),
    (-1 * Gallery.hallLength) / 2 - (trimSideWidth / 4)
   );

   Gallery.scene.add(trimRight, trimLeft, trimBot, trimTop);
}

function makeShelves() {
   //shelves
   let shelfWidth = Gallery.hallWidth / 12; let shelfHeight = 0.02;
   let shelfGeometry = new THREE.BoxGeometry(
    shelfWidth,
    shelfHeight,
    Gallery.hallLength
   );
   let shelfMaterial = Gallery.textures.oakVeneer;
   setRepeatCount(shelfMaterial, 1, 25);

   let shelf1 = new THREE.Mesh(shelfGeometry.clone(), shelfMaterial);
   shelf1.position.set(
    -1 * (Gallery.hallWidth / 2) + shelfWidth / 2,
    -0.5,
    0
   );
   shelf1.name = "Bot Left Shelf";
   let shelf2 = new THREE.Mesh(shelfGeometry.clone(), shelfMaterial);
   shelf2.position.set(
    -1 * (Gallery.hallWidth / 2) + shelfWidth / 2,
    0.5,
    0
   );
   shelf2.name = "Top Left Shelf";
   let shelf3 = new THREE.Mesh(shelfGeometry.clone(), shelfMaterial);
   shelf3.position.set(Gallery.hallWidth / 2 - shelfWidth / 2, -0.5, 0);
   shelf3.name = "Bot Right Shelf";
   let shelf4 = new THREE.Mesh(shelfGeometry.clone(), shelfMaterial);
   shelf4.position.set(Gallery.hallWidth / 2 - shelfWidth / 2, 0.5, 0);
   shelf4.name = "Top Right Shelf";

   Gallery.scene.add(shelf1, shelf2, shelf3, shelf4);
}

function setRepeatCount(text, x, y) {
   text.map.wrapS = THREE.RepeatWrapping;
   text.map.wrapT = THREE.RepeatWrapping;
   text.map.repeat.set(x, y);
   text.normalMap.wrapS = THREE.RepeatWrapping;
   text.normalMap.wrapT = THREE.RepeatWrapping;
   text.normalMap.repeat.set(x, y);
   text.roughnessMap.wrapS = THREE.RepeatWrapping;
   text.roughnessMap.wrapT = THREE.RepeatWrapping;
   text.roughnessMap.repeat.set(x, y);
}

function setRotation(text, x) {
   text.map.rotation = x;
   text.normalMap.rotation = x;
   text.roughnessMap.rotation = x;
}

//call functions needed
function makeMainRoom() {

   makeBricks();

   makeFlats();

   makeTrim();

   makeColumns();

   makeShelves();

}

export default function() {makeMainRoom()}