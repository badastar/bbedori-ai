(function () {
  "use strict";

  /**
   * 모바일 메뉴 열기/닫기 제어
   */
  function initMobileNav() {
    var toggleBtn = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("site-nav");
    if (!toggleBtn || !nav) return;

    function setOpen(isOpen) {
      nav.classList.toggle("is-open", isOpen);
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      toggleBtn.textContent = isOpen ? "메뉴 닫기" : "메뉴";
    }

    toggleBtn.addEventListener("click", function () {
      var expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      setOpen(!expanded);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggleBtn.focus();
      }
    });
  }

  /**
   * 수동 복사 안내 영역 표시/숨김
   */
  function showManualFallback(container, text) {
    if (!container) return;
    container.hidden = false;
    var textarea = container.querySelector("textarea");
    if (textarea) {
      textarea.value = text;
      textarea.focus();
      textarea.select();
    }
  }

  function hideManualFallback(container) {
    if (!container) return;
    container.hidden = true;
  }

  /**
   * 공통 텍스트 복사 함수 (Clipboard API + execCommand 폴백 + 수동 복사 안내)
   * @param {string} text
   * @param {HTMLElement|null} statusEl
   * @param {HTMLElement|null} fallbackEl
   */
  function copyText(text, statusEl, fallbackEl) {
    function setStatus(message, isError) {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.classList.remove("copy-status--success", "copy-status--error");
      statusEl.classList.add(isError ? "copy-status--error" : "copy-status--success");
    }

    function legacyCopy() {
      var temp = document.createElement("textarea");
      temp.value = text;
      temp.setAttribute("readonly", "");
      temp.style.position = "fixed";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      document.body.removeChild(temp);
      return ok;
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function" && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () {
          hideManualFallback(fallbackEl);
          setStatus("복사되었습니다. ChatGPT 또는 NotebookLM에 붙여넣기 하세요.", false);
        },
        function () {
          if (legacyCopy()) {
            hideManualFallback(fallbackEl);
            setStatus("복사되었습니다. 붙여넣기(Ctrl+V)로 바로 사용할 수 있습니다.", false);
          } else {
            setStatus("자동 복사에 실패했습니다. 아래 상자에서 직접 복사해 주세요.", true);
            showManualFallback(fallbackEl, text);
          }
        }
      );
      return;
    }

    if (legacyCopy()) {
      hideManualFallback(fallbackEl);
      setStatus("복사되었습니다. 붙여넣기(Ctrl+V)로 바로 사용할 수 있습니다.", false);
    } else {
      setStatus("자동 복사가 지원되지 않는 환경입니다. 아래 상자에서 직접 복사해 주세요.", true);
      showManualFallback(fallbackEl, text);
    }
  }

  /**
   * 페이지 내 모든 복사 버튼 바인딩
   */
  function initCopyButtons() {
    var buttons = document.querySelectorAll("[data-copy-target]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var targetId = btn.getAttribute("data-copy-target");
        var statusId = btn.getAttribute("data-copy-status");
        var fallbackId = btn.getAttribute("data-copy-fallback");

        var targetEl = targetId ? document.getElementById(targetId) : null;
        if (!targetEl) return;

        var statusEl = statusId ? document.getElementById(statusId) : null;
        var fallbackEl = fallbackId ? document.getElementById(fallbackId) : null;

        copyText(targetEl.textContent, statusEl, fallbackEl);
      });
    });
  }

  /**
   * 실습 패널: 업종 및 업체명 실시간 치환 (브라우저 메모리 내 치환만 수행)
   */
  function initPracticePrompt() {
    var input = document.getElementById("business-input");
    var promptEl = document.getElementById("practice-prompt-text");
    var resetBtn = document.getElementById("business-reset");
    if (!input || !promptEl) return;

    var baseTemplate = promptEl.textContent;
    var placeholderToken = "[업종 및 업체명]";

    function updatePrompt() {
      var value = input.value.trim();
      var replacement = value.length > 0 ? value : placeholderToken;
      promptEl.textContent = baseTemplate.split(placeholderToken).join(replacement);
    }

    input.addEventListener("input", updatePrompt);

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        input.value = "";
        updatePrompt();
        input.focus();
      });
    }
  }

  /**
   * 발표 슬라이드 뷰어 제어 (slides.html 전용)
   */
  function initSlideDeck() {
    var deck = document.querySelector("[data-slide-deck]");
    if (!deck) return;

    var panels = Array.prototype.slice.call(deck.querySelectorAll("[data-slide-panel]"));
    var pills = Array.prototype.slice.call(deck.querySelectorAll("[data-slide-pill]"));
    var prevBtn = deck.querySelector("[data-slide-prev]");
    var nextBtn = deck.querySelector("[data-slide-next]");
    var counterEl = deck.querySelector("[data-slide-counter]");

    if (panels.length === 0) return;

    var currentIndex = 0;

    function showSlide(index) {
      if (index < 0 || index >= panels.length) return;
      currentIndex = index;

      panels.forEach(function (panel, idx) {
        panel.hidden = idx !== currentIndex;
      });

      pills.forEach(function (pill, idx) {
        if (idx === currentIndex) {
          pill.setAttribute("aria-current", "true");
        } else {
          pill.removeAttribute("aria-current");
        }
      });

      if (counterEl) {
        counterEl.textContent = (currentIndex + 1) + " / " + panels.length;
      }

      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === panels.length - 1;
    }

    pills.forEach(function (pill, idx) {
      pill.addEventListener("click", function () {
        showSlide(idx);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        showSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        showSlide(currentIndex + 1);
      });
    }

    document.addEventListener("keydown", function (event) {
      var tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (event.key === "ArrowLeft") {
        showSlide(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        showSlide(currentIndex + 1);
      }
    });

    var hashMatch = window.location.hash.match(/^#slide-(\d+)$/);
    if (hashMatch) {
      var requested = parseInt(hashMatch[1], 10) - 1;
      if (requested >= 0 && requested < panels.length) {
        showSlide(requested);
        return;
      }
    }

    showSlide(0);
  }

  /**
   * 강사 대본 인쇄 버튼 (script.html 전용)
   */
  function initPrintButton() {
    var printBtn = document.querySelector("[data-print-btn]");
    if (!printBtn) return;
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initCopyButtons();
    initPracticePrompt();
    initSlideDeck();
    initPrintButton();
  });
})();
