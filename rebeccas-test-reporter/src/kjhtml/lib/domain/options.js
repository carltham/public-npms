function optionsMenu(config) {
  var optionsMenuDom = createDom(
    "div",
    { className: "jasmine-run-options" },
    createDom("span", { className: "jasmine-trigger" }, "Options"),
    createDom(
      "div",
      { className: "jasmine-payload" },
      createDom(
        "div",
        { className: "jasmine-stop-on-failure" },
        createDom("input", {
          className: "jasmine-fail-fast",
          id: "jasmine-fail-fast",
          type: "checkbox",
        }),
        createDom(
          "label",
          { className: "jasmine-label", for: "jasmine-fail-fast" },
          "stop execution on spec failure"
        )
      ),
      createDom(
        "div",
        { className: "jasmine-throw-failures" },
        createDom("input", {
          className: "jasmine-throw",
          id: "jasmine-throw-failures",
          type: "checkbox",
        }),
        createDom(
          "label",
          { className: "jasmine-label", for: "jasmine-throw-failures" },
          "stop spec on expectation failure"
        )
      ),
      createDom(
        "div",
        { className: "jasmine-random-order" },
        createDom("input", {
          className: "jasmine-random",
          id: "jasmine-random-order",
          type: "checkbox",
        }),
        createDom(
          "label",
          { className: "jasmine-label", for: "jasmine-random-order" },
          "run tests in random order"
        )
      ),
      createDom(
        "div",
        { className: "jasmine-hide-disabled" },
        createDom("input", {
          className: "jasmine-disabled",
          id: "jasmine-hide-disabled",
          type: "checkbox",
        }),
        createDom(
          "label",
          { className: "jasmine-label", for: "jasmine-hide-disabled" },
          "hide disabled tests"
        )
      )
    )
  );

  var failFastCheckbox = optionsMenuDom.querySelector("#jasmine-fail-fast");
  failFastCheckbox.checked = config.failFast;
  failFastCheckbox.onclick = function () {
    navigateWithNewParam("failFast", !config.failFast);
  };

  var throwCheckbox = optionsMenuDom.querySelector("#jasmine-throw-failures");
  throwCheckbox.checked = config.oneFailurePerSpec;
  throwCheckbox.onclick = function () {
    navigateWithNewParam("throwFailures", !config.oneFailurePerSpec);
  };

  var randomCheckbox = optionsMenuDom.querySelector("#jasmine-random-order");
  randomCheckbox.checked = config.random;
  randomCheckbox.onclick = function () {
    navigateWithNewParam("random", !config.random);
  };

  var hideDisabled = optionsMenuDom.querySelector("#jasmine-hide-disabled");
  hideDisabled.checked = config.hideDisabled;
  hideDisabled.onclick = function () {
    navigateWithNewParam("hideDisabled", !config.hideDisabled);
  };

  var optionsTrigger = optionsMenuDom.querySelector(".jasmine-trigger"),
    optionsPayload = optionsMenuDom.querySelector(".jasmine-payload"),
    isOpen = /\bjasmine-open\b/;

  optionsTrigger.onclick = function () {
    if (isOpen.test(optionsPayload.className)) {
      optionsPayload.className = optionsPayload.className.replace(isOpen, "");
    } else {
      optionsPayload.className += " jasmine-open";
    }
  };

  return optionsMenuDom;
}