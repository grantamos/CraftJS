CraftJS
=======

CraftJS is a Minecraft clone in written in Javascript.

###Architecture
* CraftJS will be split into three main components
	1. Engine
		* Renderer - Consists of WebGL rendering, core 3D objects, cameras, etc. (Think slim Three.js)
		* Voxel - Renders voxels, chunks, culls, etc.
		* Terrain - Built on top of the Voxel engine.  Takes care of random level generation.
	2. Game
		* Main - Main game loop.  Initializes and runs game logic / loop.
		* Character
		* Multiplayer
		* Chat
	3. Website
		* Demos
		* Game
		* Homepage
