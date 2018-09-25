debug.print_callstack() {
  # callstack to skip
  local skip=${1:-0}

  local i=0;
  local cs_frames=${#BASH_LINENO[@]}

  echo ===================================================
  echo Traceback ...
  for (( i = cs_frames - 2; i >= $skip; i-- )); do
    local cs_file=${BASH_SOURCE[i+1]}
    local cs_fn=${FUNCNAME[i+1]}
    local cs_line=${BASH_LINENO[i]}

    echo '  File "'"$cs_file"'" line ' $cs_line, in "$cs_fn"
    # extract the line from the file
    sed -n "${cs_line}{s/^/    /;p}" "$cs_file"
  done
  echo --------------------------------------------------
}

### on_exit helper ###

declare -a __on_exit_handlers=()
declare -i __script_exit_code=0



# on_exit_handler <exit-value>
_on_exit_handler() {

  local cleanup_count=${#__on_exit_handlers[@]}
  log.debug "Cleanup handlers: ${#__on_exit_handlers[@]}: [ ${__on_exit_handlers[*]} ]"
  [[ $cleanup_count == 0 ]] && return 0

  # store the script exit code to be used later by handlers
  __script_exit_code=${1:-0}

  echo -e "$BLUE  ------------------------------------------ $RESET"
  for cmd in "${__on_exit_handlers[@]}" ; do
    log.info "    running: $cmd"
    # run commands in a subshell so that the failures can be ignored
    ( eval "$cmd" ) || {

      local cmd_exit_code=$?
      local cmd_type=$(type -t "$cmd")
      log.warn " $cmd_type: $cmd - FAILED with exit code: $cmd_exit_code"

    }
  done
}

script.on_exit() {
  local cmd=""

  # quote arguments with spaces in them
  local -r whitespaces=" |'"
  for arg in "$@"; do
    if [[ "$arg" =~ $whitespaces ]]; then
      cmd="$cmd '$arg'"
    else
      cmd="$cmd $arg"
    fi
  done

  local n=${#__on_exit_handlers[*]}
  if [[ $n -eq 0 ]]; then
    # install exit_handler on first on_exit invokation
    trap '_on_exit_handler $?' EXIT
    __on_exit_handlers=("$cmd")
  else
    # insert at the front of the list so that execution happens in reverse
    # i.e. the last on_exit is first executed
    __on_exit_handlers=("$cmd" "${__on_exit_handlers[@]}")
  fi
  log.debug "  ... adding cleanup handlers (${#__on_exit_handlers[@]}): [ ${__on_exit_handlers[*]} ]"
}

### show callstack on bad exit ###
_show_callstack(){
  [[ "$1" != 0 ]] && debug.print_callstack 2
  return 0
}

script.show_callstack_on_bad_exit() {
  trap '_show_callstack $?' EXIT
}
