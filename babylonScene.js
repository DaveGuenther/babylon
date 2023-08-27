const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

const createScene = async function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    // Creates and positions a free camera
    const camera = new BABYLON.ArcRotateCamera("camera1", 
        1,1,70,
        BABYLON.Vector3.Zero(),
        scene);
    // Targets the camera to scene origin
    
    // Attaches the camera to the canvas
    camera.attachControl(canvas, true);
    
    // Locate .blend files in my git repo: https://github.com/DaveGuenther/babylon
    await BABYLON.SceneLoader.ImportMeshAsync(
        '',
        'https://raw.githubusercontent.com/DaveGuenther/babylon/main/',
        'light_path_anim_baked.glb',
        scene
    );

    var shadow_casting_mesh = scene.getMeshByName("Cube");
    var ground = scene.getMeshByName("Plane");
    scene.lights.forEach(function(lght){
        lght.intensity=200;
    });
    var light = scene.getLightByName("Light");
    light.intensity=1000;    
    //camera.setPosition(0,0,0);
    
    var spot_1 = scene.getLightByName("Spot.001");
    var spot_2 = scene.getLightByName("Spot.002");

    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    const shadowGenerator2 = new BABYLON.ShadowGenerator(1024, spot_1);
    const shadowGenerator3 = new BABYLON.ShadowGenerator(1024, spot_2);
    

    shadowGenerator.addShadowCaster(shadow_casting_mesh, true);
    shadowGenerator2.addShadowCaster(shadow_casting_mesh, true);
    shadowGenerator3.addShadowCaster(shadow_casting_mesh, true);
    ground.receiveShadows = true;

    scene.materials.forEach(function(mtl){
        mtl.maxSimultaneousLights = 9;
    });

    return scene;
}




const scene = await createScene();

   engine.runRenderLoop(function () {
	if (scene) {
		scene.render();
	}
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});
