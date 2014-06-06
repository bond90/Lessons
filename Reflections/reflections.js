var userOpts = {
		a		: 1,
		b		: 0,
		c		: 0,
		duration	: 0.5,
		delay		: 200,
		easing		: 'Linear.EaseNone',
		Reflection  : 'Plane',
};
var animationOpts={
	mesh:0
};
var scene, camera, renderer, meshes, reflectionMeshes, reflectionPoints, line, plane, cube, reflectPlane, reflectVector, reflectionVectorMesh, transformationStack, stats, controls, gridXY, gridXZ, gridYZ;

function init(){
	transformationStack=[];
	var width = window.innerWidth;
	var height = window.innerHeight;

	/*Renderer creation*/
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.setClearColor( 0xFFFFFF, 1); /*White Background*/
	document.body.appendChild(renderer.domElement);
	scene = new THREE.Scene();
	meshes=new THREE.Object3D(); /*An empty container to group meshes together*/

	/*Line that will be used during animation.
	Vertices are dummy ones, they will be changed later.
	Opacity property of the material is set to 0 (transparent property too must be set
	in order to make it work).
	It will be tweened during animations, to implement fade-in and fade-out effects*/
	var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(-10, 0, 0));
    lineGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent:true,
        opacity:0
    });
    line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    /*Vector orthogonal to the hyperplane*/
    var vectorGeometry = new THREE.Geometry();
    vectorGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    vectorGeometry.vertices.push(new THREE.Vector3(0, 10, 0));
    var vectorMaterial = new THREE.LineBasicMaterial({
        color: 0xffff00,
        transparent:true,
        opacity:0
    });
    reflectionVectorMesh=new THREE.Mesh(vectorGeometry,vectorMaterial);
 	scene.add(reflectionVectorMesh);


 	/*Creation of a plane geometry.
 	The mesh is composed of two geometries, one of which flipped, merged together.
 	This because we wanted to apply different textures for each of the two sides.
 	Materials is an array composed of two materials.
 	*/
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
	/*Plane creation.
	MeshFaceMaterial is just a container for the former array of materials. It has no own property.*/
	plane = new THREE.Mesh(geometry,new THREE.MeshFaceMaterial( materials ));
	plane.overdraw = true;
	plane.name="plane";
	plane.position.x=100;
	plane.add (new THREE.AxisHelper(30));
	meshes.add(plane);

	/*Creation of a cube geometry (note: it has been renamed to boxGeometry in last version of THREE.js).
	It takes three parameters, the three dimensions of the polyhedron.
	Material for each face is MeshLambertMaterial.
	Doubleside property tells the renderer to draw both front and back face;
	this is not the normal behaviour, because it requires additional computation.
	*/
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
	cube.position.x=-100;
	cube.position.z=50;
	meshes.add(cube);

	scene.add(meshes);

	reflectionMeshes=new THREE.Object3D();
	reflectionPoints=new THREE.Object3D();
	reflectionMeshes.add(reflectionPoints);

	/*Setup the reflection plane.*/
	reflectGeometry=new THREE.PlaneGeometry( 400, 400 );
	reflectPlane = new THREE.Mesh(reflectGeometry, new THREE.MeshNormalMaterial());
	reflectPlane.overdraw = true;
	reflectPlane.name="reflectPlane";
	reflectPlane.visible=false;
	reflectPlane.material.transparent = true;
	reflectPlane.material.side=THREE.DoubleSide;
	reflectionMeshes.add(reflectPlane);

	scene.add(reflectionMeshes);
	var axisHelper = new THREE.AxisHelper( 500 );
	axisHelper.material.linewidth=4;
	scene.add( axisHelper );

	/*Creation of an ambient light. A soft uniform light.
	In order to visualize anything, a light must be added to the scene.*/

	var light = new THREE.AmbientLight( 0x909090 );
	scene.add( light );

	/*Camera creation.
	You can choose between Perspective or Orthogonal camera.*/

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

	/*A simple frame counter, used for debugging purposes.
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.body.appendChild( stats.domElement );*/

	/*Grids creation*/
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

function buildGui(options,callback){
	var meshes={};
	var click	= function(){
		callback();
	};
	var obj = { Reflect:click,displayGrid:true};
	var gui = new dat.GUI();
	var folder1 = gui.addFolder('Reflection');
	folder1.add(options,'a');
	folder1.add(options,'b');
	folder1.add(options,'c');
	folder1.add(obj,'Reflect');
	folder1.open();
	var folder2 = gui.addFolder('Advanced');
	folder2.add(options, 'duration').name('Duration (ms)');
	var toggleGrid=function(){
		gridXY.visible===true?gridXY.visible=false:gridXY.visible=true;
		gridXZ.visible===true?gridXZ.visible=false:gridXZ.visible=true;
		gridYZ.visible===true?gridYZ.visible=false:gridYZ.visible=true;
	};
	folder2.add(obj,'displayGrid').onChange(toggleGrid);
}

/*
Setup the animation and execute it.
First, a sphere is placed on each vertex of each mesh in the scene.
Then, each sphere is moved to its new location.
Finally, the new meshes fade in 
*/

function setupTween()
{
	var i,j;
	animationOpts.mesh=0;
	setReflectionPlane();
	reflectPlane.material.opacity=0;
	reflectPlane.visible=true;
	reflectionVectorMesh.geometry.vertices[1].x=reflectVector.x*30;
	reflectionVectorMesh.geometry.vertices[1].y=reflectVector.y*30;
	reflectionVectorMesh.geometry.vertices[1].z=reflectVector.z*30;
	reflectionVectorMesh.geometry.verticesNeedUpdate=true;
	reflectionVectorMesh.visible=true;
	for ( i=reflectionPoints.children.length-1;i>=0;i--){
		reflectionPoints.remove(reflectionPoints.children[i]);
	}
	var point;
	var vector;
	for(j in meshes.children){
		for (i in meshes.children[j].geometry.vertices){
			point=new THREE.Mesh(new THREE.SphereGeometry(5, 3, 3), new THREE.MeshNormalMaterial());
			vector = meshes.children[j].geometry.vertices[i].clone();
			vector.applyMatrix4(meshes.children[j].matrixWorld);
			point.position=vector;
			reflectionPoints.add(point);
		}
	}
	var tl = new TimelineLite();
	tl.to(reflectPlane.material,2,{opacity:0.5});
	tl.to(reflectionVectorMesh.material,0.01,{opacity:1});
	var HouseHolder=Math.HouseHolderMatrix();
	transformationStack.push(HouseHolder.clone());
	var vertexReset=function(){line.geometry.verticesNeedUpdate=true;};
	for(i in reflectionPoints.children){
		vector=reflectionPoints.children[i].clone().position.applyMatrix4(HouseHolder);
		tl.to(line.geometry.vertices[0],0.01,{x:reflectionPoints.children[i].position.x,y:reflectionPoints.children[i].position.y,z:reflectionPoints.children[i].position.z});
		tl.to(line.geometry.vertices[1],0.01,{x:vector.x,y:vector.y,z:vector.z,onComplete:vertexReset});
		tl.to(line.material,userOpts.duration,{opacity:1});
		tl.to(reflectionPoints.children[i].position,userOpts.duration,{x:vector.x,y:vector.y,z:vector.z,ease:userOpts.easing});
		tl.to(line.material,userOpts.duration,{opacity:0});
	}
	tl.add("fadeOut", tl.duration());
	var moveMesh=function(){
		console.log(animationOpts.mesh);
		console.log("mesh");
		meshes.children[animationOpts.mesh].applyMatrix(HouseHolder);
		//meshes.children[animationOpts.mesh].updateMatrix();
	};
	for (var mesh in meshes.children){
			for(i in meshes.children[mesh].material.materials){
				tl.to(meshes.children[mesh].material.materials[i],userOpts.duration,{opacity:0},"fadeOut");
			}
	}
	for (i in meshes.children){
		console.log(i);
		tl.to(animationOpts,0.01,{mesh:parseInt(i)+1,onStart:moveMesh});
	}
	tl.add("fadeIn", tl.duration());
	for (j in meshes.children){
			for(i in meshes.children[j].material.materials){
				tl.to(meshes.children[j].material.materials[i],userOpts.duration,{opacity:1},"fadeIn");
		}
	}
	tl.play();
}

function animate() { 
	requestAnimationFrame( animate );
	render();
	stats.update();
	controls.update();
}

// ## Render the 3D Scene
function render() {
	renderer.render( scene, camera );
}


/*A simple function that resizes the screen in order to maintain proportions*/
function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
}

function setReflectionPlane(){
 	reflectPlane.visible=false;
 	reflectPlane.rotation.x=0;
 	reflectPlane.rotation.y=0;
 	reflectPlane.rotation.z=0;
 	reflectVector=new THREE.Vector3();
 	reflectVector.x=userOpts.a;
 	reflectVector.y=userOpts.b;
 	reflectVector.z=userOpts.c;
 	var angle=reflectPlane.geometry.faces[0].normal.angleTo(reflectVector);
	reflectPlane.rotateOnAxis((reflectPlane.geometry.faces[0].normal.clone().cross(reflectVector.normalize())).normalize(),angle);
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

Math.HouseHolderMatrix=function(){
	var w=new THREE.Vector3( reflectVector.x, reflectVector.y, reflectVector.z );
	var v=w.clone();
	var c=w.dot(v);
	var identity=new THREE.Matrix4();
	var matrix1=new THREE.Matrix4(w.x,0,0,0,w.y,0,0,0,w.z,0,0,0,0,0,0,1);
	var matrix2=new THREE.Matrix4(w.x,w.y,w.z,0,0,0,0,0,0,0,0,0,0,0,0,1);
	var matrix3=new THREE.Matrix4();
	matrix3.multiplyMatrices(matrix1,matrix2);
	matrix3.multiplyScalar(2/c);
	var HHMatrix=new THREE.Matrix4();
	for(var k in HHMatrix.elements){
		HHMatrix.elements[k]=identity.elements[k]-matrix3.elements[k];
	}
	HHMatrix.elements[15]=1;
	return HHMatrix;
};

function setData(){
 	string="";
 	if(transformationStack.length===0){
 		string="You haven't reflected objects yet!";
 	}
 	else{
 		string+="You have reflected your objects "+(transformationStack.length)+" times <br/>";
 		string+="Figures refer to the cube mesh; the transformations are represented by the following sequence of matrices multiplications:<br/>";
 		string+=multiplyMatrices(transformationStack);
 		string+="which yields the following results:<br/><br/>";
 		string+="$$"+matrix4Latex(cube.matrix.clone())+"$$";

 	}
 	document.getElementById("thedialog").innerHTML=string;
}