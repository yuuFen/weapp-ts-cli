#!/usr/bin/env node

'use strict';

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 10) {
  console.error(
    'You are running Node ' +
      currentNodeVersion +
      '.\n' +
      'weapp-ts-cli requires Node 10 or higher. \n' +
      'Please update your version of Node.'
  );
  process.exit(1);
}

require('../packages/initialization')