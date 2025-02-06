# TransIP Dynamic IP DNS fixer [docker]

The 'TransIP Dynamic IP DNS fixer' checks every minute if your external IP has changed. If the IP has changed, it will
update your desired TransIP DNS records with your current IP address.

## Requirements

In order to run the fixer, you need a TransIP private API key and a `records.json` that contains the DNS records you
desire to upgrade.

### TransIP private API key

On https://www.transip.nl/cp/account/api/ you can create "key pairs". You need to create a key pair for this script to
use. Once you've created a key pair, a private key will be shown. Copy this private key and save it to a `transip.key`
file on your computer.

### DNS records file

To let the fixer know what DNS records you want to upgrade, you need to create a `records.json` file witch contains an
array of the following values:

- domain: your domain name for the DNS record
- name: the DNS record name
- expire: is the "Time To Live" in seconds (300 is recommended)
- type: the DNS record type (A, AAAA, CNAME, MX, TXT, etc.)

The fixer script will update the value of the record to the **current IP address** detected via https://api.ipify.org

```json
[
	{
		"domain": "futureportal.com",
		"name": "@",
		"expire": 300,
		"type": "A"
	},
	{
		"domain": "futureportal.com",
		"name": "server",
		"expire": 300,
		"type": "A"
	}
]
```

## Running the fixer script

There are multiple ways to run the fixer.

### Deno (source files)

Download this repository to your machine. Add the `transip.key` file and `records.json` to the same folder as the
`main.ts` file. Then run `deno run -A main.ts` to run the fixer script.

### Docker

In order to run the fixer via docker, you need to mount your `transip.key` file and `records.json` file to the running
container. You can run the script with the following command:

```shell
docker run -ti \
	--detach \
	--restart unless-stopped \
	--volume ./records.json:/opt/futureportal/transip-dynamic-ip-fixer/records.json \
	--volume ./transip.key:/opt/futureportal/transip-dynamic-ip-fixer/transip.key \
	futureportal/transip-dynamic-ip-fixer:latest
```

### Docker compose

In order to run the fixer via docker compose, you need the following files in the same location:

- `docker-compose.yml`
- `transip.key`
- `records.json`

The docker compose should contain:

```yml
services:
    transip-dynamic-ip-fixer:
        image: futureportal/transip-dynamic-ip-fixer:latest
        restart: unless-stopped
        volumes:
            - ./records.json:/opt/futureportal/transip-dynamic-ip-fixer/records.json
            - ./transip.key:/opt/futureportal/transip-dynamic-ip-fixer/transip.key
```

Run `docker compose up --detach` to start the script.

## Development

Run `./Taskfile` to see the available development commands. You need to have `deno` installed locally.

# Contributors

A big thanks to all the contributors!

![contributor avatars](https://contrib.rocks/image?repo=FuturePortal/transip-dynamic-ip-fixer)
