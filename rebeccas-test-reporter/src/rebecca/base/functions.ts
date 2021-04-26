export class Functions {
  static noExpectations(result) {
    var allExpectations =
      result.failedExpectations.length + result.passedExpectations.length;

    return (
      allExpectations === 0 &&
      (result.status === "passed" || result.status === "failed")
    );
  }

  static pluralize(singular, count) {
    var word = count == 1 ? singular : singular + "s";

    return "" + count + " " + word;
  }
}
