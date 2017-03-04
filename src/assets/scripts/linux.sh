#!/usr/bin/env bash

# add a new user group for hosts editing
groupadd hozz
usermod -a -G hozz root
usermod -a -G hozz $1
chgrp hozz /etc/hosts
chmod g+w /etc/hosts