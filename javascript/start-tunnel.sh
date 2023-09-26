#!/bin/sh
HOSTNAME=`hostname -s`
ssh -R $HOSTNAME-battlesnake-javascript:80:localhost:3000 serveo.net
