Craft.Camera = function(params) {

	params = params || {};

	var _pMatrix = mat4.create(),
	_fovy = params.fovy !== undefined ? params.fovy : 45,
	_aspectRatio = params.aspectRatio !== undefined ? params.aspectRatio : window.width/window.height,
	_near = params.near !== undefined ? params.near : .1,
	_far = params.far !== undefined ? params.far : 1000;
	
	mat4.perspective(_pMatrix, _fovy, _aspectRatio, _near, _far);
};