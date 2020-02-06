# Wireguard® API admin
The codebase is currently under heavy development, use it at your own risk!

Manage your Wireguard® servers through HTTP requests

Currently supported OS: Ubuntu

## Before you start
Make sure UDP:6666 and TCP:8080 are both free on your server.

## Install
First install wireguard
```console
$ apt-get install software-properties-common -y
$ add-apt-repository ppa:wireguard/wireguard -y
$ apt update
$ apt install linux-headers-$(uname -r) wireguard qrencode iptables-persistent -y
```
Then install wireguard-api
```console
$ npm i -g wireguard-api
```

## Setup
```console
$ wireguard-api setup
```

## Run
```console
$ wireguard-api run
```

## Manage
1. Open http://your_server_ip:8080 or http://localhost:8080
2. Enter username and password for first-time login.
3. Done!

### Configuration
1. For DNS server: change server.dns
2. For retrieving IP address of the server: please refer to https://github.com/major/icanhaz
```
{
  "server.dns": "1.1.1.1",
  "server.ipv4.checkip.host": "https://ipv4.icanhazip.com",
  "server.ipv6.checkip.host": "https://ipv6.icanhazip.com",
  ...
}
```
