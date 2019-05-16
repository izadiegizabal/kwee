
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
uniform vec4 uLightSpecular;

uniform vec4 uMaterialDiffuse;
uniform vec4 uMaterialSpecular;
uniform float uShininess;

varying vec4 vFinalColor;


void main(void){

    vec4 vertex = uMVMatrix * vec4(aVertexPosition.xyz, 1.0);
	vec3 vEyeVec = -vec3(vertex.xyz);

    //Transformed normal position
    vec3 N = vec3(uNMatrix * vec4(aVertexNormal, 1.0));
    
	//Transformed light position
	vec3 light = vec3(uMVMatrix * vec4(uLightDirection, 0.0));
    vec3 L = normalize(light);
	
	//Lambert's cosine law
	float lambertTerm = dot(N,L);
    
	//Ambient Term
    vec4 Ia = uMaterialDiffuse * uLightAmbient;
	
	//Diffuse Term
	vec4 Id = uMaterialDiffuse * uLightDiffuse * lambertTerm;

	// Specular term
	vec3 E = normalize(vEyeVec);
	vec3 R = reflect(L, N);
	float specular = pow( max(dot(R, E), 0.0), uShininess);
	vec4 Is = uMaterialSpecular * uLightSpecular * specular; //add specular term 
	
	//Final Color
	vFinalColor = Ia + Id + Is;
	vFinalColor.a = 1.0;
    
	//transformed vertex position
    //gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uPMatrix * vertex;
    
}
