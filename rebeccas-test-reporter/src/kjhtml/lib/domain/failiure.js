function globalFailureMessage(failure) {
  if (failure.globalErrorType === "load") {
    var prefix = "Error during loading: " + failure.message;
    if (failure.filename) {
      return prefix + " in " + failure.filename + " line " + failure.lineno;
    } else {
      return prefix;
    }
  } else {
    return afterAllMessagePrefix + failure.message;
  }
}

function failureDom(result) {
  var failure = createDom(
    "div",
    { className: "jasmine-spec-detail jasmine-failed" },
    failureDescription(result, stateBuilder.currentParent),
    createDom("div", { className: "jasmine-messages" })
  );
  var messages = failure.childNodes[1];

  for (var i = 0; i < result.failedExpectations.length; i++) {
    var expectation = result.failedExpectations[i];
    messages.appendChild(
      createDom(
        "div",
        { className: "jasmine-result-message" },
        expectation.message
      )
    );
    messages.appendChild(
      createDom("div", { className: "jasmine-stack-trace" }, expectation.stack)
    );
  }

  if (result.failedExpectations.length === 0) {
    messages.appendChild(
      createDom(
        "div",
        { className: "jasmine-result-message" },
        "Spec has no expectations"
      )
    );
  }

  return failure;
}

function failureDescription(result, suite) {
  var wrapper = createDom(
    "div",
    { className: "jasmine-description" },
    createDom(
      "a",
      { title: result.description, href: specHref(result) },
      result.description
    )
  );
  var suiteLink;

  while (suite && suite.parent) {
    wrapper.insertBefore(createTextNode(" > "), wrapper.firstChild);
    suiteLink = createDom(
      "a",
      { href: suiteHref(suite) },
      suite.result.description
    );
    wrapper.insertBefore(suiteLink, wrapper.firstChild);

    suite = suite.parent;
  }

  return wrapper;
}
