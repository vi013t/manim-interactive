BUNDLER=bun

build:
	$(BUNDLER) run tauri build

dev:
	$(BUNDLER) run tauri dev

build-aur: 
	ifeq ($(OS),Windows_NT)
		echo "Building for Linux can only be done on Linux"
	else
		$(MAKE) build
		makepkg --printsrcinfo > .SRCINFO
	endif

build-debian: build

build-windows:
	ifeq ($(OS),Windows_NT)
		$(MAKE) build
	else
		echo "Building for Windows can only be done on a Windows machine"
	endif
