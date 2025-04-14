#!/bin/bash

pm2 delete 0

echo "Removing existing client directory..."
sudo rm -rf /home/ubuntu/workspace/crew-wiki-next/client
