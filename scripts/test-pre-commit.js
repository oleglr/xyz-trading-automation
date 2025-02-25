#!/usr/bin/env node

/**
 * Script to test the pre-commit hook
 * This script simulates what happens when a developer tries to commit changes
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const gitRootPath = execSync('git rev-parse --show-toplevel').toString().trim();
const preCommitPath = path.join(gitRootPath, '.git', 'hooks', 'pre-commit');

// Check if the pre-commit hook exists
if (!fs.existsSync(preCommitPath)) {
  console.error('❌ Pre-commit hook not found:', preCommitPath);
  console.error('Run `npm install` to set up the pre-commit hook.');
  process.exit(1);
}

console.log('🧪 Testing pre-commit hook...');
console.log('This will simulate what happens when you try to commit changes.');
console.log('The pre-commit hook should run the build process and check for errors.');
console.log('');

try {
  // Execute the pre-commit hook directly
  execSync(preCommitPath, { stdio: 'inherit' });
  console.log('');
  console.log('✅ Pre-commit hook test passed!');
  console.log('The build process completed successfully.');
} catch (error) {
  console.log('');
  console.error('❌ Pre-commit hook test failed!');
  console.error('The build process encountered errors.');
  console.error('');
  console.error('This is expected behavior if your code has build errors.');
  console.error('Fix the build errors before committing your changes.');
  process.exit(1);
}