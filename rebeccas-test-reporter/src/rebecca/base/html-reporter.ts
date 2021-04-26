import { ResultsStateBuilder } from "./results-state-builder";
import { FailureDom } from "../dom/failiure";
import { DomHandler } from "../dom/dom-handler";
import { SpecHandler } from "./spec-handler";
import { DomType } from "../support/dom-type";
export class HtmlReporter {
  getContainer;
  createElement;
  createTextNode;
  navigateWithNewParam;
  addToExistingQueryString;
  defaultQueryString;
  filterSpecs;
  htmlReporterMain;
  symbols;
  deprecationWarnings;
  totalSpecsDefined;
  stateBuilder;
  failures = [];

  constructor(
    private options: any,
    private domHandler: DomHandler,
    private specHandler: SpecHandler,
    private $j: any
  ) {
    this.stateBuilder = new ResultsStateBuilder($j);
    (this.getContainer = options.getContainer),
      (this.createElement = options.createElement),
      (this.createTextNode = options.createTextNode),
      (this.navigateWithNewParam =
        options.navigateWithNewParam || function () {}),
      (this.addToExistingQueryString =
        options.addToExistingQueryString || this.defaultQueryString),
      (this.filterSpecs = options.filterSpecs),
      this.htmlReporterMain,
      this.symbols,
      (this.deprecationWarnings = []);

    return this;
  }

  config = function () {
    return (this.options.env && this.options.env.configuration()) || {};
  };

  jasmineStarted(options) {
    this.totalSpecsDefined = options.totalSpecsDefined || 0;
  }

  suiteStarted(result) {
    this.stateBuilder.suiteStarted(result);
  }

  suiteDone(result) {
    this.stateBuilder.suiteDone(result);

    if (result.status === "failed") {
      this.failures.push(
        new FailureDom(
          result,
          this.options,
          this.domHandler,
          this.specHandler,
          this,
          this.$j
        )
      );
    }
    this.domHandler.addDeprecationWarnings(result);
  }

  specStarted = function (result) {
    this.stateBuilder.specStarted(result);
  };

  specDone = function (result) {
    this.stateBuilder.specDone(result);

    if (this.domHandler.noExpectations(result)) {
      var noSpecMsg = "Spec '" + result.fullName + "' has no expectations.";
      if (result.status === "failed") {
        console.error(noSpecMsg);
      } else {
        console.warn(noSpecMsg);
      }
    }

    if (!this.symbols) {
      this.symbols = this.domHandler.find(".jasmine-symbol-summary");
    }

    this.symbols.appendChild(
      this.domHandler.createDom(DomType.LI, {
        className: this.displaySpecInCorrectFormat(result),
        id: "spec_" + result.id,
        title: result.fullName,
      })
    );

    if (result.status === "failed") {
      this.failures.push(this.domHandler.failureDom(result));
    }

    this.domHandler.addDeprecationWarnings(result);
  };

  displaySpecInCorrectFormat = function (result) {
    return this.domHandler.noExpectations(result) && result.status === "passed"
      ? "jasmine-empty"
      : this.resultStatus(result.status);
  };

  resultStatus = function (status) {
    if (status === "excluded") {
      return this.config().hideDisabled
        ? "jasmine-excluded-no-display"
        : "jasmine-excluded";
    }
    return "jasmine-" + status;
  };
}
