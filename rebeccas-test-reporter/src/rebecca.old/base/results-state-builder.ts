import { ResultType } from "../support/result-type";
export class ResultsStateBuilder {
  topResults;
  currentParent;
  specsExecuted;
  failureCount;
  pendingSpecCount;

  constructor(private j$: any) {
    this.topResults = new j$.ResultsNode({}, "", null);
    this.currentParent = this.topResults;
    this.specsExecuted = 0;
    this.failureCount = 0;
    this.pendingSpecCount = 0;
  }

  suiteStarted(result) {
    this.currentParent.addChild(result, ResultType.SUITE);
    this.currentParent = this.currentParent.last();
  }

  suiteDone(result) {
    this.currentParent.updateResult(result);
    if (this.currentParent !== this.topResults) {
      this.currentParent = this.currentParent.parent;
    }

    if (result.status === "failed") {
      this.failureCount++;
    }
  }

  specStarted(result) {}

  specDone(result) {
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
  }
}
