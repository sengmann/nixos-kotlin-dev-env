# devenv

* Fokus auf Bereitstellung von Entwicklungsumgebungen
* sinnvolle Defaults

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

```nix {*}{maxHeight:'95%'}
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

* vorgefertigte Module um verschiedene Sprachen zu konfigurieren
* einfache Aktivierung per `languages.<language>.enable = true`
* automatische Installation von Compiler, Interpreter und Tooling
* versionsspezifische Konfiguration möglich
* Unterstützung für viele Sprachen: Python, Rust, Go, JavaScript, Java, etc.
* IDE-Integration (LSP, Formatter, Linter) oft inklusive

::right::

```nix [devenv.nix]
{ ... }:
{
  languages.javascript = {
    enable = true;
    pnpm.enable = true;
  };

  languages.kotlin.enable = true;
  languages.java = {
    enable = true;
    gradle.enable = true;
  };
}

```

---

## Secrets

---

## Tasks

---

## Prozesse

---

## Services

---

## Profiles

---

## Erfahrungen bisher

---

## Offene Punkte
