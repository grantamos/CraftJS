CraftJS
=======

CraftJS is a Minecraft clone in written in Javascript.

Architecture
-CraftJS will be split into three main components:
	1) The engine.
	2) The game.
	3) The website.

Components

-Engine
	- Voxel - Consists of WebGL rendering, chunking, blocks, etc.
	- Terrain - Built on top of the Voxel engine.  Takes care of random level generation.

-Game
	-Main - Main game loop.  Initializes and runs game logic / loop.
	-Character
	-Multiplayer
	-Chat

-Website
	-Demos
	-Game
	-Homepage