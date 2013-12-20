precision mediump float;

varying float vLuminosity;

void main(void) {
	gl_FragColor = vec4 (vLuminosity, vLuminosity, vLuminosity, 1.0);
}