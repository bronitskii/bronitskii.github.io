document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("fast") === "true" || sessionStorage.getItem("bootSeen")) {
    const hackingAnimation = document.querySelector(".hacking-animation");
    if (hackingAnimation) hackingAnimation.remove();
    document.getElementById("main").style.display = "";
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
                const selector = ".gallery-status";
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    revealInScrollable(scrollEl, selector);
                  });
                });
                [200, 500, 1000].forEach(delay => {
                  setTimeout(() => revealInScrollable(scrollEl, selector), delay);
                });
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

  function getOpenModal() {
    const modals = document.querySelectorAll('[id^="myModal"]');
    for (let i = 0; i < modals.length; i++) {
      if (modals[i].style.display === "block") return modals[i];
    }
    return null;
  }

  $body.on("click", function (event) {
    const openModal = getOpenModal();
    if (openModal) return;
    if (carouselModal && carouselModal.style.display === "block") return;
    if ($body.hasClass("is-article-visible")) $main._hide(true);
  });

  $window.on("keyup", function (event) {
    if (event.keyCode === 27) {
      if (carouselModal && carouselModal.style.display === "block") return;
      const openModal = getOpenModal();
      if (openModal) {
        closeModal(openModal.id);
        return;
      }
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

  var galleryData = [];
  var carouselModal = null;
  var currentCarouselIndex = 0;
  function buildGalleryData() {
    var items = document.querySelectorAll(".gallery-item img");
    galleryData = [];
    items.forEach(function(img, i) {
      var modal = document.getElementById("myModal" + (i + 1));
      if (!modal) return;
      var caption = modal.querySelector(".caption");
      if (!caption) return;
      galleryData.push({
        src: img.getAttribute("data-imgsrc"),
        title: caption.querySelector("h3").textContent,
        meta: caption.querySelector("p").textContent,
      });
    });
  }

  function setupCarousel() {
    var c = document.createElement("div");
    c.id = "carousel-modal";
    c.className = "modal";
    c.innerHTML =
      '<span class="close">&times;</span>' +
      '<div class="loading-indicator" style="display:none"><code class="loading-text"></code></div>' +
      '<div class="carousel-container">' +
        '<div class="carousel-item carousel-item--prev"><img src="" alt=""/></div>' +
        '<div class="carousel-item carousel-item--current">' +
          '<div class="flashcard">' +
            '<div class="flashcard-inner">' +
              '<div class="flashcard-front">' +
                '<img src="" alt=""/>' +
                '<div class="flip-hint">[ click the picture ]</div>' +
              '</div>' +
              '<div class="flashcard-back">' +
                '<div class="flashcard-title"></div>' +
                '<div class="flashcard-divider"></div>' +
                '<div class="flashcard-meta"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="carousel-item carousel-item--next"><img src="" alt=""/></div>' +
      '</div>' +
      '<div class="carousel-arrow carousel-arrow--left">&lsaquo;</div>' +
      '<div class="carousel-arrow carousel-arrow--right">&rsaquo;</div>';
    document.body.appendChild(c);

    c.querySelector(".close").onclick = function(e) { e.stopPropagation(); closeCarousel(); };
    c.querySelector(".carousel-arrow--left").onclick = function(e) { e.stopPropagation(); navigateCarousel(-1); };
    c.querySelector(".carousel-arrow--right").onclick = function(e) { e.stopPropagation(); navigateCarousel(1); };
    c.querySelector(".flashcard").onclick = function(e) { e.stopPropagation(); flipCarouselFlashcard(); };
    c.querySelector(".carousel-item--prev").onclick = function(e) { e.stopPropagation(); navigateCarousel(-1); };
    c.querySelector(".carousel-item--next").onclick = function(e) { e.stopPropagation(); navigateCarousel(1); };

    return c;
  }

  function openCarousel(index) {
    if (!carouselModal) carouselModal = setupCarousel();
    currentCarouselIndex = index;

    var data = galleryData[index];
    var currentImg = carouselModal.querySelector(".carousel-item--current img");
    var loadingIndicator = carouselModal.querySelector(".loading-indicator");

    carouselModal.querySelector(".flashcard").classList.remove("flipped");
    carouselModal.style.display = "block";
    carouselModal.style.transform = "scale(1)";
    document.body.style.overflow = "hidden";
    setTimeout(function() { carouselModal.style.opacity = 1; }, 10);

    var container = carouselModal.querySelector(".carousel-container");
    var arrows = carouselModal.querySelectorAll(".carousel-arrow");
    container.style.visibility = "hidden";
    arrows.forEach(function(a) { a.style.visibility = "hidden"; });
    currentImg.style.opacity = "0";

    loadingIndicator.style.display = "flex";
    loadingIndicator.querySelector(".loading-text").textContent =
      "[v:~]$ curl -LO " + new URL(window.location.href).origin + "/" + data.src;

    var newImg = new Image();
    newImg.onload = function() {
      carouselModal.querySelector(".flashcard-title").textContent = data.title;
      carouselModal.querySelector(".flashcard-meta").textContent = data.meta;

      currentImg.src = data.src;
      currentImg.style.display = "block";
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          loadingIndicator.style.display = "none";
          container.style.visibility = "";
          arrows.forEach(function(a) { a.style.visibility = ""; });
          currentImg.style.opacity = "1";
        });
      });
    };
    newImg.src = data.src;

    updateAdjacentImages();
  }

  function updateAdjacentImages() {
    if (!carouselModal) return;
    var total = galleryData.length;
    var prevImg = carouselModal.querySelector(".carousel-item--prev img");
    var nextImg = carouselModal.querySelector(".carousel-item--next img");
    var prevIdx = (currentCarouselIndex - 1 + total) % total;
    var nextIdx = (currentCarouselIndex + 1) % total;
    prevImg.style.opacity = "0";
    nextImg.style.opacity = "0";
    setTimeout(function() {
      prevImg.src = galleryData[prevIdx].src;
      nextImg.src = galleryData[nextIdx].src;
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          prevImg.style.opacity = "";
          nextImg.style.opacity = "";
        });
      });
    }, 180);
  }

  function navigateCarousel(dir) {
    if (!carouselModal) return;
    var total = galleryData.length;
    currentCarouselIndex = (currentCarouselIndex + dir + total) % total;

    var currentItem = carouselModal.querySelector(".carousel-item--current");
    var currentImg = currentItem.querySelector(".flashcard-front img");
    var data = galleryData[currentCarouselIndex];
    carouselModal.querySelector(".flashcard").classList.remove("flipped");

    var shiftOut = dir > 0 ? "-12%" : "12%";
    currentImg.style.transform = "translateX(" + shiftOut + ")";
    currentImg.style.opacity = "0";

    setTimeout(function() {
      carouselModal.querySelector(".flashcard-title").textContent = data.title;
      carouselModal.querySelector(".flashcard-meta").textContent = data.meta;

      currentImg.style.transition = "none";
      currentImg.style.transform = "translateX(" + (dir > 0 ? "12%" : "-12%") + ")";
      currentImg.src = data.src;
      currentImg.offsetHeight;

      currentImg.style.transition = "";
      currentImg.style.transform = "translateX(0)";
      currentImg.style.opacity = "1";
    }, 200);

    updateAdjacentImages();
  }

  function flipCarouselFlashcard() {
    if (!carouselModal) return;
    carouselModal.querySelector(".flashcard").classList.toggle("flipped");
  }

  function closeCarousel() {
    if (!carouselModal) return;
    document.body.style.overflow = "";
    carouselModal.style.opacity = 0;
    carouselModal.style.transform = "scale(0.95)";
    setTimeout(function() {
      carouselModal.style.display = "none";
    }, 300);
  }
  document.addEventListener("keydown", function(e) {
    if (!carouselModal || carouselModal.style.display !== "block") return;
    if (e.key === "ArrowLeft") { navigateCarousel(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { navigateCarousel(1); e.preventDefault(); }
    else if (e.key === "Escape") { closeCarousel(); e.preventDefault(); }
  });
  function openModal(modalId, imgSrc) {
    var idx = parseInt(modalId.replace("myModal", ""), 10) - 1;
    if (idx >= 0 && idx < galleryData.length) openCarousel(idx);
  }
  function closeModal(modalId) { closeCarousel(); }

  window.openModal = openModal;
  window.closeModal = closeModal;

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
    "IT Service Engineer & InfoSec Enthusiast.",
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

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    var img = item.querySelector("img");
    if (img) {
      var src =
        img.getAttribute("data-imgsrc") || img.getAttribute("src") || "";
      var filename = src.split("/").pop();
      item.setAttribute("data-label", "$ cat " + filename);
    }
  });

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
    var galleryImages = document.querySelectorAll(".gallery-item img");
    var imageModals = document.querySelectorAll('[id^="myModal"]');
    var closeButtons = document.querySelectorAll('[id^="myModal"] .close');

    galleryImages.forEach(function (img, index) {
      img.onclick = function () {
        var modal = document.getElementById("myModal" + (index + 1));
        if (modal) {
          const loadingText = modal.querySelector(".loading-text");
          const imgSrc = img.getAttribute("data-imgsrc");

          loadingText.textContent = "[v:~]$ ";

          async function typeWriterEffect(text) {
            for (let i = 0; i < text.length; i++) {
              if (text[i] === " ") {
                loadingText.textContent += "\u00A0";
              } else {
                loadingText.innerText += text[i];
              }
              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 50),
              );
            }
          }

          typeWriterEffect(
            "curl -LO " + new URL(window.location.href).origin + "/" + imgSrc,
          );
          openCarousel(index);
        }
      };
    });

    closeButtons.forEach(function (btn) {
      btn.onclick = function (event) {
        event.stopPropagation();
        var modal = this.closest('[id^="myModal"]');
        if (modal) {
          closeModal(modal.id);
        }
      };
    });
    document
      .querySelectorAll("#more .scrollbar, #gallery .container")
      .forEach((element) => {
        const article = element.closest("article");
        const isMore = article && article.id === "more";

        element.addEventListener("scroll", () => {
          updateProgressBar(article);
          const sel = isMore
            ? (element.querySelector(".line") ? ".line, h3" : "p, h3")
            : ".gallery-status";
          revealInScrollable(element, sel);
        });
      });

  });
})(jQuery);
