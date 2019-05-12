
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform vec4 uLightAmbient;
uniform vec3 uLightDirection;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialDiffuse;

varying vec4 vFinalColor;

// old shader:
uniform bool uWireframe;
uniform bool uUseVertexColor;
uniform bool uUseTextures;
varying vec3 vNormal;
varying vec3 vLightRay;
varying vec3 vEyeVec;
varying vec2 vTextureCoord;

void main(void){
    
    //Transformed normal position
    vec3 N = vec3(uNMatrix * vec4(aVertexNormal, 1.0));
    
	//Transformed light position
	vec3 light = vec3(uMVMatrix * vec4(uLightDirection, 0.0));
    vec3 L = normalize(light);
	
	//Lambert's cosine law
	//float lambertTerm = dot(N,-L);
	float lambertTerm = dot(N,L);
    
	//Ambient Term
    vec4 Ia = uMaterialDiffuse * uLightAmbient;
	
	//Diffuse Term
	vec4 Id =  uMaterialDiffuse * uLightDiffuse * lambertTerm;
	
	//Final Color
	vFinalColor = Ia + Id;
	vFinalColor.a = 1.0;
    
	//transformed vertex position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
}
