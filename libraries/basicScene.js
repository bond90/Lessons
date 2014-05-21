var scene, camera, renderer, controls, gridXY, gridXZ, gridYZ,gui,stats;
var width = window.innerWidth;
var height = window.innerHeight;
/*Renderer creation*/
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setClearColorHex( 0xFFFFFF, 1 );
document.body.appendChild(renderer.domElement);
/*Scene creation*/
scene = new THREE.Scene();
axisHelper=new THREE.AxisHelper(200);
axisHelper.material.linewidth=4;
scene.add(axisHelper);
var light = new THREE.AmbientLight( 0x909090 ); // soft white light
scene.add( light );
/*Camera initialization*/
camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.y = 160;
camera.position.z = 400;
scene.add(camera);
window.addEventListener( 'resize', onWindowResize, false );
controls = new THREE.OrbitControls( camera, renderer.domElement );

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
/*stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );*/

function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
}
