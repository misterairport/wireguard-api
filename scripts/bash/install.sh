#!/bin/bash

if [ -e /etc/centos-release ]; then
  DISTRO="CentOS"
elif [ -e /etc/debian_version ]; then
  DISTRO=$( lsb_release -is )
else
  echo "Your distribution is not supported (yet)"
  exit
fi

if [ "$( systemd-detect-virt )" == "openvz" ]; then
  echo "OpenVZ virtualization is not supported"
  exit
fi