# Hozz
#### A Better Way to Manage Your Hosts. [Homepage](http://ppoffice.github.io/Hozz)
![](https://ooo.0o0.ooo/2016/01/01/56868691bd272.png)
---

## Features
* Provide swift switch between different hosts files
* Automatic update of online hosts
* Import hosts file by dragging them into the sidebar
* Export and import hosts files
* Support hosts sorting through dragging
* Export hosts file to [Surge](https://surge.run/manual/) config file

## Known Issues
* Hosts will not save on sidebar status switch/edit button clicking
* Wrong window height/width when maximized on Windows
* Window get ghost shadows sometimes on OS X
* Get black background on startup on Linux due to graphics issues ([Electron#2170](https://github.com/atom/electron/issues/2170)), and this will soon disappear
* If the tray icon does not appears on Linux, you need to install `libappindicator1` according to [Electron#1347](https://github.com/atom/electron/issues/1347)

## Development

### Requirements:

* Node.js
* Gulp

### Get the code:
```
git clone https://github.com/ppoffice/Hozz.git
cd Hozz
npm install
```

### Commands:

* **gulp**: Compile, build and copy files to /app
* **gulp clean**: Delete the built files, including /app and /build
* **gulp watch**: Watch the /src directory and automatically build on file change
* **gulp package**: Pack with Electron for releasing, need to run **gulp clean** before this
* **gulp package-x32**: Pack ia32 files on x64 systems, this doesn't apply to **OS X**

## Todos
- [x] Multilanguage support
- [ ] Manifest and hosts sync based on cloud services
- [ ] Better text searching and editing experience
