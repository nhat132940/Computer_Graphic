import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js";

var plane, geometry, material, mesh, planeMesh, light;
var camera, scene, renderer, reflectionCamera, cubeRenderTarget;
var controls, AffineControls;
var gui;
var CheckingMaterial = false;
//animation var
var ani2_a = 0;
var ani2_b = 0; //

const loader = new GLTFLoader();
// DefaultValues
var DefaultValues = {
  general: {
    scale: 1,
    autorotate: false,
    spd: 0.01,
  },
  geometry: {
    shape: "Cube",
    color: "#d97c7c",
    material: "Basic",
  },
  light: {
    lightType: "Point Light",
    enable: true,
    autorotate: false,
    shadow: true,
    positionX: 0,
    positionY: 1,
    positionZ: 0,
    intensity: 5,
  },
  affine: {
    mode: "None",
  },
  animation: {
    mode: "None",
  },
  reset: function () {
    this.general.scale = 1;
    this.general.autorotate = false;
    this.general.spd = 0.01;
    this.geometry.shape = "Cube";
    this.geometry.color = "#d97c7c";
    this.geometry.material = "Basic";
    this.light.lightType = "Point Light";
    this.light.enable = true;
    this.light.autorotate = false;
    this.light.shadow = true;
    this.light.positionX = 0;
    this.light.positionY = 1;
    this.light.positionZ = 0;
    this.light.intensity = 5;
    this.affine.mode = "None";
    this.animation.mode = "None";
    ChooseMatetial();
    AffineTransform();
    ChooseLight();
    ChooseGeometry();
    camera.updateProjectionMatrix();
  },
};

function ChooseGeometry() {
  if (DefaultValues["geometry"].shape != "")
    switch (DefaultValues["geometry"].shape) {
      case "Cone":
        geometry = new THREE.ConeGeometry(0.5, 0.5, 32, 32);
        break;
      case "Cube":
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        break;
      case "Sphere":
        geometry = new THREE.SphereGeometry(0.5, 50, 50);
        break;
      case "Torus":
        geometry = new THREE.TorusGeometry(0.5, 0.2, 40, 40);
        break;
      case "Cylinder":
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 32, 32);
        break;
      case "Teapot":
        var path = "models/Teapot/scene.gltf";
        Choose3DModel(path, 0.2);
        return;
      case "Gun":
        var path = "models/gun/scene.gltf";
        Choose3DModel(path, 0.2);
        return;
    }
  updateMesh(geometry, material);
}

function ChooseMatetial() {
  CheckingMaterial = true;
  switch (DefaultValues["geometry"].material) {
    case "Basic":
      material = new THREE.MeshBasicMaterial({
        color: DefaultValues["geometry"].color,
      });
      break;
    case "Line":
      material = new THREE.MeshNormalMaterial();
      material.wireframe = true;
      break;
    case "Phong":
      material = new THREE.MeshPhongMaterial({
        color: DefaultValues["geometry"].color,
      });
      break;
    case "Lambert":
      material = new THREE.MeshLambertMaterial({
        wireframe: false,
        envMap: cubeRenderTarget.texture,
        combine: THREE.MixOperation,
        reflectivity: 0.7,
      });
      break;
    case "Points":
      material = new THREE.PointsMaterial({
        color: DefaultValues["geometry"].color,
        sizeAttenuation: false,
      });
      break;
    case "Yellow":
      var texture = new THREE.TextureLoader().load(
        "/texture/colorful.png",
        function (texture) {
          material = new THREE.MeshBasicMaterial({
            map: texture,
          });
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
      material = new THREE.MeshBasicMaterial({ map: texture });
      break;
    case "Blue":
      var texture = new THREE.TextureLoader().load(
        "/texture/blue.jpg", 
        
        function (texture) {
          material = new THREE.MeshBasicMaterial({
            map: texture,
          });
        },
        undefined,
        function (err) {
          console.log(err);
        }
      );
      material = new THREE.MeshBasicMaterial({ map: texture });
      break;
  }
  updateMesh(geometry, material);
}

function Choose3DModel(path, scale) {
  loader.load(
    path,
    function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.scale.set(
            child.scale.x * scale,
            child.scale.y * scale,
            child.scale.z * scale
          );

          geometry = child.geometry
            .scale(
              child.scale.x * scale,
              child.scale.y * scale,
              child.scale.z * scale
            )
            .clone();

          updateMesh(geometry, material);
          return 0;
        }
      });
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}

function ChooseLight() {
  switch (DefaultValues["light"].lightType) {
    case "Spot Light":
      if (DefaultValues["light"].enable === false) light.visible = false;
      else {
        light.visible = false;
        light.castShadow = false;
        light = new THREE.SpotLight(0xffffff, 2, 100);
        light.visible = true;
        light.position.set(0, 1, 0);
        light.castShadow = true;
        light.intensity = DefaultValues["light"].intensity;
        scene.add(light);
      }
      break;
    case "Point Light":
      if (DefaultValues["light"].enable === false) light.visible = false;
      else {
        light.visible = false;
        light.castShadow = false;
        light = new THREE.PointLight(0xffffff, 2, 100);
        light.visible = true;
        light.position.set(0, 1, 0);
        light.castShadow = true;
        light.intensity = DefaultValues["light"].intensity;
        scene.add(light);
      }
      break;
    case "Directional Light":
      if (DefaultValues["light"].enable === false) light.visible = false;
      else {
        light.visible = false;
        light.castShadow = false;
        light = new THREE.DirectionalLight(0xffffff, 2, 100);
        light.visible = true;
        light.position.set(0, 1, 0);
        light.castShadow = true;
        light.intensity = DefaultValues["light"].intensity; 
        scene.add(light);
      }
      break;
  }
}

function AffineTransform() {
  switch (DefaultValues["affine"].mode) {
    case "None":
      console.log("detached");
      AffineControls.detach();
      break;
    case "Translate":
      console.log("translating");
      AffineControls.setMode("translate");
      AffineControls.attach(mesh);
      break;
    case "Rotate":
      AffineControls.setMode("rotate");
      AffineControls.attach(mesh);
      break;
    case "Scale":
      AffineControls.setMode("scale");
      AffineControls.attach(mesh);
      break;
  }
}

function updateMesh(g, m) {
  //clear Geometry
  for (var i = 0; i < scene.children.length; i++) {
    if (scene.children[i].name == "object") scene.remove(scene.children[i]);
  }

  if (CheckingMaterial == false) {
    if (DefaultValues["geometry"].material == "Points") {
      mesh = new THREE.Points(g, m);
    } else {
      mesh = new THREE.Mesh(g, m);
    }

    if (DefaultValues["light"].shadow == true) {
      mesh.castShadow = true;
      mesh.receiveShadow = false;
    }
    mesh.name = "object";
    mesh.scale.set(
      DefaultValues["general"].scale,
      DefaultValues["general"].scale,
      DefaultValues["general"].scale
    );

    console.log(mesh.position);
    console.log(mesh.visible);
    scene.add(mesh);
  } else {
    CheckingMaterial = false;

    if (DefaultValues["geometry"].material == "Points") {
      var matrix_transformation = mesh.matrix.clone();

      mesh = new THREE.Points(g, m);

      mesh.applyMatrix4(matrix_transformation);

      if (DefaultValues["light"].shadow == true) {
        mesh.castShadow = true;
        mesh.receiveShadow = false;
      }
      mesh.name = "object";
      scene.add(mesh);
    } else {
      mesh = new THREE.Mesh(g, m);
      if (DefaultValues["light"].shadow == true) {
        mesh.castShadow = true;
        mesh.receiveShadow = false;
      }
      mesh.name = "object";
      scene.add(mesh);
    }
  }
  AffineTransform();
  gui.updateDisplay();
}

function init() {
  camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  
  camera.position.x = 1;
	camera.position.y = 1;
  camera.position.z = 2;
  scene = new THREE.Scene();

  // main object
  geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  material = new THREE.MeshBasicMaterial({ color: DefaultValues["geometry"].color });
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  mesh.name = "object";

  // load cube map
  var cube = new THREE.CubeTextureLoader()
        .setPath('Cubemap/')
        .load([
            'skybox_right.png',
            'skybox_left.png',
            'skybox_top.png',
            'skybox_bottom.png',
            'skybox_front.png',
            'skybox_back.png'
        ]);
  cube.format = THREE.RGBFormat;

  // plane
  plane = new THREE.PlaneGeometry(5, 5, 30, 30);

  var planeMat = new THREE.MeshStandardMaterial({
    color: 0x404040,
    side: THREE.DoubleSide,
  });
  var texture_loader = new THREE.TextureLoader();
  planeMat.map = texture_loader.load("/texture/black.jpg");
  planeMat.envMap = cube;

  planeMesh = new THREE.Mesh(plane, planeMat);
  planeMesh.receiveShadow = true;
  planeMesh.rotation.x = -Math.PI / 2.0;
  planeMesh.name = "plane";
  planeMesh.position.set(0, -1.2, 0);

  // light
  light = new THREE.PointLight(0xffffff, 2, 100);
  light.position.set(0, 1, 0);
  light.castShadow = true;
  light.intensity = DefaultValues["light"].intensity;

  // add camera for reflection
  cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });
  reflectionCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
  mesh.add(reflectionCamera);

  // add object and plane to scene
  scene.add(planeMesh);
  scene.add(mesh);
  scene.add(light);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // add background to scene
  scene.background = cube;

  // controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 1;
  controls.minDistance = 1;
  controls.maxDistance = 100;

  AffineControls = new THREE.TransformControls(camera, renderer.domElement);
  AffineControls.addEventListener("change", function () {
    renderer.render(scene, camera);
  });
  AffineControls.addEventListener("dragging-changed", function (event) {
    controls.enabled = !event.value;
  });

  scene.add(AffineControls);
  window.addEventListener("resize", onWindowResize, false);
  GUIdisplay();
  ChooseAnimation();
}

function ChooseAnimation() {
  requestAnimationFrame(ChooseAnimation);

  if (DefaultValues["general"].autorotate == true) {
    mesh.rotation.x += DefaultValues["general"].spd;
    mesh.rotation.y += DefaultValues["general"].spd;
  }

  if (DefaultValues["light"].autorotate == true) {
    ani2_a = Math.PI * 0.01 + ani2_a;
    var set_x = Math.sin(ani2_a);
    var set_z = Math.cos(ani2_a);
    light.position.set(set_x, 1, set_z);
  }

  if (DefaultValues["animation"].mode == "Animation 1") {
      mesh.rotation.x += 0.05;
      mesh.rotation.y += 0.01;
      mesh.translateZ(0.02);
      mesh.translateY(0.02);
  }

  if (DefaultValues["animation"].mode == "Animation 2") {
    ani2_a = ani2_a + 0.05;
    ani2_b = ani2_b + 0.01;
    var new_a = Math.sin(ani2_a);
    var new_b = Math.cos(ani2_b);
    mesh.position.set(new_a, new_b, 1);
  }
  renderer.render(scene, camera);
  reflectionCamera.update(renderer, scene);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function GUIdisplay() {
  gui = new dat.GUI();
  var parameters = {project: "Đồ án cuối kì"}
  gui.add(parameters, 'project').name('Project');

  var g = gui.addFolder("General");

  g.add(DefaultValues["general"], "scale", 0.1, 2, 0.1)
    .name("Scale")
    .onChange(function () {
      mesh.scale.set(
        DefaultValues["general"].scale,
        DefaultValues["general"].scale,
        DefaultValues["general"].scale
      );
    });

  g.add(DefaultValues["general"], "autorotate").name("Auto Rotate");

  g.add(DefaultValues["general"], "spd", 0.01, 0.2, 0.01).name("Speed Rotate").onChange(function() {
      mesh.rotation.x += DefaultValues["general"].spd;
      mesh.rotation.y += DefaultValues["general"].spd;
});

  g = gui.addFolder("Geometry");

  g.addColor(DefaultValues["geometry"], "color").name("Color").onChange(ChooseMatetial);

  g.add(DefaultValues["geometry"], "shape", [
    "Cube",
    "Cone",
    "Sphere",
    "Torus",
    "Cylinder",
    "Teapot",
    "Gun",
  ])
    .name("Shape")
    .onChange(ChooseGeometry);

  g.add(DefaultValues["geometry"], "material", [
    "Basic",
    "Line",
    "Phong",
    "Lambert",
    "Points",
    "Yellow",
    "Blue",
  ])
    .name("Material")
    .onChange(ChooseMatetial);

  g = gui.addFolder("Affine");

  g.add(DefaultValues["affine"], "mode", ["None", "Translate", "Rotate", "Scale"])
    .name("Mode")
    .onChange(AffineTransform);

  g = gui.addFolder("Light");

  g.add(DefaultValues["light"], "lightType", [
    "Point Light",
    "Spot Light",
    "Directional Light",
  ])
    .name("Light Type")
    .onChange(ChooseLight);

  g.add(DefaultValues["light"], "enable")
    .name("Enable")
    .onChange(function () {
      if (DefaultValues["light"].enable == true) {
        light.visible = true;
      } else light.visible = false;
    });
    
  g.add(DefaultValues["light"], "autorotate")
    .name("Auto Rotate")
    .onChange(function () {
      if (DefaultValues["light"].autorotate == true) {
        console.log("rotating light");
      }
    });

  g.add(DefaultValues["light"], "shadow")
    .name("Shadows")
    .onChange(function () {
      if (DefaultValues["light"].shadow == false) {
        console.log("no shadows");
        planeMesh.receiveShadow = false;
        light.castShadow = false;
      } else {
        planeMesh.receiveShadow = true;
        light.castShadow = true;
        mesh.castShadow = true;
      }
    });

  g.add(DefaultValues["light"], "positionX", -10, 10).onChange(function () {
    light.position.x = DefaultValues["light"].positionX;
  });

  g.add(DefaultValues["light"], "positionY", -10, 10).onChange(function () {
    light.position.y = DefaultValues["light"].positionY;
  });

  g.add(DefaultValues["light"], "positionZ", -10, 10).onChange(function () {
    light.position.z = DefaultValues["light"].positionZ;
  });

  g.add(DefaultValues["light"], "intensity", 0, 20, 0.1)
    .name("Intensity")
    .onChange(function () {
      light.intensity = DefaultValues["light"].intensity;
    });

  g = gui.addFolder("Animation");

  g.add(DefaultValues["animation"], "mode", [
    "None",
    "Animation 1",
    "Animation 2",
  ]).name("Mode");

  gui.add(DefaultValues, "reset").name("Reset");
}

init();
