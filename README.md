# StatsMonitor
### Monitor your Linux Server or PC's statistics

## Get Started
First, you will need a machine to install this on. I have only tested on Ubuntu Server 24.04 & Kubuntu 25.04. This may work on Windows, but it has not been tested.

Next, you will need to install NodeJS and NPM via `sudo apt install nodejs`. I tried with nvm and could not get it working with the systemd service.

Once NodeJS is installed, clone this repository via `git clone https://github.com/Cartyoo/StatsMonitor`.

Then, install all the dependencies via `npm install`

If nessecary, change the port at the bottom of `server.js` to your liking. I recommend firewalling this port to only allow connections from your IP address if you are installing this on a publicly accessable machine.

You will need to change the `SERVER_URL` value near the start of the body in `index.html` to your server's IP. Using localhost will not work if you are trying to access this externally; you will need to put the public IP.

Now, you can start the application with `node server.js` and visit it in your browser on the port specified in the logs when running the server (default is 9264.)

## Sending Notifications
You can send notifications via CURL with the following command: `curl -X POST http://127.0.0.1:9264/notify -H "Content-Type: application/json" -d '{"title":"this is a notification","message":"hello world","priority":5}'`

## Systemd Service
The Systemd service allows the server to always be running in the background.

You can add it by creating the file at `/etc/systemd/system/stats.service` with the contents:
### TIP: Make sure to change the ExecStart and WorkingDirectory values!

```
[Unit]
Description=StatsMonitor Server
After=network.target

[Service]
ExecStart=/usr/bin/node /var/www/stats/server.js
WorkingDirectory=/var/www/stats
Restart=always
User=www-data
Group=www-data
Environment=NODE_ENV=production
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=stats

[Install]
WantedBy=multi-user.target
```

## Running in fullscreen on an Apple Device
If you want to run this on an Apple Device, ex. iPhone, you can by following the steps below (I am running the iOS 26 Developer Beta; steps may vary):

First, visit your website in Safari, then follow as below.

<img src="https://github.com/user-attachments/assets/145902e8-9d64-4efd-a64c-f3784587bbe3" width="300"/>
<img src="https://github.com/user-attachments/assets/d8b6c851-7f1f-4e21-82ec-212df510a8d0" width="300"/>
<img src="https://github.com/user-attachments/assets/a45c8123-ad62-44f3-9b42-e2af8f94e639" width="300"/>


## Pictures

<img src="https://github.com/user-attachments/assets/79e21508-988a-47af-9c3a-27b5967edc58" width="700"/>
<img src="https://github.com/user-attachments/assets/e8da7c24-0101-40f4-819b-c0ffc17b7c1e" width="500"/>

## Issues? Questions?
Feel free to make an issue on this repository or add me on discord @`herbert__`

## Notice
This code is 100% ChatGPT, so don't expect it to work perfectly.

This is inspired by and based off of [this project](https://github.com/imlayered/DokployPi), I just had ChatGPT convert it to JavaScript and modify/add features.
