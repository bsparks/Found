// utilities.js
// common utils

window.hasOwnProperty("main") || (window.main = {});
window.hasOwnProperty("utilities") || (window.utilities = {});

(function($, utils, main, undefined) {
    
    utils.SHADER_TYPE_FRAGMENT = "x-shader/x-fragment";
    utils.SHADER_TYPE_VERTEX = "x-shader/x-vertex";
    
    // make sure we have a global cache, if not create it
    // todo: move this? (used to be in shaders.js)
    main.hasOwnProperty("shaders") || (main.shaders = {});
    
	utils.loadShader = function(file, type) {
        var cache, shader;
        
        $.ajax({
            async: false, // need to wait... todo: deferred?
            url: "shaders/" + file, //todo: use global config for shaders folder?
            success: function(result) {
               cache = {script: result, type: type}; 
            }
        });
        
        // store in global cache
        main.shaders[file] = cache;
	};
	
	//get shader function
    utils.getShader = function (gl, id) {
        
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
	utils.degToRad = function (degrees) {
        return degrees * Math.PI / 180;
    };//end:degToRad
    
	
	
	
	//============================ PUSH AND POP TRANSFORMATIONS
	
	var mvMatrixStack = [];
	
	//push a transformation
	utils.mvPushMatrix = function () {
	    var copy = mat4.create();
	    mat4.set(mvMatrix, copy);
	    mvMatrixStack.push(copy);
  	};
	
	//pop a transformation
	utils.mvPopMatrix = function () {
	    if (mvMatrixStack.length == 0) {
	      throw "Invalid popMatrix!";
	    }
	    mvMatrix = mvMatrixStack.pop();
	};
    
})(jQuery, window.utilities, window.main);

