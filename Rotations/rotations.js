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
var scene, camera, renderer, meshes, gimbals, plane, cube, stats, controls, gui, gridXY, gridXZ, gridYZ,transformationStack,axis,rotation,quaternionStack,lastQuaternion;
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
	plane.userData.startPosition=plane.position.clone();
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


	var tetraHedronGeometry = new THREE.Geometry();
	array=[];
	array.push(new THREE.Vector3( 1,  0, 0 ));
	array.push(new THREE.Vector3( -1, 0, 0 ));
	array.push(new THREE.Vector3( 0, 0, Math.sqrt(3) ));
	array.push(new THREE.Vector3( 0, 2*Math.sqrt(2.0/3.0), Math.sqrt(3)/3.0 ));
	for(var i in array){
		array[i].y-=2.0/3.0*Math.sqrt(2.0/3.0);
		array[i].z-=Math.sqrt(3)/3.0;
		array[i].normalize();
	}
	tetraHedronGeometry.vertices.push( new THREE.Vector3( 1, 0, 0 ) );
	tetraHedronGeometry.vertices.push( new THREE.Vector3( -1, 0, 0 ) );
	tetraHedronGeometry.vertices.push( new THREE.Vector3(  0, 0, Math.sqrt(3) ) );
	tetraHedronGeometry.vertices.push( new THREE.Vector3(  0, 2*Math.sqrt(2.0/3.0), Math.sqrt(3)/3.0 ) );
	tetraHedronGeometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
	tetraHedronGeometry.faces.push( new THREE.Face3( 0, 3, 1 ) );
	tetraHedronGeometry.faces.push( new THREE.Face3( 0, 2, 3 ) );
	tetraHedronGeometry.faces.push( new THREE.Face3( 1, 3, 2 ) );
	/*arrayFaces=[];
	arrayFaces.push(new THREE.Face3( 0, 2, 1));
	arrayFaces.push(new THREE.Face3( 0, 1, 3));
	arrayFaces.push(new THREE.Face3( 0, 3, 2));
	arrayFaces.push(new THREE.Face3( 1, 2, 3));
	oldArrayFaces=[];
	faceIndexesToRemove=[];
	for (k=1;k<1;k++) {
		for(i in arrayFaces){
			oldArrayFaces.push(arrayFaces[i]);	
		}
		arrayFaces=[];
        var barycenter = new THREE.Vector3();
        for (var j in oldArrayFaces) {
        	v0=oldArrayFaces[j].a;
           	v1=oldArrayFaces[j].b;
           	v2=oldArrayFaces[j].c;
        	barycenter.x=array[v0].x+array[v1].x+array[v2].x;
        	barycenter.y=array[v0].y+array[v1].y+array[v2].y;
        	barycenter.z=array[v0].z+array[v1].z+array[v2].z;
        	barycenter.multiplyScalar(1.0/3.0);
        	barycenter.normalize();
        	array.push(barycenter.clone());
        	arrayFaces.push(new THREE.Face3(v0,v1,array.length-1));
        	arrayFaces.push(new THREE.Face3(v1,v2,array.length-1));
        	arrayFaces.push(new THREE.Face3(v2,v0,array.length-1));
        }
	}


	for(i in array){
		tetraHedronGeometry.vertices.push(array[i]);
	}
	for(i in arrayFaces){
		tetraHedronGeometry.faces.push(arrayFaces[i]);
	}

	tetraHedronGeometry.faces.push( new THREE.Face3( 0, 2, 1 ) );
	tetraHedronGeometry.faces.push( new THREE.Face3( 0, 1, 3 ) );
	tetraHedronGeometry.faces.push( new THREE.Face3( 0, 3, 2 ) );
	tetraHedronGeometry.faces.push( new THREE.Face3( 1, 2, 3 ) );*/
	tetraHedronGeometry.centroid = new THREE.Vector3();
	for (i = 0, l = tetraHedronGeometry.vertices.length; i < l; i++) {
	    tetraHedronGeometry.centroid.add(tetraHedronGeometry.vertices[i]);
	}
	tetraHedronGeometry.centroid.divideScalar(tetraHedronGeometry.vertices.length);
	tetraHedronGeometry.computeBoundingBox();
	tetraHedronGeometry.computeBoundingSphere();
	tetraHedronGeometry.computeFaceNormals();
	tetraHedronGeometry.computeVertexNormals();
	THREE.GeometryUtils.center(tetraHedronGeometry);
	tetraHedronMaterial=new THREE.MeshNormalMaterial({wireframe:true});
	tetraHedron=new THREE.Mesh(tetraHedronGeometry,tetraHedronMaterial);
	tetraHedron.scale.x=50;
	tetraHedron.scale.y=50;
	tetraHedron.scale.z=50;
	tetraHedron.position.x=-50;
	tetraHedron.userData.startPosition=tetraHedron.position.clone();
	//faceNormals=new THREE.FaceNormalsHelper(tetraHedron,70);
	meshes.add(tetraHedron);
	//scene.add(faceNormals);
	console.log("finishedSphere");


   	axis = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(axis);
	var cubeGeometry = new THREE.CubeGeometry(100, 100, 100);
    var cubeMaterials = [
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/1.png'),
           //side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/3.png'),
           //side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/6.png'),
           //side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/5.png'),
           //side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/4.png'),
           //side:THREE.DoubleSide,
           transparent:true
       }),
       new THREE.MeshLambertMaterial({
           map: THREE.ImageUtils.loadTexture('/Content/Images/2.png'),
           //side:THREE.DoubleSide,
           transparent:true
       })
    ];
	cube = new THREE.Mesh(cubeGeometry, new THREE.MeshFaceMaterial( cubeMaterials ) );
	cube.name="Cube";
	//cube.rotation.y = Math.PI * 45 / 180;
	cube.position.x=-200;
	cube.userData.startPosition=cube.position.clone();
	cube.add (new THREE.AxisHelper(70));
	meshes.add(cube);
	var segmentCount = 32,
    circleGeometry1= new THREE.Geometry(),
    circleMaterial = new THREE.LineBasicMaterial({ color: 0x0000FF,linewidth:5});
    var theta;
	for (i = 0; i <= segmentCount; i++) {
	    theta = (i / segmentCount) * Math.PI * 2;
	    circleGeometry1.vertices.push(
	        new THREE.Vector3(
	        	0,
	            Math.cos(theta) * 120,
	            Math.sin(theta) * 120
	            ));            
	}
	circleGeometry2= new THREE.Geometry();

	for (i = 0; i <= segmentCount; i++) {
	    theta = (i / segmentCount) * Math.PI * 2;
	    circleGeometry2.vertices.push(
	        new THREE.Vector3(
	            Math.cos(theta) * 100,
	            0,
	            Math.sin(theta) * 100
	            ));            
	}
	circleGeometry3= new THREE.Geometry();

	for (i = 0; i <= segmentCount; i++) {
	    theta = (i / segmentCount) * Math.PI * 2;
	    circleGeometry3.vertices.push(
	        new THREE.Vector3(
	            Math.cos(theta) * 80,
	            Math.sin(theta) * 80,
	            0));            
	}
	gimbalsX=new THREE.Line(circleGeometry1, new THREE.LineBasicMaterial({ color: 0xFF0000,linewidth:5}));
	gimbalsY=new THREE.Line(circleGeometry2, new THREE.LineBasicMaterial({ color: 0x00FF00,linewidth:5}));
	gimbalsZ=new THREE.Line(circleGeometry3, new THREE.LineBasicMaterial({ color: 0x0000FF,linewidth:5}));
	gimbalsY.add(gimbalsZ);
	gimbalsX.add(gimbalsY);
	gimbalsX.position=cube.position;
	scene.add(gimbalsX);
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
	quaternionStack=[];
	lastQuaternion=new THREE.Quaternion();
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
	var obj = { rotate:AxisAngleRotation,quaternion:rotateWithQuaternion,pquaternion:rotateWithProductQuaternion,matrix:rotateWithMatrix,displayGrid:true,displayGimbals:true,reset:reset};
	gui = new dat.GUI();
	var folder1 = gui.addFolder('Euler');
	folder1.add(options.Euler,"x").min(-180).max(180).onChange(function(value){
		var angle=Math.radians(value);
		cube.rotation.x=angle;
		gimbalsX.rotation.x=angle;
	});
	folder1.add(options.Euler,"y").min(-180).max(180).onChange(function(value){
		var angle=Math.radians(value);
		cube.rotation.y=angle;
		gimbalsY.rotation.y=angle;
	});
	folder1.add(options.Euler,"z").min(-180).max(180).onChange(function(value){
		var angle=Math.radians(value);
		cube.rotation.z=angle;
		gimbalsZ.rotation.z=angle;
	});
	folder1.open();
	var folder2= gui.addFolder('Axis-Angle and Quaternions');
	folder2.add(options.AxisAngle,'x');
	folder2.add(options.AxisAngle,'y');
	folder2.add(options.AxisAngle,'z');
	folder2.add(options.AxisAngle,'angle');
	folder2.add(obj,'rotate').name('Axis-Angle rotation');
	folder2.add(obj,'quaternion').name("Quaternion");
	folder2.add(obj,'pquaternion').name("qProduct");
	var folder3 = gui.addFolder('Rotation Matrix');
	folder3.add(userOpts.rotationMatrix.parameters,'0').name('First angle');
	folder3.add(userOpts.rotationMatrix.axes,'0',["x","y","z"]).name('First axis');
	folder3.add(userOpts.rotationMatrix.parameters,'1').name('Second angle');
	folder3.add(userOpts.rotationMatrix.axes,'1',["x","y","z"]).name('Second axis');
	folder3.add(userOpts.rotationMatrix.parameters,'2').name('Third angle');
	folder3.add(userOpts.rotationMatrix.axes,'2',["x","y","z"]).name('Third axis');
	folder3.add(obj,'matrix').name('Rotate using matrices');
	var folder4 = gui.addFolder('Advanced');
	folder4.add(options, 'duration').name('Duration (s)');
	var toggleGrid=function(){
		gridXY.visible===true?gridXY.visible=false:gridXY.visible=true;
		gridXZ.visible===true?gridXZ.visible=false:gridXZ.visible=true;
		gridYZ.visible===true?gridYZ.visible=false:gridYZ.visible=true;
	};
	folder4.add(obj,'displayGrid').onChange(toggleGrid);
	folder4.add(obj,'displayGimbals').onChange(function(){
		gimbalsX.visible===true?gimbalsX.visible=false:gimbalsX.visible=true;
		gimbalsY.visible===true?gimbalsY.visible=false:gimbalsY.visible=true;
		gimbalsZ.visible===true?gimbalsZ.visible=false:gimbalsZ.visible=true;
	});
	var folder5 = gui.addFolder('center');
	var meshesIndexes=[];
	for (var i in meshes.children){
		meshesIndexes.push(i);
	}
	folder5.add(options,'mesh',meshesIndexes).onChange(function(){
		options.X=meshes.children[options.mesh].position.x;
		options.Y=meshes.children[options.mesh].position.y;
		options.Z=meshes.children[options.mesh].position.z;
		updateCenterLocation();
	});
	updateCenterLocation();
	folder5.add(options,'X');
	folder5.add(options,'Y');
	folder5.add(options,'Z');
	gui.add(obj,"reset").name("Reset all positions");
}

function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
}

init();
buildGui(userOpts, function(){
});
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
 			productQuaternion=new THREE.Quaternion();
			for (var i in quaternionStack){
				productQuaternion.multiply(quaternionStack[i]);
			}
			lastQuaternion=productQuaternion.clone();
 			string+="You performed a rotation using quaternions<br/>";
 			string+="Rotation axis: $"+vector3Latex(new THREE.Vector3(cube.userData.axis[0],cube.userData.axis[1],cube.userData.axis[2]))+"$<br/><br/>";
 			string+="Rotation angle: $"+cube.userData.angle+" deg$<br/><br/>";
 			string+="Rotation quaternion: $"+quaternionLatex(cube.userData.rotationQuaternion)+"$<br/><br/>";
 			string+="Start quaternion: $"+quaternionLatex(cube.userData.startQuaternion)+"$<br/><br/>";
 			string+="End quaternion: $"+quaternionLatex(cube.userData.endQuaternion)+"$<br/><br/>";
 			string+="You rotated "+quaternionStack.length+"time(s).<br/>";
 			string+="The ending quaternion is the result of subsequent quaternion multiplication. This is the chain:";
 			string+=multiplyQuaternion(quaternionStack);
 			string+="And this is the result:";
 			string+="$"+quaternionLatex(productQuaternion)+"$";
 			string+="We could directly multiply the starting quaternion times this one and obtain the same rotation<br/><br/>";
 			string+="Try resetting meshes and using the \"QProduct\" Button";
 			//string+="The first element of this quaternion is the cosine of half the angle, starting from zero";
 			break;
 		}
 		case "Product Quaternion":{
 			string+="You rotated using the product quaternion.<br/>";
 			string+="This quaternion is the result of the multiplications of all the previous quaternions.<br/>";
 			string+="The new rotation is the same as the previous one.";
 			break;
 		}
 		case "AxisAngle":{
 			console.log("AxisAngle");
 			string+="You chose the Axis-Angle Method.<br/>";
 			string+="During the rotation, a red axis appeared in the scene.";
 			string+="This axis was your chosen Rotation Axis, drawn with respect to the mesh's local reference frame.";
 			string+="The rotation axis w.r.t. the world axis has coordinates $"+vector3Latex(new THREE.Vector3(cube.userData.axis[0],cube.userData.axis[1],cube.userData.axis[2]))+"$<br/>";
 			string+="The rotation axis w.r.t. the local axis has coordinates $"+vector3Latex(new THREE.Vector3(cube.userData.axis[0],cube.userData.axis[1],cube.userData.axis[2]).applyMatrix4(cube.matrix))+"$";
 			break;
 		}
 		case "Matrix":{
 			matrices=[];
 			resultMatrix=new THREE.Matrix4();
 			tempMatrix=new THREE.Matrix4();
 			for(var j=0;j<3;j++){
				if(cube.userData.axisOrder[j]==="x"){
					console.log("making matrix rotation on axis x by angle");
					tempMatrix.makeRotationX(Math.radians(cube.userData.angles[j]));
					resultMatrix.multiplyMatrices(tempMatrix,resultMatrix);
					matrices.push(tempMatrix.clone());
				}
				else if(userOpts.rotationMatrix.axes[j]==="y"){
					tempMatrix.makeRotationY(Math.radians(cube.userData.angles[j]));
					resultMatrix.multiplyMatrices(tempMatrix,resultMatrix);
					matrices.push(tempMatrix.clone());
				}
				else if(userOpts.rotationMatrix.axes[j]==="z"){
					tempMatrix.makeRotationZ(Math.radians(cube.userData.angles[j]));
					resultMatrix.multiplyMatrices(tempMatrix,resultMatrix);
					matrices.push(tempMatrix.clone());
				}
			}
 			string+="You performed a matrix rotation.<br/>";
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
		tl.to(rotation,0.00001,{angle:0,precAngle:0,mesh:parseInt(i)+1});
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
 	rotation={
 		t:0,
 		mesh:0,
 		x:0,
 		y:0,
 		z:0,
 		w:1
 	};
 	var rotateAngle=function(){
 		meshes.children[rotation.mesh].quaternion=meshes.children[i].userData.startQuaternion.clone().slerp(meshes.children[rotation.mesh].userData.endQuaternion,rotation.t);
 	};
	var tl = new TimelineLite();
	var i;
	rotationQuaternion=new THREE.Quaternion().setFromAxisAngle(rotationAxis,Math.radians(userOpts.AxisAngle.angle));
	quaternionStack.push(rotationQuaternion.clone());
	for(i in meshes.children){
		meshes.children[i].userData.last="Quaternion";
		meshes.children[i].userData.axis=[userOpts.AxisAngle.x,userOpts.AxisAngle.y,userOpts.AxisAngle.z];
		meshes.children[i].userData.angle=userOpts.AxisAngle.angle;
		meshes.children[i].userData.startQuaternion=meshes.children[i].quaternion.clone();
		meshes.children[i].userData.rotationQuaternion=rotationQuaternion;
		meshes.children[i].userData.endQuaternion=meshes.children[i].quaternion.clone().multiply(meshes.children[i].userData.rotationQuaternion);
		tl.to(rotation,0.01,{x:meshes.children[rotation.mesh].quaternion.x,y:meshes.children[rotation.mesh].quaternion.y,z:meshes.children[rotation.mesh].quaternion.z,w:meshes.children[rotation.mesh].quaternion.w});
		tl.add(TweenLite.to(rotation,userOpts.duration,{t:1,onUpdate:rotateAngle}));
		tl.to(rotation,0.01,{t:0,x:0,y:0,z:0,w:1,mesh:parseInt(i)+1});
	}
	tl.to(rotation,0.01,{t:0,x:0,y:0,z:0,w:1,mesh:0});
	tl.play();
 }
 function rotateWithProductQuaternion(){
 	rotation={
 		t:0,
 		mesh:0,
 		x:0,
 		y:0,
 		z:0,
 		w:1
 	};
 	var rotateAngle=function(){
 		meshes.children[rotation.mesh].quaternion=meshes.children[i].userData.startQuaternion.clone().slerp(meshes.children[rotation.mesh].userData.endQuaternion,rotation.t);
 	};
	var tl = new TimelineLite();
	var i;
	rotationQuaternion=lastQuaternion;
	for(i in meshes.children){
		meshes.children[i].userData.last="Product Quaternion";
		meshes.children[i].userData.startQuaternion=meshes.children[i].quaternion.clone();
		meshes.children[i].userData.rotationQuaternion=rotationQuaternion;
		meshes.children[i].userData.endQuaternion=meshes.children[i].quaternion.clone().multiply(meshes.children[i].userData.rotationQuaternion);
		//tl.to(rotation,0.01,{x:meshes.children[rotation.mesh].quaternion.x,y:meshes.children[rotation.mesh].quaternion.y,z:meshes.children[rotation.mesh].quaternion.z,w:meshes.children[rotation.mesh].quaternion.w});
		tl.add(TweenLite.to(rotation,userOpts.duration,{t:1,onUpdate:rotateAngle}));
		tl.to(rotation,0.01,{t:0,x:0,y:0,z:0,w:1,mesh:parseInt(i)+1});
	}
	tl.to(rotation,0.01,{t:0,x:0,y:0,z:0,w:1,mesh:0});
	tl.play();
 }
 function reset(){
 	for (var i in meshes.children){
 		console.log(meshes.children[i].userData.startPosition);
 		meshes.children[i].position=meshes.children[i].userData.startPosition;
 		meshes.children[i].rotation.x=0;
 		meshes.children[i].rotation.y=0;
 		meshes.children[i].rotation.z=0;
 		meshes.children[i].updateMatrix();

 	}
 }
