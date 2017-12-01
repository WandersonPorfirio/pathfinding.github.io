(function () {

	var rows = 50, cols = 50, barreiras_count = 800;

	var start, end, openSet = [], closedSet = [];

	var canvas, ctx, tileSize, tabuleiro;


	Spot.prototype.show = function (newColor) {
		drawRect(this.x * this.w, this.y * this.w, this.w, this.w, newColor || '#fff');
	};


	function createCanvas (w, h) {
		canvas = document.createElement('canvas');
		canvas.width  = w;
		canvas.height = h;
		canvas.textContent = 'sem suporte';

		document.body.appendChild(canvas);

		ctx = canvas.getContext('2d');

		tileSize = canvas.width / rows;

		tabuleiro = preencher_matriz(rows, cols);

		tabuleiro.forEach(row => row.forEach(celula => celula.defineNeighbors(tabuleiro)));

		start = tabuleiro[0][0];
		end   = tabuleiro[cols - 1][rows - 1];

		openSet.push(start);

		update();

		return console.log('A*');
	};


	function heuristic (a, b) {
		var d1 = Math.abs(a.x - b.x);
		var d2 = Math.abs(b.y - b.y);
		return d1 + d2; // Manhattan Distance

		// d1 = Math.pow(d1, 2);
		// d2 = Math.pow(d2, 2);
		// return Math.sqrt(d1 + d2); // Euclidian Distance
	};


	function preencher_matriz (w, h) {
		var matriz = [];

		while (h--) {
			var reserveX = 0, row = [];

			while (reserveX < w) {
				row.push(new Spot(reserveX, h, tileSize));
				reserveX++;
			};

			matriz.unshift(row);
		};

		return lancar_barreiras(matriz);
	};


	function lancar_barreiras (matriz) {
		var posX, posY;

		while (barreiras_count > quantidade_barreiras(matriz)) {
			posX = Math.floor(Math.random() * rows);
			posY = Math.floor(Math.random() * cols);

			if ((posX || posY) && (posX != rows - 1 || posY != cols - 1) && !matriz[posY][posX].wall) {
				matriz[posY][posX].wall = 1;
			};
		};

		return matriz;
	};


	function quantidade_barreiras (matriz) {
		var qnt = 0;

		matriz.forEach(row => qnt += row.filter(celula => celula.wall).length);

		return qnt;
	};


	function getTheLowestF (matriz) {
		var lower;

		matriz.forEach(celula => {
			if (!lower || lower.f > celula.f) lower = celula;
		});

		return lower;
	};


	function drawParent (_el, slowly) {
		if (_el.parent) {
			route(_el, _el.parent);
			slowly ? setTimeout(() => drawParent(_el.parent, slowly), 20) : drawParent(_el.parent);
		};
	};


	function route (from, to) {
		ctx.beginPath();

		ctx.lineWidth = 3;
		ctx.lineCap = 'round';
		ctx.strokeStyle = '#F00';

		ctx.moveTo(from.x * from.w + (from.w * 0.5), from.y * from.w + (from.w * 0.5));
		ctx.lineTo(to.x * to.w + (to.w * 0.5), to.y * to.w + (to.w * 0.5));

		ctx.closePath();

		ctx.stroke();
	};


	function clearCanvas (newColor) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawRect(0, 0, canvas.width, canvas.height, newColor || '#fff');
	};


	function drawRect (x, y, w, h, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x + .5, y + .5, w - 1, h - 1);
	};


	function draw () {
		clearCanvas('#e0e0e0');

		tabuleiro.forEach((row, y) => {
			row.forEach((celula, x) => {
				celula.show(celula.wall ? '#000' : '#fff');
			});
		});

		[start, end].forEach(celula => celula.show('#F00')); // from and to points
	};


	function reload () {
		location = '';
	};



	function update (time = 0) {
		draw();
				

		if (openSet.length) {
			var current = getTheLowestF(openSet);

			if (current === end) {
				draw();
				openSet = [];
				drawParent(current, 1);
				return console.log('Done!');
			};

			drawParent(current);

			closedSet.push(openSet.splice(openSet.indexOf(current), 1)[0]);

			var neighbors = current.neighbors;

			for (var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i];

				if (closedSet.indexOf(neighbor) >= 0 || neighbor.wall) continue;

				var gScore = current.g + 1, betterGScore = false;

				if (openSet.indexOf(neighbor) === -1) {
					betterGScore = true;
					neighbor.h = heuristic(neighbor, end);
					openSet.push(neighbor);
				} else if (gScore < neighbor.g) {
					betterGScore = true;
				};

				if (betterGScore) {
					neighbor.parent = current;
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
				};
			};

			requestAnimationFrame(update, canvas);
		} else setTimeout(reload, 10);
	};


	createCanvas(480, 480);
} ());