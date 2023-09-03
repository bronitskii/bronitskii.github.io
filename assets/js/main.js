/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');
	var browser = { name: navigator.userAgent.toLowerCase().match(/(msie|chrome|safari|firefox|opera)/)[0] };


	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == 'ie') {

		var flexboxFixTimeoutId;

		$window.on('resize.flexbox-fix', function () {

			clearTimeout(flexboxFixTimeoutId);

			flexboxFixTimeoutId = setTimeout(function () {

				if ($wrapper.prop('scrollHeight') > $window.height())
					$wrapper.css('height', 'auto');
				else
					$wrapper.css('height', '100vh');

			}, 250);

		}).triggerHandler('resize.flexbox-fix');

	}

	// Nav.
	var $nav = $header.children('nav'),
		$nav_li = $nav.find('li');

	// Add "middle" alignment classes if we're dealing with an even number of items.
	if ($nav_li.length % 2 == 0) {

		$nav.addClass('use-middle');
		$nav_li.eq(($nav_li.length / 2)).addClass('is-middle');

	}

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	$main._show = function (id, initial) {

		var $article = $main_articles.filter('#' + id);

		// No such article? Bail.
		if ($article.length == 0)
			return;

		// Handle lock.

		// Already locked? Speed through "show" steps w/o delays.
		if (locked || (typeof initial != 'undefined' && initial === true)) {

			// Mark as switching.
			$body.addClass('is-switching');

			// Mark as visible.
			$body.addClass('is-article-visible');

			// Deactivate all articles (just in case one's already active).
			$main_articles.removeClass('active');

			// Hide header, footer.
			$header.hide();
			$footer.hide();

			// Show main, article.
			$main.show();
			$article.show();

			// Activate article.
			$article.addClass('active');

			// Unlock.
			locked = false;

			// Unmark as switching.
			setTimeout(function () {
				$body.removeClass('is-switching');
			}, (initial ? 1000 : 0));

			return;

		}

		// Lock.
		locked = true;

		// Article already visible? Just swap articles.
		if ($body.hasClass('is-article-visible')) {

			// Deactivate current article.
			var $currentArticle = $main_articles.filter('.active');

			$currentArticle.removeClass('active');

			// Show article.
			setTimeout(function () {

				// Hide current article.
				$currentArticle.hide();

				// Show article.
				$article.show();

				// Activate article.
				setTimeout(function () {

					$article.addClass('active');

					// Window stuff.
					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function () {
						locked = false;
					}, delay);

				}, 25);

			}, delay);

		}

		// Otherwise, handle as normal.
		else {

			// Mark as visible.
			$body
				.addClass('is-article-visible');

			// Show article.
			setTimeout(function () {

				// Hide header, footer.
				$header.hide();
				$footer.hide();

				// Show main, article.
				$main.show();
				$article.show();

				// Activate article.
				setTimeout(function () {

					$article.addClass('active');

					// Window stuff.
					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function () {
						locked = false;
					}, delay);

				}, 25);

			}, delay);

		}

	};

	$main._hide = function (addState) {

		var $article = $main_articles.filter('.active');

		// Article not visible? Bail.
		if (!$body.hasClass('is-article-visible'))
			return;

		// Add state?
		if (typeof addState != 'undefined'
			&& addState === true)
			history.pushState(null, null, '#');

		// Handle lock.

		// Already locked? Speed through "hide" steps w/o delays.
		if (locked) {

			// Mark as switching.
			$body.addClass('is-switching');

			// Deactivate article.
			$article.removeClass('active');

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			$body.removeClass('is-article-visible');

			// Unlock.
			locked = false;

			// Unmark as switching.
			$body.removeClass('is-switching');

			// Window stuff.
			$window
				.scrollTop(0)
				.triggerHandler('resize.flexbox-fix');

			return;

		}

		// Lock.
		locked = true;

		// Deactivate article.
		$article.removeClass('active');

		// Hide article.
		setTimeout(function () {

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			setTimeout(function () {

				$body.removeClass('is-article-visible');

				// Window stuff.
				$window
					.scrollTop(0)
					.triggerHandler('resize.flexbox-fix');

				// Unlock.
				setTimeout(function () {
					locked = false;
				}, delay);

			}, 25);

		}, delay);


	};

	// Articles.
	$main_articles.each(function () {

		var $this = $(this);

		// Close.
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on('click', function () {
				location.hash = '';
			});

		// Prevent clicks from inside article from bubbling.
		$this.on('click', function (event) {
			event.stopPropagation();
		});

	});

	// Events.
	$body.on('click', function (event) {

		// Article visible? Hide.
		if ($body.hasClass('is-article-visible'))
			$main._hide(true);

	});

	$window.on('keyup', function (event) {

		switch (event.keyCode) {

			case 27:

				// Article visible? Hide.
				if ($body.hasClass('is-article-visible'))
					$main._hide(true);

				break;

			default:
				break;

		}

	});

	$window.on('hashchange', function (event) {

		// Empty hash?
		if (location.hash == ''
			|| location.hash == '#') {

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Hide.
			$main._hide();

		}

		// Otherwise, check for a matching article.
		else if ($main_articles.filter(location.hash).length > 0) {

			// Prevent default.
			event.preventDefault();
			event.stopPropagation();

			// Show article.
			$main._show(location.hash.substr(1));

		}

	});

	// Scroll restoration.
	// This prevents the page from scrolling back to the top on a hashchange.
	if ('scrollRestoration' in history)
		history.scrollRestoration = 'manual';
	else {

		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $('html,body');

		$window
			.on('scroll', function () {

				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();

			})
			.on('hashchange', function () {
				$window.scrollTop(oldScrollPos);
			});

	}

	// Initialize.

	// Hide main, articles.
	$main.hide();
	$main_articles.hide();

	// Initial article.
	if (location.hash != ''
		&& location.hash != '#')
		$window.on('load', function () {
			$main._show(location.hash.substr(1), true);
		});

})(jQuery);


const galleryImgs = document.querySelectorAll('.gallery-item img');

galleryImgs.forEach(img => {
	img.addEventListener('click', () => {
		const jpegSrc = img.dataset.imgsrc;
		const modalId = img.dataset.modal;
		const modal = document.getElementById(modalId);
		const modalImg = modal.querySelector('.modal-content');
		const modalCaption = modal.querySelector('.caption');
		const loadingIndicator = modal.querySelector('.loading-indicator');

		// Hide the caption
		modalCaption.style.display = 'none';

		// Show the loading indicator
		loadingIndicator.style.display = 'block';

		// Hide the modal content
		modalImg.style.display = 'none';

		// Create a new image element
		const newImg = new Image();

		// Set up a listener for when the image has loaded
		newImg.addEventListener('load', function () {
			// Hide the loading indicator
			loadingIndicator.style.display = 'none';

			// Show the modal content
			modalImg.style.display = 'block';

			// Set the modal image source to the loaded image
			modalImg.src = jpegSrc;

			// Show the caption
			modalCaption.style.display = 'block';
		});

		// Set the source of the new image to the given image URL
		newImg.src = jpegSrc;

		// Set the loading indicator to the loading.gif
		loadingIndicator.src = 'loading.gif';

		// Show the modal
		modal.style.display = 'block';
	});
});

function openModal(modalId, imgSrc) {
	const modal = document.getElementById(modalId);
	const modalImg = modal.querySelector('.modal-content');
	const modalCaption = modal.querySelector('.caption');
	const loadingIndicator = modal.querySelector('.loading-indicator');

	// Hide the caption
	modalCaption.style.display = 'none';

	// Show the loading indicator
	loadingIndicator.style.display = 'block';

	// Hide the modal content
	modalImg.style.display = 'none';

	// Create a new image element
	const newImg = new Image();

	// Set up a listener for when the image has loaded
	newImg.addEventListener('load', function () {
		// Hide the loading indicator
		loadingIndicator.style.display = 'none';

		// Show the modal content
		modalImg.style.display = 'block';

		// Set the modal image source to the loaded image
		modalImg.src = imgSrc;

		// Show the caption
		modalCaption.style.display = 'block';
	});

	// Set the source of the new image to the given image URL
	newImg.src = imgSrc;

	// Set the loading indicator to the loading.gif
	loadingIndicator.src = 'loading.gif';

	// Show the modal
	modal.style.display = 'block';
}

function closeModal(modalId) {
	const modal = document.getElementById(modalId);
	modal.style.display = 'none';
}

// textscramble

class TextScramble {
	constructor(el) {
		this.el = el;
		this.chars = '!<>-_\\/[]{}ß%&*-=___+-≈#$>@/';
		this.update = this.update.bind(this);
	}
	setText(newText) {
		const oldText = this.el.innerText;
		const length = Math.max(oldText.length, newText.length);
		const promise = new Promise(resolve => this.resolve = resolve);
		this.queue = [];
		for (let i = 0; i < length; i++) {
			const from = oldText[i] || '';
			const to = newText[i] || '';
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
		let output = '';
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
	'An avid and experienced translator / interpreter',
	'photoshop creator and network enthusiast.',];

const el = document.querySelector('.stext');
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
	fx.setText(phrases[counter]).then(() => {
		setTimeout(next, 2500);
	});
	counter = (counter + 1) % phrases.length;
};

next();
// Get the canvas element and its 2D rendering context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Add animation to go from 10px blur to 0px blur and from 0% brightness to 50% brightness on window load
window.onload = function () {
	var blurAmount = 10;
	var brightnessAmount = 0;
	var intervalId = setInterval(function () {
	  if (blurAmount < 0.1 && brightnessAmount > 50) {
		clearInterval(intervalId);
		console.log('animation finished')
	  } else {
		blurAmount -= 0.1;
		brightnessAmount += 0.5;
		canvas.style.filter = `brightness(${brightnessAmount}%) blur(${blurAmount}px)`;
	  }
	}, 30);
  };

// Function to set canvas dimensions
function setCanvasDimensions() {
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;

	// Recalculate the number of columns based on new canvas width
	columns = canvas.width / font_size;

	// Reset the position of falling characters
	drops = [];
	for (var x = 0; x < columns; x++) {
		drops[x] = 1;
	}
}

// Call setCanvasDimensions initially and on window resize
setCanvasDimensions();
window.addEventListener("resize", setCanvasDimensions);

// Define the characters that will fall
var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
characters = characters.split("");

// Set the font size and calculate the number of columns
var font_size = 10;
var columns = canvas.width / font_size;

// Initialize an array to track the vertical position of each character
var drops = [];
for (var x = 0; x < columns; x++) {
	drops[x] = 1;
}

// Function to draw the falling characters
function draw() {
	// Create a semi-transparent background
	ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Set the character color
	ctx.fillStyle = "#45717b";
	ctx.font = font_size + "px Arial";

	// Iterate through columns and characters
	for (var i = 0; i < drops.length; i++) {
		// Choose a random character
		var text = characters[Math.floor(Math.random() * characters.length)];

		// Draw the character at the current position
		ctx.fillText(text, i * font_size, drops[i] * font_size);

		// Reset the character position if it reaches the bottom of the canvas
		if (drops[i] * font_size > canvas.height) {
			drops[i] = 0;
		}

		// Move the character down for the next frame
		drops[i]++;
	}
}

// Call the draw function repeatedly with a 50-millisecond interval for animation
setInterval(draw, 70);
