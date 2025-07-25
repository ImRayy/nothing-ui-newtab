![repo-size](https://img.shields.io/github/repo-size/ImRayy/nothing-ui-newtab?style=for-the-badge&logo=github&color=C9CBFF&logoColor=D9E0EE&labelColor=302D41)
![size](https://img.shields.io/github/languages/code-size/ImRayy/nothing-ui-newtab?style=for-the-badge&logo=gnu-bash&color=ee999f&logoColor=D9E0EE&labelColor=302D41)
![last-commit](https://img.shields.io/github/last-commit/ImRayy/nothing-ui-newtab?style=for-the-badge&logo=git&color=8bd5ca&logoColor=D9E0EE&labelColor=302D41)

<div align="center">
<img src="https://ik.imagekit.io/rayshold/projects/nothing-ui-new-tab/banner.png?updatedAt=1735063786358" alt="banner"/> 
<hr/>

<p>Nothing UI New Tab is an elegant and feature-rich start page for your browser, heavily inspired by <a href="https://github.com/XengShi/materialYouNewTab" target="_blank">Material You NewTab</a>. Designed with customization and user experience in mind, it transforms your new tab page into a personalized dashboard that caters to your needs and preferences.</p>

**[<kbd> <br> Features <br> </kbd>](#features)**
**[<kbd> <br> Installation <br> </kbd>](#installation)**
**[<kbd> <br> License <br> </kbd>][License]**

[License]: "https://github.com/ImRayy/nothing-ui-new-tab/blob/main/LICENSE"
</div>

## Screenshots
|![ss-08](https://ik.imagekit.io/rayshold/projects/nothing-ui-new-tab/screenshot-08.png?updatedAt=1735060634920&tr=w-1389%2Ch-692%2Cfo-custom%2Ccm-extract)|
|--|

|![ss-01](https://ik.imagekit.io/rayshold/projects/nothing-ui-new-tab/screenshot-02.png)|![ss-03](https://ik.imagekit.io/rayshold/projects/nothing-ui-new-tab/screenshot-03.png)|![ss-04](https://ik.imagekit.io/rayshold/projects/nothing-ui-new-tab/screenshot-04.png)|
|---|---|---|

|![ss-05](https://ik.imagekit.io/rayshold/projects/nothing-ui-new-tab/screenshot-05.png)|![ss-06](https://ik.imagekit.io/rayshold/projects/nothing-ui-new-tab/screenshot-06.png)|![ss-07](https://ik.imagekit.io/rayshold/projects/nothing-ui-new-tab/screenshot-07.png)|
|---|---|---|

## Features

- Create, Update & Remove app
- Dynamic app icon upon adding
- Custom icon from [iconify](https://icon-sets.iconify.design/)
- Custom images for gallery widget, and custom bg image
- Toggle monochrome(grayscale) image on gallery widget, and background
- Toggle blur effect background image
- Toggle dock, app drawer, ai-tools, greeter
- Toggle between digital & analogue clock
- Weather ofc, necessary
- Custom greeting text
- Add search engines, set icon
- Set shortcut for search engine to quick switching
- Search suggestions
- Offline support

**Planned Features** 
- [ ] Random image from unsplash or something
- [ ] Different color-schems
- [ ] Glass widgets
- [ ] Popup to add websites directly to app drawer, dock

...more unplanned features

## Installation

**Requirements**

- `bun`
- `podman` or `docker` *(optional)*

**Build** 

1. `git clone https://github.com/ImRayy/nothing-ui-newtab`
2. `cd nothing-ui-newtab`
3. `bun install`
4. `bun run build`

**NOTE:** You can build [docker/podman image as well](#step-1) 

## Usage

#### Firefox extension

There are multiple ways to use this as a Firefox extension. The first and easiest method is to host this website on a hosting provider and use [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override) to set it as your new tab page. My preferred method is to use this as docker/podman image and start with systemd or add it to init script or something to start when system boots automatically

> [!TIP]
> When using New Tab Override extension make sure you check `Set focus to the web page instead of the address bar` option

##### Clone & Build

```sh
git clone https://github.com/ImRayy/nothing-ui-newtab
cd nothing-ui-newtab

## Podman
podman build -t nothing-ui-newtab .

## Docker 
docker build -t nothing-ui-newtab .
```
---

##### Run

```bash
## Podman
podman run -d -p <your-desired-port>:4173 nothing-ui-newtab 

## Docker
docker run -d -p <your-desired-port>:4173 nothingui-newtab:latest
```
---

##### Autostart (Podman) [rootless] 

###### Legacy Systemd Medhod

```bash
## Generate systemd service
podman generate systemd --new --name <container-id> > ~/.config/systemd/user/nothing-ui-newtab.service

## Restart systemd daemon which will reload and re-execute the systemd
## user instance without stopping the currently running services
systemctl --user daemon-reload

## Enable & start container service that you just created
systemctl --user enable nothing-ui-newtab.service --now
```

###### Quadlet Systemd Method [recommended]

1. Copy following content in `nothing-ui-newtab.container` and move to `~/.config/containers/systemd`
```container
[Unit]
Description=Nothing UI New Tab
After=graphical-session.target

[Container]
Image=localhost/nothing-ui-newtab ## Could be something else, check with `podman container ls`
PublishPort=<your-desired-port>:4173
```
2. `systemctl --user daemon-reload`
3. `systemctl --user enable nothing-ui-newtab.service --now`

---

##### Autostart (docker) [rootless]

```bash
docker run --restart unless-stopped -d -p <your-desired-port>:4173 nothingui-newtab:latest
```

___

#### Chrome/Chromium-based Extension

1. [Install & build](#installation)
2. Click on extension icon somewhere in top right corner, click on extension button > `Manage extensions` > enable `Developer Mode`  > `Load Unpacked` > Select nothing-ui-newtab/dist
