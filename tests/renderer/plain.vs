attribute vec3 aVertexPosition;

void main(void) {
	//gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	gl_Position = vec4(aVertexPosition, 1.0);
}