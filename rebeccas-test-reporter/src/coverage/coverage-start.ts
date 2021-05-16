import fs from "fs";
// import jasmineRequire from "jasmine-core/lib/jasmine-core/jasmine";

// console.log("InitReporter::jasmineRequire = ", jasmineRequire);

var JASMINE_CORE_PATTERN = /([\\/]karma-jasmine[\\/])/i;
var createPattern = function (path) {
  return { pattern: path, included: true, served: true, watched: false };
};

const InitReporter = function (config, baseReporterDecorator) {
  var resultMap;
  var reporters = config.reporters;
  let promiseComplete = null;

  this.onRunStart = function (browsers) {
    resultMap = new Map();
  };

  // 'AuthenticationLoginComponent should show 5 users' => {
  //   fullName: 'AuthenticationLoginComponent should show 5 users',
  //   description: 'should show 5 users',
  //   id: 'spec6',
  //   log: [],
  //   skipped: false,
  //   disabled: false,
  //   pending: false,
  //   success: true,
  //   suite: [ 'AuthenticationLoginComponent' ],
  //   time: 85,
  //   executedExpectationsCount: 3,
  //   passedExpectations: [ [Object], [Object], [Object] ],
  //   properties: null
  // }

  this.executeReport = async function (reporterConfig, browser) {
    const results = { exitCode: 0 };
    return results;
  };

  this.onSpecComplete = (browser: any, result: any) => {
    if (!result.skipped && !result.disabled) {
      resultMap.set(result.fullName, result);
    }
  };

  this.onRunComplete = function (browsers) {
    console.log("resultMap = ", resultMap);
    let results = { exitCode: 0 };

    const promiseCollection = reporters.map((reporterConfig) =>
      Promise.all(
        browsers.map(async (browser) => {
          const res = await this.executeReport(reporterConfig, browser);
          if (res && res.exitCode === 1) {
            results = res;
          }
        })
      )
    );
    promiseComplete = Promise.all(promiseCollection).then(() => results);
    return promiseComplete;
  };

  this.onExit = async function (done) {
    const results = await promiseComplete;
    if (results && results.exitCode === 1) {
      done(results.exitCode);
      return;
    }
    if (typeof config._onExit === "function") {
      config._onExit(done);
    } else {
      done();
    }
  };

  var jasmineCoreIndex = 0;

  const files = config.files;

  // baseReporterDecorator(this);
  console.log("baseReporterDecorator = ", baseReporterDecorator);

  const rebeccasConfig = config.reporterconfigs.rebeccas;
  console.log("config.reporterconfigs.rebeccas = ", rebeccasConfig);
  if (rebeccasConfig) {
    replaceInfile(
      __dirname + "/config.js",
      "suppressExcluded = false",
      "suppressExcluded = " + rebeccasConfig.suppressExcluded
    );
    replaceInfile(
      __dirname + "/config.js",
      "suppressExcluded = true",
      "suppressExcluded = " + rebeccasConfig.suppressExcluded
    );
    replaceInfile(
      __dirname + "/config.js",
      "suppressExcluded = undefined",
      "suppressExcluded = " + rebeccasConfig.suppressExcluded
    );
  }

  if (config.jasmineHtmlReporter) {
    const jasmineHtmlReporter = config.jasmineHtmlReporter;
    if (jasmineHtmlReporter.suppressAll) {
      this.onSpecComplete = () => void 0;
      this.onRunComplete = () => void 0;
    }
    if (jasmineHtmlReporter.suppressFailed) {
      this.specFailure = () => void 0;
    }
  }

  files.forEach(function (file, index) {
    if (JASMINE_CORE_PATTERN.test(file.pattern)) {
      jasmineCoreIndex = index;
    }
  });
  files.splice(++jasmineCoreIndex, 0, createPattern(__dirname + "/config.js"));

  files.splice(
    ++jasmineCoreIndex,
    0,
    createPattern(__dirname + "/css/jasmine.css")
  );
  files.splice(
    ++jasmineCoreIndex,
    0,
    createPattern(__dirname + "/html.jasmine.reporter.js")
  );
  files.splice(++jasmineCoreIndex, 0, createPattern(__dirname + "/adapter.js"));
};

const replaceInfile = function (
  filename: string,
  oldValue: any,
  newValue: any
) {
  let promise = new Promise(function (resolve, reject) {
    fs.readFile(filename, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      var result = data.replace(oldValue, newValue);

      fs.writeFile(filename, result, "utf8", function (err) {
        reject(err);
      });

      resolve(result);
    });
  });
  return promise;
};

// const initReporterInit = function (config, baseReporterDecorator) {
//   return new InitReporter(config, baseReporterDecorator);
// };
// initReporterInit.$inject = ["config", "baseReporterDecorator"];
InitReporter.$inject = ["config", "baseReporterDecorator"];

// module.exports = {
//   "reporter:kjhtml": ["type", initReporterInit],
// };
module.exports = {
  "reporter:kjhtml": ["type", InitReporter],
};
// module.exports = {
//   "reporter:kjhtml": ["type", require("./coverage/reporter.js")],
// };
