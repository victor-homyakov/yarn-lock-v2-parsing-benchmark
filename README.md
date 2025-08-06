# Yarn.lock Parsing Benchmark

This directory contains a benchmark to compare the performance of various libraries for parsing Yarn v2+ lockfile (SYML) format.

## Setup

Install the required dependencies:

```bash
npm install
```

## Usage

Run the benchmark with the default number of iterations (100):

```bash
npm run bench
```

To customize the number of iterations, set the `ITERATIONS` environment variable:

```bash
ITERATIONS=1000 npm run bench
```

The following parsers are measured:
- `@yarnpkg/parsers` (official Yarn v2+ SYML parser)
- `js-yaml` (generic YAML parser)
- `snyk-nodejs-lockfile-parser` (Snyk’s Yarn v2+ lockfile parser)

The output reports the minimal and median parse time per iteration for each parser.

## Results

```
Iterations: 100
@yarnpkg/parsers@3.0.3:                 min  9.145 ms, median  9.475 ms
js-yaml@4.1.0:                          min 11.264 ms, median 12.163 ms
snyk-nodejs-lockfile-parser@2.2.2:      min 15.275 ms, median 16.678 ms
```
