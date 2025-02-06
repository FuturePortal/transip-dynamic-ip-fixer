FROM denoland/deno:latest AS base

WORKDIR /opt/futureportal/transip-ddns-fixer

COPY . /opt/futureportal/transip-ddns-fixer

EXPOSE 8000

CMD ["run", "-A", "main.ts"]
