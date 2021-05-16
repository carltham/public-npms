import fs from "fs";

var JASMINE_CORE_PATTERN = /([\\/]karma-jasmine[\\/])/i;
var createPattern = function (path) {
  return { pattern: path, included: true, served: true, watched: false };
};

class InitReporter {
  karmaConfig;
  baseReporterDecorator;
  onSpecComplete: () => any;
  onRunComplete: () => any;
  specFailure: () => any;

  constructor(config, decorator) {
    this.karmaConfig = config;
    this.baseReporterDecorator = decorator;
    this.init();
  }
  init() {
    var jasmineCoreIndex = 0;

    const files = this.karmaConfig.files;

    this.baseReporterDecorator(this);

    const rebeccasConfig = this.karmaConfig.reporterconfigs.rebeccas;
    console.log('__dirname + "/config.js" = ', __dirname + "/config.js");
    console.log("karmaConfig.reporterconfigs.rebeccas = ", rebeccasConfig);
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

    if (this.karmaConfig.jasmineHtmlReporter) {
      const config = this.karmaConfig.jasmineHtmlReporter;
      if (config.suppressAll) {
        this.onSpecComplete = () => void 0;
        this.onRunComplete = () => void 0;
      }
      if (config.suppressFailed) {
        this.specFailure = () => void 0;
      }
    }

    files.forEach(function (file, index) {
      if (JASMINE_CORE_PATTERN.test(file.pattern)) {
        jasmineCoreIndex = index;
      }
    });
    files.splice(
      ++jasmineCoreIndex,
      0,
      createPattern(__dirname + "/config.js")
    );

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
    files.splice(
      ++jasmineCoreIndex,
      0,
      createPattern(__dirname + "/adapter.js")
    );
  }
}

const replaceInfile = function (
  filename: string,
  oldValue: any,
  newValue: any
) {
  let data = fs.readFileSync(filename, "utf8") + "";
  var result = data.replace(oldValue, newValue);
  fs.writeFileSync(filename, result);
};

const initReporterInit = function (config, decorator) {
  return new InitReporter(config, decorator);
};
initReporterInit.$inject = ["config", "baseReporterDecorator"];

module.exports = {
  "reporter:kjhtml": ["type", initReporterInit],
};
