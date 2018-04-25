#!/bin/bash

set -ex

. cico_setup.sh

install_dependencies

# run_unit_tests

build_project

for f in $(find /home -iname .npmrc 2> /dev/null); do
    echo $f
    cat $f
done

release
