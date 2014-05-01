var userOpts = {
		x		: 1,
		y		: 1,
		z		: 1,
		duration	: 0.5,
		delay		: 200,
		easing		: 'Linear.EaseNone',
		fadeDuration:3
};
var scene, camera, renderer, meshes, plane, cube, stats, controls, gridXY, gridXZ, gridYZ,transformationStack,axis;
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

function setupTween()
{
	var vertexReset=function(){axis.geometry.verticesNeedUpdate=true;};
	var tl = new TimelineLite();
	scalingMatrix=new THREE.Matrix4().makeScale(userOpts.x,userOpts.y,userOpts.z);
	transformationStack.push(new THREE.Matrix4().copy(scalingMatrix));
	var meshScalingVector=[];
	for(var i in meshes.children){
		meshScalingVector=meshes.children[i].scale;
		tl.to(axis.geometry.vertices[0],0.01,{x:meshes.children[i].position.x-200,y:meshes.children[i].position.y,z:meshes.children[i].position.z});
		tl.to(axis.geometry.vertices[1],0.01,{x:meshes.children[i].position.x+200,y:meshes.children[i].position.y,z:meshes.children[i].position.z,onComplete:vertexReset});
		//tl.to(axis.geometry.vertices[1],0.01,{x:meshes.children[i].position.x+1,onComplete:vertexReset});
		tl.to(axis.material,userOpts.fadeDuration,{opacity:1});
		tl.to(meshScalingVector,userOpts.duration,{x:meshScalingVector.x*userOpts.x});
		tl.to(axis.material,userOpts.fadeDuration,{opacity:0});
		tl.to(axis.geometry.vertices[0],0.01,{x:meshes.children[i].position.x,y:meshes.children[i].position.y-200,z:meshes.children[i].position.z});
		tl.to(axis.geometry.vertices[1],0.01,{x:meshes.children[i].position.x,y:meshes.children[i].position.y+200,z:meshes.children[i].position.z,onComplete:vertexReset});
		tl.to(axis.material,userOpts.fadeDuration,{opacity:1});
		tl.to(meshScalingVector,userOpts.duration,{y:meshScalingVector.y*userOpts.y});
		tl.to(axis.material,userOpts.fadeDuration,{opacity:0});
		tl.to(axis.geometry.vertices[0],0.01,{x:meshes.children[i].position.x,y:meshes.children[i].position.y,z:meshes.children[i].position.z-200});
		tl.to(axis.geometry.vertices[1],0.01,{x:meshes.children[i].position.x,y:meshes.children[i].position.y,z:meshes.children[i].position.z+200,onComplete:vertexReset});
		tl.to(axis.material,userOpts.fadeDuration,{opacity:1});
		tl.to(meshScalingVector,userOpts.duration,{z:meshScalingVector.z*userOpts.z});
		tl.to(axis.material,userOpts.fadeDuration,{opacity:0});
		//tl.to(meshScalingVector,userOpts.duration,{x:meshScalingVector.x*userOpts.x,y:meshScalingVector.y*userOpts.y,z:meshScalingVector.z*userOpts.z});
	}
	tl.play();
}

function buildGui(options,callback){
	var meshes={};
	var Scale	= function(){
		callback();
		userOpts.x=1;
		userOpts.y=1;
		userOpts.z=1;
		/*gui.__controllers["x"].updateDisplay();
		gui.__controllers["y"].updateDisplay();
		gui.__controllers["z"].updateDisplay();*/
	};
	var obj = { Scale:Scale,displayGrid:true};
	var gui = new dat.GUI();
	var folder1 = gui.addFolder('Scaling');
	folder1.add(options,'x');
	folder1.add(options,'y');
	folder1.add(options,'z');
	folder1.add(obj,'Scale');
	folder1.open();
	/*var body=document.getElementsByTagName["body"];
	console.log(body)*/
	var folder2 = gui.addFolder('Advanced');
	folder2.add(options, 'duration').name('Duration (s)');
	folder2.add(options, 'fadeDuration').name('Fade Duration (s)');
	//folder2.addColor(body, '.style.background-color').name('Background-color');
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
 	string="";
 	if(transformationStack.length===1){
 		string="You haven't performed any transformation yet!<br/>";
 		string+="The transformation matrix of the object is unchanged:";
 		string+="$$"+matrix4Latex(transformationStack[0])+"$$";
 	}
 	else{
 		string+="You have scaled your objects "+(transformationStack.length-1)+" time(s) <br/>";
 		string+="Figures refer to the cube mesh; the transformations are represented by the following sequence of matrices multiplications:<br/>";
 		string+=multiplyMatrices(transformationStack);
 		string+="which yields the following results:<br/><br/>";
 		string+="$$"+matrix4Latex(cube.matrix)+"$$";

 	}
 	document.getElementById("thedialog").innerHTML=string;
 }