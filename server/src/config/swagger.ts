import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nuru API",
      version: "1.0.0",
      description: "API documentation for the Nuru Backend",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Read JSDoc comments from route files
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  const customJs = `
    (function () {
      function autoFillLocation() {
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser.');
          return;
        }
        const btn = document.getElementById('nuru-location-btn');
        if (btn) { btn.textContent = '⏳ Detecting...'; btn.disabled = true; }

        navigator.geolocation.getCurrentPosition(
          function (pos) {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);

            // Save globally so it can be re-applied if user opens new endpoints
            window.__nuruLat = lat;
            window.__nuruLng = lng;

            let filled = fillVisibleInputs(lat, lng);

            // Show success banner
            showBanner('\\uD83D\\uDCCD Location detected: ' + lat + ', ' + lng + ' (' + filled + ' field(s) filled)', '#10b981');
            if (btn) { btn.textContent = '\\uD83D\\uDCCD ' + lat + ', ' + lng; btn.disabled = false; }
          },
          function (err) {
            showBanner('\\u26A0\\uFE0F Could not get location: ' + err.message, '#ef4444');
            if (btn) { btn.textContent = '\\uD83D\\uDCCD Auto-detect My Location'; btn.disabled = false; }
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }

      function fillVisibleInputs(lat, lng) {
        let count = 0;
        // React 16+ overrides the native value setter, so we need to bypass it
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

        document.querySelectorAll('table.parameters input').forEach(function (input) {
          const row = input.closest('tr') || input.parentElement;
          if (!row) return;
          
          let labelText = '';
          const nameEl = row.querySelector('.parameter__name');
          if (nameEl) {
            // Remove the red asterisk from text
            labelText = nameEl.childNodes[0]?.textContent || nameEl.textContent;
          } else {
            labelText = (row.textContent || '').toLowerCase();
          }
          
          labelText = labelText.trim().toLowerCase();

          if (labelText === 'lat' || labelText.startsWith('lat')) {
            nativeInputValueSetter.call(input, lat);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            count++;
          } else if (labelText === 'lng' || labelText.startsWith('lng') || labelText.startsWith('long')) {
            nativeInputValueSetter.call(input, lng);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            count++;
          }
        });
        return count;
      }

      function showBanner(msg, color) {
        var old = document.getElementById('nuru-banner');
        if (old) old.remove();
        var el = document.createElement('div');
        el.id = 'nuru-banner';
        el.style.cssText = 'position:fixed;top:65px;right:20px;background:' + color + ';color:#fff;padding:10px 16px;border-radius:8px;z-index:99999;font-family:sans-serif;font-size:13px;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.2);max-width:340px;line-height:1.4';
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 5000);
      }

      function injectButton() {
        if (document.getElementById('nuru-location-btn')) return;
        var btn = document.createElement('button');
        btn.id = 'nuru-location-btn';
        btn.textContent = '\\uD83D\\uDCCD Auto-detect My Location';
        btn.style.cssText = 'position:fixed;top:14px;right:20px;background:#3b82f6;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;z-index:99999;font-size:13px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.25);transition:background 0.2s';
        btn.onmouseover = function () { btn.style.background = '#2563eb'; };
        btn.onmouseout  = function () { btn.style.background = '#3b82f6'; };
        btn.onclick = autoFillLocation;
        document.body.appendChild(btn);
      }

      // Observe for new endpoints opening to auto-fill them if location is known
      var observer = new MutationObserver(function() {
        injectButton();
        if (window.__nuruLat && window.__nuruLng) {
          fillVisibleInputs(window.__nuruLat, window.__nuruLng);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener('load', function () { setTimeout(injectButton, 800); });
    })();
  `;

  // Swagger Page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, <any>{
    customJsStr: customJs,
    customSiteTitle: "Nuru API Docs",
    customCss: `
      .topbar { background: #1e1b4b !important; }
      .topbar-wrapper img { display: none; }
      .topbar-wrapper::before { content: 'Nuru API'; color: white; font-size: 18px; font-weight: 700; }
    `,
  }));

  // Serve swagger spec as JSON
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
