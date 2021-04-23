this.jasmineDone = function (doneResult) {
  var banner = find(".jasmine-banner");
  var alert = find(".jasmine-alert");
  var order = doneResult && doneResult.order;
  var i;

  var statusBarMessage = "";
  var statusBarClassName = "jasmine-overall-result jasmine-bar ";
  var globalFailures = (doneResult && doneResult.failedExpectations) || [];
  var failed = stateBuilder.failureCount + globalFailures.length > 0;

  var errorBarClassName = "jasmine-bar jasmine-errored";
  var afterAllMessagePrefix = "AfterAll ";

  var warningBarClassName = "jasmine-bar jasmine-warning";
  var results = find(".jasmine-results");

  var seedBar;

  alert.appendChild(
    createDom(
      "span",
      { className: "jasmine-duration" },
      "finished in " + doneResult.totalTime / 1000 + "s"
    )
  );
  banner.appendChild(optionsMenu(config()));

  if (stateBuilder.specsExecuted < totalSpecsDefined) {
    var skippedMessage =
      "Ran " +
      stateBuilder.specsExecuted +
      " of " +
      totalSpecsDefined +
      " specs - run all";
    var skippedLink = addToExistingQueryString("spec", "");
    alert.appendChild(
      createDom(
        "span",
        { className: "jasmine-bar jasmine-skipped" },
        createDom(
          "a",
          { href: skippedLink, title: "Run all specs" },
          skippedMessage
        )
      )
    );
  }

  if (totalSpecsDefined > 0 || failed) {
    statusBarMessage +=
      pluralize("spec", stateBuilder.specsExecuted) +
      ", " +
      pluralize("failure", stateBuilder.failureCount);

    if (stateBuilder.pendingSpecCount) {
      statusBarMessage +=
        ", " + pluralize("pending spec", stateBuilder.pendingSpecCount);
    }
  }

  if (doneResult.overallStatus === "passed") {
    statusBarClassName += " jasmine-passed ";
  } else if (doneResult.overallStatus === "incomplete") {
    statusBarClassName += " jasmine-incomplete ";
    statusBarMessage =
      "Incomplete: " + doneResult.incompleteReason + ", " + statusBarMessage;
  } else {
    statusBarClassName += " jasmine-failed ";
  }

  if (order && order.random) {
    seedBar = createDom(
      "span",
      { className: "jasmine-seed-bar" },
      ", randomized with seed ",
      createDom(
        "a",
        {
          title: "randomized with seed " + order.seed,
          href: seedHref(order.seed),
        },
        order.seed
      )
    );
  }

  alert.appendChild(
    createDom(
      "span",
      { className: statusBarClassName },
      statusBarMessage,
      seedBar
    )
  );

  for (i = 0; i < globalFailures.length; i++) {
    alert.appendChild(
      createDom(
        "span",
        { className: errorBarClassName },
        globalFailureMessage(globalFailures[i])
      )
    );
  }

  addDeprecationWarnings(doneResult);

  for (i = 0; i < deprecationWarnings.length; i++) {
    var warning = deprecationWarnings[i];
    alert.appendChild(
      createDom(
        "span",
        { className: warningBarClassName },
        "DEPRECATION: " + warning
      )
    );
  }

  results.appendChild(summary);
  summaryList(stateBuilder.topResults, summary);

  if (failures.length) {
    alert.appendChild(
      createDom(
        "span",
        { className: "jasmine-menu jasmine-bar jasmine-spec-list" },
        createDom("span", {}, "Spec List | "),
        createDom(
          "a",
          { className: "jasmine-failures-menu", href: "#" },
          "Failures"
        )
      )
    );
    alert.appendChild(
      createDom(
        "span",
        { className: "jasmine-menu jasmine-bar jasmine-failure-list" },
        createDom(
          "a",
          { className: "jasmine-spec-list-menu", href: "#" },
          "Spec List"
        ),
        createDom("span", {}, " | Failures ")
      )
    );

    find(".jasmine-failures-menu").onclick = function () {
      setMenuModeTo("jasmine-failure-list");
      return false;
    };

    find(".jasmine-spec-list-menu").onclick = function () {
      setMenuModeTo("jasmine-spec-list");
      return false;
    };
    setMenuModeTo("jasmine-failure-list");
    var failureNode = find(".jasmine-failures");

    for (i = 0; i < failures.length; i++) {
      failureNode.appendChild(failures[i]);
    }
  }
};
