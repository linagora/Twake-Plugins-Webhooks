# Twake-Plugins-Webhooks

Webhooks plugin for Twake

### Install

```
sudo docker build -t giphy .
sudo docker run \
  --restart unless-stopped \
  -dp 3001:3001 \
  -e SERVER_PORT=3001 \
  -e SERVER_PREFIX='/plugins/giphy' \
  -e SERVER_ORIGIN='https://plugin-server.com'
  -e CREDENTIALS_ENDPOINT='https://canary.twake.app' \
  -e CREDENTIALS_ID='abcdef' \
  -e CREDENTIALS_SECRET='some-twake-application-secret' \
  giphy
```
