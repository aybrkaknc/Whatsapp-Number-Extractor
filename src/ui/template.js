(() => {
  const WA = globalThis.WA ||= {};

  // Static markup only; all user-facing text is filled in by updateUITexts()
  WA.UI_TEMPLATE = `
    <div id="wa-extractor-window" class="window hide" style="width: min(280px, 90vw); margin-bottom: 5px;">
      <div class="title-bar">
        <div class="title-bar-text">WA Extractor</div>
        <div class="title-bar-controls">
          <button id="wa-ext-btn-lang"></button>
          <button id="wa-ext-btn-settings"></button>
          <button id="wa-ext-btn-github"></button>
          <button id="wa-ext-btn-minimize" class="minimize"></button>
          <button id="wa-ext-btn-close" class="close"></button>
        </div>
      </div>

      <div id="wa-ext-main" class="window-body">
        <div id="wa-ext-notice" class="hide">
          <p id="wa-ext-notice-text"></p>
          <button id="wa-ext-notice-ok"></button>
        </div>

        <fieldset class="wa-ext-col">
          <legend id="wa-ext-label-actions"></legend>
          <button id="wa-ext-btn-start"></button>
          <button id="wa-ext-btn-auto" class="hide"></button>
          <button id="wa-ext-btn-copy" class="hide"></button>
          <button id="wa-ext-btn-stop" class="hide"></button>
        </fieldset>

        <div class="field-row-stacked" style="margin-top: 8px;">
          <label id="wa-ext-label-status"></label>
          <div id="wa-extractor-status" class="sunken-panel" role="status" aria-live="polite" style="padding: 10px; min-height: 70px; word-break: break-all; font-family: 'Fixedsys', 'Courier New', monospace; font-size: 14px; background: black; color: #00ff00; line-height: 1.5;"></div>
        </div>

        <div id="wa-ext-progress" class="progress-indicator segmented hide">
          <span id="wa-ext-progress-bar" class="progress-indicator-bar" style="width: 0%;"></span>
        </div>

        <div style="margin-top: 8px;">
          <button id="wa-ext-btn-log" style="width: 100%;"></button>
        </div>

        <div id="wa-extractor-log-terminal" class="sunken-panel" style="padding: 6px; overflow-y: auto; background: black; color: #00ff00; font-family: 'Fixedsys', 'Courier New', monospace; font-size: 12px;"></div>

        <button id="wa-extractor-log-clear" class="hide" style="width: 100%; margin-top: 4px;"></button>
      </div>

      <div id="wa-ext-settings" class="window-body hide">
        <fieldset class="wa-ext-col">
          <legend id="wa-ext-set-legend"></legend>
          <div class="field-row-stacked">
            <label for="wa-ext-set-country" id="wa-ext-set-country-label"></label>
            <select id="wa-ext-set-country"></select>
          </div>
          <div class="field-row-stacked">
            <label for="wa-ext-set-delimiter" id="wa-ext-set-delimiter-label"></label>
            <select id="wa-ext-set-delimiter">
              <option value=";"></option>
              <option value=","></option>
            </select>
          </div>
          <div class="field-row-stacked">
            <label for="wa-ext-set-speed" id="wa-ext-set-speed-label"></label>
            <select id="wa-ext-set-speed">
              <option value="slow"></option>
              <option value="normal"></option>
              <option value="fast"></option>
            </select>
          </div>
          <div class="field-row-stacked">
            <label for="wa-ext-set-copy" id="wa-ext-set-copy-label"></label>
            <select id="wa-ext-set-copy">
              <option value="lines"></option>
              <option value="comma"></option>
            </select>
          </div>
          <div class="field-row-stacked">
            <label for="wa-ext-set-format" id="wa-ext-set-format-label"></label>
            <select id="wa-ext-set-format">
              <option value="csv"></option>
              <option value="vcf"></option>
              <option value="json"></option>
            </select>
          </div>
          <div class="field-row-stacked">
            <label for="wa-ext-set-filter" id="wa-ext-set-filter-label"></label>
            <select id="wa-ext-set-filter"></select>
          </div>
          <div class="field-row-stacked">
            <label for="wa-ext-set-motion" id="wa-ext-set-motion-label"></label>
            <select id="wa-ext-set-motion">
              <option value="system"></option>
              <option value="on"></option>
              <option value="off"></option>
            </select>
          </div>
          <div class="field-row">
            <input type="checkbox" id="wa-ext-set-unsaved">
            <label for="wa-ext-set-unsaved" id="wa-ext-set-unsaved-label"></label>
          </div>
          <div class="field-row">
            <input type="checkbox" id="wa-ext-set-sound">
            <label for="wa-ext-set-sound" id="wa-ext-set-sound-label"></label>
          </div>
          <div class="field-row">
            <input type="checkbox" id="wa-ext-set-keep">
            <label for="wa-ext-set-keep" id="wa-ext-set-keep-label"></label>
          </div>
        </fieldset>
        <div class="wa-ext-set-buttons">
          <button id="wa-ext-set-help"></button>
          <button id="wa-ext-set-ok"></button>
        </div>
      </div>

      <div class="status-bar">
        <p id="wa-ext-sb-phase" class="status-bar-field"></p>
        <p id="wa-ext-sb-count" class="status-bar-field"></p>
      </div>
    </div>

    <button id="wa-extractor-main-toggle" style="width: 55px; height: 34px; font-weight: bold; font-size: 13px;">WA</button>
  `;
})();
