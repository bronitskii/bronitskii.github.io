/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

window.addEventListener('load', function () {
	const lines = [
		"[v:~]$ cd ~/Downloads/bronitskii.github.io",
		"[v:~]$ curl -sSLO https://payload.sh",
		"[v:~]$ chmod +x p4y1O4d.sh",
		"[v:~]$ ./p4y1O4d.sh",
		"[PAYLOAD] Downloading payload...",
		"[PAYLOAD] Bootstrapping...",
		"[PAYLOAD] Welcome, V",
		"[v:~]$ lynx index.html",
	];

	const container = document.querySelector('.hacking-animation');
	const textElem = container.querySelector('.hacking-animation__text');
	let currentLine = 0;
	let currentChar = 0;

	function addNewLine() {
		const line = document.createElement('div');
		const prompt = document.createElement('span');
		prompt.className = 'hacking-animation__prompt';
		line.appendChild(prompt);
		textElem.appendChild(line);
		return line;
	}

	let currentLineElem = addNewLine();
	const cursor = document.createElement('span');
	cursor.className = 'hacking-animation__cursor';
	currentLineElem.appendChild(cursor);

	const interval = setInterval(() => {
		if (currentLine >= lines.length) {
			setTimeout(() => {
				container.classList.add('hide');
				setTimeout(() => container.remove(), 500);
			}, 1000);
			clearInterval(interval);
			return;
		}

		if (currentChar >= lines[currentLine].length) {
			currentLine++;
			currentChar = 0;
			if (currentLine < lines.length) {
				currentLineElem = addNewLine();
				cursor.remove();
				currentLineElem.appendChild(cursor);
			}
			return;
		}

		const char = lines[currentLine][currentChar];
		const span = document.createElement('span');
		span.textContent = char;
		if (lines[currentLine].startsWith('[PAYLOAD]')) {
			span.style.color = '#d53b3b';
		}
		cursor.remove();
		currentLineElem.appendChild(span);
		currentLineElem.appendChild(cursor);
		currentChar++;
	}, 25);
});

(function ($) {
	var $window = $(window),
		$body = $("body"),
		$wrapper = $("#wrapper"),
		$header = $("#header"),
		$footer = $("#footer"),
		$main = $("#main"),
		$main_articles = $main.children("article");

	var browser = {
		name: navigator.userAgent
			.toLowerCase()
			.match(/(msie|chrome|safari|firefox|opera)/)[0],
	};

	breakpoints({
		xlarge: ["1281px", "1680px"],
		large: ["981px", "1280px"],
		medium: ["737px", "980px"],
		small: ["481px", "736px"],
		xsmall: ["361px", "480px"],
		xxsmall: [null, "360px"],
	});

	$window.on("load", function () {
		window.setTimeout(function () {
			$body.removeClass("is-preload");
		}, 100);
	});

	if (browser.name == "ie") {
		var flexboxFixTimeoutId;

		$window
			.on("resize.flexbox-fix", function () {
				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function () {
					if ($wrapper.prop("scrollHeight") > $window.height())
						$wrapper.css("height", "auto");
					else $wrapper.css("height", "100vh");
				}, 250);
			})
			.triggerHandler("resize.flexbox-fix");
	}

	var $nav = $header.children("nav"),
		$nav_li = $nav.find("li");

	if ($nav_li.length % 2 == 0) {
		$nav.addClass("use-middle");
		$nav_li.eq($nav_li.length / 2).addClass("is-middle");
	}

	var delay = 50,
		locked = false;

	function hideArticleContent($article) {
		$article.removeClass("active");
		$article.hide();
		$main.hide();
		$footer.show();
		$header.show();
		$body.removeClass("is-article-visible");
	}

	function showArticleContent($article) {
		$main.show();
		$article.show();

		requestAnimationFrame(() => {
			$body.addClass("is-article-visible");
			$main_articles.removeClass("active");
			$header.hide();
			$footer.hide();
			$article.addClass("active");
		});
	}

	$main._show = function (id, initial) {
		var $article = $main_articles.filter('#' + id);
		if ($article.length === 0) return;

		if (locked) return;
		locked = true;

		$main.show();
		$article.hide();

		const articleHackingAnimation = document.createElement('div');
		articleHackingAnimation.className = 'hacking-animation article-transition';
		const textElem = document.createElement('pre');
		textElem.className = 'hacking-animation__text';
		articleHackingAnimation.appendChild(textElem);
		document.body.appendChild(articleHackingAnimation);

		const lines = [
			"cd articles",
			"nvim " + id + ".md"
		];

		let currentLine = 0;
		let currentChar = 0;

		function addNewLine() {
			const line = document.createElement('div');
			const prompt = document.createElement('span');
			prompt.className = 'hacking-animation__prompt';
			prompt.textContent = '[v:~]$ ';
			line.appendChild(prompt);
			textElem.appendChild(line);
			return line;
		}

		let currentLineElem = addNewLine();
		const cursor = document.createElement('span');
		cursor.className = 'hacking-animation__cursor';
		currentLineElem.appendChild(cursor);

		const interval = setInterval(() => {
			if (currentLine >= lines.length) {
				$article.show();
				$body.addClass("is-article-visible");
				$main_articles.removeClass("active");
				$header.hide();
				$footer.hide();
				$article.addClass("active");

				setTimeout(() => {
					articleHackingAnimation.classList.add('hide');
					setTimeout(() => {
						articleHackingAnimation.remove();
						locked = false;
					}, 150);
				}, 150);
				clearInterval(interval);
				return;
			}

			if (currentChar >= lines[currentLine].length) {
				currentLine++;
				currentChar = 0;
				if (currentLine < lines.length) {
					currentLineElem = addNewLine();
					cursor.remove();
					currentLineElem.appendChild(cursor);
				}
				return;
			}

			const char = lines[currentLine][currentChar];
			const span = document.createElement('span');
			span.textContent = char;
			cursor.remove();
			currentLineElem.appendChild(span);
			currentLineElem.appendChild(cursor);
			currentChar++;
		}, 25);
	};

	$main._hide = function (addState) {
		if (document.querySelector('.article-transition')) return;
		if (locked) return;
		locked = true;

		var $article = $main_articles.filter(".active");
		if (!$body.hasClass("is-article-visible")) {
			locked = false;
			return;
		}

		hideArticleContent($article);

		const articleHackingAnimation = document.createElement('div');
		articleHackingAnimation.className = 'hacking-animation article-transition';
		const textElem = document.createElement('pre');
		textElem.className = 'hacking-animation__text';
		articleHackingAnimation.appendChild(textElem);
		document.body.appendChild(articleHackingAnimation);

		const lines = [
			":qa!",
			"cd ..",
		];

		let currentLine = 0;
		let currentChar = 0;

		function addNewLine() {
			const line = document.createElement('div');
			const prompt = document.createElement('span');
			prompt.className = 'hacking-animation__prompt';
			prompt.textContent = '[v:~]$ ';
			line.appendChild(prompt);
			textElem.appendChild(line);
			return line;
		}

		let currentLineElem = addNewLine();
		const cursor = document.createElement('span');
		cursor.className = 'hacking-animation__cursor';
		currentLineElem.appendChild(cursor);

		const interval = setInterval(() => {
			if (currentLine >= lines.length) {
				clearInterval(interval);

				setTimeout(() => {
					articleHackingAnimation.classList.add('hide');
					setTimeout(() => {
						articleHackingAnimation.remove();

						if (addState) history.pushState(null, null, "#");
						locked = false;
					}, 150);
				}, 150);
				return;
			}

			if (currentChar >= lines[currentLine].length) {
				currentLine++;
				currentChar = 0;
				if (currentLine < lines.length) {
					currentLineElem = addNewLine();
					cursor.remove();
					currentLineElem.appendChild(cursor);
				}
				return;
			}

			const char = lines[currentLine][currentChar];
			const span = document.createElement('span');
			span.textContent = char;
			cursor.remove();
			currentLineElem.appendChild(span);
			currentLineElem.appendChild(cursor);
			currentChar++;
		}, 25);
	};

	$main_articles.each(function () {
		var $this = $(this);
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on("click", function () {
				location.hash = "";
			});

		$this.on("click", function (event) {
			event.stopPropagation();
		});
	});

	$body.on("click", function (event) {
		if ($body.hasClass("is-article-visible")) $main._hide(true);
	});

	$window.on("keyup", function (event) {
		if (event.keyCode === 27) {
			if ($body.hasClass("is-article-visible")) $main._hide(true);
		}
	});

	$window.on("hashchange", function (event) {
		if (location.hash === "" || location.hash === "#") {
			event.preventDefault();
			event.stopPropagation();
			$main._hide();
		} else if ($main_articles.filter(location.hash).length > 0) {
			event.preventDefault();
			event.stopPropagation();
			$main._show(location.hash.substr(1));
		}
	});

	if ("scrollRestoration" in history) history.scrollRestoration = "manual";
	else {
		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $("html,body");

		$window
			.on("scroll", function () {
				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();
			})
			.on("hashchange", function () {
				$window.scrollTop(oldScrollPos);
			});
	}

	$main.hide();
	$main_articles.hide();

	if (location.hash !== "" && location.hash !== "#")
		$window.on("load", function () {
			$main._show(location.hash.substr(1), true);
		});
})(jQuery);

const galleryImgs = document.querySelectorAll(".gallery-item img");

galleryImgs.forEach((img) => {
	img.addEventListener("click", () => {
	});
});

function openModal(modalId, imgSrc) {
	const modal = document.getElementById(modalId);
	const modalImg = modal.querySelector(".modal-content img");
	const modalCaption = modal.querySelector(".caption");
	const loadingIndicator = modal.querySelector(".loading-indicator");

	modal.style.display = "block";
	setTimeout(() => {
		modal.style.transform = "scale(1)";
		modal.style.opacity = 1;
	}, 10);

	modal.addEventListener('click', (e) => {
		e.stopPropagation();
	});

	modalCaption.style.display = "none";
	modalImg.style.display = "none";
	loadingIndicator.style.display = "flex";

	const newImg = new Image();
	newImg.onload = function () {
		loadingIndicator.style.display = "none";
		modalImg.src = imgSrc;
		modalImg.style.display = "block";
		modalCaption.style.display = "block";
	};
	newImg.src = imgSrc;
}

function closeModal(modalId) {
	const modal = document.getElementById(modalId);
	modal.style.transform = "scale(0.95)";
	modal.style.opacity = 0;
	setTimeout(() => {
		modal.style.display = "none";
	}, 300);
}

class TextScramble {
	constructor(el) {
		this.el = el;
		this.chars = "!<>-_\\/[]{}ß%&*-=___+-≈#$>@/";
		this.update = this.update.bind(this);
	}

	setText(newText) {
		const oldText = this.el.innerText;
		const length = Math.max(oldText.length, newText.length);
		const promise = new Promise((resolve) => (this.resolve = resolve));
		this.queue = [];
		for (let i = 0; i < length; i++) {
			const from = oldText[i] || "";
			const to = newText[i] || "";
			const start = Math.floor(Math.random() * 40);
			const end = start + Math.floor(Math.random() * 40);
			this.queue.push({ from, to, start, end });
		}
		cancelAnimationFrame(this.frameRequest);
		this.frame = 0;
		this.update();
		return promise;
	}

	update() {
		let output = "";
		let complete = 0;
		for (let i = 0, n = this.queue.length; i < n; i++) {
			let { from, to, start, end, char } = this.queue[i];
			if (this.frame >= end) {
				complete++;
				output += to;
			} else if (this.frame >= start) {
				if (!char || Math.random() < 0.28) {
					char = this.randomChar();
					this.queue[i].char = char;
				}
				output += `<span class="dud">${char}</span>`;
			} else {
				output += from;
			}
		}
		this.el.innerHTML = output;
		if (complete === this.queue.length) {
			this.resolve();
		} else {
			this.frameRequest = requestAnimationFrame(this.update);
			this.frame++;
		}
	}

	randomChar() {
		return this.chars[Math.floor(Math.random() * this.chars.length)];
	}
}

const phrases = [
	"Professional Interpreter",
	"Graphic Design Creator and InfoSec Enthusiast.",
];

const el = document.querySelector(".stext");
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
	fx.setText(phrases[counter]).then(() => {
		setTimeout(next, 2500);
	});
	counter = (counter + 1) % phrases.length;
};

next();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var minDistance = 20;

window.onload = function () {
	var blurAmount = 10;
	var brightnessAmount = 0;
	var intervalId = setInterval(function () {
		if (blurAmount < 0.1 && brightnessAmount > 50) {
			clearInterval(intervalId);
		} else {
			blurAmount -= 0.1;
			brightnessAmount += 0.5;
			canvas.style.filter = `brightness(${brightnessAmount}%) blur(${blurAmount}px)`;
		}
	}, 30);
};

function setCanvasDimensions() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
}

setCanvasDimensions();
window.addEventListener("resize", setCanvasDimensions);

var characters = [];
var font_size = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? 9 : 13;
ctx.font = font_size + "px Consolas, monospace";

function intersect(x1, y1, x2, y2) {
	var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	return distance < minDistance;
}

function getRandomPosition() {
	var x, y, intersecting;
	do {
		x = Math.floor(Math.random() * canvas.width);
		y = Math.floor(Math.random() * canvas.height);
		intersecting = false;
		for (var i = 0; i < characters.length; i++) {
			if (intersect(x, y, characters[i].x, characters[i].y)) {
				intersecting = true;
				break;
			}
		}
	} while (intersecting);
	return { x: x, y: y };
}

function draw() {
	ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#00AA00";
	ctx.font = font_size + "px Arial";

	var text, opacity, position;
	for (var i = 0; i < 10; i++) {
		text = Math.random() < 0.5 ? "0" : "1";
		position = getRandomPosition();
		opacity = 0;
		ctx.globalAlpha = opacity;
		characters.push({ x: position.x, y: position.y });
		(function (x, y, text, opacity) {
			setTimeout(function () {
				var fadeInterval = setInterval(function () {
					if (opacity >= 0.481) {
						clearInterval(fadeInterval);
					} else {
						opacity += 0.95;
						ctx.globalAlpha = opacity;
						ctx.fillText(text, x, y);
					}
				}, 50);
			}, Math.random() * 2000);
		})(position.x, position.y, text, opacity);
	}
}

var intervalTime = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? 500 : 300;
var intervalId = setInterval(draw, intervalTime);

var timeoutTime = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? 6000 : 6000;
setTimeout(function () {
	clearInterval(intervalId);
}, timeoutTime);

var galleryImages = document.querySelectorAll('.gallery-item img');
var imageModals = document.querySelectorAll('[id^="myModal"]');
var closeButtons = document.querySelectorAll('[id^="myModal"] .close');

galleryImages.forEach(function (img, index) {
	img.onclick = function () {
		var modal = document.getElementById('myModal' + (index + 1));
		if (modal) {
			const loadingText = modal.querySelector('.loading-text');
			const imgSrc = img.getAttribute('data-imgsrc');

			loadingText.innerHTML = '[v:~]$ ';

			async function typeWriterEffect(text) {
				for (let i = 0; i < text.length; i++) {
					if (text[i] === ' ') {
						loadingText.innerHTML += '&nbsp;';
					} else {
						loadingText.innerText += text[i];
					}
					await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
				}
			}

			typeWriterEffect("curl -LO " + new URL(window.location.href).origin + '/' + imgSrc);
			openModal('myModal' + (index + 1), this.getAttribute('data-imgsrc'));
		}
	}
});

closeButtons.forEach(function (btn) {
	btn.onclick = function (event) {
		event.stopPropagation();
		var modal = this.closest('[id^="myModal"]');
		if (modal) {
			closeModal(modal.id);
		}
	}
});

function updateProgressBar(article) {
	const progressBar = article.querySelector('.progress-bar');
	if (!progressBar) return;

	const scrollElement = article.querySelector('.scrollbar, .container');
	const scrollPosition = scrollElement.scrollTop;
	const scrollHeight = scrollElement.scrollHeight;
	const clientHeight = scrollElement.clientHeight;

	const scrolled = (scrollPosition / (scrollHeight - clientHeight)) * 100;
	progressBar.style.width = scrolled + '%';
}

document.querySelectorAll('#more .scrollbar, #gallery .container').forEach(element => {
	element.addEventListener('scroll', () => {
		updateProgressBar(element.closest('article'));
	});
});
