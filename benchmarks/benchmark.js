#!/usr/bin/env node

/**
 * Benchmark to compare the performance of popular Yarn.lock parsing libraries.
 */

const fs = require("fs");
const path = require("path");

let parseV2;
try {
  // Yarn v2+ lockfile parser (syml format)
  ({ parseSyml: parseV2 } = require("@yarnpkg/parsers"));
} catch (err) {
  console.error('Missing dependency "@yarnpkg/parsers". Run `npm install` first.');
  process.exit(1);
}

let jsYaml;
try {
  // Generic YAML parser for experimental comparison
  jsYaml = require("js-yaml");
} catch (err) {
  console.error('Missing dependency "js-yaml". Run `npm install` first.');
  process.exit(1);
}

let snykParserV2;
try {
  // Snyk lockfile parser (Yarn v2+)
  ({ parseYarnLockV2Project: snykParserV2 } = require("snyk-nodejs-lockfile-parser"));
  const x = require("snyk-nodejs-lockfile-parser");
} catch (err) {
  console.error('Missing dependency "snyk-nodejs-lockfile-parser". Run `npm install` first.');
  process.exit(1);
}

const filePath = path.resolve(__dirname, "../in/yarn.lock");
const raw = fs.readFileSync(filePath, "utf8");
const ITERATIONS = parseInt(process.env.ITERATIONS, 10) || 100;

async function bench(name, fn) {
  // Warm-up iterations
  for (let i = 0; i < 10; i++) {
    const res = fn();
    if (res instanceof Promise) await res;
  }

  // Record individual iteration times
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const t0 = process.hrtime.bigint();
    const res = fn();
    if (res instanceof Promise) await res;
    const t1 = process.hrtime.bigint();
    times.push(Number(t1 - t0) / 1e6);
  }

  // Compute minimal and median times
  times.sort((a, b) => a - b);
  const min = times[0];
  const median = times[Math.floor(times.length / 2)];
  console.log(`${name}:\tmin ${min.toFixed(3)} ms, median ${median.toFixed(3)} ms`);
}

// Run all benchmarks sequentially
(async () => {
  console.log(`Benchmarking parsing of ${filePath}`);
  console.log(`Iterations: ${ITERATIONS}`);

  try {
    await bench("@yarnpkg/parsers", () => parseV2(raw));
  } catch (err) {
    console.error(`@yarnpkg/parsers parser failed: ${err.message}`);
  }

  try {
    await bench("js-yaml", () => jsYaml.load(raw));
  } catch (err) {
    console.error(`js-yaml parser failed: ${err.message}`);
  }

  try {
    await bench("snyk-nodejs-lockfile-parser", () => snykParserV2("{}", raw, {}));
  } catch (err) {
    console.error(`snyk-nodejs-lockfile-parser failed: ${err.message}`);
  }
})();
