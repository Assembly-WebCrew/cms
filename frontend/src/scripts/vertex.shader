precision mediump float;

attribute vec2 position;
attribute float number;

varying mediump vec2 vTextureCoord;
varying mediump float vAlpha;

uniform mat4 projection;
uniform vec2 screen;
uniform float time;

// http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main() {
    float t = time;
    vec3 r = vec3(rand(vec2(number*2.0,0.0)), rand(vec2(0.0, number)), rand(vec2(number, 0.0)));
    float scaling = (0.1 + 0.3 * r.z) * 15.0;

    vec2 ofs = vec2(
        r.x * screen.x,
        abs(sin(r.z)) * screen.y * 2.0 + t*(10.0 + r.y * 60.0)
        );

    ofs.y = mod(ofs.y, screen.y + scaling*4.0) - scaling*2.0;
    ofs.x = mod(ofs.x, screen.x);

    vAlpha = (1.0 - ofs.y / screen.y) * (0.1 + rand(vec2(number*3.0, 0.0)));
    vAlpha *= 0.5;

    vec2 pos = position*scaling + ofs;
    gl_Position = projection * vec4(pos, 0, 1);
    vTextureCoord = position;
}