# rebeccas-test-reporter

This project is built on the old kara-jasmine-html-reporter.

It is ment to be more configurable and moved to minimum ES6 instead of CommonJS as it looks like it's built with.

## Configuration

present supported config params :

suppressExcluded:boolean :: anywhere in root of karma.conf.js

Ex. under jasmineHtmlReporter config in karma.conf.js

<pre><code>
jasmineHtmlReporter: {
&nbsp;&nbsp;suppressExcluded: true,
},
reporterconfigs: {
&nbsp;&nbsp;rebeccas: {
&nbsp;&nbsp;&nbsp;&nbsp;suppressExcluded: true,
&nbsp;&nbsp;},
},
</code></pre>
