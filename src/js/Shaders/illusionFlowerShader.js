const vertexshader = `
void main() {
    gl_Position = vec4( position, 1.0 );
}`;

const fragmentshader = `
uniform vec2 u_resolution;
uniform float u_time;
varying vec3 vColor;

void main() {
    vec3 c;
    float l;
    for(int i=0; i<3; i++){
        vec2 uv = gl_FragCoord.xy/u_resolution;
		uv -=.5;
		uv.x*=u_resolution.x/u_resolution.y;
		l=length(uv);
		uv+=uv/l*(sin(u_time)+1.)*abs(sin(l*9.-u_time*2.));
		c[i]=.01/length(abs(mod(uv,1.)-.5));
    }
    gl_FragColor=vec4(c/l,u_time);
}`;

export { vertexshader, fragmentshader };
