import { DomHandler } from "./dom-handler";
import { DomType } from "../support/dom-type";
import { ResultsStateBuilder } from "../base/results-state-builder";
import { ResultType } from "../support/result-type";
import { SpecHandler } from "../base/spec-handler";
import { HtmlReporter } from "../base/html-reporter";
export class FailureDom {
  constructor(
    result,
    private options: any,
    private domHandler: DomHandler,
    private specHandler: SpecHandler,
    private htmlReporter: HtmlReporter,
    private $j: any
  ) {
    var failure = domHandler.createDom(
      DomType.DIV,
      { className: "jasmine-spec-detail jasmine-failed" },
      this.failureDescription(result, htmlReporter.stateBuilder.currentParent),
      domHandler.createDom(DomType.DIV, { className: "jasmine-messages" })
    );
    var messages = failure.childNodes[1];

    for (var i = 0; i < result.failedExpectations.length; i++) {
      var expectation = result.failedExpectations[i];
      messages.appendChild(
        domHandler.createDom(
          DomType.DIV,
          { className: "jasmine-result-message" },
          expectation.message
        )
      );
      messages.appendChild(
        domHandler.createDom(
          DomType.DIV,
          { className: "jasmine-stack-trace" },
          expectation.stack
        )
      );
    }

    if (result.failedExpectations.length === 0) {
      messages.appendChild(
        domHandler.createDom(
          DomType.DIV,
          { className: "jasmine-result-message" },
          "Spec has no expectations"
        )
      );
    }

    return failure;
  }

  failureDescription(result, suite) {
    var wrapper = this.domHandler.createDom(
      DomType.DIV,
      { className: "jasmine-description" },
      this.domHandler.createDom(
        DomType.A,
        { title: result.description, href: this.specHandler.specHref(result) },
        result.description
      )
    );
    var suiteLink;

    while (suite && suite.parent) {
      wrapper.insertBefore(
        this.options.createTextNode(" > "),
        wrapper.firstChild
      );
      suiteLink = this.domHandler.createDom(
        DomType.A,
        { href: this.suiteHref(suite) },
        suite.result.description
      );
      wrapper.insertBefore(suiteLink, wrapper.firstChild);

      suite = suite.parent;
    }

    return wrapper;
  }

  suiteHref(suite) {
    var els = [];

    while (suite && suite.parent) {
      els.unshift(suite.result.description);
      suite = suite.parent;
    }

    return this.specHandler.addToExistingQueryString(
      ResultType.SPEC,
      els.join(" ")
    );
  }
}
