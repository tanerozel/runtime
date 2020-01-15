#!/bin/bash
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

cd ..

# Variables
basePath=$(pwd [-LP])
filePostgres="http://get.enterprisedb.com/postgresql/postgresql-12.1-1-osx-binaries.zip"
fileMinio="https://dl.min.io/server/minio/release/darwin-amd64/minio"
fileRedis="https://github.com/fatihsever/redis-mac/archive/5.0.7.zip"
postgresLocale="en_US"
postgresPath="$basePath/programs/pgsql/bin"
programsPath="$basePath/programs"
programsPathEscape=${programsPath//\//\\/}
dataPath="$basePath/data"
dataPathEscape=${dataPath//\//\\/}
user=$(id -un)

# Create programs directory
mkdir programs
cd programs

# Install PostgreSQL
echo -e "${GREEN}Downloading PostgreSQL...${NC}"
curl $filePostgres -L --output postgres.zip
unzip postgres.zip
rm postgres.zip

# Install Minio
cd "$basePath/programs"
mkdir minio
cd minio
echo -e "${GREEN}Downloading Minio...${NC}"
curl $fileMinio -L --output minio
chmod 777 minio

# Install Redis
cd "$basePath/programs"
echo -e "${GREEN}Downloading Redis...${NC}"
curl $fileRedis -L --output redis.zip
unzip redis.zip
rm redis.zip
mv redis-mac-5.0.7 redis
cd redis
chmod 777 redis-server

# Init database instances
cd $postgresPath
echo -e "${GREEN}Initializing database instances...${NC}"
./initdb -D "$basePath/data/pgsql_pre" --no-locale --encoding=UTF8

# Register database instances
echo -e "${GREEN}Registering database instances...${NC}"

cp "$basePath/setup/plist/postgres-pre.plist" postgres-pre.plist
sed -i -e "s/{{DATA}}/$dataPathEscape/" postgres-pre.plist
sed -i -e "s/{{PROGRAMS}}/$programsPathEscape/" postgres-pre.plist
launchctl load postgres-pre.plist
cp postgres-pre.plist ~/Library/LaunchAgents/

sleep 3 # Sleep 3 seconds for postgres services wakeup

# Create postgres role
echo -e "${GREEN}Creating postgres role for database instances...${NC}"
./psql -d postgres -p 5436 -c "CREATE ROLE postgres SUPERUSER CREATEDB CREATEROLE LOGIN REPLICATION BYPASSRLS;"

# Create databases
echo -e "${GREEN}Creating databases...${NC}"
./createdb -h localhost -U postgres -p 5436 --template=template0 --encoding=UTF8 --lc-ctype=$postgresLocale --lc-collate=$postgresLocale auth
./createdb -h localhost -U postgres -p 5436 --template=template0 --encoding=UTF8 --lc-ctype=$postgresLocale --lc-collate=$postgresLocale platform

# Restore databases
echo -e "${GREEN}Restoring databases...${NC}"
./pg_restore -h localhost -U postgres -p 5436 --no-owner --role=postgres -Fc -d auth "$basePath/database/auth.bak"
./pg_restore -h localhost -U postgres -p 5436 --no-owner --role=postgres -Fc -d platform "$basePath/database/platform.bak"

# Init storage instances
echo -e "${GREEN}Initializing storage instances...${NC}"
cd "$basePath/programs/minio"

cp "$basePath/setup/plist/minio-pre.plist" minio-pre.plist
sed -i -e "s/{{DATA}}/$dataPathEscape/" minio-pre.plist
sed -i -e "s/{{PROGRAMS}}/$programsPathEscape/" minio-pre.plist
launchctl load minio-pre.plist
cp minio-pre.plist ~/Library/LaunchAgents/

# Init cache instance
echo -e "${GREEN}Initializing cache instances...${NC}"
cd "$basePath/programs/redis"

mkdir "$basePath/data/redis_pre"
cp redis.conf "$basePath/data/redis_pre/redis.conf"

cp "$basePath/setup/plist/redis-pre.plist" redis-pre.plist
sed -i -e "s/{{DATA}}/$dataPathEscape/" redis-pre.plist
sed -i -e "s/{{PROGRAMS}}/$programsPathEscape/" redis-pre.plist
launchctl load redis-pre.plist
cp redis-pre.plist ~/Library/LaunchAgents/

# Create directory for dump, package, git, etc.
mkdir "$basePath/data/primeapps"

sleep 3 # Sleep 3 seconds for write database before backup

# Backup
echo -e "${GREEN}Compressing data folders...${NC}"
cd "$basePath/data"
tar -czf pgsql_pre.tar.gz pgsql_pre
tar -czf minio_pre.tar.gz minio_pre
tar -czf redis_pre.tar.gz redis_pre

echo -e "${BLUE}Completed${NC}"