precision highp float;

#include "spectral.glsl"

varying vec2 vTexCoord;

uniform sampler2D mask;
uniform sampler2D textureA;
uniform sampler2D textureB;

float noiseModA = 2.;
float noiseModB = 2.;
float noiseStart = 0.1;
float fieldOff = 0.1;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }

float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f * f * (3.0 - 2.0 * f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return (mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y);
}

void main(void) {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;  // flip y axis to draw right side up

    // warp UVs
    vec2 uvW = uv;
    uvW.xy += random(uvW.xy) * 0.002;

    // use mask to blend between texA and texB
    // float mixAmount = texture2D(mask, uvW).r;
    vec4 texA = texture2D(textureA, uv);
    vec4 texB = texture2D(textureB, uv);

    // only apply mix where incoming texture has alpha
    if (texB.a > 0.0 && texA.a > 0.0) {
        gl_FragColor = spectral_mix(texA, texB, 0.5);
    } else if (texA.a > 0.0) {
        gl_FragColor = texA;
    } else if (texB.a > 0.0) {
        gl_FragColor = texB;
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}