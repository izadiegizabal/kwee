precision highp float;

uniform sampler2D uSampler;

varying float vLifespan;

void main(void) {
    vec4 texColor = texture2D(uSampler, gl_PointCoord);
    //if (texColor.a == 0.) discard;
    vec2 coord = gl_PointCoord - vec2(0.5);  //from [0,1] to [-0.5,0.5]
    if(length(coord) > 0.2)                  //outside of circle radius?
        discard;
    //gl_FragColor = vec4(texColor.rgb, texColor.a * vLifespan);
    gl_FragColor =  vec4(1.0,0.0,1.0, vLifespan);

}