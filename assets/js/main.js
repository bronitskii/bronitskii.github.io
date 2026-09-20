var cachedVisit = false;

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("fast") === "true" || sessionStorage.getItem("bootSeen")) {
    const hackingAnimation = document.querySelector(".hacking-animation");
    if (hackingAnimation) hackingAnimation.remove();
    document.getElementById("main").style.display = "";
    cachedVisit = true;
  } else {

  const bootLines = [
    {
      text: "[    0.000000] Linux version 6.7.0-v (gcc 13.2.0) #1 SMP PREEMPT",
      color: "#888",
    },
    {
      text: "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1",
      color: "#888",
    },
    { text: "[    0.023145] BIOS-provided physical RAM map:", color: "#666" },
    {
      text: "[    0.023150]  BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
      color: "#555",
    },
    {
      text: "[    0.045012] DMI: Custom Build v1.0/VB-BOARD, BIOS 1.0 02/06/2026",
      color: "#666",
    },
    {
      text: "[    0.089234] tsc: Detected 3600.000 MHz processor",
      color: "#888",
    },
    {
      text: "[    0.102445] Calibrating delay loop (skipped), value calculated using timer frequency",
      color: "#555",
    },
    {
      text: "[    0.156000] pid_max: default: 32768 minimum: 301",
      color: "#555",
    },
    {
      text: "[    0.201023] Mount-cache hash table entries: 16384",
      color: "#555",
    },
    { text: "[    0.245678] CPU: Physical Processor ID: 0", color: "#666" },
    {
      text: "[    0.312456] Performance Events: PEBS fmt4+-baseline, 32-deep LBR, full-width counters",
      color: "#555",
    },
    {
      text: "[    0.398000] Freeing SMP alternatives memory: 44K",
      color: "#666",
    },
    {
      text: "[    0.456123] smpboot: Estimated ratio of average max frequency by base frequency: 134%",
      color: "#555",
    },
    {
      text: "[    0.523400] NET: Registered PF_INET protocol family",
      color: "#888",
    },
    {
      text: "[    0.589000] PCI: Using configuration type 1 for base access",
      color: "#555",
    },
    { text: "[    0.634521] ACPI: Core revision 20230628", color: "#666" },
    {
      text: "[    0.712340] systemd[1]: Detected architecture x86-64.",
      color: "#999",
    },
    {
      text: "[    0.712500] systemd[1]: Hostname set to <vb-server>.",
      color: "#999",
    },
    {
      text: "[    0.823456] systemd[1]: Queued start job for default target graphical.target.",
      color: "#999",
    },
    {
      text: "[    0.901234] systemd[1]: Starting Journal Service...",
      color: "#999",
    },
    { text: "[  OK  ] Started Journal Service.", color: null, ok: true },
    {
      text: "[    1.023000] systemd[1]: Starting Load Kernel Module...",
      color: "#999",
    },
    { text: "[  OK  ] Started Load Kernel Module.", color: null, ok: true },
    {
      text: "[    1.245678] systemd[1]: Starting Network Configuration...",
      color: "#999",
    },
    { text: "[  OK  ] Started Network Configuration.", color: null, ok: true },
    {
      text: "[    1.456789] systemd[1]: Mounting /home/v/projects...",
      color: "#999",
    },
    { text: "[  OK  ] Mounted /home/v/projects.", color: null, ok: true },
    {
      text: "[    1.678901] systemd[1]: Starting Web Server (nginx)...",
      color: "#999",
    },
    { text: "[  OK  ] Started Web Server (nginx).", color: null, ok: true },
    {
      text: "[    1.890123] systemd[1]: Reached target Multi-User System.",
      color: "#ccc",
    },
    {
      text: "[    1.923456] systemd[1]: Starting VB Personal Site...",
      color: "#ccc",
    },
    { text: "[  OK  ] Started VB Personal Site.", color: null, ok: true },
    { text: "", color: null },
    { text: "vb-server login: v", color: "#fff" },
    {
      text: "Confirm user presence for key ED25519-SK SHA256:dIbUMR/2KikdjBSJ4LTFbs9...eZk",
      color: "#ccc",
    },
    {
      text: "Enter PIN for ED25519-SK key /Users/v/.ssh/yubikey5c: [KEY]",
      color: "#999",
      blink: true,
    },
    { text: "User identity confirmed", color: null, ok: false },
    { text: "Last login: " + new Date().toUTCString(), color: "#888" },
    { text: "", color: null },
    { text: "[v:~]$ startx", color: "#fff" },
  ];

  const container = document.querySelector(".hacking-animation");
  const textElem = container.querySelector(".hacking-animation__text");
  const progressBar = document.getElementById("boot-progress");
  const bootStatus = document.querySelector(".boot-status");

  let lineIndex = 0;
  const totalLines = bootLines.length;

  function addBootLine(lineData) {
    const div = document.createElement("div");
    div.className = "boot-line";

    if (lineData.ok) {
      const okSpan = document.createElement("span");
      okSpan.className = "boot-ok";
      okSpan.textContent = "[  OK  ]";
      div.appendChild(okSpan);

      const restText = document.createTextNode(
        " " + lineData.text.replace("[  OK  ] ", ""),
      );
      div.appendChild(restText);
      div.style.color = "#ccc";
    } else if (lineData.blink) {
      const parts = lineData.text.split("[KEY]");
      const textNode = document.createTextNode(parts[0]);
      div.appendChild(textNode);
      const keySpan = document.createElement("span");
      keySpan.textContent = "▓";
      keySpan.className = "blink-key";
      keySpan.id = "boot-key-blink";
      div.appendChild(keySpan);
      if (lineData.color) div.style.color = lineData.color;
    } else if (lineData.text === "") {
      div.innerHTML = "&nbsp;";
    } else {
      div.textContent = lineData.text;
      if (lineData.color) div.style.color = lineData.color;
    }

    textElem.appendChild(div);

    textElem.scrollTop = textElem.scrollHeight;
  }

  function getLineDelay(lineData) {
    if (lineData.blink) return 800 + Math.random() * 200;
    if (lineData.ok) return 80 + Math.random() * 120;
    if (lineData.text.includes("systemd")) return 30 + Math.random() * 50;
    if (lineData.text.includes("login:") || lineData.text.includes("Password:"))
      return 400 + Math.random() * 200;
    if (lineData.text.includes("startx")) return 50;
    if (lineData.text === "") return 50;
    return 15 + Math.random() * 35;
  }

  function showNextLine() {
    if (lineIndex >= totalLines) {
      if (bootStatus) {
        bootStatus.textContent = "Welc0me_";
        bootStatus.classList.add("access-granted");
      }
      if (progressBar) progressBar.style.width = "100%";

      sessionStorage.setItem("bootSeen", "1");
      container.classList.add("flicker-out");
      setTimeout(() => container.remove(), 200);
      return;
    }

    const lineData = bootLines[lineIndex];
    addBootLine(lineData);

    lineIndex++;

    if (
      lineIndex > 0 &&
      bootLines[lineIndex - 1] &&
      bootLines[lineIndex - 1].blink
    ) {
      const blinkEl = document.getElementById("boot-key-blink");
      if (blinkEl) {
        blinkEl.classList.remove("blink-key");
        blinkEl.style.opacity = "1";
      }
    }

    if (progressBar) {
      progressBar.style.width = (lineIndex / totalLines) * 100 + "%";
    }

    if (bootStatus) {
      if (lineIndex < 10) bootStatus.textContent = "KERNEL INIT";
      else if (lineIndex < 20) bootStatus.textContent = "LOADING SERVICES";
      else if (lineIndex < 30) bootStatus.textContent = "ALLOCATING MEMORY";
      else bootStatus.textContent = "AUTHENTICATING";
    }

    setTimeout(showNextLine, getLineDelay(lineData));
  }

  if (bootStatus) bootStatus.textContent = "KERNEL INIT";
  showNextLine();
  }
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
    if (cachedVisit) {
      $body.addClass("terminal-reveal");
      $body.removeClass("is-preload");
      scrambleReveal();
    } else {
      window.setTimeout(function () {
        $body.removeClass("is-preload");
      }, 100);
    }
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

  function scrambleReveal() {
    var h1 = document.querySelector("#header h1");
    var navItems = document.querySelectorAll("#header nav li");

    if (h1) h1.classList.remove("animate-fade-in-down");

    if (h1) h1.style.opacity = "1";

    if (h1) h1.classList.add("glitch-reveal");

    navItems.forEach(function (li, i) {
      li.style.opacity = "1";
      li.classList.add("glitch-reveal-nav");
      li.style.animationDelay = (0.12 + i * 0.06) + "s";
    });

    setTimeout(function () {
      $body.removeClass("terminal-reveal");
      if (h1) h1.classList.remove("glitch-reveal");
      navItems.forEach(function (li) { li.classList.remove("glitch-reveal-nav"); });
    }, 1000);
  }

  var $nav = $header.children("nav"),
    $nav_li = $nav.find("li");

  if ($nav_li.length % 2 == 0) {
    $nav.addClass("use-middle");
    $nav_li.eq($nav_li.length / 2).addClass("is-middle");
  }

  var locked = false;
  var bootComplete = false;

  function hideArticleContent($article) {
    const art = $article[0];
    art.querySelectorAll(".animate-text-reveal, .animate-fade-in-up, .is-revealed").forEach(el => {
      el.classList.remove("animate-text-reveal", "animate-fade-in-up", "is-revealed");
    });
    art.querySelectorAll(".line, h3").forEach(el => {
      el.style.color = '';
    });

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
    var $article = $main_articles.filter("#" + id);

    if ($article.length === 0) return;

    if (locked) return;
    locked = true;

    $main.show();
    $article.hide();

    const articleHackingAnimation = document.createElement("div");
    articleHackingAnimation.className = "hacking-animation article-transition";
    const textElem = document.createElement("pre");
    textElem.className = "hacking-animation__text";
    articleHackingAnimation.appendChild(textElem);
    document.body.appendChild(articleHackingAnimation);

    const lines = ["cd articles", "nvim " + id + ".md"];

    let currentLine = 0;
    let currentChar = 0;

    function addNewLine() {
      const line = document.createElement("div");
      const prompt = document.createElement("span");
      prompt.className = "hacking-animation__prompt";
      prompt.textContent = "[v:~]$ ";
      line.appendChild(prompt);
      textElem.appendChild(line);
      return line;
    }

    let currentLineElem = addNewLine();
    const cursor = document.createElement("span");
    cursor.className = "hacking-animation__cursor";
    currentLineElem.appendChild(cursor);

    function typeNextArticle() {
      if (currentLine >= lines.length) {
        $article.show();
        $body.addClass("is-article-visible");
        $main_articles.removeClass("active");
        $header.hide();
        $footer.hide();
        $article.addClass("active");

        setTimeout(() => {
          articleHackingAnimation.classList.add("hide");
          setTimeout(() => {
            articleHackingAnimation.remove();
            locked = false;
            if (id === "more") {
              const scrollEl = $article[0].querySelector(".scrollbar");
              if (scrollEl) {
                scrollEl.scrollTop = 0;
                wrapParagraphLines(scrollEl);
                const selector = ".line, h3";
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    revealInScrollable(scrollEl, selector);
                  });
                });
                [200, 500, 1000].forEach(delay => {
                  setTimeout(() => revealInScrollable(scrollEl, selector), delay);
                });
              }
            } else if (id === "gallery") {
              const scrollEl = $article[0].querySelector(".container");
              if (scrollEl) {
                scrollEl.scrollTop = 0;

                setTimeout(function() { animateGalleryEntrance(); }, 150);
              }
            }
          }, 100);
        }, 100);
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
        setTimeout(typeNextArticle, 30 + Math.random() * 30);
        return;
      }

      const char = lines[currentLine][currentChar];
      const span = document.createElement("span");
      span.textContent = char;
      cursor.remove();
      currentLineElem.appendChild(span);
      currentLineElem.appendChild(cursor);
      currentChar++;
      setTimeout(typeNextArticle, 8 + Math.random() * 10);
    }
    typeNextArticle();
  };

  $main._hide = function (addState) {
    if (document.querySelector(".article-transition")) return;
    if (locked) return;
    locked = true;

    var $article = $main_articles.filter(".active");
    if (!$body.hasClass("is-article-visible")) {
      locked = false;
      return;
    }

    hideArticleContent($article);

    const articleHackingAnimation = document.createElement("div");
    articleHackingAnimation.className = "hacking-animation article-transition";
    const textElem = document.createElement("pre");
    textElem.className = "hacking-animation__text";
    articleHackingAnimation.appendChild(textElem);
    document.body.appendChild(articleHackingAnimation);

    const lines = [":qa!", "cd .."];

    let currentLine = 0;
    let currentChar = 0;

    function addNewLine() {
      const line = document.createElement("div");
      const prompt = document.createElement("span");
      prompt.className = "hacking-animation__prompt";
      prompt.textContent = "[v:~]$ ";
      line.appendChild(prompt);
      textElem.appendChild(line);
      return line;
    }

    let currentLineElem = addNewLine();
    const cursor = document.createElement("span");
    cursor.className = "hacking-animation__cursor";
    currentLineElem.appendChild(cursor);

    function typeNextHide() {
      if (currentLine >= lines.length) {
        setTimeout(() => {
          articleHackingAnimation.classList.add("hide");
          setTimeout(() => {
            articleHackingAnimation.remove();

            if (addState) history.pushState(null, null, "#");
            locked = false;
          }, 100);
        }, 100);
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
        setTimeout(typeNextHide, 30 + Math.random() * 30);
        return;
      }

      const char = lines[currentLine][currentChar];
      const span = document.createElement("span");
      span.textContent = char;
      cursor.remove();
      currentLineElem.appendChild(span);
      currentLineElem.appendChild(cursor);
      currentChar++;
      setTimeout(typeNextHide, 8 + Math.random() * 10);
    }
    typeNextHide();
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
    if (carouselModal && carouselModal.style.display === "block") return;
    if ($body.hasClass("is-article-visible")) $main._hide(true);
  });

  $window.on("keyup", function (event) {
    if (event.keyCode === 27) {
      if (carouselModal && carouselModal.style.display === "block") return;
      if ($body.hasClass("is-article-visible")) $main._hide(true);
    }
  });

  $window.on("hashchange", function (event) {
    if (!bootComplete && document.querySelector(".hacking-animation")) return;
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

  if (location.hash !== "" && location.hash !== "#") {
    $window.on("load", function () {
      function waitForBoot() {
        if (document.querySelector(".hacking-animation")) {
          setTimeout(waitForBoot, 100);
        } else {
          bootComplete = true;
          $main._show(location.hash.substr(1), true);
        }
      }
      waitForBoot();
    });
  } else {
    $window.on("load", function () {
      function markBootComplete() {
        if (document.querySelector(".hacking-animation")) {
          setTimeout(markBootComplete, 100);
        } else {
          bootComplete = true;
        }
      }
      markBootComplete();
    });
  }

  var GALLERY_META = [
    { title: "Wizard of the Glowing Woods", meta: "Canon 7D mk II \u2022 38mm \u2022 f/3.2 \u2022 exp 1/160" },
    { title: "Teslabot", meta: "iPhone X" },
    { title: "Defiance in Red: A Silhouette of Solidarity", meta: "iPhone 15 Pro" },
    { title: "Bike Embassy", meta: "iPhone 15 Pro" },
    { title: "Reaching through time", meta: "Canon 7D mk II" },
    { title: "Cinematic Musing", meta: "Canon 7D mk II" },
    { title: "Makura-Nage", meta: "Canon 7D mk II" },
    { title: "Conversations with Time", meta: "iPhone X" },
    { title: "The Watched and the Unseen", meta: "Canon 7D mk II" },
    { title: "Digital Infatuation", meta: "Canon 7D mk II \u2022 f/2.8 \u2022 21mm \u2022 exp 1/10" },
    { title: "The P.R.O.T.O.T.Y.P.E", meta: "iPhone 15 Pro" },
    { title: "Blood In The Water", meta: "iPhone 15 Pro" },
    { title: "Synthetics in the Aftermath", meta: "Canon 1300D" },
    { title: "Cosmic Reflections", meta: "Photoshop" },
    { title: "Interstellar Transactions", meta: "Canon 1300D \u2022 55mm \u2022 exp 1/400 \u2022 f/5.6" },
    { title: "The Night Carousel", meta: "Canon 1300D \u2022 exp 1/400 \u2022 18mm \u2022 f/4" },
    { title: "The Plight of the Pigeon", meta: "Canon 7D mk II" },
    { title: "Monochrome Mourning", meta: "Canon 7D mk II" }
  ];

  var galleryData = [];
  var carouselModal = null;
  var currentCarouselIndex = 0;
  var carouselTween = null;
  var galleryEntranceDone = false;
  var carouselNavToken = 0;
  var carouselTypeInterval = null;

  function startCarouselTypewriter(src) {
    if (carouselTypeInterval) { clearInterval(carouselTypeInterval); carouselTypeInterval = null; }
    var loadingText = carouselModal.querySelector(".loading-text");
    if (!loadingText) return;
    var fullLoadText = "[v:~]$ curl -LO " + new URL(window.location.href).origin + "/" + src;
    loadingText.textContent = "[v:~]$ ";
    var loadCharIdx = 6;
    carouselTypeInterval = setInterval(function() {
      if (loadCharIdx < fullLoadText.length) {
        loadingText.textContent += fullLoadText[loadCharIdx] === " " ? "\u00A0" : fullLoadText[loadCharIdx];
        loadCharIdx++;
      } else {
        clearInterval(carouselTypeInterval);
        carouselTypeInterval = null;
      }
    }, 8 + Math.random() * 12);
  }

  function showCarouselLoader(src) {
    var loadingIndicator = carouselModal.querySelector(".loading-indicator");
    if (!loadingIndicator) return;
    loadingIndicator.style.display = "flex";
    gsap.to(loadingIndicator, { opacity: 1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    startCarouselTypewriter(src);
  }

  function hideCarouselLoader() {
    if (carouselTypeInterval) { clearInterval(carouselTypeInterval); carouselTypeInterval = null; }
    var loadingIndicator = carouselModal.querySelector(".loading-indicator");
    if (!loadingIndicator) return;
    gsap.to(loadingIndicator, {
      opacity: 0, duration: 0.25, ease: "power2.in", overwrite: "auto",
      onComplete: function() { loadingIndicator.style.display = "none"; }
    });
  }

  function buildGalleryData() {
    var items = document.querySelectorAll(".gallery-item img");
    galleryData = [];
    items.forEach(function(img, i) {
      var src = img.getAttribute("data-imgsrc");
      if (!src) return;
      var meta = GALLERY_META[i] || { title: "", meta: "" };
      galleryData.push({
        src: src,
        title: meta.title,
        meta: meta.meta
      });
    });
  }

  function buildCarouselProgress() {
    if (!carouselModal) return;
    var total = galleryData.length;
    var prog = carouselModal.querySelector(".carousel-counter-progress");
    if (!prog || prog.children.length === total) return;
    prog.innerHTML = "";
    for (var i = 0; i < total; i++) {
      (function(idx) {
        var li = document.createElement("li");
        li.className = "carousel-counter-segment";
        li.setAttribute("role", "button");
        li.setAttribute("aria-label", "Open image " + (idx + 1));
        li.onclick = function(e) { e.stopPropagation(); goToCarousel(idx); };
        prog.appendChild(li);
      })(i);
    }
  }

  function updateCarouselCounter() {
    if (!carouselModal) return;
    var total = galleryData.length;
    if (total < 1) return;
    var idxEl = carouselModal.querySelector(".carousel-counter-index");
    if (idxEl) idxEl.textContent = String(currentCarouselIndex + 1).padStart(2, "0");
    var totalEl = carouselModal.querySelector(".carousel-counter-total");
    if (totalEl) totalEl.textContent = String(total).padStart(2, "0");
    buildCarouselProgress();
    var prog = carouselModal.querySelector(".carousel-counter-progress");
    if (prog) {
      for (var s = 0; s < total; s++) {
        if (prog.children[s]) prog.children[s].classList.toggle("active", s === currentCarouselIndex);
      }
    }
  }

  function commitCarouselSlide(index, token) {
    if (token !== carouselNavToken) return false;
    if (!carouselModal || carouselModal.style.display !== "block") return false;
    var data = galleryData[index];
    if (!data) return false;
    currentCarouselIndex = index;
    carouselModal.querySelector(".flashcard-title").textContent = data.title;
    carouselModal.querySelector(".flashcard-meta").textContent = data.meta;
    carouselModal.querySelector(".carousel-item--current img").src = data.src;
    updateCarouselCounter();
    return true;
  }

  function setupCarousel() {
    var c = document.createElement("div");
    c.id = "carousel-modal";
    c.className = "modal";
    c.innerHTML =
      '<span class="close">[x]</span>' +
      '<div class="carousel-counter"><span class="carousel-counter-index">01</span><span class="carousel-counter-sep">&nbsp;/&nbsp;</span><span class="carousel-counter-total">18</span><ol class="carousel-counter-progress"></ol></div>' +
      '<div class="loading-indicator" style="display:none"><code class="loading-text"></code></div>' +
      '<div class="carousel-container">' +
        '<div class="carousel-item carousel-item--current">' +
          '<div class="carousel-photo">' +
            '<img src="" alt=""/>' +
            '<div class="glitch-slice"></div>' +
            '<div class="glitch-tint"></div>' +
          '</div>' +
          '<div class="carousel-caption">' +
            '<div class="flashcard-title"></div>' +
            '<div class="flashcard-divider"></div>' +
            '<div class="flashcard-meta"></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="carousel-arrow carousel-arrow--left">&lsaquo;</div>' +
      '<div class="carousel-arrow carousel-arrow--right">&rsaquo;</div>';
    document.body.appendChild(c);

    c.querySelector(".close").onclick = function(e) { e.stopPropagation(); closeCarousel(); };
    c.querySelector(".carousel-arrow--left").onclick = function(e) { e.stopPropagation(); navigateCarousel(-1); };
    c.querySelector(".carousel-arrow--right").onclick = function(e) { e.stopPropagation(); navigateCarousel(1); };

    c.onclick = function(e) { if (e.target === c) closeCarousel(); };

    return c;
  }

  function openCarousel(index) {
    if (!carouselModal) carouselModal = setupCarousel();
    currentCarouselIndex = index;
    var token = ++carouselNavToken;

    var data = galleryData[index];
    if (!data) return;
    var currentImg = carouselModal.querySelector(".carousel-item--current img");
    var loadingIndicator = carouselModal.querySelector(".loading-indicator");
    var container = carouselModal.querySelector(".carousel-container");
    var arrows = carouselModal.querySelectorAll(".carousel-arrow");

    if (carouselTween) carouselTween.kill();

    carouselModal.style.display = "block";
    document.body.style.overflow = "hidden";

    gsap.set(carouselModal, { opacity: 0 });
    gsap.set(container, { opacity: 0, scale: 0.92, y: 0 });
    gsap.set(arrows, { opacity: 0 });

    var entranceTL = gsap.timeline();
    entranceTL.to(carouselModal, { opacity: 1, duration: 0.45, ease: "power2.out" }, 0);
    entranceTL.to(container, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 0.08);
    entranceTL.to(arrows, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.2);

    container.style.visibility = "hidden";
    arrows.forEach(function(a) { a.style.visibility = "hidden"; });
    currentImg.style.opacity = "0";

    loadingIndicator.style.display = "flex";
    loadingIndicator.style.opacity = "0";
    gsap.to(loadingIndicator, { opacity: 1, duration: 0.35, ease: "power2.out", delay: 0.35 });

    startCarouselTypewriter(data.src);

    var newImg = new Image();
    newImg.onload = function() {
      if (token !== carouselNavToken) return;
      if (!carouselModal || carouselModal.style.display !== "block") return;
      if (carouselTypeInterval) { clearInterval(carouselTypeInterval); carouselTypeInterval = null; }
      commitCarouselSlide(index, token);

      currentImg.style.display = "block";

      var revealTL = gsap.timeline();
      revealTL.to(loadingIndicator, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: function() { loadingIndicator.style.display = "none"; }
      });
      revealTL.fromTo(currentImg,
        { opacity: 0, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
        "-=0.15"
      );

      container.style.visibility = "";
      arrows.forEach(function(a) { a.style.visibility = ""; });
    };
    newImg.onerror = function() {
      if (token !== carouselNavToken) return;
      if (!carouselModal || carouselModal.style.display !== "block") return;
      commitCarouselSlide(index, token);
      hideCarouselLoader();
      container.style.visibility = "";
      arrows.forEach(function(a) { a.style.visibility = ""; });
    };
    newImg.src = data.src;
  }

  function navigateCarousel(dir) {
    if (!carouselModal) return;
    var total = galleryData.length;
    if (total < 1) return;
    goToCarousel((currentCarouselIndex + dir + total) % total);
  }

  function goToCarousel(index) {
    if (!carouselModal) return;
    var total = galleryData.length;
    if (total < 1 || !galleryData[index]) return;

    if (carouselTween) carouselTween.kill();
    currentCarouselIndex = index;
    var token = ++carouselNavToken;
    var data = galleryData[index];

    var photo = carouselModal.querySelector(".carousel-photo");
    var currentImg = carouselModal.querySelector(".carousel-item--current img");
    var titleEl = carouselModal.querySelector(".flashcard-title");
    var metaEl = carouselModal.querySelector(".flashcard-meta");
    var captionEl = carouselModal.querySelector(".carousel-caption");
    var counterEl = carouselModal.querySelector(".carousel-counter");
    var sliceEl = carouselModal.querySelector(".glitch-slice");
    var tintEl = carouselModal.querySelector(".glitch-tint");

    gsap.set(photo, { x: 0, opacity: 1 });
    gsap.set([sliceEl, tintEl], { opacity: 0 });
    gsap.set(sliceEl, { yPercent: -101 });
    gsap.set([captionEl, counterEl], { opacity: 1 });

    showCarouselLoader(data.src);

    function playSwitch() {
      carouselTween = gsap.timeline({
        onComplete: function() {
          gsap.set(photo, { x: 0, opacity: 1 });
          gsap.set([sliceEl, tintEl], { opacity: 0 });
          gsap.set(sliceEl, { yPercent: -101 });
          gsap.set([captionEl, counterEl], { opacity: 1 });
        }
      });

      carouselTween.to(photo, { x: -8, opacity: 0.25, duration: 0.1, ease: "power2.in" }, 0);
      carouselTween.to([captionEl, counterEl], { opacity: 0, duration: 0.08, ease: "power2.in" }, 0);

      carouselTween.set(sliceEl, { opacity: 1 }, 0.08);
      carouselTween.to(sliceEl, { yPercent: 101, duration: 0.12, ease: "power1.in" }, 0.08);
      carouselTween.to(tintEl, { opacity: 1, duration: 0.05, ease: "power2.in" }, 0.08);
      carouselTween.to(tintEl, { opacity: 0, duration: 0.07, ease: "power2.out" }, 0.13);

      carouselTween.call(function() {
        if (token !== carouselNavToken) return;
        commitCarouselSlide(index, token);
      }, null, 0.1);

      carouselTween.to(photo, { x: 0, opacity: 1, duration: 0.12, ease: "power2.out" }, 0.1);
      carouselTween.to(sliceEl, { opacity: 0, duration: 0.05 }, 0.2);
      carouselTween.to([captionEl, counterEl], { opacity: 1, duration: 0.1, ease: "power2.out" }, 0.12);
    }

    var preloader = new Image();
    preloader.onload = function() {
      if (token !== carouselNavToken) return;
      if (!carouselModal || carouselModal.style.display !== "block") return;
      carouselModal.querySelector(".carousel-container").style.visibility = "";
      carouselModal.querySelectorAll(".carousel-arrow").forEach(function(a) { a.style.visibility = ""; });
      hideCarouselLoader();
      playSwitch();
    };
    preloader.onerror = function() {
      if (token !== carouselNavToken) return;
      if (!carouselModal || carouselModal.style.display !== "block") return;
      hideCarouselLoader();
      commitCarouselSlide(index, token);
    };
    preloader.src = data.src;
  }

  function closeCarousel() {
    if (!carouselModal) return;
    if (carouselTween) carouselTween.kill();
    carouselNavToken++;
    if (carouselTypeInterval) { clearInterval(carouselTypeInterval); carouselTypeInterval = null; }
    var loader = carouselModal.querySelector(".loading-indicator");
    if (loader) {
      gsap.killTweensOf(loader);
      loader.style.display = "none";
    }
    document.body.style.overflow = "";

    var container = carouselModal.querySelector(".carousel-container");
    var arrows = carouselModal.querySelectorAll(".carousel-arrow");

    var exitTL = gsap.timeline({
      onComplete: function() { carouselModal.style.display = "none"; }
    });

    exitTL.to(container, { opacity: 0, scale: 0.86, y: 24, duration: 0.35, ease: "power2.in" }, 0);
    exitTL.to(arrows, { opacity: 0, duration: 0.2, ease: "power2.in" }, 0);

    exitTL.to(carouselModal, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.1);
  }

  document.addEventListener("keydown", function(e) {
    if (!carouselModal || carouselModal.style.display !== "block") return;
    if (e.key === "ArrowLeft") { navigateCarousel(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { navigateCarousel(1); e.preventDefault(); }
    else if (e.key === "Escape") { closeCarousel(); e.preventDefault(); }
  });

  var _tilt = {
    canvas: null, container: null, items: [], N: 0,
    coarse: false,
    targetRX: 0, targetRY: 0, curRX: 0, curRY: 0,
    raf: 0, running: false,
    hintEl: null, hasInteracted: false,
    listeners: [], resizeObs: null
  };

  function _tiltIsCoarse() {

    if (typeof window.matchMedia === "function") {
      if (window.matchMedia("(pointer: coarse)").matches) return true;
      if (window.matchMedia("(max-width: 767px)").matches) return true;
    }
    if ("ontouchstart" in window && typeof window.matchMedia === "function" &&
        window.matchMedia("(hover: none)").matches) return true;
    return false;
  }

  function _tiltOn(el, type, fn, opts) {

    el.addEventListener(type, fn, opts);
    _tilt.listeners.push({ el: el, type: type, fn: fn, opts: opts });
  }

  function _tiltRender() {
    if (!_tilt.running || !_tilt.canvas) return;

    _tilt.curRX += (_tilt.targetRX - _tilt.curRX) * 0.07;
    _tilt.curRY += (_tilt.targetRY - _tilt.curRY) * 0.07;

    if (Math.abs(_tilt.targetRX - _tilt.curRX) < 0.01 &&
        Math.abs(_tilt.targetRY - _tilt.curRY) < 0.01) {
      _tilt.curRX = _tilt.targetRX;
      _tilt.curRY = _tilt.targetRY;
      _tilt.running = false;
      _tilt.raf = 0;
      return;
    }

    _tilt.canvas.style.transform =
      "translate3d(0,0,0) rotateX(" + _tilt.curRX.toFixed(3) + "deg) rotateY(" + _tilt.curRY.toFixed(3) + "deg)";
    _tilt.raf = requestAnimationFrame(_tiltRender);
  }

  function _tiltKick() {

    if (!_tilt.running && !_tilt.coarse && _tilt.canvas) {
      _tilt.running = true;
      _tilt.raf = requestAnimationFrame(_tiltRender);
    }
  }

  function destroyTiltGrid() {

    _tilt.running = false;
    if (_tilt.raf) { cancelAnimationFrame(_tilt.raf); _tilt.raf = 0; }
    _tilt.listeners.forEach(function(sub) {
      sub.el.removeEventListener(sub.type, sub.fn, sub.opts);
    });
    _tilt.listeners = [];
    if (_tilt.resizeObs) { _tilt.resizeObs.disconnect(); _tilt.resizeObs = null; }
    if (_tilt.canvas) {
      _tilt.canvas.style.transform = "";
      _tilt.canvas.classList.remove("has-hover");
    }
    _tilt.items.forEach(function(item) { item.classList.remove("is-lifted"); });
    _tilt.canvas = null; _tilt.container = null; _tilt.items = [];
  }

  function _tiltOnResize() {

    if (!_tilt.canvas) return;
    var coarse = _tiltIsCoarse();
    if (coarse === _tilt.coarse) return;
    _tilt.coarse = coarse;
    _tilt.container.classList.toggle("is-static", coarse);
    if (coarse) {
      _tilt.running = false;
      if (_tilt.raf) { cancelAnimationFrame(_tilt.raf); _tilt.raf = 0; }
      _tilt.canvas.style.transform = "";
    }
  }

  function initRotondeCarousel() {

    initTiltGrid();
  }

  function initTiltGrid() {
    var canvas = document.querySelector(".rotonde-canvas");
    if (!canvas) return;
    var container = canvas.closest(".rotonde-container") || canvas.parentElement;

    var items = Array.from(canvas.querySelectorAll(".gallery-item"));
    var N = items.length;
    if (N < 1) return;

    destroyTiltGrid();

    _tilt.canvas = canvas;
    _tilt.container = container;
    _tilt.items = items;
    _tilt.N = N;
    _tilt.coarse = _tiltIsCoarse();
    _tilt.hintEl = document.getElementById("rotonde-hint");
    _tilt.hasInteracted = false;

    container.classList.toggle("is-static", _tilt.coarse);

    items.forEach(function(item, i) {
      item.style.animationDelay = (-(i * 0.55)).toFixed(2) + "s";
    });

    if (typeof gsap !== "undefined") {

      canvas.classList.add("is-entering");
      gsap.from(items, { opacity: 0, y: 26, duration: 0.6, ease: "power2.out", stagger: 0.035, overwrite: "auto", clearProps: "opacity,transform",
        onComplete: function() { canvas.classList.remove("is-entering"); } });
    }
    galleryEntranceDone = true;

    if (!_tilt.coarse) {

      _tiltOn(container, "mousemove", function(e) {
        var rect = container.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        _tilt.targetRY = px * 10;
        _tilt.targetRX = -py * 8;
        if (_tilt.hintEl && !_tilt.hasInteracted) {
          _tilt.hintEl.setAttribute("data-hidden", "true");
          _tilt.hasInteracted = true;
        }
        _tiltKick();
      });

      _tiltOn(container, "mouseleave", function() {
        _tilt.targetRX = 0;
        _tilt.targetRY = 0;
        _tiltKick();
      });
    } else if (_tilt.hintEl) {

      _tilt.hintEl.setAttribute("data-hidden", "true");
    }

    _tiltOn(window, "resize", _tiltOnResize);
    if (window.ResizeObserver) {
      _tilt.resizeObs = new ResizeObserver(_tiltOnResize);
      _tilt.resizeObs.observe(container);
    }

    initGalleryInteractions();
  }

  function animateGalleryEntrance(force) {
    if (typeof gsap === "undefined") return;
    if (!_tilt.items || !_tilt.items.length) return;
    if (galleryEntranceDone && !force) return;
    galleryEntranceDone = true;

    var grid = _tilt.canvas;
    if (grid) grid.classList.add("is-entering");
    gsap.from(_tilt.items, { opacity: 0, y: 26, duration: 0.6, ease: "power2.out", stagger: 0.035, overwrite: "auto", clearProps: "opacity,transform",
      onComplete: function() { if (grid) grid.classList.remove("is-entering"); } });
  }

  function initGalleryInteractions() {
    if (typeof gsap === "undefined") return;

    var items = document.querySelectorAll(".gallery-item");
    if (!items.length) return;

    items.forEach(function(item) {
      var imgEl = item.querySelector("img");
      var dataSrc = imgEl ? imgEl.getAttribute("data-imgsrc") : null;

      var matchedIndex = -1;
      for (var gi = 0; gi < GALLERY_META.length; gi++) {
        if (galleryData[gi] && galleryData[gi].src === dataSrc) { matchedIndex = gi; break; }
      }
      if (matchedIndex < 0) matchedIndex = 0;

      item.addEventListener("click", function() {
        if (matchedIndex < galleryData.length) openCarousel(matchedIndex);
      });

      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", "Open " + (GALLERY_META[matchedIndex] ? GALLERY_META[matchedIndex].title : "image " + (matchedIndex + 1)));
      item.addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (matchedIndex < galleryData.length) openCarousel(matchedIndex);
        }
      });

      var status = item.querySelector(".gallery-status");
      var originalText = status ? status.textContent.trim() : "";
      var hoverTl = null;

      item.addEventListener("mouseenter", function() {
        if (hoverTl) hoverTl.kill();
        hoverTl = gsap.timeline();

        item.classList.add("is-lifted");
        var grid = item.closest(".rotonde-canvas");
        if (grid) grid.classList.add("has-hover");

        if (imgEl) {
          hoverTl.to(imgEl, {
            filter: "grayscale(0%) contrast(1.1) brightness(1)",
            scale: 1.03,
            duration: 0.45,
            ease: "power2.out"
          }, 0);
        }

        hoverTl.to(item, {
          borderColor: "rgba(216,30,28,0.6)",
          boxShadow: "inset 0 0 25px rgba(126,30,68,0.15), 0 30px 64px rgba(0,0,0,0.6), 0 0 44px rgba(216,48,48,0.14)",
          duration: 0.4,
          ease: "power2.out"
        }, 0);

        if (status && originalText) {
          hoverTl.set(status, { opacity: 1, textContent: "" }, 0.08);
          for (var ti = 0; ti < originalText.length; ti++) {
            (function(idx) {
              hoverTl.call(function() {
                status.textContent = originalText.substring(0, idx + 1) + "_";
              }, null, 0.12 + idx * 0.025);
            })(ti);
          }
          hoverTl.call(function() { status.textContent = originalText; }, null, 0.12 + originalText.length * 0.025 + 0.1);
        }
      });

      item.addEventListener("mouseleave", function() {
        if (hoverTl) hoverTl.kill();
        hoverTl = gsap.timeline();

        item.classList.remove("is-lifted");
        var grid = item.closest(".rotonde-canvas");
        if (grid) grid.classList.remove("has-hover");

        if (imgEl) {
          hoverTl.to(imgEl, {
            filter: "grayscale(80%) contrast(1.2) brightness(0.7)",
            scale: 1,
            duration: 0.5, ease: "power2.out"
          }, 0);
        }

        hoverTl.to(item, {
          borderColor: "rgba(216,10,38,0.15)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
          duration: 0.4, ease: "power2.out"
        }, 0);

        if (status) {
          status.textContent = originalText;
          hoverTl.to(status, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
        }
      });
    });
  }

  window._galleryEntrance = animateGalleryEntrance;
  window.destroyTiltGrid = destroyTiltGrid;

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = "0x";
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
  "IAM & Endpoint Engineer",
  "7365637265746C7920536563757269747920456E67696E656572",
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

  function updateProgressBar(article) {
    const progressBar = article.querySelector(".progress-bar");
    if (!progressBar) return;

    const scrollElement = article.querySelector(".scrollbar, .container");
    if (!scrollElement) return;
    const scrollPosition = scrollElement.scrollTop;
    const scrollHeight = scrollElement.scrollHeight;
    const clientHeight = scrollElement.clientHeight;

    if (scrollHeight <= clientHeight) {
      progressBar.style.width = "0%";
      return;
    }

    const scrolled = (scrollPosition / (scrollHeight - clientHeight)) * 100;
    progressBar.style.width = scrolled + "%";
  }

  function revealInScrollable(scrollEl, itemSelector) {
    if (!scrollEl) return;
    const containerRect = scrollEl.getBoundingClientRect();
    const revealBottom = containerRect.bottom + 100;

    const isMore = scrollEl.closest('#more') !== null;

    scrollEl.querySelectorAll(itemSelector).forEach(el => {
      const rect = el.getBoundingClientRect();
      const elBottom = rect.bottom;
      const elTop = rect.top;

      if (elBottom > containerRect.top && elTop < revealBottom) {
        if (isMore) {
          el.style.color = '#fff';
        } else {
          el.classList.add("animate-fade-in-up");
        }
      } else {
        if (isMore) {
          el.style.color = '';
        } else {
          el.classList.remove("animate-fade-in-up");
        }
      }
    });
  }
  function wrapParagraphLines(container) {
    container.querySelectorAll("p").forEach(p => {
      if (p.querySelector(".line")) return;

      const groups = [];
      let current = [];

      for (let i = 0; i < p.childNodes.length; i++) {
        const node = p.childNodes[i];
        if (node.nodeType === 1 && node.tagName === "BR") {
          if (current.length) { groups.push(current); current = []; }
        } else {
          if (node.nodeType === 3 && !node.textContent.trim()) continue;
          current.push(node);
        }
      }
      if (current.length) groups.push(current);
        if (groups.length === 0) return;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < groups.length; i++) {
        const span = document.createElement("span");
        span.className = "line text-[#333] transition-colors duration-1000 ease-out";
        for (const n of groups[i]) span.appendChild(n);
        fragment.appendChild(span);
      }
      p.textContent = '';
      p.appendChild(fragment);
    });
  }

  window.addEventListener("load", function () {
    buildGalleryData();
    initRotondeCarousel();

    document
      .querySelectorAll("#more .scrollbar")
      .forEach((element) => {
        const article = element.closest("article");
        const isMore = article && article.id === "more";

        element.addEventListener("scroll", () => {
          updateProgressBar(article);
          if (isMore) {
            const sel = element.querySelector(".line") ? ".line, h3" : "p, h3";
            revealInScrollable(element, sel);
          }
        });
      });

    var galleryArticle = document.getElementById("gallery");
    if (galleryArticle && galleryArticle.classList.contains("active")) {
      setTimeout(function() { animateGalleryEntrance(); }, 150);
    }
  });
})(jQuery);
