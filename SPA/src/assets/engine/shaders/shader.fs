#ifdef GL_ES
precision highp float;
#endif

uniform bool uWireframe;
uniform bool uUseTextures;

uniform vec4 uLightAmbient;
uniform vec4 uLightDiffuse;
uniform vec4 uMaterialAmbient;
uniform vec4 uMaterialDiffuse;
uniform bool uOffscreen;

uniform sampler2D uSampler;

varying vec4 vFinalColor;

void main(void){
    gl_FragColor = vFinalColor;
    //gl_FragColor = vec4(1.0,0.0,1.0,1.0);

}