#!/bin/bash
set -e

COMPOSE_FILE="docker-compose.dev.yml"

case "$1" in
	start)
		echo "Building and starting containers..."
		sudo docker compose -f "$COMPOSE_FILE" up --build -d
		;;
	stop)
		echo "Stopping containers..."
		sudo docker compose -f "$COMPOSE_FILE" down
		;;
	*)
		echo "Usage: $0 {start|stop}"
		exit 1
		;;
esac
