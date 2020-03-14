const vertexshader = `
void main() {
    gl_Position = vec4( position, 1.0 );
}`;

const fragmentshader = `
uniform vec2 u_resolution;
uniform float u_time;
varying vec3 vColor;

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    gl_FragColor=vec4(st.x,st.y,sin(u_time),1.0);
}`;

export { vertexshader, fragmentshader };
