# Das Problem

- Wechsel zwischen verschiedenen Projekten bringt Reibung
  - unterschiedliche SDK Versionen pro Projekt
  - verschiedene Artefakt-Server pro Kunde
- nicht (gut) reproduzierbare Umgebung
  - Fehler aka. Works on my machine
  - bei Änderungen keine Vorhersagbarkeit der Auswirkungen

---

## Das Ziel

- Setup einer Development Umgebung, mit
  - kein kompliziertes Onboarding
  - so wenig manueller Arbeit wie nötig
  - einfacher Wechsel zwischen Projekten
- Beispiel heute:
  - Backend (Spring Boot / Kotlin)
  - Frontend (Angular Client)
- Bonus:
  - verwenden der Umgebung für CI / CD
  - reproduzierbare Artefakte

---

## Lösungsansätze

- manuelles Setup
- Tools wie SDK-Man (JVM), nvm (Node.js)
- Dev-Containers
- Nix

---
layout: two-cols-header
---

## Lösungsansätze

::left::

- manuelles Setup
  - skaliert genau gar nicht
  - Fehleranfällig

::right::

```shell
$ cd myproject
$ npm run start
# Random error
$ cat README.md
## local setup
Start with Node.js 18
$ node --version
v20.20.0
$ brew uninstall node
$ brew install node@18
$ node -v
v18.18.0
```

---
layout: two-cols-header
---

## Lösungsansätze

::left::

- Tools wie SDK-Man, NVM usw.
  - sind für jede Technologie anders
  - können nur imperativ verwendet werden

::right::

```shell
$ cd myproject
$ npm run start
# Random error
$ cat README.md
## Project setup
Start with Node.js 18
$ node --version
v20.20.0
$ nvm use 18
Now using node v18.18.0 (npm v9.2.1)
$ node -v
v18.18.0
```

---
layout: two-cols-header
---

## Lösungsansätze

::left::

- Docker Container
  - deklarativ<sub>1</sub>
  - Portabel
  - haben durch Isolierung eigene Probleme

::right::

::code-group

```dockerfile [Dockerfile]
FROM ubuntu:26.04
RUN apt-get update && \
    apt-get upgrade && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
    apt-get update && \
    apt-get install -y nodejs
RUN mkdir -p /app
```

```shell [start]
docker build -t myproject-devcontainer:latest
docker run -it -v $(pwd):/app -w /app -p 3000:3000 myproject-devcontainer:latest
$ npm run start
connecting to database localhost:5432
ERROR connection refused localhost:5432
```

::

<Footnotes separator>
  <Footnote :number=1>irgendwie, aber auch nicht richtig</Footnote>
</Footnotes>

---
layout: two-cols-header
---

## Lösungsansätze

::left::

- Dev-Container
  - gleiche Einschränkungen wie Docker Container
  - im Falle von VS-Code besser integriert
  - vorgefertigte Images für 'typische' Umgebungen

::right::

```json [devcontainer.json]
{
  "image": "mcr.microsoft.com/devcontainers/typescript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {}
  },
  "postCreateCommand": "npm install -g @devcontainers/cli",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint", "editorconfig.editorconfig"]
    }
  }
}
```

![img.png](/assets/images/open-dev-container-action.png)

---
layout: two-cols-header
---

## Lösungsansätze

::left::

- Nix
  - wirklich deklarativ
  - Portabel

::right::

```nix [shell.nix ~i-vscode-icons:file-type-nix~]
{
  pkgs ? import <nixpkgs> { },
}:

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodejs_18
  ];
}

```

```shell
$ nix shell
$ npm run start
```
