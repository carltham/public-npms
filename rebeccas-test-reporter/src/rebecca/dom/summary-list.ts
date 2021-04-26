import { DomHandler } from "./dom-handler";
import { ResultType } from "../support/result-type";
import { DomType } from "../support/dom-type";
import { SpecHandler } from "../base/spec-handler";
import { Functions } from "../base/functions";
export class SummaryList {
  summary;

  constructor(
    resultsTree,
    domParent,
    private options: any,
    private domHandler: DomHandler,
    private specHandler: SpecHandler
  ) {
    this.summary = domHandler.createDom(DomType.DIV, {
      className: "jasmine-summary",
    });
    var specListNode;
    for (var i = 0; i < resultsTree.children.length; i++) {
      var resultNode = resultsTree.children[i];
      if (options.filterSpecs && !this.specHandler.hasActiveSpec(resultNode)) {
        continue;
      }
      if (resultNode.type === ResultType.SUITE) {
        var suiteListNode = this.domHandler.createDom(
          DomType.UL,
          { className: "jasmine-suite", id: "suite-" + resultNode.result.id },
          this.domHandler.createDom(
            DomType.LI,
            {
              className:
                "jasmine-suite-detail jasmine-" + resultNode.result.status,
            },
            this.domHandler.createDom(
              DomType.A,
              { href: this.specHandler.specHref(resultNode.result) },
              resultNode.result.description
            )
          )
        );

        new SummaryList(
          resultNode,
          suiteListNode,
          options,
          domHandler,
          specHandler
        );
        domParent.appendChild(suiteListNode);
      }
      if (resultNode.type === ResultType.SPEC) {
        if (domParent.getAttribute("class") !== "jasmine-specs") {
          specListNode = this.domHandler.createDom(DomType.UL, {
            className: "jasmine-specs",
          });
          domParent.appendChild(specListNode);
        }
        var specDescription = resultNode.result.description;
        if (Functions.noExpectations(resultNode.result)) {
          specDescription = "SPEC HAS NO EXPECTATIONS " + specDescription;
        }
        if (
          resultNode.result.status === "pending" &&
          resultNode.result.pendingReason !== ""
        ) {
          specDescription =
            specDescription +
            " PENDING WITH MESSAGE: " +
            resultNode.result.pendingReason;
        }
        specListNode.appendChild(
          this.domHandler.createDom(
            DomType.LI,
            {
              className: "jasmine-" + resultNode.result.status,
              id: "spec-" + resultNode.result.id,
            },
            this.domHandler.createDom(
              DomType.A,
              { href: specHandler.specHref(resultNode.result) },
              specDescription
            )
          )
        );
      }
    }
  }
}
