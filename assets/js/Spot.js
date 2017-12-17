

function Spot (x, y, w) {
	this.x = x;
	this.y = y;
	this.w = w;

	this.h = 0;
	this.f = 0;
	this.g = 0;

	this.wall = 0;

	this.neighbors = [];

	this.parent = undefined;

	this.defineNeighbors = function (matriz) {
		let x = this.x,
			y = this.y;

		for (let i = -1; i <= 1; i++) {
			if (!matriz[y + i]) continue;
			for (let j = -1; j <= 1; j++) {
				let neighbor = matriz[y + i][x + j];
				if (!neighbor || (i % 2) && (j % 2) || neighbor.wall) continue;
				if (neighbor !== this) this.neighbors.push(neighbor);
			};
		};
	};
};