
export default class myFlyControls {

   pressedKeys = {
      "KeyW": 0,
      "KeyS": 0,
      "KeyA": 0,
      "KeyD": 0,
      "ArrowUp": 0,
      "ArrowDown": 0,
      "ArrowLeft": 0,
      "ArrowRight": 0,
      "ShiftLeft": 0,
      "KeyJ": 0
   };

   keyEffects = {
      changePos: (time, scalarMove) => {
         let MpS = this.pressedKeys["ShiftLeft"] === 1 ? 100 : 1;
         //forward and backward
         if ((-this.pressedKeys["KeyW"] + this.pressedKeys["KeyS"]) !== 0) {
            this.camera.translateZ(
             MpS * ((time * (-this.pressedKeys["KeyW"] 
             + this.pressedKeys["KeyS"])) * scalarMove)
            );
         }
         //left and right
         if ((-this.pressedKeys["KeyA"] + this.pressedKeys["KeyD"]) !== 0) {
            this.camera.translateX(
             MpS * ((time * (-this.pressedKeys["KeyA"] 
             + this.pressedKeys["KeyD"])) * scalarMove)
            );
         }
      },
      changeView: (time) => {
         let MpS = this.pressedKeys["ShiftLeft"] === 1 ? 3 : 1;
         //Y Rotation (Left and Right) (World)
         if ((this.pressedKeys["ArrowLeft"] + -this.pressedKeys["ArrowRight"]) 
          !== 0 ) {
            this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 
             MpS * ((this.pressedKeys["ArrowLeft"] + 
             -this.pressedKeys["ArrowRight"]) * time)
            );
         }
         //X Rotation (Up and Down) (Local)
         if ((this.pressedKeys["ArrowUp"] + -this.pressedKeys["ArrowDown"])) {
            this.camera.rotateX(
             MpS * ((this.pressedKeys["ArrowUp"] + 
             -this.pressedKeys["ArrowDown"]) * time)
            );
         }
      }
   }

   constructor(cam) {
      this.camera = cam;
      window.addEventListener('keydown', (event) => {
         this.pressedKeys[event.code] = 1;
      });
      window.addEventListener('keyup', (event) => {
         this.pressedKeys[event.code] = 0;
      });
   }

   update(timePassed, scalarMove) {
      if (scalarMove < 0.001) scalarMove = 0;
      this.keyEffects.changePos(timePassed, scalarMove);
      this.keyEffects.changeView(timePassed);     
      if (this.pressedKeys["KeyJ"]) {
         console.log(timePassed);
      }
   }

   getNextFramePoint(cam, time) {

      let MpS = this.pressedKeys["ShiftLeft"] === 1 ? 3 : 1;
      let xVal;
      let zVal;

      //forward and backward
      if ((-this.pressedKeys["KeyW"] + this.pressedKeys["KeyS"]) !== 0) {
          zVal = (MpS * (time * (-this.pressedKeys["KeyW"] 
          + this.pressedKeys["KeyS"])))
      }
      else {
         zVal = 0;
      }
      //left and right
      if ((-this.pressedKeys["KeyA"] + this.pressedKeys["KeyD"]) !== 0) {
          xVal = (MpS * (time * (-this.pressedKeys["KeyA"] 
          + this.pressedKeys["KeyD"])))
      }
      else {
         xVal = 0;
      }

      return cam.localToWorld(new THREE.Vector3(
       xVal,
       0,
       zVal
      ));
   }

}