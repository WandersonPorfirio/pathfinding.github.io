

function Spot (x, y, w) {
	this.x = x;
	this.y = y;
	this.w = w;

	this.h = 0;
	this.f = 0;
	this.g = 0;

	this.wall = 0;

	this.parent = null;

	this.neighbors = [];

	this.defineNeighbors = function (matriz) {
		var x = this.x;
		var y = this.y;

		if (x < matriz[y].length - 1 && !matriz[y][x + 1].wall) this.neighbors.push(matriz[y][x + 1]);
		if (y < matriz.length - 1 && !matriz[y + 1][x].wall) this.neighbors.push(matriz[y + 1][x]);
		if (x > 0 && !matriz[y][x - 1].wall) this.neighbors.push(matriz[y][x - 1]);
		if (y > 0 && !matriz[y - 1][x].wall) this.neighbors.push(matriz[y - 1][x]);
	};
};