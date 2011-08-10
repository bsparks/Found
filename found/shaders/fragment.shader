#ifdef GL_ES
    precision highp float;
#endif
		   
varying vec2 vTextureCoord;
varying vec3 vLightWeighting;
		   
uniform sampler2D uSampler;		    
uniform bool uUseFog;	
uniform float uAlphaBlend;

float perspective_far = 500.0;
float fog_density = 6.0;
			
void main(void) {

    vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
				
	float fog_cord = (gl_FragCoord.z / gl_FragCoord.w) / perspective_far;
	float fog = fog_cord * fog_density;
				
	vec4 frag_color = vec4(textureColor.rgb * vLightWeighting, textureColor.a * uAlphaBlend);
	vec4 fog_color = vec4(0.8,0.8,0.8,1);
				
	if(uUseFog) {
	    gl_FragColor = mix(fog_color, frag_color, clamp(1.0-fog,0.0,1.0));
	} else {
        gl_FragColor = frag_color;
    }			
}