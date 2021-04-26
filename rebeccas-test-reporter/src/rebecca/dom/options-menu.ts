import { DomHandler } from "./dom-handler";
import { DomType } from "../support/dom-type";
export class OptionsMenu {
  constructor(
    private config: any,
    private options: any,
    private domHandler: DomHandler
  ) {
    var optionsMenuDom = domHandler.createDom(
      DomType.DIV,
      { className: "jasmine-run-options" },
      domHandler.createDom(
        DomType.SPAN,
        { className: "jasmine-trigger" },
        "Options"
      ),
      domHandler.createDom(
        DomType.DIV,
        { className: "jasmine-payload" },
        domHandler.createDom(
          DomType.DIV,
          { className: "jasmine-stop-on-failure" },
          domHandler.createDom(DomType.INPUT, {
            className: "jasmine-fail-fast",
            id: "jasmine-fail-fast",
            type: DomType.CHECKBOX,
          }),
          domHandler.createDom(
            DomType.LABEL,
            { className: "jasmine-label", for: "jasmine-fail-fast" },
            "stop execution on spec failure"
          )
        ),
        domHandler.createDom(
          DomType.DIV,
          { className: "jasmine-throw-failures" },
          domHandler.createDom(DomType.INPUT, {
            className: "jasmine-throw",
            id: "jasmine-throw-failures",
            type: DomType.CHECKBOX,
          }),
          domHandler.createDom(
            DomType.LABEL,
            { className: "jasmine-label", for: "jasmine-throw-failures" },
            "stop spec on expectation failure"
          )
        ),
        domHandler.createDom(
          DomType.DIV,
          { className: "jasmine-random-order" },
          domHandler.createDom(DomType.INPUT, {
            className: "jasmine-random",
            id: "jasmine-random-order",
            type: DomType.CHECKBOX,
          }),
          domHandler.createDom(
            DomType.LABEL,
            { className: "jasmine-label", for: "jasmine-random-order" },
            "run tests in random order"
          )
        ),
        domHandler.createDom(
          DomType.DIV,
          { className: "jasmine-hide-disabled" },
          domHandler.createDom(DomType.INPUT, {
            className: "jasmine-disabled",
            id: "jasmine-hide-disabled",
            type: DomType.CHECKBOX,
          }),
          domHandler.createDom(
            DomType.LABEL,
            { className: "jasmine-label", for: "jasmine-hide-disabled" },
            "hide disabled tests"
          )
        )
      )
    );

    var failFastCheckbox = optionsMenuDom.querySelector("#jasmine-fail-fast");
    failFastCheckbox.checked = config.failFast;
    failFastCheckbox.onclick = function () {
      options.navigateWithNewParam("failFast", !config.failFast);
    };

    var throwCheckbox = optionsMenuDom.querySelector("#jasmine-throw-failures");
    throwCheckbox.checked = config.oneFailurePerSpec;
    throwCheckbox.onclick = function () {
      options.navigateWithNewParam("throwFailures", !config.oneFailurePerSpec);
    };

    var randomCheckbox = optionsMenuDom.querySelector("#jasmine-random-order");
    randomCheckbox.checked = config.random;
    randomCheckbox.onclick = function () {
      options.navigateWithNewParam("random", !config.random);
    };

    var hideDisabled = optionsMenuDom.querySelector("#jasmine-hide-disabled");
    hideDisabled.checked = config.hideDisabled;
    hideDisabled.onclick = function () {
      options.navigateWithNewParam("hideDisabled", !config.hideDisabled);
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
}
