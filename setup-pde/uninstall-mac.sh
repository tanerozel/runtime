#!/bin/bash
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
cd ..
basePath=$(pwd [-LP])

echo -e "${GREEN}Deleting services...${NC}"
launchctl remove io.primeapps.postgres.pre
launchctl remove io.primeapps.postgres.pde
launchctl remove io.primeapps.postgres.pre-test
launchctl remove io.primeapps.minio.pre
launchctl remove io.primeapps.minio.pde
launchctl remove io.primeapps.minio.pre-test
launchctl remove io.primeapps.redis.pre
launchctl remove io.primeapps.redis.pde
launchctl remove io.primeapps.redis.pre-test
launchctl remove io.primeapps.gitea.pde

echo -e "${GREEN}Deleting $basePath/data...${NC}"
rm -rf "$basePath/data"

echo -e "${GREEN}Deleting $basePath/programs...${NC}"
rm -rf "$basePath/programs"

echo -e "${BLUE}Completed${NC}"