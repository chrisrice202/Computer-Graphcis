import {Gallery} from './consolidator.js';

//only global var
let totalTriArr;

let pressedKeys = {
   "ControlLeft": 0,
   "KeyX": 0,
   "KeyP": 0,
   "KeyT": 0
};

function intersectsBoundingBox(boundingBox, cam) {

   let scalarVals = new Set();
   let scalarIntersections = [];
   let camVec = new THREE.Vector3(0, 0, 0);
   cam.getWorldDirection(camVec); //is unit length
   const camPos = cam.position;

   const boxValues = {
      x: {
         min: Math.min(boundingBox.min.x, boundingBox.max.x),
         max: Math.max(boundingBox.min.x, boundingBox.max.x)
      },
      y: {
         min: Math.min(boundingBox.min.y, boundingBox.max.y),
         max: Math.max(boundingBox.min.y, boundingBox.max.y)
      },
      z: {
         min: Math.min(boundingBox.min.z, boundingBox.max.z),
         max: Math.max(boundingBox.min.z, boundingBox.max.z)
      }
   }

   //compute all possible scalars (non-duplicated)
   for (let axis in boxValues) {
      //this is interesting since axis.min has data of boxVal,
      //but camPos[axis] does not (I think it's cuz they're both hash tables)
      const scalarMin = (boxValues[axis].min - camPos[axis]) / camVec[axis];
      const scalarMax = (boxValues[axis].max - camPos[axis]) / camVec[axis];
      if (scalarMin >= 0) scalarVals.add(scalarMin);
      if (scalarMax >= 0) scalarVals.add(scalarMax);
   }
   
   //check against!
   scalarVals.forEach((scalar) => {
      const xVal = camPos.x + (scalar * camVec.x);
      const yVal = camPos.y + (scalar * camVec.y);
      const zVal = camPos.z + (scalar * camVec.z);

      if (xVal >= boxValues.x.min && xVal <= boxValues.x.max &&
       yVal >= boxValues.y.min && yVal <= boxValues.y.max  &&
       zVal >= boxValues.z.min && zVal <= boxValues.z.max ) {
         scalarIntersections.push(scalar);
      }

   });

   //only return the min value (i.e the scalar at which we FIRST hit)
   return Math.min(...scalarIntersections);

}

//Using ctrl+x, show all intersection bounding boxes
function computeBoundingBoxIntersections(cam) {

   let reportArr = [];

   Gallery.scene.traverse( (obj) => {
      if (obj.name !== "") {
         //Check if obj is not a group
         //These statements make triangles and compare against them
         if (obj.type !== "Group") { 
            let boundingBox = obj.geometry.boundingBox.clone();
            //Checking if there was actually a hit, if there wasn't,
            //intersectsBoundingBox defaults to infinity
            let hit = intersectsBoundingBox(boundingBox, cam);
            if (hit !== Infinity) {
               let tempObj = obj;
               let name = tempObj.name;
               while (tempObj.parent !== null) {
                  name = tempObj.parent.name + ":" + name;
                  tempObj = tempObj.parent;
               }
               reportArr.push({"name": name, "scalar": hit});
            }
         }
         else { //These statements make triangles and compare against them
            if (obj.name === "Right Wall" || obj.name === "Left Wall" || 
             obj.name === "Back Wall") {
               let boundingBox = obj.boundingBox.clone();
               let hit = intersectsBoundingBox(boundingBox, cam);
               if (hit !== Infinity) {
                  let name = obj.name;
                  reportArr.push({"name": name, "scalar": hit});
               }
            } 
         }
      }
   });   

   //report all intersections
   console.log(reportArr.sort( (a, b) => a["scalar"] - b["scalar"]) );

}

function showIntersections(cam) {

   //Compute All Bounding Boxes
   Gallery.scene.traverse( (obj) => {
      if (obj.name !== "") {
         //Check if obj is not a group (groups don't have Bounding Boxes yet)
         //These statements convert all Object's Bounding Boxes to World Coords
         if (obj.type !== "Group") { 
            obj.geometry.computeBoundingBox();
            let boundingBox = obj.geometry.boundingBox;
            boundingBox.min = obj.localToWorld(boundingBox.min);
            boundingBox.max = obj.localToWorld(boundingBox.max);
         }
         else { //Create a boundingBox property for walls that are only groups
            if (obj.name === "Right Wall" || obj.name === "Left Wall" || 
             obj.name === "Back Wall") {
               let tempBox = new THREE.Box3();
               tempBox.setFromObject(obj);
               obj.boundingBox = tempBox;
            } 
         }
      }
   });

   window.addEventListener('keydown', (event) => {
      pressedKeys[event.code] = 1;
   });

   //actually call the func
   //called in keyup so that func is only called once
   window.addEventListener('keyup', (event) => {
      if (pressedKeys["ControlLeft"] === 1 && pressedKeys["KeyX"] === 1 ) {
         computeBoundingBoxIntersections(cam);
      }

      if (pressedKeys["KeyP"] === 1 ) {
         totalTriArr = preProcessTriangles();
      }
      pressedKeys[event.code] = 0;
   });

}

function preProcessTriangles() {
   let totalTriArr = [];
   Gallery.scene.traverse( (obj) => {
      if (obj.name !== "") {
         if (obj.type !== "Group") { 
            totalTriArr.push(buildTriangles(obj));
         }
         else { //Create a boundingBox property for walls that are only groups
            if (obj.name === "Right Wall" || obj.name === "Left Wall" || 
             obj.name === "Back Wall" || 
             obj.name === "Manual Tooth Group (Music Box)") {
               for (let val in obj.children) {
                  totalTriArr.push(buildTriangles(obj.children[val]));
                  if (obj.name === "Manual Tooth Group (Music Box)") {
                     console.log(obj.children[val]);
                  }
               }
            } 
         }
      }
   });
   return totalTriArr;
}

function buildTriangles(obj) {
   let triPoints = obj.geometry.getAttribute('position').array;
   let triIndicies;
   if (obj.geometry.getIndex() !== null) {
      triIndicies = obj.geometry.getIndex().array;
   }
   let triArr = []

   //convert the two typed arrays into one single tri point array with Vector3s
   //yes this duplicates vertexes
   let triPointArr = [];
   //the only reason this if statement exists is cuz of 
   //CSG stuff, since it isn't indicied
   if (triIndicies !== undefined) {
      for (let i = 0; i < triIndicies.length;) {
         //p1
         triPointArr.push(obj.localToWorld(new THREE.Vector3(
          triPoints[triIndicies[i] * 3],
          triPoints[triIndicies[i] * 3 + 1],
          triPoints[triIndicies[i] * 3 + 2]
         )));
         i++; //next point
         //p2
         triPointArr.push(obj.localToWorld(new THREE.Vector3(
          triPoints[triIndicies[i] * 3],
          triPoints[triIndicies[i] * 3 + 1],
          triPoints[triIndicies[i] * 3 + 2]
         )));
         i++; //next point
         //p3
         triPointArr.push(obj.localToWorld(new THREE.Vector3(
          triPoints[triIndicies[i] * 3],
          triPoints[triIndicies[i] * 3 + 1],
          triPoints[triIndicies[i] * 3 + 2]
         )));
         i++; //next point
      }
   }
   else {
      for (let i = 0; i < triPoints.length;) {
         //p1
         triPointArr.push(new THREE.Vector3(
          triPoints[i],
          triPoints[i + 1],
          triPoints[i + 2]
         ).add(obj.position));
         i+=3; //next point
         //p2
         triPointArr.push(new THREE.Vector3(
          triPoints[i],
          triPoints[i + 1],
          triPoints[i + 2]
         ).add(obj.position));
         i+=3; //next point
         //p3
         triPointArr.push(new THREE.Vector3(
          triPoints[i],
          triPoints[i + 1],
          triPoints[i + 2]
         ).add(obj.position));
         i+=3; //next point
      }
   }

   let tempTri = {
      p1: new THREE.Vector3(),
      p2: new THREE.Vector3(),
      p3: new THREE.Vector3(),
      uVec: new THREE.Vector3(),
      vVec: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      distance: 0.0,
   }
   
   for (let i = 0; i < triPointArr.length;) {
      tempTri.p1 = (triPointArr[i]);
      tempTri.p2 = (triPointArr[i + 1]);
      tempTri.p3 = (triPointArr[i + 2]);
      i += 3; //next triangle

      //I always use p2 as anchor, set up tri info
      tempTri.uVec = tempTri.p1.clone().sub(tempTri.p2); 
      tempTri.vVec = tempTri.p3.clone().sub(tempTri.p2); 
      tempTri.normal = tempTri.uVec.clone().cross(
       tempTri.p1.clone().sub(tempTri.p3)).normalize();
      tempTri.distance = tempTri.normal.dot(tempTri.p1);
      
      //"deep copy"
      triArr.push({
         p1: tempTri.p1.clone(),
         p2: tempTri.p2.clone(),
         p3: tempTri.p3.clone(),
         uVec: tempTri.p1.clone().sub(tempTri.p2),
         vVec: tempTri.p3.clone().sub(tempTri.p2),
         normal: tempTri.uVec.clone().cross(
          tempTri.p1.clone().sub(tempTri.p3)).normalize(),
         distance: tempTri.normal.dot(tempTri.p1)
      });
   }

   //get name
   let triName = obj.name;
   if (obj.parent !== null) {
      triName = obj.parent.name + ":" + triName;
   }

   return {
      name: triName,
      triArr: triArr
   };
}

function checkTriangles(cam, termVec) {
   const camInit = cam.position;
   const camTerm = termVec;
   const distOff = .1; //10 cm
   let scalarOff;
   let hitArr = [];

   let equationUtils = {
      u: 0,
      v: 0,
      t: 0,
      scalar: 0.0
   }

   
   for (let i = 0; i < totalTriArr.length; i++) {

      let currentTriArr = totalTriArr[i].triArr;

      for(let j = 0; j < currentTriArr.length; j++) {

         let tempTri = currentTriArr[j];
         
         //Figure out scalar val on plane
         let constant = (tempTri.normal.x * camInit.x) + 
         (tempTri.normal.y * camInit.y) + (tempTri.normal.z * camInit.z);

         equationUtils.scalar = (tempTri.distance - constant) / (
         (tempTri.normal.x * (camTerm.x - camInit.x)) + 
         (tempTri.normal.y * (camTerm.y - camInit.y)) + 
         (tempTri.normal.z * (camTerm.z - camInit.z))
         );

         //compute distance offset
         scalarOff = distOff / (camInit.clone().distanceTo(camTerm.clone()));

         if (equationUtils.scalar > 1 + scalarOff || equationUtils.scalar < 0 ) 
          continue;

         equationUtils.scalar = equationUtils.scalar - scalarOff;

         //get x y and z val on plane
         let tempPlaneVec = camInit.clone().add(camTerm.clone().sub(
          camInit.clone()).multiplyScalar(equationUtils.scalar));

         let vals = new THREE.Matrix3();
         vals.set(
          tempTri.uVec.x, tempTri.vVec.x, tempTri.normal.x, 
          tempTri.uVec.y, tempTri.vVec.y, tempTri.normal.y, 
          tempTri.uVec.z, tempTri.vVec.z, tempTri.normal.z
         );
         vals.invert();
         tempPlaneVec.sub(tempTri.p2).applyMatrix3(vals);

         equationUtils.u = new Number(tempPlaneVec.x);
         equationUtils.v = new Number(tempPlaneVec.y);
         equationUtils.t = new Number(tempPlaneVec.z);

         if (equationUtils.u <= 1 && equationUtils.v <= 1 && 
          equationUtils.u > 0 && equationUtils.v > 0 && 
          equationUtils.u + equationUtils.v <= 1) {
            console.log((camInit.clone().distanceTo(camTerm.clone())));
            console.log(scalarOff);
            if (equationUtils.scalar < 0.0001) {
               console.log("STOPPED");
            }
            hitArr.push({
               p2: tempTri.p2,
               uVec: tempTri.uVec,
               vVec: tempTri.vVec,
               name: totalTriArr[i].name,
               scalar: new Number(equationUtils.scalar)
            });
         }

      }

   }

   return hitArr;

}

function intersectTriangles(cam, termVec) {
   //Must disable privacy.reduceTimerPrecision on FireFox for 
   //performance.now to work
   if (totalTriArr !== undefined) {
      //keyT for tests
      if (pressedKeys["KeyT"] === 1) {
         console.log(checkTriangles(cam, cam.position.clone().add(
          termVec.sub(cam.position.clone()).multiplyScalar(100000))));
         return 1;
      }
      let hitArr = checkTriangles(cam, termVec);
      if (hitArr.length !== 0) {console.log(hitArr)};
      hitArr.sort( (a, b) => {a["scalar"].valueOf() - b["scalar"].valueOf()} );
      return hitArr[0] !== undefined ? hitArr[0].scalar.valueOf() : 1;
   }

   return 1;
}


export {showIntersections, intersectTriangles};