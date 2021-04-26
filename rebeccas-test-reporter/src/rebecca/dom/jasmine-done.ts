import { DomHandler } from "./dom-handler";
import { DomType } from "../support/dom-type";
import { ResultsStateBuilder } from "../base/results-state-builder";
import { OptionsMenu } from "./options-menu";
import { ResultType } from "../support/result-type";
import { Settings } from "../base/settings";
import { SpecHandler } from "../base/spec-handler";
import { Functions } from "../base/functions";
import { SummaryList } from "./summary-list";
import { Reporter } from "./reporter";
import { HtmlReporter } from "../base/html-reporter";
export class JasmineDone {
  constructor(
    doneResult,
    options,
    config,
    private domHandler: DomHandler,
    private stateBuilder: ResultsStateBuilder,
    private specHandler: SpecHandler,
    private summaryList: SummaryList,
    private reporter: Reporter,
    private htmlReporter: HtmlReporter
  ) {
    var banner = this.domHandler.find(".jasmine-banner");
    var alert = this.domHandler.find(".jasmine-alert");
    var order = doneResult && doneResult.order;
    var i;
    alert.appendChild(
      this.domHandler.createDom(
        DomType.SPAN,
        { className: "jasmine-duration" },
        "finished in " + doneResult.totalTime / 1000 + "s"
      )
    );

    banner.appendChild(new OptionsMenu(config, options, domHandler));

    if (stateBuilder.specsExecuted < htmlReporter.totalSpecsDefined) {
      var skippedMessage =
        "Ran " +
        stateBuilder.specsExecuted +
        " of " +
        htmlReporter.totalSpecsDefined +
        " specs - run all";
      var skippedLink = specHandler.addToExistingQueryString(
        ResultType.SPEC,
        ""
      );
      alert.appendChild(
        this.domHandler.createDom(
          DomType.SPAN,
          { className: "jasmine-bar jasmine-skipped" },
          this.domHandler.createDom(
            DomType.A,
            { href: skippedLink, title: "Run all specs" },
            skippedMessage
          )
        )
      );
    }
    var statusBarMessage = "";
    var statusBarClassName = "jasmine-overall-result jasmine-bar ";
    var globalFailures = (doneResult && doneResult.failedExpectations) || [];
    var failed = stateBuilder.failureCount + globalFailures.length > 0;

    if (htmlReporter.totalSpecsDefined > 0 || failed) {
      statusBarMessage +=
        Functions.pluralize(ResultType.SPEC, stateBuilder.specsExecuted) +
        ", " +
        Functions.pluralize("failure", stateBuilder.failureCount);
      if (stateBuilder.pendingSpecCount) {
        statusBarMessage +=
          ", " +
          Functions.pluralize("pending spec", stateBuilder.pendingSpecCount);
      }
    }

    if (doneResult.overallStatus === "passed") {
      statusBarClassName += " jasmine-passed ";
    } else if (doneResult.overallStatus === "incomplete") {
      statusBarClassName += " jasmine-incomplete ";
      statusBarMessage =
        "Incomplete: " + doneResult.incompleteReason + ", " + statusBarMessage;
    } else {
      statusBarClassName += " jasmine-failed ";
    }

    var seedBar;
    if (order && order.random) {
      seedBar = this.domHandler.createDom(
        DomType.SPAN,
        { className: "jasmine-seed-bar" },
        ", randomized with seed ",
        this.domHandler.createDom(
          DomType.A,
          {
            title: "randomized with seed " + order.seed,
            href: specHandler.seedHref(order.seed),
          },
          order.seed
        )
      );
    }

    alert.appendChild(
      this.domHandler.createDom(
        DomType.SPAN,
        { className: statusBarClassName },
        statusBarMessage,
        seedBar
      )
    );

    var errorBarClassName = "jasmine-bar jasmine-errored";
    var afterAllMessagePrefix = "AfterAll ";

    for (i = 0; i < globalFailures.length; i++) {
      alert.appendChild(
        this.domHandler.createDom(
          DomType.SPAN,
          { className: errorBarClassName },
          globalFailureMessage(globalFailures[i])
        )
      );
    }

    function globalFailureMessage(failure) {
      if (failure.globalErrorType === "load") {
        var prefix = "Error during loading: " + failure.message;

        if (failure.filename) {
          return prefix + " in " + failure.filename + " line " + failure.lineno;
        } else {
          return prefix;
        }
      } else {
        return afterAllMessagePrefix + failure.message;
      }
    }

    domHandler.addDeprecationWarnings(doneResult);

    var warningBarClassName = "jasmine-bar jasmine-warning";
    for (i = 0; i < domHandler.deprecationWarnings.length; i++) {
      var warning = domHandler.deprecationWarnings[i];
      alert.appendChild(
        this.domHandler.createDom(
          DomType.SPAN,
          { className: warningBarClassName },
          "DEPRECATION: " + warning
        )
      );
    }

    var results = domHandler.find(".jasmine-results");
    results.appendChild(summaryList.summary);
    domHandler.createSummaryList(stateBuilder.topResults, summaryList.summary);

    if (htmlReporter.failures.length) {
      alert.appendChild(
        this.domHandler.createDom(
          DomType.SPAN,
          { className: "jasmine-menu jasmine-bar jasmine-spec-list" },
          this.domHandler.createDom(DomType.SPAN, {}, "Spec List | "),
          this.domHandler.createDom(
            DomType.A,
            { className: "jasmine-failures-menu", href: "#" },
            "Failures"
          )
        )
      );
      alert.appendChild(
        this.domHandler.createDom(
          DomType.SPAN,
          { className: "jasmine-menu jasmine-bar jasmine-failure-list" },
          this.domHandler.createDom(
            DomType.A,
            { className: "jasmine-spec-list-menu", href: "#" },
            "Spec List"
          ),
          this.domHandler.createDom(DomType.SPAN, {}, " | Failures ")
        )
      );

      domHandler.find(".jasmine-failures-menu").onclick = function () {
        reporter.setMenuModeTo("jasmine-failure-list");
        return false;
      };
      domHandler.find(".jasmine-spec-list-menu").onclick = function () {
        reporter.setMenuModeTo("jasmine-spec-list");
        return false;
      };

      reporter.setMenuModeTo("jasmine-failure-list");

      var failureNode = domHandler.find(".jasmine-failures");
      for (i = 0; i < htmlReporter.failures.length; i++) {
        failureNode.appendChild(htmlReporter.failures[i]);
      }
    }
  }
}
