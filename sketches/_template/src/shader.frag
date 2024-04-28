#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;

uniform sampler2D mask;
uniform sampler2D textureA;
uniform sampler2D textureB;

// float noiseModA = 2.;
// float noiseModB = 2.;
// float noiseStart = 0.1;
// float fieldOff = 0.1;

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
    // uv is our base texture
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;

    // vec2 uvW = uv;
    // // float ns = map(noise((noiseStart + uvW.xy) * noiseModA), 0.0, 1.0, -1.0, 1.0);
    // // float nsB = map(noise((noiseStart + uvW.xy) * noiseModB), 0.0, 1.0, -1.0, 1.0);
    // // uvW.xy += (ns)*fieldOff / 2.0;
    // // uvW.xy += (nsB)*fieldOff / 2.0;
    // uvW.xy += random(uvW.xy) * 0.001;

    // use mask to blend between texA and texB
    vec3 texAlpha = texture2D(mask, uv).rgb;
    vec4 texA = texture2D(textureA, uv);
    vec4 texB = texture2D(textureB, uv);
    vec4 col = texA * texAlpha.r + texB * texAlpha.g;
    gl_FragColor = col;

    // gl_FragColor = texture2D(textureA, uv);

    // uv.y *= 3.0;  // TEMP - just for visual ref
    // // texture is loaded upside down and backwards

    // // uvW is a warped version
    // vec2 uvW = uv;
    // uvW.y += 1.0;
    // float ns = map(noise((noiseStart + uvW.xy) * noiseModA), 0.0, 1.0, -1.0, 1.0);
    // float nsB = map(noise((noiseStart + uvW.xy) * noiseModB), 0.0, 1.0, -1.0, 1.0);
    // uvW.xy += (ns)*fieldOff / 2.0;
    // uvW.xy += (nsB)*fieldOff / 2.0;
    // uvW.xy += random(uvW.xy) * 0.001;

    // // uvR is +random*x to mix into uv and dull stray pixels
    // vec2 uvR = uv;
    // uvR.y += 2.0;
    // float randPxOff = map(random(uvR.xy), 0.0, 1.0, -1.0, 1.0);
    // uvR += randPxOff * 0.1;

    // // guide layers
    // vec4 texP2 = texture2D(p2, uv);
    // vec4 texP2W = texture2D(p2, uvW);
    // vec4 texP2N = texture2D(p2, uvR);

    // if (vTexCoord.y < 0.333) {
    //     // gl_FragColor = vec4(uv, 0, 1);
    //     gl_FragColor = texP2;
    // } else if (vTexCoord.y < 0.666) {
    //     // gl_FragColor = vec4(uvW, 0, 1);
    //     gl_FragColor = texP2W;
    // } else {
    //     // gl_FragColor = vec4(uvR, 0, 1);
    //     gl_FragColor = texP2N;
    // }

    // pattern layers
    // vec4 texLineV = texture2D(lineV, uvW);
    //...
}