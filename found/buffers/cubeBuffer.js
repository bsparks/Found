/* cubeBuffer.js */

"main" in window || (main = {});
"utilities" in window || (utilities = {});
"buffers" in window || (buffers = {});

(function ($) {
	
	var bufferSize = 1;
	
	//our square buffer
	buffers.cubeBuffer =  function (id, gl, cubePos) {
			
		//the buffer object
		var that = {};
		
		//the data
		that.bufferPositionData = [];
		that.bufferTextureData = [];
		that.bufferIndexData = [];
		that.bufferLightData = [];
		that.bufferNormalData = [];

		//the index
		that.bufferIndex = {};
		
		//create the cubeVertexPositionBuffer
		that.cubeVertexPositionBuffer = gl.createBuffer();
		that.cubeVertexPositionBuffer.itemSize = 3;
		
		//create the cubeTextureBuffer
		that.cubeVertexTextureCoordBuffer = gl.createBuffer();
		that.cubeVertexTextureCoordBuffer.itemSize = 2;
		
		//create the cubeIndexBuffer
		that.cubeVertexIndexBuffer = gl.createBuffer();
		that.cubeVertexIndexBuffer.itemSize = 1;
		
		//create then normal vertx buffer
		that.cubeVertexNormalBuffer = gl.createBuffer();
		that.cubeVertexNormalBuffer.itemSize = 3;
		
		//add a box at a certain position with type and light
		that.addBox = function (pos, type, light) {
			
			//pos = {x,y,z}
			var cp = that.bufferPositionData.length /3;
			
			//create the vertices
			var	vertices = [
				// Front face
				0 + pos.x, 0 + pos.y,  1.0 + pos.z,
				1.0 + pos.x, 0 + pos.y,  1.0 + pos.z,
				1.0 + pos.x,  1.0 + pos.y,  1.0 + pos.z,
				0 + pos.x,  1.0 + pos.y,  1.0 + pos.z,
				
				// Back face
				0 + pos.x, 0 + pos.y, 0 + pos.z,
				0 + pos.x,  1.0 + pos.y, 0 + pos.z,
				1.0 + pos.x,  1.0 + pos.y, 0 + pos.z,
				1.0 + pos.x, 0 + pos.y, 0 + pos.z,
				
				// Top face
				0 + pos.x,  1.0 + pos.y, 0 + pos.z,
				0 + pos.x,  1.0 + pos.y,  1.0 + pos.z,
				1.0 + pos.x,  1.0 + pos.y,  1.0 + pos.z,
				1.0 + pos.x,  1.0 + pos.y, 0 + pos.z,
				
				// Bottom face
				0 + pos.x, 0 + pos.y, 0 + pos.z,
				1.0 + pos.x, 0 + pos.y, 0 + pos.z,
				1.0 + pos.x, 0 + pos.y,  1.0 + pos.z,
				0 + pos.x, 0 + pos.y,  1.0 + pos.z,
				
				// Right face
				1.0 + pos.x, 0 + pos.y, 0 + pos.z,
				1.0 + pos.x,  1.0 + pos.y, 0 + pos.z,
				1.0 + pos.x,  1.0 + pos.y,  1.0 + pos.z,
				1.0 + pos.x, 0 + pos.y,  1.0 + pos.z,
				
				// Left face
				0 + pos.x, 0 + pos.y, 0 + pos.z,
				0 + pos.x, 0 + pos.y,  1.0 + pos.z,
				0 + pos.x,  1.0 + pos.y,  1.0 + pos.z,
				0 + pos.x,  1.0 + pos.y, 0 + pos.z,
		    ];
			
			//create the texture coords
			var textureCoords = [
				// Front face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,
				
				// Back face
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,
				0.0, 0.0,
				
				// Top face
				0.0, 1.0,
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				
				// Bottom face
				1.0, 1.0,
				0.0, 1.0,
				0.0, 0.0,
				1.0, 0.0,
				
				// Right face
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,
				0.0, 0.0,
				
				// Left face
				0.0, 0.0,
				1.0, 0.0,
				1.0, 1.0,
				0.0, 1.0,
		    ];
			
		    var vertexNormals = [
		      // Front face
		       0.0,  0.0,  1.0,
		       0.0,  0.0,  1.0,
		       0.0,  0.0,  1.0,
		       0.0,  0.0,  1.0,
		
		      // Back face
		       0.0,  0.0, -1.0,
		       0.0,  0.0, -1.0,
		       0.0,  0.0, -1.0,
		       0.0,  0.0, -1.0,
		
		      // Top face
		       0.0,  1.0,  0.0,
		       0.0,  1.0,  0.0,
		       0.0,  1.0,  0.0,
		       0.0,  1.0,  0.0,
		
		      // Bottom face
		       0.0, -1.0,  0.0,
		       0.0, -1.0,  0.0,
		       0.0, -1.0,  0.0,
		       0.0, -1.0,  0.0,
		
		      // Right face
		       1.0,  0.0,  0.0,
		       1.0,  0.0,  0.0,
		       1.0,  0.0,  0.0,
		       1.0,  0.0,  0.0,
		
		      // Left face
		      -1.0,  0.0,  0.0,
		      -1.0,  0.0,  0.0,
		      -1.0,  0.0,  0.0,
		      -1.0,  0.0,  0.0,
		    ];
		    			
			//create the indices
		    var cubeVertexIndices = [
		      cp + 0, cp + 1, cp + 2,      cp + 0, cp + 2, cp + 3,    // Front face
		      cp + 4, cp + 5, cp + 6,      cp + 4, cp + 6, cp + 7,    // Back face
		      cp + 8, cp + 9, cp + 10,     cp + 8, cp + 10, cp + 11,  // Top face
		      cp + 12, cp + 13, cp + 14,   cp + 12, cp + 14, cp + 15, // Bottom face
		      cp + 16, cp + 17, cp + 18,   cp + 16, cp + 18, cp + 19, // Right face
		      cp + 20, cp + 21, cp + 22,   cp + 20, cp + 22, cp + 23  // Left face
		    ];
			
			//push the data into each
			
			//check to see if this is a new one or not
			//if its already in there... we need to get the index from the indexObject and replace in each array at that spot
			
			var boxId = "x" + pos.x + "y" + pos.y + "z" + pos.z;
		
			if(!that.bufferIndex[boxId]){}
			
			//otherwise we need to push the data onto each array and then add an index object with that array index based on length - 1
			that.bufferPositionData = that.bufferPositionData.concat(vertices);
			that.bufferIndexData = that.bufferIndexData.concat(cubeVertexIndices);
			that.bufferTextureData = that.bufferTextureData.concat(textureCoords);
			that.bufferNormalData = that.bufferNormalData.concat(vertexNormals);

			
			gl.bindBuffer(gl.ARRAY_BUFFER, that.cubeVertexPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.bufferPositionData), gl.STATIC_DRAW);
		    that.cubeVertexPositionBuffer.numItems = that.bufferPositionData.length / that.cubeVertexPositionBuffer.itemSize;
			
			gl.bindBuffer(gl.ARRAY_BUFFER, that.cubeVertexNormalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.bufferNormalData), gl.STATIC_DRAW);
			that.cubeVertexNormalBuffer.numItems = that.bufferNormalData.length / that.cubeVertexNormalBuffer.itemSize;
			
			gl.bindBuffer(gl.ARRAY_BUFFER, that.cubeVertexTextureCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.bufferTextureData), gl.STATIC_DRAW);
		    that.cubeVertexTextureCoordBuffer.numItems = that.bufferTextureData.length / that.cubeVertexTextureCoordBuffer.itemSize;
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.cubeVertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(that.bufferIndexData), gl.STATIC_DRAW);
		    that.cubeVertexIndexBuffer.numItems = that.bufferIndexData.length / that.cubeVertexIndexBuffer.itemSize;
		
		};
		
		return that;   
			
	};
	

})(jQuery)
