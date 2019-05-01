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

varying vec3 vNormal;
varying vec3 vLightRay;
varying vec3 vEyeVec;
varying vec2 vTextureCoord;

varying vec4 vFinalColor;

void gmain(void)
{
    if(uOffscreen){
        gl_FragColor = uMaterialDiffuse;
        return;
    }

    if(uWireframe){
        gl_FragColor = vFinalColor;
    }
    else{
        //ambient term
        vec4 Ia = uLightAmbient * uMaterialAmbient;

        //diffuse term
        vec3 L = normalize(vLightRay);
        vec3 N = normalize(vNormal);
        float lambertTerm = max(dot(N,-L),0.33);
        vec4 Id = uLightDiffuse * uMaterialDiffuse * lambertTerm;

        //specular term
        vec3 E = normalize(vEyeVec);
        vec3 R = reflect(L, N);
        float specular = pow( max(dot(R, E), 0.5), 50.0);
        vec4 Is = vec4(0.5) * specular;

        //result
        vec4 finalColor = Ia + Id + Is;

        if (uMaterialDiffuse.a != 1.0) {
            finalColor.a = uMaterialDiffuse.a;
        }
        else {
            finalColor.a = 1.0;
        }

        if (uUseTextures){
            gl_FragColor =  finalColor * texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        }
        else{
            gl_FragColor = finalColor;
        }
    }

}

void main(void){
    gl_FragColor = vFinalColor;
    //gl_FragColor = vec4(1.0,0.0,1.0,1.0);

}