var main = main || {};
var utilities = utilities || {};
var buffers = buffers || {};

(function ($){
	
	var bufferSize = 1;
	
	//our square buffer
	buffers.sphereBuffer =  function (id,gl,spherePos) {
			
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
		
		that.sphereVertexPositionBuffer = gl.createBuffer();
		that.sphereVertexPositionBuffer.itemSize = 3;
		
		that.sphereVertexNormalBuffer = gl.createBuffer();
		that.sphereVertexNormalBuffer.itemSize = 3;
		
		that.sphereVertexTextureCoordBuffer = gl.createBuffer();
		that.sphereVertexTextureCoordBuffer.itemSize = 2;
		
		that.sphereVertexIndexBuffer = gl.createBuffer();
		that.sphereVertexIndexBuffer.itemSize = 1;
		
		
		//add a box at a certain position with type and light
		that.addSphere = function (pos,radius,latitudeBands,longitudeBands) {
			
			for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
				var theta = latNumber * Math.PI / latitudeBands;
				var sinTheta = Math.sin(theta);
				var cosTheta = Math.cos(theta);
				
				for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
					var phi = longNumber * 2 * Math.PI / longitudeBands;
					var sinPhi = Math.sin(phi);
					var cosPhi = Math.cos(phi);
					
					var x = cosPhi * sinTheta;
					var y = cosTheta;
					var z = sinPhi * sinTheta;
					var u = 1 - (longNumber / longitudeBands);
					var v = 1 - (latNumber / latitudeBands);
					
					that.bufferNormalData.push(x);
					that.bufferNormalData.push(y);
					that.bufferNormalData.push(z);
					that.bufferTextureData.push(u);
					that.bufferTextureData.push(v);
					that.bufferPositionData.push(radius * x);
					that.bufferPositionData.push(radius * y);
					that.bufferPositionData.push(radius * z);
				}
			}
			
			//create the index array
			for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
				for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
					var first = (latNumber * (longitudeBands + 1)) + longNumber;
					var second = first + longitudeBands + 1;
					that.bufferIndexData.push(first);
					that.bufferIndexData.push(second);
					that.bufferIndexData.push(first + 1);
					
					that.bufferIndexData.push(second);
					that.bufferIndexData.push(second + 1);
					that.bufferIndexData.push(first + 1);
				}
			}
	
			//push the data into each
			
			//check to see if this is a new one or not
			//if its already in there... we need to get the index from the indexObject and replace in each array at that spot
			
			var boxId = "x" + pos.x + "y" + pos.y + "z" + pos.z;
		
			if(!that.bufferIndex[boxId]){}
			
			gl.bindBuffer(gl.ARRAY_BUFFER, that.sphereVertexPositionBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.bufferPositionData), gl.STATIC_DRAW);
		    that.sphereVertexPositionBuffer.numItems = that.bufferPositionData.length / that.sphereVertexPositionBuffer.itemSize;
			
			console.log("ITEMS:",that.sphereVertexPositionBuffer.numItems);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, that.sphereVertexNormalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.bufferNormalData), gl.STATIC_DRAW);
			that.sphereVertexNormalBuffer.numItems = that.bufferNormalData.length / that.sphereVertexNormalBuffer.itemSize;
			
			console.log("ITEMS:",that.sphereVertexNormalBuffer.numItems);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, that.sphereVertexTextureCoordBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.bufferTextureData), gl.STATIC_DRAW);
		    that.sphereVertexTextureCoordBuffer.numItems = that.bufferTextureData.length / that.sphereVertexTextureCoordBuffer.itemSize;
			
			console.log("ITEMS:",that.sphereVertexTextureCoordBuffer.numItems);
			
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.sphereVertexIndexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(that.bufferIndexData), gl.STATIC_DRAW);
		    that.sphereVertexIndexBuffer.numItems = that.bufferIndexData.length / that.sphereVertexIndexBuffer.itemSize;
			
			console.log("ITEMS:",that.sphereVertexIndexBuffer.numItems);
			
		};
		
		return that;   
			
	};
	

})(jQuery)
