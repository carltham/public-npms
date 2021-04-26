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

  function HtmlReporter(options) {
    (getContainer = options.getContainer),
      (createElement = options.createElement),
      (createTextNode = options.createTextNode),
      (navigateWithNewParam = options.navigateWithNewParam || function () {}),
      (addToExistingQueryString =
        options.addToExistingQueryString || defaultQueryString),
      (filterSpecs = options.filterSpecs),
      htmlReporterMain,
      symbols,
      (deprecationWarnings = []);

    this.jasmineStarted = function (options) {
      totalSpecsDefined = options.totalSpecsDefined || 0;
    };

    this.suiteStarted = function (result) {
      stateBuilder.suiteStarted(result);
    };

    this.suiteDone = function (result) {
      stateBuilder.suiteDone(result);

      if (result.status === "failed") {
        failures.push(failureDom(result));
      }
      addDeprecationWarnings(result);
    };

    this.specStarted = function (result) {
      stateBuilder.specStarted(result);
    };

    this.specDone = function (result) {
      stateBuilder.specDone(result);

      if (noExpectations(result)) {
        var noSpecMsg = "Spec '" + result.fullName + "' has no expectations.";
        if (result.status === "failed") {
          console.error(noSpecMsg);
        } else {
          console.warn(noSpecMsg);
        }
      }

      if (!symbols) {
        symbols = find(".jasmine-symbol-summary");
      }

      symbols.appendChild(
        createDom(DomType.LI, {
          className: this.displaySpecInCorrectFormat(result),
          id: "spec_" + result.id,
          title: result.fullName,
        })
      );

      if (result.status === "failed") {
        failures.push(failureDom(result));
      }

      addDeprecationWarnings(result);
    };

    this.displaySpecInCorrectFormat = function (result) {
      return noExpectations(result) && result.status === "passed"
        ? "jasmine-empty"
        : this.resultStatus(result.status);
    };

    this.resultStatus = function (status) {
      if (status === "excluded") {
        return config().hideDisabled
          ? "jasmine-excluded-no-display"
          : "jasmine-excluded";
      }
      return "jasmine-" + status;
    };

    return this;
  }

  return HtmlReporter;
};

jasmineRequire.HtmlSpecFilter = function () {
  function HtmlSpecFilter(options) {
    var filterString =
      options &&
      options.filterString() &&
      options.filterString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var filterPattern = new RegExp(filterString);

    this.matches = function (specName) {
      return filterPattern.test(specName);
    };
  }

  return HtmlSpecFilter;
};

jasmineRequire.ResultsNode = function () {
  function ResultsNode(result, type, parent) {
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

  return ResultsNode;
};

jasmineRequire.QueryString = function () {
  function QueryString(options) {
    this.navigateWithNewParam = function (key, value) {
      options.getWindowLocation().search = this.fullStringWithNewParam(
        key,
        value
      );
    };

    this.fullStringWithNewParam = function (key, value) {
      var paramMap = queryStringToParamMap();
      paramMap[key] = value;
      return toQueryString(paramMap);
    };

    this.getParam = function (key) {
      return queryStringToParamMap()[key];
    };

    return this;

    function toQueryString(paramMap) {
      var qStrPairs = [];
      for (var prop in paramMap) {
        qStrPairs.push(
          encodeURIComponent(prop) + "=" + encodeURIComponent(paramMap[prop])
        );
      }
      return "?" + qStrPairs.join("&");
    }

    function queryStringToParamMap() {
      var paramStr = options.getWindowLocation().search.substring(1),
        params = [],
        paramMap = {};

      if (paramStr.length > 0) {
        params = paramStr.split("&");
        for (var i = 0; i < params.length; i++) {
          var p = params[i].split("=");
          var value = decodeURIComponent(p[1]);
          if (value === "true" || value === "false") {
            value = JSON.parse(value);
          }
          paramMap[decodeURIComponent(p[0])] = value;
        }
      }

      return paramMap;
    }
  }

  return QueryString;
};
