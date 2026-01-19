{ pkgs, ... }: {

  # ... otras configuraciones ...

  packages = [
    pkgs.nodejs_20 # O la versión que uses
    # Dependencias requeridas por Puppeteer/Chromium
    pkgs.glib
    pkgs.nss
    pkgs.nspr
    pkgs.expat
    pkgs.atk
    pkgs.at-spi2-atk
    pkgs.at-spi2-core
    pkgs.cups
    pkgs.dbus
    pkgs.dbus-glib
    pkgs.gdk-pixbuf
    pkgs.gtk3
    pkgs.libdrm
    pkgs.mesa
    pkgs.alsa-lib
    pkgs.pango
    pkgs.cairo
    pkgs.xorg.libX11
    pkgs.xorg.libXcomposite
    pkgs.xorg.libXdamage
    pkgs.xorg.libXext
    pkgs.xorg.libXfixes
    pkgs.xorg.libXrandr
    pkgs.xorg.libxcb
    pkgs.libxkbcommon
  ];

  # Configuración opcional para asegurar que Puppeteer encuentre las librerías
  env = {
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "false"; 
  };
}