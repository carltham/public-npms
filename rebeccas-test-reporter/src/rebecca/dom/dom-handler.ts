import { DomType } from "../support/dom-type";
import { Attributes } from "../support/attributes";
export class DomHandler {
  constructor(private options: any) {}
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
}
