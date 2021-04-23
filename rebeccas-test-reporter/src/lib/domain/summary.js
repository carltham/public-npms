function summaryList(resultsTree, domParent) {
  var specListNode;
  for (var i = 0; i < resultsTree.children.length; i++) {
    var resultNode = resultsTree.children[i];
    if (filterSpecs && !hasActiveSpec(resultNode)) {
      continue;
    }
    if (resultNode.type === "suite") {
      var suiteListNode = createDom(
        "ul",
        { className: "jasmine-suite", id: "suite-" + resultNode.result.id },
        createDom(
          "li",
          {
            className:
              "jasmine-suite-detail jasmine-" + resultNode.result.status,
          },
          createDom(
            "a",
            { href: specHref(resultNode.result) },
            resultNode.result.description
          )
        )
      );

      summaryList(resultNode, suiteListNode);
      domParent.appendChild(suiteListNode);
    }
    if (resultNode.type === "spec") {
      if (domParent.getAttribute("class") !== "jasmine-specs") {
        specListNode = createDom("ul", { className: "jasmine-specs" });
        domParent.appendChild(specListNode);
      }
      var specDescription = resultNode.result.description;
      if (noExpectations(resultNode.result)) {
        specDescription = "SPEC HAS NO EXPECTATIONS " + specDescription;
      }
      if (
        resultNode.result.status === "pending" &&
        resultNode.result.pendingReason !== ""
      ) {
        specDescription =
          specDescription +
          " PENDING WITH MESSAGE: " +
          resultNode.result.pendingReason;
      }
      specListNode.appendChild(
        createDom(
          "li",
          {
            className: "jasmine-" + resultNode.result.status,
            id: "spec-" + resultNode.result.id,
          },
          createDom("a", { href: specHref(resultNode.result) }, specDescription)
        )
      );
    }
  }
}
