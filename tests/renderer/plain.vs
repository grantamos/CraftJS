attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uNMatrix;
uniform mat4 uPMatrix;

varying float vLuminosity;

void main(void) {
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	vec3 light = vec3(-0.5,-0.2,1.0);
	light = normalize(light);

	vec4 transNormal = uNMatrix * vec4(aVertexNormal, 1.0);;

	vLuminosity = max(dot(transNormal.xyz, light), 0.0);
}