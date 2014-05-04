var userOpts = {
		Euler:{
			x:0,
			y:0,
			z:0
		},
		rotationMatrix:{
			parameters:[0,0,0],
			axes:["x","y","z"]
		},
		AxisAngle:{
			x		: 1,
			y		: 1,
			z		: 1,
			angle:45,
		},
		Matrix:{
			x:0,
			y:0,
			z:0
		},
		duration	: 1,
		fadeDuration: 1,
		delay		: 200,
		easing		: 'Linear.EaseNone',
		mesh: 0,
		X:0,
		Y:0,
		Z:0
};
var scene, camera, renderer, meshes, plane, cube, stats, controls, gui, gridXY, gridXZ, gridYZ,transformationStack,axis,rotation;
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
	plane.add (new THREE.AxisHelper(30));
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
	cube.add (new THREE.AxisHelper(70));
	meshes.add(cube);

	cube2 = new THREE.Mesh(cubeGeometry, new THREE.MeshFaceMaterial( cubeMaterials ) );
	cube2.name="Cube";
	cube2.position.x=-200;
	cube2.add (new THREE.AxisHelper(70));
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
	console.log(meshes)
	buildGui(userOpts, function(){
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

function updateCenterLocation (){
	userOpts.X=meshes.children[userOpts.mesh].position.x;
	userOpts.Y=meshes.children[userOpts.mesh].position.y;
	userOpts.Z=meshes.children[userOpts.mesh].position.z;
	for (var i in gui.__folders.center.__controllers) {
    		gui.__folders.center.__controllers[i].updateDisplay();
  	}
}

function buildGui(options,callback){
	var obj = { rotate:AxisAngleRotation,quaternion:rotateWithQuaternion,matrix:rotateWithMatrix,displayGrid:true};
	gui = new dat.GUI();
	var folder1 = gui.addFolder('Euler');
	folder1.add(cube.rotation,"x").min(-180).max(180);
	folder1.add(cube.rotation,"y").min(-180).max(180);
	folder1.add(cube.rotation,"z").min(-180).max(180);
	folder1.open();
	var folder2= gui.addFolder('Axis-Angle');
	folder2.add(options.AxisAngle,'x');
	folder2.add(options.AxisAngle,'y');
	folder2.add(options.AxisAngle,'z');
	folder2.add(options.AxisAngle,'angle');
	folder2.add(obj,'rotate').name('Axis-Angle rotation');
	folder2.add(obj,'quaternion').name("Rotate using quaternion");
	folder2.open();
	var folder3 = gui.addFolder('Rotation Matrix');
	folder3.add(userOpts.rotationMatrix.parameters,'0').name('First angle');
	folder3.add(userOpts.rotationMatrix.axes,'0',["x","y","z"]).name('First axis');
	folder3.add(userOpts.rotationMatrix.parameters,'1').name('Second angle');
	folder3.add(userOpts.rotationMatrix.axes,'1',["x","y","z"]).name('Second axis');
	folder3.add(userOpts.rotationMatrix.parameters,'2').name('Third angle');
	folder3.add(userOpts.rotationMatrix.axes,'2',["x","y","z"]).name('Third axis');
	folder3.add(obj,'matrix').name('Rotate using matrices');
	folder3.open();
	var folder4 = gui.addFolder('Advanced');
	folder4.add(options, 'duration').name('Duration (s)');
	var toggleGrid=function(){
		gridXY.visible===true?gridXY.visible=false:gridXY.visible=true;
		gridXZ.visible===true?gridXZ.visible=false:gridXZ.visible=true;
		gridYZ.visible===true?gridYZ.visible=false:gridYZ.visible=true;
	};
	folder4.add(obj,'displayGrid').onChange(toggleGrid);
	var folder5 = gui.addFolder('center');
	var meshesIndexes=[];
	console.log(cube)
	console.log(meshes)
	for (var i in meshes.children){
		meshesIndexes.push(i);
	}
	folder5.add(options,'mesh',meshesIndexes).onChange(function(){
		options.X=meshes.children[options.mesh].position.x;
		options.Y=meshes.children[options.mesh].position.y;
		options.Z=meshes.children[options.mesh].position.z;
		updateCenterLocation();
	});
	folder5.add(options,'X');
	folder5.add(options,'Y');
	folder5.add(options,'Z');
	folder5.open();
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
 	switch(cube.userData.last){
 		case "Quaternion":{
 			console.log("quaternion")
 			string+="QuaternionUsed"
 			break;
 		}
 		case "AxisAngle":{
 			console.log("AxisAngle")
 			string+="You chose the Axis-Angle Method.<br/>";
 			string+="During the rotation, a red axis appeared in the scene.";
 			string+="This axis was your chosen Rotation Axis, drawn with respect to the mesh's local reference frame.";
 			string+="The rotation axis w.r.t. the world axis has coordinates $"+vector3Latex(new THREE.Vector3(cube.userData.axis[0],cube.userData.axis[1],cube.userData.axis[2]))+"$<br/>";
 			string+="The rotation axis w.r.t. the local axis has coordinates $"+vector3Latex(new THREE.Vector3(cube.userData.axis[0],cube.userData.axis[1],cube.userData.axis[2]).applyMatrix4(cube.matrix))+"$";
 			break;
 		}
 		case "Matrix":{
 			console.log("Matrix")
 			matrices=[];
 			resultMatrix=new THREE.Matrix4();
 			tempMatrix=new THREE.Matrix4();
 			for(var j=0;j<3;j++){
				if(cube.userData.axisOrder[j]==="x"){
					console.log("making matrix rotation on axis x by angle")
					console.log(Math.radians(cube.userData.angles[j]))
					tempMatrix.makeRotationX(Math.radians(cube.userData.angles[j]));
					console.log(tempMatrix)
					console.log(cube.userData)
					resultMatrix.multiplyMatrices(tempMatrix,resultMatrix);
					matrices.push(tempMatrix.clone());
				}
				else if(userOpts.rotationMatrix.axes[j]==="y"){
					console.log("making matrix rotation on axis y by angle")
					console.log(Math.radians(cube.userData.angles[j]))
					tempMatrix.makeRotationY(Math.radians(cube.userData.angles[j]));
					console.log(tempMatrix)
					resultMatrix.multiplyMatrices(tempMatrix,resultMatrix);
					matrices.push(tempMatrix.clone());
				}
				else if(userOpts.rotationMatrix.axes[j]==="z"){
					console.log("making matrix rotation on axis z by angle")
					console.log(Math.radians(cube.userData.angles[j]))
					tempMatrix.makeRotationZ(Math.radians(cube.userData.angles[j]))
					console.log(tempMatrix)
					resultMatrix.multiplyMatrices(tempMatrix,resultMatrix);
					matrices.push(tempMatrix.clone());
				}
			}
 			string+="You chose the matrix rotation.<br/>";
 			string+="The rotation was performed in this sequence:"+cube.userData.axisOrder;
 			string+=multiplyMatrices(matrices);
 			string+="<br/>This yields the following results:<br/><br/>";
 			string+="$"+matrix4Latex(resultMatrix)+"$<br/><br/>";
 			string+="and this is the transformation matrix of the cube<br/><br/>";
			string+="$"+matrix4Latex(cube.matrix)+"$<br/><br/>";
 			/*string+="The rotation axis w.r.t. the world axis has coordinates $"+vector3Latex(new THREE.Vector3(cube.userData.axis[0],cube.userData.axis[1],cube.userData.axis[2]))+"$<br/>";
 			string+="The rotation axis w.r.t. the local axis has coordinates $"+vector3Latex(new THREE.Vector3(cube.userData.axis[0],cube.userData.axis[1],cube.userData.axis[2]).applyMatrix4(cube.matrix))+"$";
 			*/break;
 		}
 	}
 	console.log(string);
 	document.getElementById("dialogBox").innerHTML=string;
 }
 function EulerRotation(){
 	rotation={
 		angle:0,
 		precAngle:0,
 		mesh:0
 	};
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
 	var calculateAxis=function(){
 		axis.geometry.vertices[0]=meshes.children[rotation.mesh].localToWorld(rotationAxis.clone().multiplyScalar(300));
 		axis.geometry.vertices[1]=meshes.children[rotation.mesh].localToWorld(rotationAxis.clone().multiplyScalar(-300));
 		axis.geometry.verticesNeedUpdate=true;
 	};
	var tl = new TimelineLite();
	for(var i in meshes.children){
		meshes.children[i].userData.last="AxisAngle";
		meshes.children[i].userData.axis=[userOpts.AxisAngle.x,userOpts.AxisAngle.y,userOpts.AxisAngle.z];
		tl.to(axis.material,userOpts.fadeDuration,{opacity:1,onStart:calculateAxis});
		tl.add(TweenLite.to(rotation,userOpts.duration,{angle:userOpts.AxisAngle.angle,onUpdate:rotateAngle,onUpdateParams:["{self}"]}));
		tl.to(axis.material,userOpts.fadeDuration,{opacity:0});
		tl.to(rotation,0.01,{angle:0,precAngle:0,mesh:rotation.mesh+1});
	}
	tl.play();
 }
 function rotateWithMatrix(){
 	for(var i in meshes.children){
		meshes.children[i].userData.last="Matrix";
		meshes.children[i].userData.axisOrder=userOpts.rotationMatrix.axes[0]+userOpts.rotationMatrix.axes[1]+userOpts.rotationMatrix.axes[2];
		meshes.children[i].userData.angles=[userOpts.rotationMatrix.parameters[0],userOpts.rotationMatrix.parameters[1],userOpts.rotationMatrix.parameters[2]];
		for(var j=0;j<3;j++){
			if(userOpts.rotationMatrix.axes[j]==="x"){
				meshes.children[i].applyMatrix(new THREE.Matrix4().makeRotationX(Math.radians(userOpts.rotationMatrix.parameters[j])));
			}
			else if(userOpts.rotationMatrix.axes[j]==="y"){
				meshes.children[i].applyMatrix(new THREE.Matrix4().makeRotationY(Math.radians(userOpts.rotationMatrix.parameters[j])));
			}
			else if(userOpts.rotationMatrix.axes[j]==="z"){
				meshes.children[i].applyMatrix(new THREE.Matrix4().makeRotationZ(Math.radians(userOpts.rotationMatrix.parameters[j])));
			}
		}
	}

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
 		//qb.setFromAxisAngle(new THREE.Vector3(userOpts.AxisAngle.x,userOpts.AxisAngle.y,userOpts.AxisAngle.z).normalize(),userOpts.AxisAngle.angle);
		qb.setFromAxisAngle(rotationAxis,userOpts.AxisAngle.angle);
 		//meshes.children[rotation.mesh].quaternion.slerp(qb,rotation.t);
 		meshes.children[rotation.mesh].quaternion=meshes.children[i].userData.startQuaternion.clone().slerp(qb,rotation.t);
 	};
	var tl = new TimelineLite();
	for(var i in meshes.children){
		meshes.children[i].userData.last="Quaternion";
		meshes.children[i].userData.axis=[userOpts.AxisAngle.x,userOpts.AxisAngle.y,userOpts.AxisAngle.z];
		meshes.children[i].userData.startQuaternion=meshes.children[i].quaternion;
		tl.to(rotation,0.01,{x:meshes.children[rotation.mesh].quaternion.x,y:meshes.children[rotation.mesh].quaternion.y,z:meshes.children[rotation.mesh].quaternion.z,w:meshes.children[rotation.mesh].quaternion.w});
		tl.add(TweenLite.to(rotation,userOpts.duration,{t:1,onUpdate:rotateAngle,onUpdateParams:["{self}"]}));
		tl.to(rotation,0.01,{t:0,x:0,y:0,z:0,w:1,mesh:rotation.mesh+1});
	}
	tl.play();
 }
 function rotateWithEuler(prop){
 	console.log(meshes)
 	for (var i in meshes.children){
 		console.log(i);
 		meshes.children[i].rotation[prop]=userOpts.Euler[prop];
 	}
 }
