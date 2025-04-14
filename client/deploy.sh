#!/bin/bash

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

REPOSITORY=/home/ubuntu/workspace/crew-wiki-next/client

cd $REPOSITORY

yarn deploy
