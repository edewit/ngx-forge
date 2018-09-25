#!/bin/bash
set -e -u -o pipefail

declare -r SCRIPT_PATH=$(readlink -f "$0")
declare -r SCRIPT_DIR=$(cd $(dirname "$SCRIPT_PATH") && pwd)

source "$SCRIPT_DIR/common.inc.sh"

validate_config() {
  local ret=0
  validate_test_config OSIO_USERNAME "$OSIO_USERNAME" || ret=1
  validate_test_config OSIO_PASSWORD "$OSIO_PASSWORD" || ret=1

  # NOTE: github login is used by the import codebase test
  # validate_test_config GITHUB_USERNAME "$GITHUB_USERNAME" || ret=1
  # github password is used in the ngx launcher e2e test as a workaround for the
  # git provider requesting 'Log In & Authorize' for the logged in user. That will
  # be gone in the future.
  export GITHUB_PASSWORD=${GITHUB_PASSWORD:-}
  export GITHUB_REPO=${GITHUB_REPO:-}
  export NGX_LAUNCHER_ENABLED=${NGX_LAUNCHER_ENABLED:-false}
  export ZABBIX_ENABLED=${ZABBIX_ENABLED:-false}
  export ZABBIX_HOST=${ZABBIX_HOST:-}
  export ZABBIX_METRIC_PREFIX=${ZABBIX_METRIC_PREFIX:-}
  export CHE_LOCAL_REPOSITORY=${CHE_LOCAL_REPOSITORY:-'../../che-functional-tests'}
  return $ret
}

main() {
  local suite=${1:-$TEST_SUITE}

  validate_config || {
    log.info "Please set test configs and re-run $0"
    exit 1
  }

  # NOTE: DO NOT start webdriver since we are using directConnection to chrome
  # see: http://www.protractortest.org/#/server-setup#connecting-directly-to-browser-drivers

  local direct_connection=true
  if [[ ${USE_WEBDRIVER:-false} == true ]]; then
    direct_connection=false

    log.info "USE_WEBDRIVER set; test may run slow .. checking webdriver status"
    webdriver_running || {
      local log_file="${SCRIPT_DIR}/webdriver.log"
      start_webdriver "$log_file"
      wait_for_webdriver
    }
  else
    log.info "USE_WEBDRIVER is not set or false; using direct connection (faster)"
  fi

  log.info "Running tslint ... "
  npm run tslint || {
    log.warn "tslint -> some rules were violated; fix it and rerun $0"
    exit 1
  }

  log.info "Running tsc ... "
  npm run tsc || {
    log.warn "ts -> js compilation failed; fix it and rerun $0"
    exit 1
  }

  local protractor="$(npm bin)/protractor"

  [[ ${NODE_DEBUG:-false} == true ]] && protractor="node --inspect --debug-brk $protractor"

  # TODO: may be target.url isn't needed at all since baseUrl can be set
  # using --baseUrl

  # NOTE: do NOT quote $protractor as we want spaces to be interpreted as
  # seperate arguments
  DIRECT_CONNECTION=${direct_connection} $protractor --baseUrl "$OSIO_URL" \
    target/ts-output/protractor.config.js \
    --suite "${suite}" \
    --params.login.user="$OSIO_USERNAME" \
    --params.login.password="$OSIO_PASSWORD" \
    --params.github.username="$GITHUB_USERNAME" \
    --params.github.password="$GITHUB_PASSWORD" \
    --params.github.repo="$GITHUB_REPO" \
    --params.oso.username="$OSO_USERNAME" \
    --params.target.url="$OSIO_URL" \
    --params.quickstart.name="$QUICKSTART_NAME" \
    --params.release.strategy="$RELEASE_STRATEGY" \
    --params.ngx_launcher.enabled="$NGX_LAUNCHER_ENABLED" \
    --params.reset.environment="$RESET_ENVIRONMENT" \
    --params.feature.level="$FEATURE_LEVEL" \
    --params.che.local.repo="$CHE_LOCAL_REPOSITORY" \
    --params.zabbix.enabled="$ZABBIX_ENABLED" \
    --params.zabbix.host="$ZABBIX_HOST" \
    --params.zabbix.metric.prefix="$ZABBIX_METRIC_PREFIX"
  return $?
}

main "$@"
