precision mediump float;

varying mediump vec2 vTextureCoord;
varying mediump float vAlpha;

void main() {
    vec2 coord = vTextureCoord.st;
    float circle = 1.0 - length(vTextureCoord.st) / 0.707107; // sqrt(2.0) * 0.5
    circle = min(1.0, circle*4.0);
    vec3 col = vec3(circle);
    gl_FragColor = vec4(vec3(1.0), vAlpha * clamp(circle, 0.0, 1.0));
}