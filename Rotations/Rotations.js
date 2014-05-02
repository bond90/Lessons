var userOpts = {
		AxisAngle:{
			x		: 1,
			y		: 1,
			z		: 1,
			angle:45,
		},
		duration	: 5,
		delay		: 200,
		easing		: 'Linear.EaseNone',
};
var scene, camera, renderer, meshes, plane, cube, stats, controls, gridXY, gridXZ, gridYZ,transformationStack,axis,rotation;
function init(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);
	scene = new THREE.Scene();
	meshes=new THREE.Object3D();
	var geometry = new THREE.PlaneGeometry(25, 25, 1, 1);
	var geometry2 = geometry.clone();
	geometry2.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
	THREE.GeometryUtils.merge( geometry, geometry2, 1 );
	geometry.mergeVertices();
	var materials = [
	       new THREE.MeshBasicMaterial({
	           map: THREE.ImageUtils.loadTexture('/Content/Images/1.png'),side:THREE.FrontSide,transparent:true
	       }),
	       new THREE.MeshBasicMaterial({
	           map: THREE.ImageUtils.loadTexture('/Content/Images/3.png'),side:THREE.FrontSide,transparent:true
	       })
	    ];
	plane = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial( materials ));
	plane.overdraw = true;
	plane.name="plane";
	plane.position.x=100;
	meshes.add(plane);
	var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    lineGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent:true,
        opacity:0
    });
    axis = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(axis);
	var cubeGeometry = new THREE.CubeGeometry(100, 100, 100);
    var cubeMaterials = [
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/1.png'),
           side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/3.png'),
           side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/6.png'),
           side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/5.png'),
           side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/4.png'),
           side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/2.png'),
           side:THREE.DoubleSide,
           transparent:true
       })
    ];
	cube = new THREE.Mesh(cubeGeometry, new THREE.MeshFaceMaterial( cubeMaterials ) );
	cube.name="Cube";
	//cube.rotation.y = Math.PI * 45 / 180;
	cube.position.x=-200;
	meshes.add(cube);

	var sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 100, 100), new THREE.MeshNormalMaterial());
    sphere.overdraw = true;
    sphere.position.x=-200;
    sphere.position.y=-100;
    //meshes.add(sphere);

	scene.add(meshes);

	var axisHelper = new THREE.AxisHelper( 500 );
	scene.add( axisHelper );

	var light = new THREE.AmbientLight( 0x909090 ); // soft white light
	scene.add( light );
	camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
	camera.position.y = 200;
	camera.position.z = 500;
	camera.lookAt(plane.position);
	scene.add(camera);

	window.addEventListener( 'resize', onWindowResize, false );

	controls = new THREE.OrbitControls( camera, renderer.domElement );

	buildGui(userOpts, function(){
			setupTween();
		});

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );

	gridXZ = new THREE.GridHelper(200, 5);
	gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	gridXZ.position.set( 0,-200,0 );
	scene.add(gridXZ);

	gridXY = new THREE.GridHelper(200, 5);
	gridXY.position.set( 0,0,-200 );
	gridXY.rotation.x = Math.PI/2;
	gridXY.setColors( new THREE.Color(0x000066), new THREE.Color(0x000066) );
	scene.add(gridXY);

	gridYZ = new THREE.GridHelper(200, 5);
	gridYZ.position.set( -200,0,0 );
	gridYZ.rotation.z = Math.PI/2;
	gridYZ.setColors( new THREE.Color(0x660000), new THREE.Color(0x660000) );
	scene.add(gridYZ);
	transformationStack=[];
	transformationStack.push(new THREE.Matrix4().copy(cube.matrix));
}

function animate() { 
	requestAnimationFrame( animate );
	render();
	stats.update();
	controls.update();
}

// ## Render the 3D Scene
function render() {
	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}

/*
Setup the animation and execute it.
*/

function buildGui(options,callback){
	var meshes={};
	var Scale	= function(){
		callback();
		userOpts.x=1;
		userOpts.y=1;
		userOpts.z=1;
	};
	var obj = { rotate:AxisAngleRotation,displayGrid:true};
	var gui = new dat.GUI();
	var folder1 = gui.addFolder('Axis-Angle');
	folder1.add(options.AxisAngle,'x');
	folder1.add(options.AxisAngle,'y');
	folder1.add(options.AxisAngle,'z');
	folder1.add(options.AxisAngle,'angle');
	folder1.add(obj,'rotate');
	folder1.open();
	var folder2 = gui.addFolder('Advanced');
	folder2.add(options, 'duration').name('Duration (s)');
	var toggleGrid=function(){
		gridXY.visible===true?gridXY.visible=false:gridXY.visible=true;
		gridXZ.visible===true?gridXZ.visible=false:gridXZ.visible=true;
		gridYZ.visible===true?gridYZ.visible=false:gridYZ.visible=true;
	};
	folder2.add(obj,'displayGrid').onChange(toggleGrid);


}

function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
}

init();

animate();


Math.degrees = function(rad)
 {
 return rad*(180/Math.PI);
 };
 
Math.radians = function(deg)
 {
 return deg * (Math.PI/180);
 };
 function setData(){
 }
 function AxisAngleRotation(){
 	var rotationAxis=new THREE.Vector3(userOpts.AxisAngle.x,userOpts.AxisAngle.y,userOpts.AxisAngle.z).normalize();
 	rotation={
 		angle:0,
 		precAngle:0,
 		mesh:0
 	};
 	var rotateAngle=function(params){
 		rot=params.target.angle-rotation.precAngle;
 		meshes.children[rotation.mesh].rotateOnAxis(rotationAxis,Math.radians(rot));
 		rotation.precAngle=params.target.angle;
 	};
	var tl = new TimelineLite();
	for(var i in meshes.children){
		tl.add(TweenLite.to(rotation,userOpts.duration,{angle:userOpts.AxisAngle.angle,onUpdate:rotateAngle,onUpdateParams:["{self}"]}));
		tl.to(rotation,0.01,{angle:0,precAngle:0,mesh:rotation.mesh+1});
	}
	tl.play();
 }
 function rotateWithQuaternion(){
 	var rotationAxis=new THREE.Vector3(userOpts.AxisAngle.x,userOpts.AxisAngle.y,userOpts.AxisAngle.z).normalize();
 	var quaternionsArray=[new THREE.Quaternion(),new THREE.Quaternion(),new THREE.Quaternion()];
 	rotation={
 		t:0,
 		mesh:0,
 		x:0,
 		y:0,
 		z:0,
 		w:1
 	};
 	var rotateAngle=function(params){
 		qb=new THREE.Quaternion();
 		qb.setFromAxisAngle(new THREE.Vector3(1,1,1).normalize(),Math.PI*0.25);
 		console.log(meshes.children[rotation.mesh].quaternion);
 		//meshes.children[rotation.mesh].quaternion.slerp(qb,rotation.t);
 		meshes.children[rotation.mesh].quaternion=meshes.children[i].userData.startQuaternion.clone().slerp(qb,rotation.t);
 	};
	var tl = new TimelineLite();
	for(var i in meshes.children){
		meshes.children[i].userData.startQuaternion=meshes.children[i].quaternion;
		tl.to(rotation,0.01,{x:meshes.children[rotation.mesh].quaternion.x,y:meshes.children[rotation.mesh].quaternion.y,z:meshes.children[rotation.mesh].quaternion.z,w:meshes.children[rotation.mesh].quaternion.w});
		tl.add(TweenLite.to(rotation,userOpts.duration,{t:1,onUpdate:rotateAngle,onUpdateParams:["{self}"]}));
		tl.to(rotation,0.01,{t:0,x:0,y:0,z:0,w:1,mesh:rotation.mesh+1});
	}
	tl.play();
 	/*qb=new THREE.Quaternion();
 	qb.setFromAxisAngle(new THREE.Vector3(1,1,1).normalize(),Math.PI/4);
 	cube.quaternion.slerp(qb,1);*/
 }