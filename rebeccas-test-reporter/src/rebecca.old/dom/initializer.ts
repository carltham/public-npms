import { DomHandler } from "./dom-handler";
import { DomType } from "../support/dom-type";
export class Initializer {
  htmlReporterMain;
  constructor(private domHandler: DomHandler, private options: any, j$: any) {
    this.clearPrior();
    this.htmlReporterMain = this.domHandler.createDom(
      DomType.DIV,
      { className: "jasmine_html-reporter" },
      this.domHandler.createDom(
        DomType.DIV,
        { className: "jasmine-banner" },
        this.domHandler.createDom(DomType.A, {
          className: "jasmine-title",
          href: "http://jasmine.github.io/",
          target: "_blank",
        }),
        this.domHandler.createDom(
          DomType.SPAN,
          { className: "jasmine-version" },
          j$.version
        )
      ),
      this.domHandler.createDom(DomType.UL, {
        className: "jasmine-symbol-summary",
      }),
      this.domHandler.createDom(DomType.DIV, { className: "jasmine-alert" }),
      this.domHandler.createDom(
        DomType.DIV,
        { className: "jasmine-results" },
        this.domHandler.createDom(DomType.DIV, {
          className: "jasmine-failures",
        })
      )
    );
    options.getContainer().appendChild(this.htmlReporterMain);
  }

  clearPrior() {
    // return the reporter
    var oldReporter = this.domHandler.find("");

    if (oldReporter) {
      this.options.getContainer().removeChild(oldReporter);
    }
  }
}
