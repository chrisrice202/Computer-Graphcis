import {default as myText} from './textures.js';
import {default as myToothPos} from './toothPositions.js';
import {default as myMainRoomFunction} from './mainRoom.js';
import {default as myWiffleBoardFunction} from './wiffleBall.js';
import {default as myMarbleBoardFunction} from "./marbleBoard.js";
import {default as myMusicBoxFunction} from "./musicBoxes.js";
import {default as myUVCubes} from './uvCubes.js';
import {default as myCoins} from './coins.js';
import {default as myFlyControls} from './myFlyControls.js';
import {default as myMountainFunction} from './mountain.js';
import {showIntersections as myShowIntersections} from './intersections.js';
import {intersectTriangles as myIntersectTriangles} from './intersections.js';

let myScene = new THREE.Scene();

let Gallery = {
   scene: myScene,
   hallLength: 15,
   hallWidth: 5,
   hallHeight: 2.5,
   brickWidth: 2.5,
   brickHeight: 2.5,
   textures: myText,
   toothPositions: myToothPos,
   makeMainRoom: myMainRoomFunction,
   makeWiffleBall: myWiffleBoardFunction,
   makeMarbleBoard: myMarbleBoardFunction,
   makeMusicBoxes: myMusicBoxFunction,
   makeUVCubes: myUVCubes,
   makeCoins: myCoins,
   showIntersections: myShowIntersections,
   intersectTriangles: myIntersectTriangles,
   makeMountain: myMountainFunction,
   flyControls: myFlyControls
};

export {Gallery};