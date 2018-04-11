#!/bin/bash

# Show command before executing
set -x

# Exit on error
set -e

yum -y update
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
yum -y install nodejs

function run_tests_and_build() {
  # install dependencies
  npm install

  if [ $? -eq 0 ]; then
    echo 'CICO: npm install OK'
  else
    echo 'CICO: npm install FAIL'
    exit 1
  fi

  # run unit tests
  npm run test:unit

  if [ $? -eq 0 ]; then
    echo 'CICO: unit tests OK'
  else
    echo 'CICO: unit tests FAIL'
    exit 1
  fi

  # run build
  npm run build

  if [ $? -eq 0 ]; then
    echo 'CICO: build OK'
  else
    echo 'CICO: build FAIL'
    exit 1
  fi
}

run_tests_and_build;
