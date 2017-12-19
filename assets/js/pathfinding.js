(function () {

	var rows = 50, cols = 50, barreiras_count = 1000;

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

		ctx.lineWidth = 3;
		ctx.lineCap = 'round';

		tileSize = canvas.width / rows;

		inicializar_busca();

		return console.log('A*');
	};


	function inicializar_busca () {
		tabuleiro = preencher_matriz(rows, cols);

		start = tabuleiro[0][0];
		end   = tabuleiro[cols - 1][rows - 1];

		openSet.push(start);

		update();
	};


	function heuristic (a, b) {
		let d1 = Math.pow(Math.abs(a.x - b.x), 2),
			d2 = Math.pow(Math.abs(a.y - b.y), 2);

		return Math.sqrt(d1 + d2); // Euclidian Distance
	};


	function preencher_matriz (w, h) {
		let matriz = [];

		while (h--) {
			let reserveX = 0, row = [];

			while (reserveX < w) {
				row.push(new Spot(reserveX, h, tileSize));
				reserveX++;
			};

			matriz.unshift(row);
		};

		return lancar_barreiras(matriz);
	};


	function lancar_barreiras (matriz) {
		let posX, posY, randomCell;

		while (barreiras_count > quantidade_barreiras(matriz)) {
			posX = Math.floor(Math.random() * rows);
			posY = Math.floor(Math.random() * cols);

			randomCell = matriz[posY][posX];

			if ((posX || posY) && (posX != rows - 1 || posY != cols - 1) && !randomCell.wall) {
				randomCell.wall = 1;
			};
		};

		return setEveryNeighbor(matriz);
	};


	function quantidade_barreiras (matriz) {
		var quantidade_atual = 0;

		matriz.forEach(row => {
			quantidade_atual += row.filter(celula => celula.wall).length; // quantos elementos em cada linha
		});

		return quantidade_atual;
	};


	function setEveryNeighbor (matriz) {
		matriz.forEach(row => {
			row.forEach(celula => celula.defineNeighbors(matriz));
		});

		return matriz;
	};


	function getTheLowestF (matriz) {
		let lower;

		matriz.forEach(celula => {
			if (!lower || lower.f > celula.f) lower = celula;
		});

		return lower;
	};


	function drawParent (_el, color) {
		ctx.beginPath();
		ctx.strokeStyle = color;
		[start, end, _el].forEach(celula => celula.show(color));
		while (_el.parent) {
			_el = route(_el, _el.parent);
		};
		ctx.closePath();
		ctx.stroke();
	};


	function route (from, to) {
		ctx.moveTo(from.x * from.w + (from.w * 0.5), from.y * from.w + (from.w * 0.5));
		ctx.lineTo(to.x * to.w + (to.w * 0.5), to.y * to.w + (to.w * 0.5));

		return to;
	};


	function clearCanvas (newColor) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawRect(0, 0, canvas.width, canvas.height, newColor || '#fff');
	};


	function drawRect (x, y, w, h, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	};


	function draw () {
		clearCanvas('#fff');

		tabuleiro.forEach((row, y) => {
			row.forEach((celula, x) => {
				if (celula.wall) celula.show('black');
			});
		});
	};


	function update (time = 0) {
		draw();

		if (openSet.length) {
			var currentNode = getTheLowestF(openSet);

			if (currentNode === end) {
				openSet = [];
				return drawParent(currentNode, 'green');
			};

			drawParent(currentNode, 'red');

			closedSet.push(openSet.splice(openSet.indexOf(currentNode), 1)[0]);

			let neighbors = currentNode.neighbors;

			for (let i = 0, len = neighbors.length; i < len; i++) {
				let neighbor = neighbors[i];

				if (closedSet.indexOf(neighbor) >= 0) continue;

				let gScore = currentNode.g + 1, betterGScore = false;

				if (openSet.indexOf(neighbor) === -1) {
					betterGScore = true;
					neighbor.h = heuristic(neighbor, end);
					openSet.push(neighbor);
				} else if (gScore < neighbor.g) {
					betterGScore = true;
				};

				if (betterGScore) {
					neighbor.parent = currentNode;
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
				};
			};

			requestAnimationFrame(update, canvas);
		} else {
			inicializar_busca();
		};
	};


	createCanvas(480, 480);
} ());