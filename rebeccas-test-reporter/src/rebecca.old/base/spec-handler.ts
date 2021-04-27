import { ResultType } from "../support/result-type";
export class SpecHandler {
  addToExistingQueryString: any;

  constructor(private options: any) {
    this.addToExistingQueryString =
      options.addToExistingQueryString || this.defaultQueryString;
  }
  hasActiveSpec(resultNode) {
    if (
      resultNode.type == ResultType.SPEC &&
      resultNode.result.status != "excluded"
    ) {
      return true;
    }

    if (resultNode.type == ResultType.SUITE) {
      for (var i = 0, j = resultNode.children.length; i < j; i++) {
        if (this.hasActiveSpec(resultNode.children[i])) {
          return true;
        }
      }
    }
  }

  specHref(result) {
    return this.addToExistingQueryString(ResultType.SPEC, result.fullName);
  }

  defaultQueryString(key, value) {
    return "?" + key + "=" + value;
  }

  seedHref(seed) {
    return this.addToExistingQueryString("seed", seed);
  }
}
