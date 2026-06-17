(function () {
  function btn(label, onclick, color) {
    const colorAttr = color ? ' color="' + color + '"' : ' color="secondary"';
    return '<fw-button size="small"' + colorAttr + ' onclick="' + onclick + '">' + label + '</fw-button>';
  }

  function accordion(title, subtitle, contentHtml, expanded) {
    const openAttr = expanded ? ' open' : '';
    const subtitleHtml = subtitle
      ? '<p class="panel-subtitle">' + subtitle + '</p>'
      : '';
    return (
      '<details class="catalog-panel"' + openAttr + '>' +
      '<summary class="catalog-panel-title">' + title + '</summary>' +
      '<div class="catalog-panel-body">' +
      subtitleHtml +
      contentHtml +
      '</div>' +
      '</details>'
    );
  }

  function badge(text, variant) {
    const cls = variant ? 'scenario-badge scenario-badge--' + variant : 'scenario-badge';
    return '<span class="' + cls + '">' + text + '</span>';
  }

  function scenarioCard(templateDef, options) {
    const opts = options || {};
    const expanded = opts.expanded === true;
    const compact = opts.compact === true;
    const safeKey = templateDef.key.replace(/'/g, "\\'");
    const accent = templateDef.accent || 'blue';
    const invokeHandler = opts.invokeHandler || "CatalogUI.invokeSmi('" + safeKey + "')";

    let actions =
      '<div class="object-actions">' +
      btn('Run integration', invokeHandler, 'primary') +
      btn('Copy server code', "CatalogUI.copySample('" + safeKey + "')") +
      '</div>';

    let techBlock =
      '<pre class="sample-code" id="sample-' + templateDef.key + '">' +
      (typeof RequestKit !== 'undefined' ? RequestKit.escapeHtml(templateDef.sampleCode) : templateDef.sampleCode) +
      '</pre>' +
      '<div id="response-' + templateDef.key + '" class="payload-preview hint">Run the integration to see the partner response.</div>';

    if (compact) {
      return (
        '<article class="scenario-card scenario-card--compact scenario-card--' + accent + '">' +
        '<div class="scenario-card__top">' +
        badge(templateDef.badge, accent) +
        '<code class="scenario-card__key">' + templateDef.key + '</code>' +
        '</div>' +
        '<h3 class="scenario-card__title">' + templateDef.scenario + '</h3>' +
        '<p class="scenario-card__story">' + templateDef.scenarioDetail + '</p>' +
        actions +
        techBlock +
        '</article>'
      );
    }

    const openAttr = expanded ? ' open' : '';
    return (
      '<article class="scenario-card scenario-card--' + accent + '">' +
      '<div class="scenario-card__top">' +
      badge(templateDef.badge, accent) +
      '<code class="scenario-card__key">' + templateDef.key + '</code>' +
      '</div>' +
      '<h3 class="scenario-card__title">' + templateDef.scenario + '</h3>' +
      '<p class="scenario-card__story">' + templateDef.scenarioDetail + '</p>' +
      actions +
      '<details class="scenario-card__tech"' + openAttr + '>' +
      '<summary class="scenario-card__tech-title">Technical details</summary>' +
      '<div class="scenario-card__tech-body">' +
      '<p class="hint">' + templateDef.description + '</p>' +
      techBlock +
      '</div>' +
      '</details>' +
      '</article>'
    );
  }

  function referenceScenarioCard(ref) {
    return (
      '<article class="scenario-card scenario-card--reference">' +
      '<div class="scenario-card__top">' +
      badge(ref.badge || 'Reference', 'muted') +
      '</div>' +
      '<h3 class="scenario-card__title">' + ref.scenario + '</h3>' +
      '<p class="scenario-card__story">' + ref.description + '</p>' +
      '<pre class="sample-code">' +
      (typeof RequestKit !== 'undefined' ? RequestKit.escapeHtml(ref.sampleCode) : ref.sampleCode) +
      '</pre>' +
      '</article>'
    );
  }

  window.CatalogHelpers = {
    btn: btn,
    accordion: accordion,
    badge: badge,
    scenarioCard: scenarioCard,
    referenceScenarioCard: referenceScenarioCard
  };
})();
