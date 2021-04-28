/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function ResultsStateBuilder() {
  this.topResults = new j$.ResultsNode({}, '', null);
  this.currentParent = this.topResults;
  this.specsExecuted = 0;
  this.failureCount = 0;
  this.pendingSpecCount = 0;
}

ResultsStateBuilder.prototype.suiteStarted = function (result) {
  this.currentParent.addChild(result, 'suite');
  this.currentParent = this.currentParent.last();
};

ResultsStateBuilder.prototype.suiteDone = function (result) {
  this.currentParent.updateResult(result);
  if (this.currentParent !== this.topResults) {
    this.currentParent = this.currentParent.parent;
  }

  if (result.status === 'failed') {
    this.failureCount++;
  }
};

ResultsStateBuilder.prototype.specStarted = function (result) { };

ResultsStateBuilder.prototype.specDone = function (result) {
  this.currentParent.addChild(result, 'spec');

  if (result.status !== 'excluded') {
    this.specsExecuted++;
  }

  if (result.status === 'failed') {
    this.failureCount++;
  }

  if (result.status == 'pending') {
    this.pendingSpecCount++;
  }
};