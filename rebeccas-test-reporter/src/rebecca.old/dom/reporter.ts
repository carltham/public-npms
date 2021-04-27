export class Reporter {
  htmlReporterMain;

  setMenuModeTo(mode) {
    this.htmlReporterMain.setAttribute(
      "class",
      "jasmine_html-reporter " + mode
    );
  }
}
