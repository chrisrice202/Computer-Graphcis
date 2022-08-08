import CSG from '../CSG/three-csg.js';
import {Gallery} from './consolidator.js';

function loadMusicBox() {
   let loader = new THREE.GLTFLoader();

   // Load a glTF resource
   loader.load(
      // resource URL
      "./Blender/betterMusicBox.glb",
      // called when the resource is loaded
      function (musicBox) {
         let musicMaterial = Gallery.textures.gold;
         let musicMesh = new THREE.Mesh(
          musicBox.scene.children[2].geometry,
          musicMaterial
         );
         musicMesh.name = "GLTF Music Box"
         musicMesh.rotateX(-0.5 * Math.PI);
         musicMesh.rotateY(0.5 * Math.PI);

         musicMesh.position.set(
          (Gallery.hallWidth / 4) * -1,
          0.375, //colTop height + (3/8 of latheGeo)
          Gallery.hallLength / 2 - (Gallery.hallLength / 8) * 2
         );

         Gallery.scene.add(musicMesh);
      }
   );
}

function loadBoxHoles() {
   let loader = new THREE.GLTFLoader();

   // Load a glTF resource
   loader.load(
      // resource URL
      "./Blender/boxHoles.glb",
      // called when the resource is loaded
      function (musicbox) {
         let wireframe = new THREE.WireframeGeometry(
          musicbox.scene.children[0].geometry
         );
         let line = new THREE.LineSegments(wireframe);
         line.rotateY(-0.5 * Math.PI);

         Gallery.scene.add(line);
      }
   );
}

function removeCylOffset(cylRadius, cylDepth, insideCylOffset, cylMaterial) {
   let tempCylCSG;
   let tempCylRadius = cylRadius - insideCylOffset;
   let tempCylDepth = insideCylOffset * 2;
   let tempCylSegments = 40;
   let tempCylGeo = new THREE.CylinderGeometry(
    tempCylRadius,
    tempCylRadius,
    tempCylDepth,
    tempCylSegments
   );
   tempCylCSG = new CSG.fromMesh(new THREE.Mesh(tempCylGeo.clone()
    .translate(0, cylDepth / 2, 0), cylMaterial));
   tempCylCSG = tempCylCSG.union(new CSG.fromMesh(new THREE.Mesh(
    tempCylGeo.clone().translate(0, -cylDepth / 2, 0), cylMaterial)));

   return tempCylCSG;
}

function makeTeeth(cylSegments, cylDepth, cylRadius) {
   let numRings = 16;
   let toothGroup = new THREE.Group();
   let toothLengthScale = 2.5;
   let toothLength = (cylDepth / numRings) / toothLengthScale;
   let toothWidthScale = 4;
   let toothWidth = (2 * Math.PI * cylRadius) / cylSegments / toothWidthScale;
   let toothPoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0, toothWidth),
    new THREE.Vector2(toothLength, toothWidth),
    new THREE.Vector2(toothLength, 0),
    new THREE.Vector2(0, 0),
   ];
   let toothShape = new THREE.Shape(toothPoints);
   let toothSettings = {
    steps: 2,
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelOffset: 0,
    bevelSegments: 5,
   };
   let toothGeo = new THREE.ExtrudeGeometry(toothShape, toothSettings);
   toothGeo.center(); //CENTER ORIGIN OF SHAPE BACK ON GEOMETRY
   let toothMaterial = Gallery.textures.gold;
   let toothMesh = new THREE.Mesh(toothGeo, toothMaterial);

   //make and place teeth
   let scaler = 4;
   for (let i = 0; i < Gallery.toothPositions.positions.length; i++) {
      let tempTooth = new THREE.Mesh(toothMesh.geometry.clone(), toothMaterial);
      tempTooth.geometry.rotateY(-0.5 * Math.PI);
      //I feel like this if statement could be more eloquent
      if (Gallery.toothPositions.positions[i][0] < 0) {
         tempTooth.geometry.rotateZ(
          -1 * Gallery.toothPositions.positions[i][1] * scaler);
      } 
      else {
         tempTooth.geometry.rotateZ(
          Gallery.toothPositions.positions[i][1] * scaler);
      }

      tempTooth.geometry.translate(
       Gallery.toothPositions.positions[i][0],
       Gallery.toothPositions.positions[i][1],
       Gallery.toothPositions.positions[i][2]
      );

      toothGroup.add(tempTooth);
   }

   return toothGroup;
}

function loadManualMusicBox() {
   let cylRadius = 0.25;
   let cylDepth = 0.8;
   let cylSegments = 40;
   let cylGeo = new THREE.CylinderGeometry(
    cylRadius,
    cylRadius,
    cylDepth,
    cylSegments
   );
   let cylMaterial = Gallery.textures.gold;
   let cylMesh = new THREE.Mesh(cylGeo, cylMaterial);
   let cylCSG = new CSG.fromMesh(cylMesh);
   let insideCylOffset = 0.05;
   let tempCylCSG = removeCylOffset(
    cylRadius,
    cylDepth,
    insideCylOffset,
    cylMaterial
   );
   let toothGroup = new THREE.Group();

   //make base indents and base cyl
   cylCSG = cylCSG.subtract(tempCylCSG);

   //add in two end cylinders
   let tempCylRadius = 0.025;
   let tempCylDepth = 0.2;
   let tempCylGeo = new THREE.CylinderGeometry(
      tempCylRadius,
      tempCylRadius,
      tempCylDepth,
      cylSegments
   );

   cylCSG = cylCSG.union(new CSG.fromMesh(new THREE.Mesh(tempCylGeo.clone()
    .translate(0, cylDepth / (2 - insideCylOffset) + (tempCylDepth / 8), 0), 
    cylMaterial)));
   cylCSG = cylCSG.union(new CSG.fromMesh(new THREE.Mesh(tempCylGeo.clone()
    .translate(0, -cylDepth / (2 - insideCylOffset) - (tempCylDepth / 8), 0), 
    cylMaterial)));

   //add in teeth!
   toothGroup = makeTeeth(cylSegments, cylDepth, cylRadius);

   //finalize
   cylMesh = CSG.toMesh(cylCSG, cylMesh.matrix, Gallery.textures.gold);
   cylMesh.geometry.rotateX(Math.PI * 0.5);


   for (let val in toothGroup.children) {
      toothGroup.children[val].position.set(
       (Gallery.hallWidth / 4) * -1,
       cylRadius * 1.5, //scale the y
       Gallery.hallLength / 2 - Gallery.hallLength / 8
      );
   }
   cylMesh.position.set(
    (Gallery.hallWidth / 4) * -1,
    cylRadius * 1.5, // scale the y
    Gallery.hallLength / 2 - Gallery.hallLength / 8
   );

   toothGroup.name = "Manual Tooth Group (Music Box)";
   cylMesh.name = "Manual Music Box";

   Gallery.scene.add(toothGroup);
   Gallery.scene.add(cylMesh);
}

function makeMusicBoxes() {

   loadMusicBox();

   loadManualMusicBox();

}

export default function() {makeMusicBoxes()};