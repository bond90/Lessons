var userOpts = {
		transX		: 0,
		transY		: 0,
		transZ		: 0,
		duration	: 2.5,
		delay		: 200,
		easing		: 'Linear.easeNone',
		mode: 'Direct',
		mesh: 0,
		X:0,
		Y:0,
		Z:0
};
var scene, camera, renderer, plane, meshes, stats, controls, gridXY, gridXZ, gridYZ,gui,transformationStack	;
function init(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);
	scene = new THREE.Scene();

	meshes=new THREE.Object3D();
	transformationStack=[];

	var materials = [
	       new THREE.MeshLambertMaterial({
	           map: THREE.ImageUtils.loadTexture('/Content/Images/1.png'),side: THREE.DoubleSide
	       }),
	       new THREE.MeshLambertMaterial({
	           map: THREE.ImageUtils.loadTexture('/Content/Images/3.png')
	       })
	    ];
	plane = new THREE.Mesh(new THREE.PlaneGeometry(25, 25), new THREE.MeshFaceMaterial(materials,THREE.DoubleSide));
	plane.overdraw = true;
	plane.name="plane";
	plane.userData.startPos=plane.position;
	meshes.add(plane);
	var cubeGeometry = new THREE.CubeGeometry(100, 100, 100);
    var cubeMaterials = [
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/1.png')
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/3.png')
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/6.png')
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/5.png')
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/4.png')
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/2.png')
       })
    ];

	var cube = new THREE.Mesh(cubeGeometry, new THREE.MeshFaceMaterial( cubeMaterials ) );
	cube.name="Cube";
	cube.rotation.y = Math.PI * 45 / 180;
	cube.position.x=-200;
	cube.userData.startPos=cube.position;
	meshes.add(cube);

	scene.add(meshes);

	var axisHelper=new THREE.AxisHelper(200);
	scene.add(axisHelper);
	var light = new THREE.AmbientLight( 0x909090 ); // soft white light
	scene.add( light );
	camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
	camera.position.y = 160;
	camera.position.z = 400;
	camera.lookAt(plane.position);
	scene.add(camera);

	window.addEventListener( 'resize', onWindowResize, false );

	controls = new THREE.OrbitControls( camera, renderer.domElement );


	userOpts.X=meshes.children[0].position.x;
	userOpts.Y=meshes.children[0].position.y;
	userOpts.Z=meshes.children[0].position.z;
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

function setupTween()
{
	var tl = new TimelineLite();
	var vector=new THREE.Vector3();
	var i;
	translationVector=new THREE.Vector3(userOpts.transX,userOpts.transY,userOpts.transZ);
	transformationStack.push(translationVector);
	if(userOpts.mode==='Direct'){
		for(i in meshes.children){
			vector=meshes.children[i].position;
			tl.to(meshes.children[i].position,userOpts.duration,{x:vector.x+translationVector.x,y:vector.y+translationVector.y,z:vector.z+translationVector.z,ease:userOpts.easing,onComplete:updateCenterLocation});
		}
	}
	else{
		for(i in meshes.children){
			vector=meshes.children[i].position;
			tl.to(meshes.children[i].position,userOpts.duration,{x:vector.x+userOpts.transX,ease:userOpts.easing,onComplete:updateCenterLocation});
			tl.to(meshes.children[i].position,userOpts.duration,{y:vector.y+userOpts.transY,ease:userOpts.easing,onComplete:updateCenterLocation});
			tl.to(meshes.children[i].position,userOpts.duration,{z:vector.z+userOpts.transZ,ease:userOpts.easing,onComplete:updateCenterLocation});
		}

	}
	tl.play();
}

function updateCenterLocation (){
	userOpts.X=meshes.children[userOpts.mesh].position.x;
	userOpts.Y=meshes.children[userOpts.mesh].position.y;
	userOpts.Z=meshes.children[userOpts.mesh].position.z;
	for (var i in gui.__folders.center.__controllers) {
    		gui.__folders.center.__controllers[i].updateDisplay();
  	}
}

function buildGui(options,callback){
	var click	= function(){
		callback();
	};

	var obj = { Translate:click,displayGrid:true};
	gui = new dat.GUI();
	var folder1 = gui.addFolder('Translation');
	folder1.add(options,'transX');
	folder1.add(options,'transY');
	folder1.add(options,'transZ');
	folder1.add(options,'mode',['Direct','AxisByAxis']);
	folder1.add(obj,'Translate');
	folder1.open();
	var folder2 = gui.addFolder('Advanced');
	folder2.add(options, 'duration').name('Duration (s)');
	var toggleGrid=function(){
		gridXY.visible===true?gridXY.visible=false:gridXY.visible=true;
		gridXZ.visible===true?gridXZ.visible=false:gridXZ.visible=true;
		gridYZ.visible===true?gridYZ.visible=false:gridYZ.visible=true;
	};
	folder2.add(obj,'displayGrid').onChange(toggleGrid);
	var folder3 = gui.addFolder('center');
	var meshesIndexes=[];
	for (var i in meshes.children){
		console.log("add")
		meshesIndexes.push(i);
	}
	console.log(meshesIndexes);
	folder3.add(options,'mesh',meshesIndexes).onChange(function(){
		options.X=meshes.children[options.mesh].position.x;
		options.Y=meshes.children[options.mesh].position.y;
		options.Z=meshes.children[options.mesh].position.z;
		updateCenterLocation();
	});
	folder3.add(options,'X');
	folder3.add(options,'Y');
	folder3.add(options,'Z');
	folder3.open();

}

function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
}

function translateWithMatrix(matrix)
{
	userOpts.transX=matrix.n14;
	userOpts.transY=matrix.n24;
	userOpts.transZ=matrix.n34;
	setupTween();
}

init();

animate();

function setData(){
 	string="";
 	if(transformationStack.length===0){
 		string="You haven't performed any transformation yet!<br/>";
 		string+="The transformation matrix of the object is unchanged:";
 	}
 	else{
 		string+="You have translated your objects "+(transformationStack.length-1)+" time(s) <br/>";
 		string+="Figures refer to the cube mesh; the transformations are represented by the following sequence of vector sums:<br/>";
 	}
 	document.getElementById("dialogBox").innerHTML=string;
}