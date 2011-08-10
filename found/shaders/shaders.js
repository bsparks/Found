//give access to the global object
var main = main || {};

(function($){
	
	//give the main object some shaders
	main.shaders = {};
		
	
	//fragment shader
	main.shaders['shader-fs'] = {
		type: 'x-shader/x-fragment',
		script: [
		   "#ifdef GL_ES",
		       "precision highp float;",
		   "#endif",
		   
		   "varying vec2 vTextureCoord;",
		   "varying vec3 vLightWeighting;",
		   
		   "uniform sampler2D uSampler;",
		    
			"uniform bool uUseFog;",
			
			"uniform float uAlphaBlend;",
			
		   	"float perspective_far = 500.0;",
			"float fog_density = 6.0;",
			
			"void main(void) {",
				
				"vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));",
				
				"float fog_cord = (gl_FragCoord.z / gl_FragCoord.w) / perspective_far;",
				"float fog = fog_cord * fog_density;",
				
				"vec4 frag_color = vec4(textureColor.rgb * vLightWeighting, textureColor.a * uAlphaBlend);",
				"vec4 fog_color = vec4(0.8,0.8,0.8,1);",
				
				"if(uUseFog){",
					"gl_FragColor = mix(fog_color, frag_color, clamp(1.0-fog,0.0,1.0));",
				"}",
				"else {",
					"gl_FragColor = frag_color;",
				"}",
			
			"}"
		].join('\n')
	};
	
	
	//vertex shader
	main.shaders['shader-vs'] = {
        type: 'x-shader/x-vertex',
        script: [
            "attribute vec3 aVertexPosition;",
			"attribute vec3 aVertexNormal;",
			"attribute vec2 aTextureCoord;",

		    "uniform mat4 uMVMatrix;",
		    "uniform mat4 uPMatrix;",
			"uniform mat3 uNMatrix;",
			
			"uniform vec3 uAmbientColor;",
			
			"uniform bool uUseLighting;",
			
			"uniform vec3 uLightingDirection;",
			"uniform vec3 uDirectionalColor;",
			
			"varying vec2 vTextureCoord;",
			"varying vec3 vLightWeighting;",
						
		    "void main(void) {",
		        "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);",
				"vTextureCoord = aTextureCoord;",
				"if(uUseLighting){",
					"vec3 transformedNormal = uNMatrix * aVertexNormal;",
					"float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);",
					"vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;",
				"}",
				"else {",
					"vLightWeighting = vec3(1.0,1.0,1.0);",
				"}",
				
				
		    "}"
        ].join('\n')
    };
	
	
})(jQuery)

