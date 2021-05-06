import jasmine from "karma-jasmine";

export class Initiator {
  init(window) {
    const jasmineRequire =
      window.jasmineRequire ||
      require("./node_modules/jasmine-core/lib/jasmine-core/jasmine.js");
    console.log("jasmineRequire.html = ", jasmineRequire.html);

    /**
     * Since this is being run in a browser and the results should populate to an HTML page, require the HTML-specific Jasmine code, injecting the same reference.
     */
    jasmineRequire.html(jasmine);

    /**
     * Create the Jasmine environment. This is used to run all specs in a project.
     */
    var env = jasmine.getEnv();

    /**
     * ## Runner Parameters
     *
     * More browser specific code - wrap the query string in an object and to allow for getting/setting parameters from the runner user interface.
     */

    var queryString = new jasmine.QueryString({
      getWindowLocation: function () {
        return window.location;
      },
    });

    var filterSpecs = !!queryString.getParam("spec");

    const config = {
      failFast: queryString.getParam("failFast"),
      oneFailurePerSpec: queryString.getParam("oneFailurePerSpec"),
      hideDisabled: queryString.getParam("hideDisabled"),
      random: "",
      seed: "",
      specFilter,
    };

    var random = queryString.getParam("random");

    if (random !== undefined && random !== "") {
      config.random = random;
    }

    var seed = queryString.getParam("seed");
    if (seed) {
      config.seed = seed;
    }

    /**
     * ## Reporters
     * The `HtmlReporter` builds all of the HTML UI for the runner page. This reporter paints the dots, stars, and x's for specs, as well as all spec names and all failures (if any).
     */
    let configuration = {
      env: env,
      navigateWithNewParam: function (key, value) {
        return queryString.navigateWithNewParam(key, value);
      },
      addToExistingQueryString: function (key, value) {
        return queryString.fullStringWithNewParam(key, value);
      },
      getContainer: function () {
        return window.document.body;
      },
      createElement: function () {
        return window.document.createElement.apply(window.document, arguments);
      },
      createTextNode: function () {
        return window.document.createTextNode.apply(window.document, arguments);
      },
      timer: new jasmine.Timer(),
      filterSpecs: filterSpecs,
      suppressExcluded: function (key, value) {
        return queryString.suppressExcluded(key, value);
      },
    };
    var htmlReporter = new jasmine.HtmlReporter(configuration);

    env.addReporter(htmlReporter);

    /**
     * Filter which specs will be run by matching the start of the full name against the `spec` query param.
     */
    var specFilter;
    if (queryString.getParam("spec")) {
      specFilter = new jasmine.HtmlSpecFilter({
        filterString: function () {
          return queryString.getParam("spec");
        },
      });

      config.specFilter = function (spec) {
        return specFilter.matches(spec.getFullName());
      };
    }

    env.configure(config);

    htmlReporter.initialize();
  }
}
