# rebeccas-test-reporter

# Still-Under-Construction

This project is built on the old kara-jasmine-html-reporter.

It is ment to be more configurable and moved to minimum ES6 instead of CommonJS as it looks like it's built with.

## Configuration

present supported config params :

<pre>To hide any tests that did not run ex. when using fit(...) and fdescribe(...)<code>
    suppressExcluded:boolean :: anywhere in root of karma.conf.js
</code></pre>

Ex. under jasmineHtmlReporter config in karma.conf.js

<pre><code>
jasmineHtmlReporter: {
&nbsp;&nbsp;suppressAll: true, // removes the duplicated traces
},
reporterconfigs: {
&nbsp;&nbsp;rebeccas: {
&nbsp;&nbsp;&nbsp;&nbsp;suppressExcluded: true,
&nbsp;&nbsp;},
},
</code></pre>
