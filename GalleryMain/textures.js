let textures = {
   bricks: new THREE.MeshStandardMaterial({
      /*displacementMap: new THREE.TextureLoader().load(
         "./textures/Brick/height.png"
      ),*/ //left out for intersection computations
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Brick/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load("./textures/Brick/normal.png"),
      map: new THREE.TextureLoader().load("./textures/Brick/albedo.png"),
      //displacementScale: 0.05, //left out for intersection computations
      //displacementBias: -0.025, //left out for intersection computations
      roughness: 0.75,
   }),

   oakVeneer: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/OakVeneer/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/OakVeneer/normal.png"
      ),
      map: new THREE.TextureLoader().load("./textures/OakVeneer/albedo.png"),
      roughness: 0,
      metalness: 0,
   }),

   oakVeneerHoriz: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/OakVeneer/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/OakVeneer/normal.png"
      ),
      map: new THREE.TextureLoader().load("./textures/OakVeneer/albedo.png"),
      roughness: 0.9,
      metalness: 0,
   }),

   oakVeneerVert: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/OakVeneer/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/OakVeneer/normal.png"
      ),
      map: new THREE.TextureLoader().load("./textures/OakVeneer/albedo.png"),
      roughness: 0.9,
      metalness: 0,
   }),

   plywood: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Plywood/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/Plywood/normal.png"
      ),
      map: new THREE.TextureLoader().load("./textures/Plywood/albedo.png"),
      roughness: 0,
   }),

   gold: new THREE.MeshStandardMaterial({
      metalnessMap: new THREE.TextureLoader().load(
         "./textures/Gold/metalness.jpg"
      ),
      //normalMap: new THREE.TextureLoader().load("./textures/Gold/normal.jpg"),
      map: new THREE.TextureLoader().load("./textures/Gold/albedo.png"),
      metalness: 0.5,

   }),

   plaster: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Plaster/roughness.jpg"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/Plaster/normal.jpg"
      ),
      map: new THREE.TextureLoader().load("./textures/Plaster/albedo.jpg"),
      roughness: 0.999,
   }),

   plasterCeiling: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Plaster/roughness.jpg"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/Plaster/normal.jpg"
      ),
      map: new THREE.TextureLoader().load("./textures/Plaster/albedo.jpg"),
      roughness: 0.99,
   }),

   oakPlank: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/OakPlank/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/OakPlank/normal.png"
      ),
      map: new THREE.TextureLoader().load("./textures/OakPlank/albedo.png"),
      roughness: 0.99,
      metalness: 0,
   }),

   marble: new THREE.MeshStandardMaterial({
      metalnessMap: new THREE.TextureLoader().load(
         "./textures/Marble/metalness.png"
      ),
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Marble/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/Marble/normal.png"
      ),
      map: new THREE.TextureLoader().load("./textures/Marble/albedo.png"),
      metalness: 0.75,
   }),

   blackMarble: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Marbles/black/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/Marbles/black/normal.png"
      ),
      map: new THREE.TextureLoader().load(
         "./textures/Marbles/black/albedo.png"
      ),
      metalness: 0,
   }),

   creamMarble: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Marbles/cream/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/Marbles/cream/normal.png"
      ),
      map: new THREE.TextureLoader().load(
         "./textures/Marbles/cream/albedo.png"
      ),
      metalness: 0,
   }),

   greenMarble: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Marbles/green/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/Marbles/green/normal.png"
      ),
      map: new THREE.TextureLoader().load(
         "./textures/Marbles/green/albedo.png"
      ),
      metalness: 0,
   }),

   redMarble: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Marbles/red/roughness.png"
      ),
      normalMap: new THREE.TextureLoader().load(
         "./textures/Marbles/red/normal.png"
      ),
      map: new THREE.TextureLoader().load("./textures/Marbles/red/albedo.png"),
      metalness: 0,
   }),

   snow: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/Snow/roughness.png"
      ),
      map: new THREE.TextureLoader().load(
         "./textures/Snow/albedo.png"
      )
   }),

   rockCliff: new THREE.MeshStandardMaterial({
      roughnessMap: new THREE.TextureLoader().load(
         "./textures/RockCliff/roughness.png"
      ),
      map: new THREE.TextureLoader().load(
         "./textures/RockCliff/albedo.png"
      )
   }),

   treeTop: new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(
         "./textures/Grass/albedo.png"
      )
   })
};

export {textures as default};