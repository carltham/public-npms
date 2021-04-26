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
}
