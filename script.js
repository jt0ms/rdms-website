(function () {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = document.querySelectorAll(".nav a");
  const sections = document.querySelectorAll("main section[id]");
  const reveals = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".counter");

  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotPanel = document.getElementById("chatbotPanel");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotForm = document.getElementById("chatbotForm");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const suggestionButtons = document.querySelectorAll(".suggestion-btn");

  const savedTheme = localStorage.getItem("rdms-theme");

  function setTheme(theme) {
    const dark = theme === "dark";
    body.classList.toggle("dark", dark);
    themeIcon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
    localStorage.setItem("rdms-theme", theme);
  }

  setTheme(savedTheme || "dark");

  themeToggle.addEventListener("click", function () {
    setTheme(body.classList.contains("dark") ? "light" : "dark");
  });

  menuToggle.addEventListener("click", function () {
    siteNav.classList.toggle("open");
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      siteNav.classList.remove("open");
    });
  });

  function updateActiveLink() {
    let current = "";

    sections.forEach(function (section) {
      const top = window.scrollY;
      const offset = section.offsetTop - 140;
      const height = section.offsetHeight;

      if (top >= offset && top < offset + height) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach(function (el) {
    revealObserver.observe(el);
  });

  function formatCounterValue(value, suffix) {
    if (value >= 1000 && suffix === "+") {
      const k = value / 1000;
      return (Number.isInteger(k) ? k : k.toFixed(1)) + "k" + suffix;
    }
    return value + suffix;
  }

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;

    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 1600;
    const startTime = performance.now();

    counter.dataset.animated = "true";

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      counter.textContent = formatCounterValue(current, suffix);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = formatCounterValue(target, suffix);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const foundCounter = entry.target.querySelector(".counter") || entry.target;
          if (foundCounter.classList.contains("counter")) {
            animateCounter(foundCounter);
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  function addMessage(text, type) {
    const bubble = document.createElement("div");
    bubble.className = "chatbot-message " + type;
    bubble.textContent = text;
    chatbotMessages.appendChild(bubble);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function botReply(message) {
    const msg = message.toLowerCase();

    if (msg.includes("join") || msg.includes("volunteer") || msg.includes("partner")) {
      return "You can join RDMS through the contact section for volunteering, partnerships, research collaboration, or outreach support.";
    }

    if (msg.includes("academy") || msg.includes("training") || msg.includes("lesson")) {
      return "The Research Academy focuses on oral health basics, community screening methods, dental public health, and research ethics.";
    }

    if (msg.includes("program") || msg.includes("services") || msg.includes("offer")) {
      return "RDMS offers school-based screenings, preventive care programs, oral health research, and research academy training.";
    }

    if (msg.includes("contact") || msg.includes("email") || msg.includes("location")) {
      return "You can reach RDMS via the contact section. The current displayed contact details include Kigali, Rwanda and info@rdmsrwanda.org.";
    }

    if (msg.includes("message generator") || msg.includes("daily message") || msg.includes("ai")) {
      return "The site can support preventive care messaging tools, chatbot assistance, and educational content generation for outreach campaigns.";
    }

    return "I can help with RDMS programs, academy information, joining RDMS, outreach, and contact details.";
  }

  function openChatbot() {
    chatbotPanel.classList.add("open");
    chatbotPanel.setAttribute("aria-hidden", "false");
  }

  function closeChatbot() {
    chatbotPanel.classList.remove("open");
    chatbotPanel.setAttribute("aria-hidden", "true");
  }

  chatbotToggle.addEventListener("click", function () {
    const isOpen = chatbotPanel.classList.contains("open");
    if (isOpen) {
      closeChatbot();
    } else {
      openChatbot();
      chatbotInput.focus();
    }
  });

  chatbotClose.addEventListener("click", closeChatbot);

  suggestionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const text = button.textContent.trim();
      addMessage(text, "user");

      setTimeout(function () {
        addMessage(botReply(text), "bot");
      }, 400);

      openChatbot();
    });
  });

  chatbotForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatbotInput.value = "";

    setTimeout(function () {
      addMessage(botReply(text), "bot");
    }, 450);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = 78;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top,
        behavior: "smooth"
      });
    });
  });
})();