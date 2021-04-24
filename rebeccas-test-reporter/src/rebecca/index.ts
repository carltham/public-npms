var JASMINE_CORE_PATTERN = /([\\/]karma-jasmine[\\/])/i;
var createPattern = function (path) {
  return { pattern: path, included: true, served: true, watched: false };
};

class Settings {
  static suppressExcluded = false;
  static suppressAll = false;
  static suppressFailed = false;
}

class InintReporter {
  static $inject = ["config", "baseReporterDecorator"];
  private karmaConfig: any;
  private baseReporterDecorator: any;
  onSpecComplete: () => any;
  onRunComplete: () => any;
  specFailure: () => any;
  constructor() {
    var jasmineCoreIndex = 0;
    if (this.baseReporterDecorator) {
      this.baseReporterDecorator(this);
    }

    if (this.karmaConfig) {
      const files = this.karmaConfig.files;

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
        createPattern(__dirname + "/css/jasmine.css")
      );
      files.splice(
        ++jasmineCoreIndex,
        0,
        createPattern(__dirname + "/lib/html.jasmine.reporter.js")
      );
      files.splice(
        ++jasmineCoreIndex,
        0,
        createPattern(__dirname + "/lib/adapter.js")
      );
    }
  }
}
var initReporter = new InintReporter();

module.exports = {
  "reporter:kjhtml": ["type", initReporter],
  Settings,
};
