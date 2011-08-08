var main = main || {};
var utilities = utilities || {};


(function($){
	
	//our main game loop setup
	main.start = function () {
	
		//============= GLOBAL Values and Objects ================
		
		
		//set our intial Z value
		var z = 0;
		
		//Create our local WebGL reference
		var gl;
		
		//Create our global texture object
		var textures = {};
		
		//Our only shaderProgram for now
		var shaderProgram;
		
		//For our square
		var cubeBuffer;
		
		
		//Our global model-view Matrix and our Projection Matrix
		var mvMatrix = mat4.create();
	    var iMatrix = mat4.identity(mat4.create());
		var pMatrix = mat4.create();
		
		//set initial POSITION ( x,y,z, yaw, pitch )
		utilities.input.init(0,1,7,0,0);
	    	
		//set the global time
		var lastTime = 0;
	    
		//If time has passed we need to run our updates on the player and other objects
		var animate = function () {
	        var timeNow = new Date().getTime();
	        
			//time as elapsed so lets do some house cleaning
			if (lastTime != 0) {
				var elapsed = timeNow - lastTime;
				
				//update the players position
	            utilities.input.updatePosition(elapsed);
				
				//update enemies
				
				//update objects
				
				//update water flow or other dynamic stuff
				
	        }
	        lastTime = timeNow;
	    };
		
		
		//initialize the WebGL object
	    var initGL = function (canvas) {
	        try {
	            gl = canvas.getContext("experimental-webgl");
	            gl.viewportWidth = canvas.width;
	            gl.viewportHeight = canvas.height;
				
	        } catch (e) {}
	        if (!gl) {
				alert('cannot start gl');
	        }
	    };
		
		
		//Get all of our shaders and build them into the shaderProgram
	    var initShaders = function () {
	        var fragmentShader = utilities.getShader(gl, "shader-fs");
	        var vertexShader = utilities.getShader(gl, "shader-vs");
	
	        shaderProgram = gl.createProgram();
	        gl.attachShader(shaderProgram, vertexShader);
	        gl.attachShader(shaderProgram, fragmentShader);
	        gl.linkProgram(shaderProgram);
	
	        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {alert("Could not initialise shaders");}
	
	        gl.useProgram(shaderProgram);
			
			//enable the aVertexPosition attribute
	        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
			
			shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
			
			//enable the aTextureCoord attribute
			shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
        	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
			
	        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
	        shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
	        shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
	        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
	        shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
	    };
		
		
		//Handle loaded textures
		var handleLoadedTexture = function (texture) {
		    gl.bindTexture(gl.TEXTURE_2D, texture);
		    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
			
		    gl.bindTexture(gl.TEXTURE_2D, null);
		};
		
		
		//Init textures
		var initTextures = function () {
		    textures.box = gl.createTexture();
		    textures.box.image = new Image();
		    textures.box.image.onload = function() {
		      handleLoadedTexture(textures.box);
		    }
		    textures.box.image.src = "images/textures/stone.jpg";
		};
		
		
		//Gain access to the WebGL uniform Matrixes. Set them with our own pMatrix and mvMatrix
	    var setMatrixUniforms = function () {
	        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
			
			//add a normal matrix to the uniforms for the shader
			var normalMatrix = mat3.create();
		    mat4.toInverseMat3(iMatrix, normalMatrix);
		    mat3.transpose(normalMatrix);
		    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
	    };
		
	
	    //Setup our vertex buffers
		var initBuffers = function () {
			//initialize our cube buffers
			cubeBuffer = buffers.cubeBuffer('hi',gl,{x:0,y:0,z:0});
	    };
		
		//Load the world
		var loadWorld = function () {
			
			main.loadMap();
			
			var p;
			
			var startWorld = new Date();
			var worldStart = startWorld.getTime();
			var allTimes = [];
			
			for(y=0; y < main.map.yDim; y++){
				for(z=0; z < main.map.zDim; z++){
					for(x=0; x < main.map.xDim; x++){
						
						p = x + main.map.zDim * z + main.map.yDim *y;
						
						var startTime = new Date();
						var start = startTime.getTime();
						
						if(main.map[p]){
							cubeBuffer.addBox({x:x,y:y,z:z});	
						}
						
						var endTime = new Date();
						var theend = endTime.getTime();
						
						allTimes.push((theend-start)/1000);
				
					}
				}
			}
			
			var endWorld = new Date();
			var worldEnd = endWorld.getTime();
			
			console.log("All Times",allTimes);
			
			console.log("World Build In:",(worldEnd-worldStart)/1000," sec");
			
			
		};
	
		//This is how we draw the scene.. which objects in which order
	    var drawScene = function () {
	        
			//Reset the viewport and Clear the frame
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	        //Setup the perspective for this scene into the pMatrix
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	
	        //==========> Set the mvMatrix to the identity matrix
			mat4.identity(mvMatrix);
			
			//==========> Move the mvMatrix with reference to our position and view
	        mat4.rotate(mvMatrix, utilities.degToRad(-(utilities.input.pitch)), [1, 0, 0]);
	        mat4.rotate(mvMatrix, utilities.degToRad(-(utilities.input.yaw)), [0, 1, 0]);
	        mat4.translate(mvMatrix, [-utilities.input.x, -utilities.input.y, -utilities.input.z]);
			
			//==========> Render each grouping of objects in order
	        	
			//restart us from the origin for drawing boxes
	        mat4.translate(mvMatrix, [0.0, 0.0, 0.0]);
			
			//now lets bind the cubeVertexPositionBuffer
			gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.cubeVertexPositionBuffer);
    		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeBuffer.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			//bind an array for normals and add an attribute
			gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.cubeVertexNormalBuffer);
    		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeBuffer.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			//and lets bind the cubeVertexTextureBuffer
    		gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.cubeVertexTextureCoordBuffer);
    		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeBuffer.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			
			//load the box texture
			gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, textures.box);
		    gl.uniform1i(shaderProgram.samplerUniform, 0);
			
			// add a lighting uniform with ambient color
			gl.uniform1i(shaderProgram.useLightingUniform, true);
			gl.uniform3f(shaderProgram.ambientColorUniform,0.8,0.8,0.8);
			
			// add directional lighting
			var lightingDirection = [-0.50,-0.50,-0.50];
			var adjustedLD = vec3.create();
			
			vec3.normalize(lightingDirection, adjustedLD);
			vec3.scale(adjustedLD, -1);
			
			gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
			gl.uniform3f(shaderProgram.directionalColorUniform,0.8,0.5,0.5);
			
			
			//bind an index array so we can take advantage of the drawElements method
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffer.cubeVertexIndexBuffer);
			
			setMatrixUniforms();
    		gl.drawElements(gl.TRIANGLES, cubeBuffer.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			
			
	    };
		
	
		// Main GAME LOOP LOGIC   : sets up the next Tick / uses keyboard input / drawScene / animate (more game logic)
		var tick= function () {
	        requestAnimFrame(tick);
	        utilities.input.applyKeyInput();
	        drawScene();
	        animate();
	    };
	

	    //this sets up the initial world
		var webGLStart = function (canvas) {
	        	        
			//initialize the WebGL container and object
			initGL(canvas);
	        
			//get and load our shaders
			initShaders();
	        
			//init buffers
			initBuffers();
			
			//get and load our textures
			initTextures();
	        
			//will load more here
			loadWorld();
	
	        //clear and enable DEPTH_TEST mode for drawing
			gl.clearColor(0.0, 0.08, 0.0, 1.0);
	        gl.enable(gl.DEPTH_TEST);
			
			tick();
	  
	    };

		
		//============= Start the Game Loop ================
		
		webGLStart(document.getElementById('found'));
		

	};//end:setup
	
})(jQuery)
