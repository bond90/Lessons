var userOpts = {
		a		: 1,
		b		: 0,
		c		: 0,
		duration	: 0.5,
		delay		: 200,
		easing		: 'Linear.EaseNone',
		Reflection  : 'Plane',
};
var scene, camera, renderer, meshes, reflectionMeshes, reflectionPoints, cloneMeshes, line, plane, cube, reflectPlane, reflectVector, transformationStack, stats, controls, gridXY, gridXZ, gridYZ;

function buildGui(options,callback){
	var meshes={};
	var click	= function(){
		callback();
	};
	var changeBackground=function(){
		renderer.setClearColor(userOpts.backgroundColor);
	};
	var obj = { Reflect:click,displayGrid:true,Background:changeBackground};
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
	length=cloneMeshes.children.length;

	for (var i=length-1;i>=0;i--){
		cloneMeshes.remove(cloneMeshes.children[i]);
	}

	setReflectionPlane();
	reflectPlane.material.opacity=0;
	reflectPlane.visible=true;
	for ( i=reflectionPoints.children.length-1;i>=0;i--){
		reflectionPoints.remove(reflectionPoints.children[i]);
	}
	var vector;
	for(var j in meshes.children){
		for (i in meshes.children[j].geometry.vertices){
			mesh=new THREE.Mesh(new THREE.SphereGeometry(5, 3, 3), new THREE.MeshNormalMaterial());
			vector = meshes.children[j].geometry.vertices[i].clone();
			vector.applyMatrix4(meshes.children[j].matrixWorld);
			mesh.position=vector;
			reflectionPoints.add(mesh);
		}
	}
	var tl = new TimelineLite();
	tl.to(reflectPlane.material,2,{opacity:0.5});
	var HouseHolder=Math.HouseHolderMatrix();
	var vertexReset=function(){line.geometry.verticesNeedUpdate=true;};
	for(i in reflectionPoints.children){
		vector=reflectionPoints.children[i].clone().position.applyMatrix4(HouseHolder);
		tl.to(line.geometry.vertices[0],0.01,{x:reflectionPoints.children[i].position.x,y:reflectionPoints.children[i].position.y,z:reflectionPoints.children[i].position.z});
		tl.to(line.geometry.vertices[1],0.01,{x:vector.x,y:vector.y,z:vector.z,onComplete:vertexReset});
		tl.to(line.material,userOpts.duration,{opacity:1});
		tl.to(reflectionPoints.children[i].position,userOpts.duration,{x:vector.x,y:vector.y,z:vector.z,ease:userOpts.easing});
		tl.to(line.material,userOpts.duration,{opacity:0});
	}
	var cloneMesh;
	var children=meshes.children;
	for(var mesh in children){
		newMesh=new THREE.Mesh(children[mesh].geometry.clone(),children[mesh].material.clone());
		newMesh.applyMatrix(meshes.children[mesh].matrix);
		cloneMeshes.add(newMesh);
	}
	tl.add("fadeIn", tl.duration());
	for (mesh in cloneMeshes.children){
			for(i in cloneMeshes.children[mesh].material.materials){
				cloneMeshes.children[mesh].material.materials[i].opacity=0;
				tl.to(cloneMeshes.children[mesh].material.materials[i],userOpts.duration,{opacity:1},"fadeIn");
			}
			cloneMeshes.children[mesh].applyMatrix(HouseHolder);
			cloneMeshes.children[mesh].updateMatrix();
	}
	tl.play();
}


function init(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(width, height);
	renderer.setClearColor( 0x111111, 1);
	document.body.appendChild(renderer.domElement);
	scene = new THREE.Scene();
	meshes=new THREE.Object3D();
	cloneMeshes=new THREE.Mesh();
	scene.add(cloneMeshes);
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

	reflectionMeshes=new THREE.Object3D();
	reflectionPoints=new THREE.Object3D();
	reflectionMeshes.add(reflectionPoints);

	//Setup the reflection plane
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
	//calcolo della matrice di HouseHolder senza utilizzarla veramente
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
 	if(transformationStack.length===1){
 		string="You haven't reflected objects yet!";
 	}
 	else{
 		string+="You have reflected your objects "+(transformationStack.length-1)+" times <br/>";
 		string+="Figures refer to the cube mesh; the transformations are represented by the following sequence of matrices multiplications:<br/>";
 		string+=multiplyMatrices(transformationStack);
 		string+="which yields the following results:<br/><br/>";
 		string+="$$"+matrix4Latex(cube.matrix.clone())+"$$";

 	}
 	document.getElementById("thedialog").innerHTML=string;
}