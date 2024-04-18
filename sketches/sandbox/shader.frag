#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;

uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTexCoord);

    // gl_FragColor = vec4(vTexCoord, 0, 1);
}