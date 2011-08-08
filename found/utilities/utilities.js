var main = main || {};
var utilities = utilities || {};

(function($){
    
	
	//=========================== GENERAL UTILITIES
	
	
	//get shader function
    utilities.getShader = function (gl, id) {
        
		//get the shader object from our main.shaders repository
		var shaderObj = main.shaders[id];
        var shaderScript = shaderObj.script;
		var shaderType = shaderObj.type;

        //create the right shader
        var shader;
        if (shaderType == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderType == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        
		//wire up the shader and compile
		gl.shaderSource(shader, shaderScript);
        gl.compileShader(shader);
        
		//if things didn't go so well alert
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        
		//return the shader reference
        return shader;
		
    };//end:getShader

	
	//degrees to radians
	utilities.degToRad = function (degrees) {
        return degrees * Math.PI / 180;
    };//end:degToRad
    
	
	
	
	//============================ PUSH AND POP TRANSFORMATIONS
	
	var mvMatrixStack = [];
	
	//push a transformation
	utilities.mvPushMatrix = function () {
	    var copy = mat4.create();
	    mat4.set(mvMatrix, copy);
	    mvMatrixStack.push(copy);
  	};
	
	//pop a transformation
	utilities.mvPopMatrix = function () {
	    if (mvMatrixStack.length == 0) {
	      throw "Invalid popMatrix!";
	    }
	    mvMatrix = mvMatrixStack.pop();
	};
	
	
	
	
})(jQuery)

