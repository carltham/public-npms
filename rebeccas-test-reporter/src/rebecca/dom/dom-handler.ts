import { DomType } from "../support/dom-type";
import { Attributes } from "../support/attributes";
import { SummaryList } from "./summary-list";
import { SpecHandler } from "../base/spec-handler";
export class DomHandler {
  summaryList;
  deprecationWarnings = [];
  constructor(
    private options: any,
    private specHandler: SpecHandler,
    private j$: any
  ) {}
  createSummaryList(topResults: any, summary: any) {
    this.summaryList = new SummaryList(
      topResults,
      summary,
      this.options,
      this,
      this.specHandler
    );
  }
  createDom(type, attrs: object, ...childrenVarArgs: any) {
    var el = this.options.createElement(type);

    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];

      if (typeof child === DomType.TEXT) {
        el.appendChild(this.options.createTextNode(child));
      } else {
        if (child) {
          el.appendChild(child);
        }
      }
    }

    Object.keys(attrs).forEach((attributeName) => {
      const value = attrs[attributeName];
      if (attributeName == Attributes.CLASS_NAME) {
        el[attributeName] = value;
      } else {
        el.setAttribute(attributeName, value);
      }
    });

    return el;
  }

  find(selector) {
    return this.options
      .getContainer()
      .querySelector(".jasmine_html-reporter " + selector);
  }
  addDeprecationWarnings(result) {
    if (result && result.deprecationWarnings) {
      for (var i = 0; i < result.deprecationWarnings.length; i++) {
        var warning = result.deprecationWarnings[i].message;
        if (!this.j$.util.arrayContains(warning)) {
          this.deprecationWarnings.push(warning);
        }
      }
    }
  }
}
