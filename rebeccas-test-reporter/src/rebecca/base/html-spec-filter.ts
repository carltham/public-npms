export class HtmlSpecFilter {
  matches;
  constructor(options) {
    var filterString =
      options &&
      options.filterString() &&
      options.filterString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var filterPattern = new RegExp(filterString);

    this.matches = function (specName) {
      return filterPattern.test(specName);
    };
  }
}
