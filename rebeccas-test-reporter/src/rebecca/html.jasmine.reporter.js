/*
Copyright (c) 2008-2019 Pivotal Labs

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
jasmineRequire.html = function (j$) {
  j$.ResultsNode = jasmineRequire.ResultsNode();
  j$.HtmlReporter = jasmineRequire.HtmlReporter(j$);
  j$.QueryString = jasmineRequire.QueryString();
  j$.HtmlSpecFilter = jasmineRequire.HtmlSpecFilter();
};

jasmineRequire.HtmlReporter = function (j$) {
  ResultsStateBuilder.prototype.suiteStarted = function (result) {
    this.currentParent.addChild(result, ResultType.SUITE);
    this.currentParent = this.currentParent.last();
  };

  ResultsStateBuilder.prototype.suiteDone = function (result) {
    this.currentParent.updateResult(result);
    if (this.currentParent !== this.topResults) {
      this.currentParent = this.currentParent.parent;
    }

    if (result.status === "failed") {
      this.failureCount++;
    }
  };

  ResultsStateBuilder.prototype.specStarted = function (result) {};

  ResultsStateBuilder.prototype.specDone = function (result) {
    this.currentParent.addChild(result, ResultType.SPEC);

    if (result.status !== "excluded") {
      this.specsExecuted++;
    }

    if (result.status === "failed") {
      this.failureCount++;
    }

    if (result.status == "pending") {
      this.pendingSpecCount++;
    }
  };

  return HtmlReporter;
};

jasmineRequire.HtmlSpecFilter = function () {
  return HtmlSpecFilter;
};

jasmineRequire.ResultsNode = function () {
  return ResultsNode;
};

jasmineRequire.QueryString = function () {
  return QueryString;
};
