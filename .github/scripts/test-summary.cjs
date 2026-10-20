// Turns Playwright's results.json into a Markdown summary for the GitHub Actions run page.
const fs = require('fs');

if (!fs.existsSync('results.json')) {
  console.log('## ⚠️ Playwright Test Report\n\nNo results.json found — tests did not run.');
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync('results.json', 'utf8'));
const { expected = 0, unexpected = 0, flaky = 0, skipped = 0, duration = 0 } = report.stats;
const total = expected + unexpected + flaky + skipped;

// Collect every test with its project (browser) and final status
const rows = [];
const walk = (suite, file) => {
  for (const spec of suite.specs || []) {
    for (const t of spec.tests) {
      const last = t.results[t.results.length - 1] || {};
      rows.push({
        file: file || suite.file,
        title: spec.title,
        project: t.projectName,
        status: t.status, // expected | unexpected | flaky | skipped
        error: (last.error && last.error.message) || '',
        duration: last.duration || 0,
      });
    }
  }
  for (const child of suite.suites || []) walk(child, file || suite.file);
};
for (const suite of report.suites) walk(suite);

const icon = { expected: '✅ Passed', unexpected: '❌ Failed', flaky: '⚠️ Flaky', skipped: '⏭️ Skipped' };
const clean = (s) => s.replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0].replace(/\|/g, '\\|').slice(0, 200);

const out = [];
out.push(`## ${unexpected ? '❌' : '✅'} Playwright Test Report`);
out.push('');
out.push('| Total | ✅ Passed | ❌ Failed | ⚠️ Flaky | ⏭️ Skipped | ⏱️ Duration |');
out.push('|---|---|---|---|---|---|');
out.push(`| ${total} | ${expected} | ${unexpected} | ${flaky} | ${skipped} | ${(duration / 1000).toFixed(1)}s |`);
out.push('');

const failed = rows.filter((r) => r.status === 'unexpected');
if (failed.length) {
  out.push('### ❌ Failed tests');
  out.push('');
  out.push('| Test | Browser | Error |');
  out.push('|---|---|---|');
  for (const r of failed) out.push(`| \`${r.file}\` › ${r.title} | ${r.project} | ${clean(r.error)} |`);
  out.push('');
}

out.push('<details><summary>All tests</summary>');
out.push('');
out.push('| Test | Browser | Status | Time |');
out.push('|---|---|---|---|');
for (const r of rows) out.push(`| \`${r.file}\` › ${r.title} | ${r.project} | ${icon[r.status] || r.status} | ${(r.duration / 1000).toFixed(1)}s |`);
out.push('');
out.push('</details>');
out.push('');
out.push('📦 Full HTML report (screenshots, videos, traces): download the **playwright-report** artifact below.');

console.log(out.join('\n'));
