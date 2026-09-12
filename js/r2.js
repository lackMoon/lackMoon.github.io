const stylesheet = new URL('../css/r2.css', import.meta.url).href;

const targets = new Set([
  "about",
  "experience",
  "projects",
  "skills",
  "contact"
]);

const r2Art = (variant) => `
  <svg
    class="r2-art r2-art--${variant}"
    viewBox="${variant === "header"
    ? "20 3 120 112"
    : "0 0 160 190"}"
    aria-hidden="true"
    focusable="false"
  >
    <g class="r2-antenna">
      <path
        data-r2-part="antenna"
        d="M58 37 43 14"
      />

      <path
        data-r2-part="antenna"
        d="m102 37 15-23"
      />

      <circle
        class="r2-antenna-light"
        cx="41"
        cy="11"
        r="8"
      />

      <circle
        class="r2-antenna-light"
        cx="119"
        cy="11"
        r="8"
      />
    </g>

    <ellipse
      class="r2-hover-shadow"
      cx="80"
      cy="181"
      rx="33"
      ry="5"
    />

    <g class="r2-body">
      <path
        class="r2-arm r2-arm--left"
        d="M36 122c-17 3-23 12-25 24"
      />

      <path
        class="r2-arm r2-arm--right"
        d="M124 122c16 0 22-8 26-19"
      />

      <g class="r2-hand r2-hand--left">
        <circle
          cx="11"
          cy="149"
          r="8"
        />

        <path d="m7 144-6-6m14 7 7-5" />
      </g>

      <g class="r2-hand r2-hand--right">
        <circle
          cx="150"
          cy="101"
          r="8"
        />

        <path d="m154 96 5-7m-13 5-1-8" />
      </g>

      <rect
        class="r2-torso"
        x="43"
        y="105"
        width="74"
        height="58"
        rx="18"
      />

      <rect
        data-r2-part="code-screen"
        class="r2-code-screen"
        x="61"
        y="119"
        width="38"
        height="25"
        rx="6"
      />

      <text
        class="r2-code"
        x="80"
        y="136"
        text-anchor="middle"
      >&lt;/&gt;</text>

      <rect
        class="r2-status-light"
        x="68"
        y="150"
        width="24"
        height="5"
        rx="2.5"
      />

      <path
        class="r2-leg"
        d="M59 160v13m42-13v13"
      />

      <path
        class="r2-foot"
        d="M45 178c1-8 7-11 16-8l7 8Z"
      />

      <path
        class="r2-foot"
        d="M92 178c2-8 8-11 17-8l6 8Z"
      />
    </g>

    <g class="r2-head">
      <circle
        class="r2-ear"
        cx="30"
        cy="76"
        r="15"
      />

      <circle
        class="r2-ear"
        cx="130"
        cy="76"
        r="15"
      />

      <rect
        class="r2-shell"
        x="26"
        y="35"
        width="108"
        height="77"
        rx="29"
      />

      <rect
        data-r2-part="face"
        class="r2-face"
        x="36"
        y="46"
        width="88"
        height="52"
        rx="20"
      />

      <g class="r2-eyes">
        <ellipse
          class="r2-eye"
          cx="61"
          cy="69"
          rx="10"
          ry="15"
        />

        <ellipse
          class="r2-eye"
          cx="99"
          cy="69"
          rx="10"
          ry="15"
        />

        <circle
          class="r2-eye-shine"
          cx="58"
          cy="64"
          r="3"
        />

        <circle
          class="r2-eye-shine"
          cx="96"
          cy="64"
          r="3"
        />
      </g>

      <path
        class="r2-mouth"
        d="M69 85q11 10 22 0"
      />

      <path
        class="r2-mouth r2-mouth--concerned"
        d="M69 91q11-9 22 0"
      />

      <g class="r2-thinking-dots">
        <circle
          cx="131"
          cy="42"
          r="2.5"
        />

        <circle
          cx="141"
          cy="34"
          r="3.5"
        />

        <circle
          cx="153"
          cy="24"
          r="4.5"
        />
      </g>
    </g>
  </svg>
`;

class R2Guide extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) {
      return;
    }

    this.history = [];
    this.busy = false;
    this.version = 0;
    this.tour = 0;

    this.setAttribute("data-expression", "happy");

    const root = this.attachShadow({
      mode: "open"
    });

    root.innerHTML = `
      <link
        rel="stylesheet"
        href="${stylesheet}"
      >

      <button
        class="launcher"
        type="button"
        aria-label="Open R2 Portfolio Guide"
        aria-expanded="false"
        aria-controls="panel"
      >
        <span class="r2-avatar r2-avatar--launcher">
          ${r2Art("launcher")}
        </span>

        <span>
          Ask R2
          <small>Your portfolio guide</small>
        </span>

        <b aria-hidden="true">✦</b>
      </button>

      <section
        id="panel"
        role="dialog"
        aria-labelledby="title"
        hidden
      >
        <header>
          <span class="r2-avatar r2-avatar--header">
            ${r2Art("header")}
          </span>

          <div>
            <h2 id="title">R2</h2>
            <p>Portfolio Guide · online</p>
          </div>

          <button
            class="close"
            type="button"
            aria-label="Close R2 Portfolio Guide"
          >
            ×
          </button>
        </header>

        <div class="intro">
          <div class="intro-copy">
            <span class="eyebrow">
              YOUR CURIOUS CODE COMPANION
            </span>

            <h3>
              Let’s explore<br>
              lackMoon’s work.
            </h3>

            <p>
              Projects, skills, experience—I know where to look.
            </p>

            <button
              class="tour"
              type="button"
            >
              Take a tour
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div class="r2-stage">
            <span
              class="r2-spark r2-spark--one"
              aria-hidden="true"
            >✦</span>

            <span
              class="r2-spark r2-spark--two"
              aria-hidden="true"
            >✦</span>

            ${r2Art("guide")}
          </div>
        </div>

        <div
          class="messages"
          role="log"
          aria-label="Conversation"
          aria-live="polite"
          aria-relevant="additions text"
        ></div>

        <div class="prompts">
          <button type="button">
            <span aria-hidden="true">▣</span>
            Explore projects
          </button>

          <button type="button">
            <span aria-hidden="true">⌁</span>
            View skills
          </button>
        </div>

        <p
          class="status"
          role="status"
        ></p>

        <form>
          <label for="message">
            Your message
          </label>

          <div class="compose">
            <textarea
              id="message"
              rows="2"
              maxlength="1000"
              placeholder="Ask R2 anything…"
              required
            ></textarea>

            <button
              class="send"
              type="submit"
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </form>

        <footer>
          <span>
            AI can be wrong. Messages go to Mistral.<br>
            Don’t share sensitive information.
          </span>

          <button
            class="clear"
            type="button"
          >
            Clear conversation
          </button>
        </footer>
      </section>
    `;

    this.$ = (selector) => root.querySelector(selector);

    this.launcher = this.$(".launcher");
    this.panel = this.$("#panel");
    this.input = this.$("textarea");

    this.launcher.addEventListener("click", () => {
      this.toggle(this.panel.hidden);
    });

    this.$(".close").addEventListener("click", () => {
      this.toggle(false);
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.toggle(false);
      }
    });

    this.$("form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.send(this.input.value);
    });

    this.input.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.isComposing
      ) {
        event.preventDefault();
        this.send(this.input.value);
      }
    });

    root
      .querySelectorAll(".prompts button")
      .forEach((button) => {
        button.addEventListener("click", () => {
          this.send(button.textContent);
        });
      });

    this.$(".tour").addEventListener("click", () => {
      const stops = [
        "about",
        "projects",
        "skills",
        "contact"
      ];

      const target =
        stops[this.tour++ % stops.length];

      this.navigate(target);
      this.setExpression("curious");

      this.status(
        `R2 tour stop ${((this.tour - 1) % stops.length) + 1
        }/${stops.length}: ${target}. Click again for the next stop.`
      );
    });

    this.$(".clear").addEventListener("click", () => {
      this.version += 1;
      this.controller?.abort();

      this.history = [];
      this.$(".messages").replaceChildren();
      this.input.value = "";

      this.setBusy(false);
      this.setExpression("happy");
      this.status("");
      this.welcome();
      this.input.focus();
    });

    this.welcome();
  }

  disconnectedCallback() {
    this.version += 1;
    this.controller?.abort();
  }

  welcome() {
    this.bubble(
      "assistant",
      "Hi! I’m R2. Want to explore lackMoon’s projects, skills, or experience?"
    );
  }

  toggle(open) {
    this.panel.hidden = !open;

    this.launcher.setAttribute(
      "aria-expanded",
      String(open)
    );

    this.setExpression(
      open ? "curious" : "happy"
    );

    if (open) {
      this.input.focus();
    } else {
      this.launcher.focus();
    }
  }

  status(text) {
    this.$(".status").textContent = text;
  }

  setExpression(expression) {
    this.setAttribute(
      "data-expression",
      expression
    );
  }

  setBusy(value) {
    this.busy = value;

    this.$(".send").disabled = value;

    this.shadowRoot
      .querySelectorAll(".prompts button")
      .forEach((button) => {
        button.disabled = value;
      });

    this.$(".messages").setAttribute(
      "aria-busy",
      String(value)
    );

    this.setAttribute(
      "data-state",
      value ? "thinking" : "idle"
    );

    if (value) {
      this.setExpression("thinking");
    }
  }

  bubble(role, text) {
    const node = document.createElement("p");

    node.className = role;
    node.textContent = text;

    this.$(".messages").append(node);

    node.scrollIntoView({
      block: "nearest"
    });

    return node;
  }

  navigate(target) {
    if (!targets.has(target)) {
      return;
    }

    const section =
      document.getElementById(target);

    if (!section) {
      this.status(
        "This section is not available on this page yet."
      );
      return;
    }

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    section.scrollIntoView({
      behavior: reducedMotion
        ? "auto"
        : "smooth",
      block: "start"
    });

    section.setAttribute(
      "data-r2-highlight",
      "true"
    );

    if (typeof section.animate === "function") {
      section.animate(
        [
          {
            outline: "3px solid #a78bfa",
            outlineOffset: "8px"
          },
          {
            outline: "3px solid transparent",
            outlineOffset: "16px"
          }
        ],
        {
          duration: reducedMotion
            ? 1
            : 1600
        }
      );
    }

    window.setTimeout(() => {
      section.removeAttribute(
        "data-r2-highlight"
      );
    }, 2000);
  }

  cards(actions) {
    if (!Array.isArray(actions)) {
      return;
    }

    const row =
      document.createElement("div");

    row.className = "actions";

    actions
      .slice(0, 3)
      .forEach((action) => {
        if (
          !action ||
          !targets.has(action.target) ||
          typeof action.label !== "string"
        ) {
          return;
        }

        const button =
          document.createElement("button");

        button.type = "button";

        button.textContent =
          `${action.label.slice(0, 80)} ↗`;

        button.setAttribute(
          "aria-label",
          action.label.slice(0, 80)
        );

        button.addEventListener(
          "click",
          () => {
            this.navigate(action.target);
          }
        );

        row.append(button);
      });

    this.$(".messages").append(row);
  }

  async send(raw) {
    const message =
      String(raw ?? "").trim();

    if (
      this.busy ||
      !message ||
      message.length > 1000
    ) {
      return;
    }

    const endpoint =
      this.getAttribute("api-url") ||
      "https://r2-2hlg.onrender.com/api/chat";

    try {
      const url = new URL(endpoint);

      const validLocalhost =
        url.protocol === "http:" &&
        (
          url.hostname === "localhost" ||
          url.hostname === "127.0.0.1"
        );

      if (
        url.protocol !== "https:" &&
        !validLocalhost
      ) {
        throw new Error(
          "Invalid API URL"
        );
      }
    } catch {
      this.status(
        "Set a valid API URL before chatting. You can still take a tour."
      );
      return;
    }

    const version =
      ++this.version;

    this.controller =
      new AbortController();

    const controller =
      this.controller;

    this.setBusy(true);
    this.input.value = "";

    const userBubble =
      this.bubble("user", message);

    this.status("R2 is thinking…");

    const wakeTimer =
      window.setTimeout(() => {
        if (version === this.version) {
          this.status(
            "R2 is still connecting. The server may be waking up…"
          );
        }
      }, 5000);

    const timeoutTimer =
      window.setTimeout(() => {
        controller.abort();
      }, 75000);

    try {
      const response =
        await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          credentials: "omit",
          signal: controller.signal,
          body: JSON.stringify({
            message,
            history:
              this.history.slice(-8)
          })
        });

      if (!response.ok) {
        throw new Error(
          response.status === 429
            ? "limited"
            : "unavailable"
        );
      }

      const data =
        await response.json();

      if (
        typeof data.reply !== "string" ||
        !data.reply.trim() ||
        data.reply.length > 4000
      ) {
        throw new Error(
          "invalid-response"
        );
      }

      if (version !== this.version) {
        return;
      }

      this.bubble(
        "assistant",
        data.reply
      );

      this.cards(data.actions);

      this.history.push(
        {
          role: "user",
          content: message
        },
        {
          role: "assistant",
          content: data.reply
        }
      );

      this.history =
        this.history.slice(-8);

      this.setExpression("happy");
      this.status("");
    } catch (error) {
      if (version !== this.version) {
        return;
      }

      userBubble.remove();

      if (!this.input.value) {
        this.input.value = message;
      }

      this.setExpression("concerned");

      if (error.name === "AbortError") {
        this.status(
          "R2 took too long to respond. Your message is ready to retry."
        );
      } else {
        this.status(
          "R2 could not connect. Your message is ready to retry; you can also take a tour."
        );
      }
    } finally {
      window.clearTimeout(wakeTimer);
      window.clearTimeout(timeoutTimer);

      if (version === this.version) {
        this.setBusy(false);
      }
    }
  }
}

if (!customElements.get("r2-guide")) {
  customElements.define("r2-guide", R2Guide);
}