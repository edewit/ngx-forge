#!/bin/bash
set -euo pipefail

declare -r temp_dir=${TEMP_DIR:-$(mktemp -d)}
declare USER_NAME=${USER_NAME:-"ijarif-test-preview"}
declare FABRIC8_WIT_API_URL=${FABRIC8_WIT_API_URL:-"https://api.prod-preview.openshift.io"}

cleanup() {
  for key in EE_TEST_USERNAME EE_TEST_PASSWORD; do
    unset "$key";
  done

  # Remove fabric8-test repo
  rm -rf $temp_dir
}

# Exit handler
trap cleanup EXIT

log() {
  echo
  echo -e "\e[93m============================================================"
  echo $1
  echo -e "============================================================\e[0m"
}

run_tests() {
  log "Running Launcher Functional Tests"
  # BASE_URL=$BASE_URL AUTH_TOKEN=$TOKEN REFRESH_TOKEN=$OFFLINE_TOKEN ./run.sh
  ./run.sh
}

# setup_environment() {
#   log "Setting up required environment variables"
#   eval $(cat launch_info_dump_getting_started.json | ./json2env)
# }

# Make sure required variables are set
validate_env() {
  err=''
  if [[ -z ${FABRIC8_WIT_API_URL+x} ]]; then
    err="$err\nFABRIC8_WIT_API_URL not set. Please set the variable and try again."
  fi
  if [[ -z ${USERNAME+x} ]]; then
    err="$err\nUSERNAME not set. Please set the variable and try again."
  fi
  # if [[ -z ${REFRESH_TOKEN+x} ]]; then
  #   err="$err\nREFRESH_TOKEN not set. Please set the variable and try again."
  # fi

  if [[ $err ]]; then
    echo -e "\e[31m=============================================================="
    printf "$err\n"
    echo -e "==============================================================\e[0m"
    exit
  fi
}

main() {
  SCRIPT_DIR=$(cd $(dirname "$0") && pwd)
  validate_env
  # clone_fabric8_test
  # generate_db
  # setup_environment
  cd $SCRIPT_DIR
  run_tests
}

main "@$"