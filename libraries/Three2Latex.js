

function vectorLatex(object){
	var string ="";
	switch (object.toArray().length){
		case 2:{
			return string+"\\left[ \\begin{array}{c}"+object.getComponent(0)+"\\\\"+object.getComponent(1)+"\\end{array}\\right]";
		}
		case 3:{
			return string+"\\left[ \\begin{array}{c}"+object.getComponent(0)+"\\\\"+object.getComponent(1)+"\\\\"+object.getComponent(2)+"\\end{array}\\right]";
		}
		case 4:{
			return string+"\\left[ \\begin{array}{c}"+object.getComponent(0)+"\\\\"+object.getComponent(1)+"\\\\"+object.getComponent(2)+"\\\\"+object.getComponent(3)+"\\end{array}\\right]";
		}
	}
}
function vector2Latex(object){
		return "\\left[ \\begin{array}{c}"+object.getComponent(0)+"\\\\"+object.getComponent(1)+"\\end{array}\\right]";
}
function vector3Latex(object){
	return "\\left[ \\begin{array}{c}"+object.getComponent(0)+"\\\\"+object.getComponent(1)+"\\\\"+object.getComponent(2)+"\\end{array}\\right]";
}
function vector4Latex(object){
	return string+"\\left[ \\begin{array}{c}"+object.getComponent(0)+"\\\\"+object.getComponent(1)+"\\\\"+object.getComponent(2)+"\\\\"+object.getComponent(3)+"\\end{array}\\right]";
}



function vector3dot(params){
	return "$"+vector3latex(params[0])+"\\cdot"+vector3latex(params[1])+"$";
}
function vector3cross(params){
	return "$"+vector3latex(params[0])+"\\mp"+vector3latex(params[1])+"$";
}
function vector4dot(params){
	return "$"+vector4latex(params[0])+"\\cdot"+vector4latex(params[1])+"$";
}
function vector4cross(params){
	return "$"+vector4latex(params[0])+"\\mp"+vector4latex(params[1])+"$";
}
function result(){

}

function matrixLatex(object){
	var string ="$";
	if (object instanceof THREE.Matrix4){
		string+="\\left[\\begin{array}{cccc}";
		for (i=0;i<4;i++){
			string+=object.elements[i]+"&"+object.elements[i+4]+"&"+object.elements[i+8]+"&"+object.elements[i+12]+"\\\\";
		}
		string+="\\end{array}\\right]";
	}
	else if (object instanceof THREE.Matrix3){
		string+="\\left[\\begin{array}{cccc}";
		for (i=0;i<3;i++){
			string+=object.elements[i]+"&"+object.elements[i+3]+"&"+object.elements[i+6]+"\\\\";
		}
		string+="\\end{array}\\right]";
	}
	string=string+"$";
	return string;
}

function matrix3Latex(object){
		var string="";
		string+="\\left[\\begin{array}{cccc}";
		for (i=0;i<3;i++){
			string+=object.elements[i]+"&"+object.elements[i+3]+"&"+object.elements[i+6]+"\\\\";
		}
		string+="\\end{array}\\right] ";
		return string;
}
function matrix4Latex(object){
		var string="";
		console.log(string);
		string+="\\left[\\begin{array}{cccc}";
		for (i=0;i<4;i++){
			string+=object.elements[i]+"&"+object.elements[i+4]+"&"+object.elements[i+8]+"&"+object.elements[i+12]+"\\\\";
		}
		console.log(object);
		console.log(string);
		string+="\\end{array}\\right] ";
		return string;
}

function multiplyMatrices(params,result){
	var string="$$";
	for(var i=params.length-1;i>=0;i--){
		if(params[i] instanceof THREE.Matrix4){
			string+=matrix4Latex(params[i]);

		}
		else if(params[i] instanceof THREE.Matrix3){
			string+=matrix3Latex(params[i]);
		}
		//console.log(string)
		console.log("step")
	}
	/*if(result){
		if(result instanceof THREE.Matrix4){
			string+=matrix4Latex(result);
		}
		else if(result instanceof THREE.Matrix3){
			string+="="+matrix3Latex(result);
		}
	}*/
	string+="$$"
	return string;
}


/*function content2Latex(params){
	var string="$";
	if (object instanceof THREE.Vector3){
		//var content=document.createTextNode('$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$')
		string=string+"\\left[ \\begin{array}{c}"+object.getComponent(0)+"\\\\"+object.getComponent(1)+"\\\\"+object.getComponent(2)+"\\end{array}\\right]"
	}
	else if (object instanceof THREE.Matrix4){
		string+="\\left[\\begin{array}{cccc}"
		for (i=0;i<4;i++){
			string+=object.elements[i]+"&"+object.elements[i+4]+"&"+object.elements[i+8]+"&"+object.elements[i+12]+"\\\\"
		}
		string+="\\end{array}\\right]"
	}
	else if (object instanceof THREE.Matrix3){
		string+="\\left[\\begin{array}{cccc}"
		for (i=0;i<3;i++){
			string+=object.elements[i]+"&"+object.elements[i+3]+"&"+object.elements[i+6]+"\\\\"
		}
		string+="\\end{array}\\right]"
	}
	string=string+"$"
	return string
}*/