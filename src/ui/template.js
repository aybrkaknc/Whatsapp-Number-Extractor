(() => {
  const WA = globalThis.WA ||= {};

  // Static markup only; all user-facing text is filled in by updateUITexts()
  WA.UI_TEMPLATE = `
    <div id="wa-extractor-window" class="window hide" style="width: 280px; margin-bottom: 5px;">
      <div class="title-bar">
        <div class="title-bar-text">WA Extractor</div>
        <div class="title-bar-controls">
          <button id="wa-ext-btn-lang"></button>
          <button id="wa-ext-btn-feedback">?</button>
          <button id="wa-ext-btn-telegram"></button>
          <button id="wa-ext-btn-close"></button>
        </div>
      </div>

      <div class="window-body">
        <fieldset class="wa-ext-col">
          <legend id="wa-ext-label-actions"></legend>
          <button id="wa-ext-btn-start"></button>
          <button id="wa-ext-btn-auto" class="hide"></button>
          <button id="wa-ext-btn-copy" class="hide"></button>
          <button id="wa-ext-btn-stop" class="hide"></button>
        </fieldset>

        <div class="field-row-stacked" style="margin-top: 8px;">
          <label id="wa-ext-label-status"></label>
          <div id="wa-extractor-status" class="sunken-panel" style="padding: 10px; min-height: 70px; word-break: break-all; font-family: 'Fixedsys', 'Courier New', monospace; font-size: 14px; background: black; color: #00ff00; line-height: 1.5;"></div>
        </div>

        <div style="margin-top: 8px;">
          <button id="wa-ext-btn-log" style="width: 100%;"></button>
        </div>

        <div id="wa-extractor-log-terminal" class="sunken-panel" style="padding: 6px; overflow-y: auto; background: black; color: #00ff00; font-family: 'Fixedsys', 'Courier New', monospace; font-size: 12px;"></div>

        <button id="wa-extractor-log-clear" class="hide" style="width: 100%; margin-top: 4px;"></button>
      </div>
    </div>

    <button id="wa-extractor-main-toggle" style="width: 55px; height: 34px; font-weight: bold; font-size: 13px;">WA</button>
  `;
})();
