this.initialize = function () {
  clearPrior();
  htmlReporterMain = createDom(
    "div",
    { className: "jasmine_html-reporter" },
    createDom(
      "div",
      { className: "jasmine-banner" },
      createDom("a", {
        className: "jasmine-title",
        href: "http://jasmine.github.io/",
        target: "_blank",
      }),
      createDom("span", { className: "jasmine-version" }, j$.version)
    ),
    createDom("ul", { className: "jasmine-symbol-summary" }),
    createDom("div", { className: "jasmine-alert" }),
    createDom(
      "div",
      { className: "jasmine-results" },
      createDom("div", { className: "jasmine-failures" })
    )
  );
  getContainer().appendChild(htmlReporterMain);
};

this.displaySpecInCorrectFormat = function (result) {
  return noExpectations(result) && result.status === "passed"
    ? "jasmine-empty"
    : this.resultStatus(result.status);
};

this.resultStatus = function (status) {
  if (status === "excluded") {
    return config().hideDisabled
      ? "jasmine-excluded-no-display"
      : "jasmine-excluded";
  }
  return "jasmine-" + status;
};

this.suiteDone = function (result) {
  stateBuilder.suiteDone(result);
  if (result.status === "failed") {
    failures.push(failureDom(result));
  }
  addDeprecationWarnings(result);
};

this.specDone = function (result) {
  stateBuilder.specDone(result);
  if (noExpectations(result)) {
    var noSpecMsg = "Spec '" + result.fullName + "' has no expectations.";
    if (result.status === "failed") {
      console.error(noSpecMsg);
    } else {
      console.warn(noSpecMsg);
    }
  }
  if (!symbols) {
    symbols = find(".jasmine-symbol-summary");
  }
  symbols.appendChild(
    createDom("li", {
      className: this.displaySpecInCorrectFormat(result),
      id: "spec_" + result.id,
      title: result.fullName,
    })
  );
  if (result.status === "failed") {
    failures.push(failureDom(result));
  }
  addDeprecationWarnings(result);
};

this.specStarted = function (result) {
  stateBuilder.specStarted(result);
};

this.jasmineStarted = function (options) {
  totalSpecsDefined = options.totalSpecsDefined || 0;
};

this.suiteStarted = function (result) {
  stateBuilder.suiteStarted(result);
};
