

function vector2Latex(object){
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

function dot(params){
	return "$"+vector2latex(params[0])+"\\cdot"+vector2latex(params[1])+"$";
}

function cross(params){
	return "$"+vector2latex(params[0])+"\\mp"+vector2latex(params[1])+"$";
}

function matrix2Latex(object){
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