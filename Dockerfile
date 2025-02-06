FROM denoland/deno:latest AS base

WORKDIR /opt/futureportal/transip-dynamic-ip-fixer

COPY . /opt/futureportal/transip-dynamic-ip-fixer

CMD ["run", "-A", "main.ts"]
