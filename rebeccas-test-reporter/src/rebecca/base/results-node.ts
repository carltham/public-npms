export class ResultsNode {
  result;
  type;
  parent;
  children;
  addChild;
  last;
  updateResult;
  constructor(result, type, parent) {
    this.result = result;
    this.type = type;
    this.parent = parent;

    this.children = [];

    this.addChild = function (result, type) {
      this.children.push(new ResultsNode(result, type, this));
    };

    this.last = function () {
      return this.children[this.children.length - 1];
    };

    this.updateResult = function (result) {
      this.result = result;
    };
  }
}
