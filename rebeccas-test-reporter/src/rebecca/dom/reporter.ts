export class Reporter {
  htmlReporterMain;
  failures = [];

  setMenuModeTo(mode) {
    this.htmlReporterMain.setAttribute(
      "class",
      "jasmine_html-reporter " + mode
    );
  }
}
