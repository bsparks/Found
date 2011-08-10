"main" in window || (main = {});
"utilities" in window || (utilities = {});

(function($) {
	
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
		
		//For the squares
		var cubeBuffer;
		
		//For the sky
		var skyBuffer;
		var cloudBuffer;
		var cloudBufferFar;
		var cloudRotation = 0;
		var cloudRotationFar = 0;
		var cloudSpeed = 5;
		
		
		//Our global model-view Matrix and our Projection Matrix
		var mvMatrix = mat4.create();
	    var iMatrix = mat4.identity(mat4.create());
		var pMatrix = mat4.create();
		
		//set initial POSITION ( x,y,z, yaw, pitch )
		utilities.input.init(0,3,7,0,0);
	    	
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
				
				//rotate the clouds
				cloudRotation = (cloudRotation + cloudSpeed) % 360;
				cloudRotationFar = (cloudRotationFar + 0.2 * cloudSpeed) % 360;
				
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
			shaderProgram.UseFogUniform = gl.getUniformLocation(shaderProgram, "uUseFog");
			shaderProgram.UseLighting = gl.getUniformLocation(shaderProgram, "uUseLighting");
			shaderProgram.AlphaBlend = gl.getUniformLocation(shaderProgram, "uAlphaBlend");
	    };
		
		
		//Handle loaded textures
		var handleLoadedTexture = function (texture,nearest) {
		    gl.bindTexture(gl.TEXTURE_2D, texture);
		    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		    
			if(!nearest){
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}
			
			 gl.bindTexture(gl.TEXTURE_2D, null);
			
		};
		
		
		//Init textures
		var initTextures = function () {
		    
			//box texture
			textures.box = gl.createTexture();
		    textures.box.image = new Image();
		    textures.box.image.onload = function() {
		      handleLoadedTexture(textures.box);
		    }
		    textures.box.image.src = "images/textures/stone.jpg";
			
			//the sky
			textures.sky = gl.createTexture();
		    textures.sky.image = new Image();
		    textures.sky.image.onload = function() {
		      handleLoadedTexture(textures.sky,true);
		    }
		    textures.sky.image.src = "images/textures/sky.jpg";
			
			//the clouds
			textures.clouds = gl.createTexture();
		    textures.clouds.image = new Image();
		    textures.clouds.image.onload = function() {
		      handleLoadedTexture(textures.clouds,true);
		    }
		    textures.clouds.image.src = "images/textures/clouds.jpg";
			
			//the clouds far
			textures.cloudsFar = gl.createTexture();
		    textures.cloudsFar.image = new Image();
		    textures.cloudsFar.image.onload = function() {
		      handleLoadedTexture(textures.cloudsFar,true);
		    }
		    textures.cloudsFar.image.src = "images/textures/cloudsFar.jpg";
			
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
			//initialize our sky buffer
			skyBuffer = buffers.sphereBuffer('hi',gl,{x:0,y:0,z:0});
			//initialize our cloud buffer
			cloudBuffer = buffers.sphereBuffer('hi',gl,{x:0,y:0,z:0});
			//initialize our cloud bufferFar
			cloudBufferFar = buffers.sphereBuffer('hi',gl,{x:0,y:0,z:0});
	    };
		
		//Load the world
		var loadWorld = function () {
			
			main.loadMap();
			
			var p;
			
			var startWorld = new Date();
			var worldStart = startWorld.getTime();
			
			console.log
			
			for(var y=0; y < main.map.yDim; y++){
				for(var z=0; z < main.map.zDim; z++){
					for(var x=0; x < main.map.xDim; x++){
						
						p = x + main.map.zDim * z + main.map.xDim * main.map.zDim * y;
						if(main.map[p] == 1){
							cubeBuffer.addBox({x:x,y:y,z:z});	
						}
				
					}
				}
			}
			
			var endWorld = new Date();
			var worldEnd = endWorld.getTime();
			
			console.log("World Build In:",(worldEnd-worldStart)/1000," sec");
			
			//build the sky
			skyBuffer.addSphere({x:0,y:0,z:0},50,10,20);
			
			//build the clouds closest
			cloudBuffer.addSphere({x:0,y:0,z:0},48,20,30);
			
			//build the clouds farther
			cloudBufferFar.addSphere({x:0,y:0,z:0},49,20,30);
			
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
		
			
			// add a lighting uniform with ambient color
			gl.uniform1i(shaderProgram.UseLighting, false);
			gl.uniform3f(shaderProgram.ambientColorUniform,0.7,0.7,0.7);
			
			// add directional lighting
			var lightingDirection = [-0.50,-0.50,0.50];
			var adjustedLD = vec3.create();
			
			vec3.normalize(lightingDirection, adjustedLD);
			vec3.scale(adjustedLD, -1);
			
			gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
			gl.uniform3f(shaderProgram.directionalColorUniform,1,0.7,0.7);
			
			
			//====> lets bind the atmosphere and clouds		
			mat4.identity(mvMatrix);
			
			mat4.rotate(mvMatrix, utilities.degToRad(-(utilities.input.pitch)), [1, 0, 0]);
	        mat4.rotate(mvMatrix, utilities.degToRad(-(utilities.input.yaw)), [0, 1, 0]);

			setMatrixUniforms();
			
			//turn off fog
			gl.uniform1i(shaderProgram.UseFogUniform, false);
			
			//start with the sky	
			gl.disable(gl.DEPTH_TEST);
			gl.enable(gl.BLEND);
			gl.blendFunc( gl.FUNC_ADD );
			gl.blendFunc( gl.SRC_COLOR, gl.DST_ALPHA );
			gl.uniform1f(shaderProgram.AlphaBlend,0.55);
		
			gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, textures.sky);
		    gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		    gl.bindBuffer(gl.ARRAY_BUFFER, skyBuffer.sphereVertexPositionBuffer);
		    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, skyBuffer.sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ARRAY_BUFFER, skyBuffer.sphereVertexTextureCoordBuffer);
		    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, skyBuffer.sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ARRAY_BUFFER, skyBuffer.sphereVertexNormalBuffer);
		    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, skyBuffer.sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, skyBuffer.sphereVertexIndexBuffer);
		    gl.drawElements(gl.TRIANGLES, skyBuffer.sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			
			
			//now the clouds
			mat4.rotate(mvMatrix, utilities.degToRad(-(cloudRotation)), [0, 1, 0]);
			
			setMatrixUniforms();
			
			
			//near clouds
			gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, textures.clouds);
		    gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		    gl.bindBuffer(gl.ARRAY_BUFFER, cloudBuffer.sphereVertexPositionBuffer);
		    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cloudBuffer.sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ARRAY_BUFFER, cloudBuffer.sphereVertexTextureCoordBuffer);
		    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cloudBuffer.sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ARRAY_BUFFER, cloudBuffer.sphereVertexNormalBuffer);
		    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cloudBuffer.sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloudBuffer.sphereVertexIndexBuffer);
		    gl.drawElements(gl.TRIANGLES, cloudBuffer.sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			
			//far clouds
			
			gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, textures.cloudsFar);
			mat4.rotate(mvMatrix, utilities.degToRad(-(cloudRotationFar-cloudRotation)), [0, 1, 0]);
			setMatrixUniforms();
			
			gl.bindBuffer(gl.ARRAY_BUFFER, cloudBufferFar.sphereVertexPositionBuffer);
		    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cloudBufferFar.sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ARRAY_BUFFER, cloudBufferFar.sphereVertexTextureCoordBuffer);
		    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cloudBufferFar.sphereVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ARRAY_BUFFER, cloudBufferFar.sphereVertexNormalBuffer);
		    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cloudBufferFar.sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cloudBufferFar.sphereVertexIndexBuffer);
		    gl.drawElements(gl.TRIANGLES, cloudBufferFar.sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			
			
			//====> lets bind the cubes
			
			// Move the mvMatrix with reference to our position and view
	        mat4.identity(mvMatrix);
		    
			mat4.rotate(mvMatrix, utilities.degToRad(-(utilities.input.pitch)), [1, 0, 0]);
	        mat4.rotate(mvMatrix, utilities.degToRad(-(utilities.input.yaw)), [0, 1, 0]);
	        mat4.translate(mvMatrix, [-utilities.input.x, -utilities.input.y, -utilities.input.z]);
			
			setMatrixUniforms();
			
			//we want solid so no blending
			gl.disable(gl.BLEND);
			gl.enable(gl.DEPTH_TEST);
			gl.uniform1f(shaderProgram.AlphaBlend,1);
			
			//let's use fog and lighting
			gl.uniform1i(shaderProgram.UseFogUniform, true);
			gl.uniform1i(shaderProgram.UseLighting, true);
			
			//load the box texture
			gl.activeTexture(gl.TEXTURE0);
		    gl.bindTexture(gl.TEXTURE_2D, textures.box);
		    gl.uniform1i(shaderProgram.samplerUniform, 0);
			
			//now lets bind the cubeVertexPositionBuffer
			gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.cubeVertexPositionBuffer);
    		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeBuffer.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			//bind an array for normals and add an attribute
			gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.cubeVertexNormalBuffer);
    		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeBuffer.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			//and lets bind the cubeVertexTextureBuffer
    		gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer.cubeVertexTextureCoordBuffer);
    		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeBuffer.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
					
			//bind an index array so we can take advantage of the drawElements method
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeBuffer.cubeVertexIndexBuffer);
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
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
	        gl.enable(gl.DEPTH_TEST);
			
			tick();
	  
	    };

		
		//============= Start the Game Loop ================
		
		webGLStart(document.getElementById('found'));
		

	};//end:setup
	
})(jQuery)
