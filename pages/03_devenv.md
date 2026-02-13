# devenv

- Fokus auf Bereitstellung von Entwicklungsumgebungen
- sinnvolle Defaults

---
layout: two-cols-header
---

## Setup

::left::

```shell
$ devenv init
Creating devenv.nix
Creating devenv.yaml
Creating .envrc
Creating .gitignore
direnv: loading /private/tmp/x/.envrc
direnv: using devenv
✓ Building shell in 167s
hello from devenv
git version 2.52.0
```

::right::

```shell
$ ls -al
drwxr-xr-x    - user 12 Feb 12:07  .devenv
drwxr-xr-x    - user 12 Feb 12:05  .direnv
.rw-r--r--  21k user 12 Feb 12:05  .devenv.flake.nix
.rw-r--r--  296 user 12 Feb 12:05  .envrc
.rw-r--r--  109 user 12 Feb 12:05 󰊢 .gitignore
.rw-r--r-- 2.9k user 12 Feb 12:05  devenv.lock
.rw-r--r-- 1.0k user 12 Feb 12:05  devenv.nix
.rw-r--r--  410 user 12 Feb 12:05  devenv.yaml
```

---

## Setup

```nix [devenv.nix ~i-vscode-icons:file-type-nix~] {all}{maxHeight:'95%'}
{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "devenv";

  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  # languages.rust.enable = true;

  # https://devenv.sh/processes/
  # processes.dev.exec = "${lib.getExe pkgs.watchexec} -n -- ls -la";

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts.hello.exec = ''
    echo hello from $GREET
  '';

  # https://devenv.sh/basics/
  enterShell = ''
    hello         # Run scripts directly
    git --version # Use packages
  '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
```

---
layout: two-cols-header
---

## Languages

::left::

- vorgefertigte Module um verschiedene Sprachen zu konfigurieren
- einfache Aktivierung per `languages.<language>.enable = true`
- automatische Installation von Compiler, Interpreter und Tooling
- versionsspezifische Konfiguration möglich
- Unterstützung für viele Sprachen: Python, Rust, Go, JavaScript, Java, etc.
- IDE-Integration (LSP, Formatter, Linter) oft inklusive

::right::

```nix [devenv.nix ~i-vscode-icons:file-type-nix~]
{ pkgs, ... }:
{
  languages.kotlin.enable = true;
  languages.java = {
    enable = true;
    gradle.enable = true;
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
    pnpm.enable = true;
  };

}

```

---

## Secrets

- für Entwicklung können Secrets notwendig sein
  - Artefakt-Server
  - API-Keys
- Secrets müssen sicher verwaltet werden
- sollen, wenn möglich nur einmal definiert werden
- devenv beschreibt Secrets mit SecretSpec

---

## SecretSpec

- beschreibt Secrets deklarativ
  - Welche Secrets gibt es
  - Wie werden Secrets festgelegt / verwendet (Profile, benötigt oder optional, Standartwerte)
  - Wo werden die Secrets gespeichert (Keyring, Env-Variablen, 1Password, ...)
- devenv integriert SecretSpec Secrets automatisch in Konfiguration

::code-group

```toml [secretspec.toml ~i-vscode-icons:file-type-light-toml~]
[project]
name = "nixos-kotlin-dev-env"
revision = "1.0"

[profiles.default]
artifactory_user = { description = "Artifactory user, should be your user id", required = true }
artifactory_password = { description = "API Token from Artifactory, create one by accessing your profile and click on 'set me up'", required = true }
artifactory_contextUrl = { description = "", required = true, default = "https://my-fancy-server.de/artifactory" }
```

```nix [devenv.nix ~i-vscode-icons:file-type-nix~]
{ config }:
{
  # env variables to set artifactory auth
  env.ORG_GRADLE_PROJECT_artifactory_user = config.secretspec.secrets.artifactory_user;
  env.ORG_GRADLE_PROJECT_artifactory_password = config.secretspec.secrets.artifactory_password;
  env.ORG_GRADLE_PROJECT_artifactory_contextUrl = config.secretspec.secrets.artifactory_contextUrl;

  packages = [
    # for now needed to access secretspec
    pkgs.secretspec
  ];
}
```

::

---

## Tasks

- devenv kennt das Konzept der Tasks
- können als Fire and Forget ausgeführt werden
- Task können andere Tasks als Dependency nutzen
- Einschränkung, wann Tasks erneut ausgeführt werden müssen

```nix [devenv.nix ~i-vscode-icons:file-type-nix~]{all|4|5|6-11|13|all}
{ pkgs, lib, config, ... }:
{
  tasks = {
    "myapp:build" = {
      exec = "npm run build";
      execIfModified = [
        "src/**/*.ts"  # All TypeScript files in src directory
        "package.json" # Specific file
      ];
      # Optionally run the build in a specific directory
      cwd = "./frontend";
    };
  };
}
```

---
layout: two-cols-header
---

## Prozesse

::left::

- langlaufende Tasks sind können als Prozesse beschrieben werden
- devenv stellt Prozess Management zur Verfügung
  - Abhängigkeiten
  - Status
  - File-Watcher
  - Socket Aktivierungen
- verschiedene Prozess Manager möglich
- process-compose ist der Default <sup>1</sup>

::right::

```nix [devenv.nix ~i-vscode-icons:file-type-nix~]
{ ... }:
{
  processes.backend = {
    exec = "gradle bootTestRun";
    cwd = "${config.git.root}/backend";
    process-compose = {
      depends_on = {
        postgres = {
          condition = "process_healthy";
        };
      };
    };
  };
}
```

<Footnotes separator>
  <Footnote :number=1>wird vielleicht als eigene Lösung integriert</Footnote>
</Footnotes>

---
layout: two-cols-header
---

## Services

::left::

- noch eine Ebene höher abstrahiert als Prozesse
- vordefinierte Services, wie zum Beispiel
  - Datenbank
  - Proxy
  - Mailserver
  - Keycloak
- Services werden direkt als Prozess ausgeführt, nicht als Container
- Zustand wird in `.devenv/state` gespeichert

::right::

```nix [devenv.nix ~i-vscode-icons:file-type-nix~]
{ ... }:
{
  services.postgres = {
    enable = true;
    listen_addresses = "*";
    initialDatabases = [
      {
        name = "tcc";
        initialSQL = initScript;
        user = "tcc";
        pass = "tcc";
      }
    ];
  };
}
```

---

## Profiles

- CI/CD Umgebungen unterscheiden sich nicht sehr von lokalen Entwicklungsumgebungen
- Profile ermöglichen umgebungsspezifische Konfigurationen
  - verschiedene Secret-Werte pro Profil
  - angepasste Prozess-Starts
- devenv kann mit verschiedenen Profilen gestartet werden
- Secrets können pro Profil definiert werden

---

## Erfahrungen bisher

- Lernkurve von Nix flacht deutlich ab, wenn Kollegen mit devenv starten
- es können auch alle Nix Features genutzt werden, wenn man denn will
- deutlich geringere Onboarding Zeiten
- erheblich weniger Reibung bei Wechsel zwischen den Projekten
- Processes nicht in Container zu kapseln macht es einfacher<sup>1</sup>

<Footnotes separator>
  <Footnote :number="1">Beispiel: localhost ist wirklich localhost</Footnote>
</Footnotes>

---

## Offene Punkte

- Projektübergreifende Secrets sind in SecretSpec aktuell nicht möglich <sup>1</sup>
- Installation von Nix auf MacOS manchmal schwierig <sup>2</sup>
- Build Prozess in Nix abbilden, um bessere Dockerimages zu bauen
- MSSQL nicht in Nixpkgs, dafür brauchen wir immer noch Container

<Footnotes separator>
  <Footnote :number="1">Feature soll mit Release <a href="https://github.com/cachix/devenv/issues/2449#issuecomment-3873588797">0.7.2</a> kommen</Footnote>
  <Footnote :number="2">Bei macOS Updates verschwindet der Schlüssel des Nix Stores</Footnote>
</Footnotes>
