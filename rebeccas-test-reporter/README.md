# rebeccas-test-reporter

# Still-Under-Construction

This project is built on the old kara-jasmine-html-reporter.

It is ment to be more configurable and moved to minimum ES6 instead of CommonJS as it looks like it's built with.

## Installation

<pre><code>
npm install karma-jasmine-html-reporter --save-dev
</code></pre>

## Configuration

### present supported config params :

<p>To hide any tests that did not run ex. when using fit(...) and fdescribe(...)
<pre><code>
reporterconfigs: {
    rebeccas: {
        suppressExcluded: true,
    },
}</code></pre>
anywhere in root of karma.conf.js

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
</p>

### For more information read on :

<p>
<a id="user-content-develop" class="anchor" aria-hidden="true" href="https://github.com/dfederm/karma-jasmine-html-reporter#readme">karma-jasmine-html-reporter</a>
</p>
