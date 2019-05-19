attribute vec4 aParticle;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uPointSize;

uniform vec4 uColor;

varying float vLifespan;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aParticle.xyz, 1.0);
   
    vLifespan = aParticle.w;
    
    gl_PointSize = uPointSize * vLifespan;
}
