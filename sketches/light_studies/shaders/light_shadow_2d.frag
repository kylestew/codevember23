#version 300 es
precision highp float;

in vec2 vTexCoord;

// void drawGrid(vec2 st, inout vec3 pixel) {
//     const float tickWidth = 0.1;
//     vec3 gridColor = vec3(0.5);
//     if (mod(st.x, tickWidth) < 0.002) pixel = gridColor;
//     if (mod(st.y, tickWidth) < 0.002) pixel = gridColor;

//     vec3 axesColor = vec3(1, 1, 1);
//     if (abs(st.x) < 0.004) pixel = axesColor;
//     if (abs(st.y) < 0.004) pixel = axesColor;
// }

struct ray {
    vec2 target;
    vec2 pos;
    vec2 d;  // step
}

ray newRay(vec2 origin, vec2 target) {
    ray r;

    r.target = target;
    r.pos = origin;
    r.d = (target - origin) / 100.0;

    return r;
}

out vec4 fragColor;

void main() {
    vec2 uv = vTexCoord;
    vec2 st = uv - 0.5;

    // vec2 dir = normalize(st);
    // float strength = pow(length(st), uFalloff);
    // vec2 vel = vec2(dir * uBlur * strength);

    // float inverseSampleCount = 1.0 / float(uSampleCount);

    // mat3x2 increments = mat3x2(vel * 1.0 * inverseSampleCount, vel * 2.0 * inverseSampleCount,
    //                            vel * 3.0 * inverseSampleCount);

    // vec3 accum = vec3(0);
    // mat3x2 offsets = mat3x2(0);

    // for (int i = 0; i < uSampleCount; i++) {
    //     accum.r += texture(tex0, uv + offsets[0]).r;
    //     accum.g += texture(tex0, uv + offsets[1]).g;
    //     accum.b += texture(tex0, uv + offsets[2]).b;

    //     offsets -= increments;
    // }
    // accum /= float(uSampleCount);

    // vec3 accum = vec3(0.0);
    // drawGrid(st, accum);

    fragColor = vec4(accum, 1.0);
}
