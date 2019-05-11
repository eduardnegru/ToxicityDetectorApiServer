#!/bin/bash

docker run -it -p 9000:3000 --volume $(pwd):/app/node_modules -v $(pwd):/app node-docker
