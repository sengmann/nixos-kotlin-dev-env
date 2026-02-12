# Was ist Nix?

- eine funktionale Programmiersprache
- ein Paketmanager
- ein Betriebssystem (NixOS)

---

## Kurze Historie

- 2003: Eelco Dolstra entwickelt Nix als Teil seiner Doktorarbeit
- 2006: Erste Version von NixOS veröffentlicht
- 2015: Nix wird von der Community weiterentwickelt
- 2021: Einführung von Nix Flakes (experimentell)
- Heute: aktive Community, über 100.000 Pakete verfügbar

---

## Nix ist eine funktionale Programmiersprache

- spezialisiert auf das Erstellen von Paketen (derivations)
- wird genutzt zur präzisen Beschreibung von
  - Datei-Inhalten
  - Ableitung neuer Dateien
- Pure Functional
- Lazy Evaluation
- dynamisch typisiert

---
layout: two-cols-header
---

## Nix ist ein Paketmanager

::left::

- deklarative Paketverwaltung
- reproduzierbare Builds
  - im Zweifel von Source bauen
  - Binary Cache stellt gebaute Artefakte zur Verfügung
- alle Pakete in `/nix/store`
  - Hash aller Inputs im Pfad
  - mehrere Versionen parallel installierbar
  - keine globalen Systemabhängigkeiten

::right::

![Package registry comparision](https://repology.org/graph/map_repo_size_fresh.svg)

<Footnotes separator>
  <Footnote :number=1>Graph: <a href="https://repology.org/repositories/graphs">https://repology.org/repositories/graphs</a></Footnote>
</Footnotes>

---

## Nix Store Path

1. Prefix des Stores
2. Hash aller Inputs im Pfad
   - Source-Code
   - Compiler Settings
   - CPU Architektur
   - ...
3. Name des Pakets

<figure class="bg-gray-100 dark:bg-gray-800 p-3 mt-5">
  <pre class="flex overflow-auto whitespace-nowrap break-keep text-base md:text-lg lg:text-xl xl:text-2xl">
    <div class="flex flex-col md:space-y-1 lg:space-y-1.5">
      <span class="font-mono text-lilac dark:text-cerulean">/nix/store/</span>
      <span class="font-sans text-xs tracking-tight md:text-sm lg:text-base">
        <strong>1.</strong> Nix store prefix
      </span>
    </div>
    <div class="flex flex-col md:space-y-1.5 lg:space-y-1.5">
      <span class="font-mono font-light text-blue dark:text-lilac">
        f8f72p3xxr20k111mpg4kk93i4cp74qb
      </span>
      <span class="font-sans text-xs tracking-tight md:text-sm lg:text-base">
        <strong>2.</strong> Hash part
      </span>
    </div>
    <span>-</span>
    <div class="flex flex-col md:space-y-1.5 lg:space-y-1.5">
      <span class="font-mono text-orange dark:text-rose">git-2.37.0</span>
      <span class="font-sans text-xs tracking-tight md:text-sm lg:text-base">
        <strong>3.</strong> Package name
      </span>
    </div>
  </pre>
  <figcaption class="font-sans text-lilac dark:text-lilac">
    Quelle: <a href="https://zero-to-nix.com/concepts/caching/">Zero to nix</a>
  </figcaption>
</figure>

---

## Nix ist ein Betriebssystem

- verwendet den Nix Paketmanager
- deklarative Systemkonfiguration, beschrieben als Nix Expression
- atomare Updates und Rollbacks mittels Generationen
- reproduzierbare Systemkonfiguration

---

## Wie kann Nix unser Problem lösen?

- deklarative Beschreibung aller für die Entwicklung notwendiger Pakete
- Portabel auf Linux, MacOS und Windows (WSL)
- sehr hohe Reproduzierbarkeit
- große Auswahl an Paketen (nixpkgs)

---
layout: two-cols-header
---

## Nix Shell

::left::

- Erstellen einer `shell.nix` Datei im Projektverzeichnis
- Deklaration der benötigten Pakete in `buildInputs`
- Aktivierung mit `nix-shell` Kommando
- Automatisches Laden der Umgebung beim Betreten
- Verlassen mit `exit` oder Ctrl+D

::right::

```nix [shell.nix ~i-vscode-icons:file-type-nix~]
{
  pkgs ? import <nixpkgs> { },
}:
pkgs.mkShell {
  packages = with pkgs; [
    jdk21
    gradle
  ];

  shellHook = ''
    # JDK 21
    export JAVA_HOME="${pkgs.jdk21}"
    export PATH="$JAVA_HOME/bin:$PATH"

    export GRADLE_HOME="${pkgs.gradle}"
    export PATH="$GRADLE_HOME/bin:$PATH"

    echo "Using JAVA_HOME=$JAVA_HOME"
    echo "Using Gradle: $(gradle --version)"
  '';
}

```

---
layout: two-cols-header
---

## Nix Shell

::left::

- Was haben wir bisher?
  - Deklarative Beschreibung, wie unsere Entwicklungsumgebung aussieht
  - shellHook setzt die Umgebung bei Betreten der Shell auf

::right::

- Was fehlt noch?
  - nicht gut reproduzierbar: genaue Paketversion hängen von globalen nixpkgs ab

---

## Nix Flakes

- experimentelles Feature für bessere Reproduzierbarkeit
- `flake.nix`: deklarative Beschreibung der Inputs und Outputs
  - Inputs: Abhängigkeiten mit exakter Version (Git-Commit, Tarball-Hash)
  - Outputs: was die Flake bereitstellt (Packages, Dev-Shells, NixOS-Konfigurationen)
- `flake.lock`: lockfile mit exakten Versionen aller Inputs
- Befehl für Development Shell `nix develop`
- Vorteile:
  - vollständig reproduzierbare Builds
  - explizite Abhängigkeitsverwaltung
  - einfaches Teilen und Versionieren von Entwicklungsumgebungen

---

## Nix Flakes

```nix [flake.nix ~i-vscode-icons:file-type-nix~]{all|4-6|8|9-12|14-38|all}{maxHeight:'95%'}
{
  description = "Java development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              jdk21
              gradle
            ];

            shellHook = ''
              # JDK 21
              export JAVA_HOME="${pkgs.jdk21}"
              export PATH="$JAVA_HOME/bin:$PATH"

              export GRADLE_HOME="${pkgs.gradle}"
              export PATH="$GRADLE_HOME/bin:$PATH"

              echo "Using JAVA_HOME=$JAVA_HOME"
              echo "Using Gradle: $(gradle --version | head -n 1)"
            '';
          };
        });
    };
}
```

---
layout: two-cols-header
---

## Zwischenfazit

::left::

- das Gute
  - Nix bietet (gerade mit Flakes) exzellente Reproduzierbarkeit
  - mit Shell Hooks Setup möglichst einfach
  - ausgezeichnete Automatisierung möglich

::right::

- das Schlechte
  - Lernkurve
  - Komplexität

---

## Geht das nicht einfacher?

- diverse Projekte versuchen die Hürde zum Einstieg kleiner zu machen
  - Nix verstecken
  - Abstraktion über Nix stülpen
- Beispiele:
  - [Flox](https://flox.dev)
  - [devenv](https://devenv.sh)

---

## Flox

- vereinfachte Abstraktion über Nix
- deklarative Umgebungsdefinition via `manifest.toml`
- automatische Aktivierung beim Betreten des Projektverzeichnisses
- teilen von Umgebungen über Flox Hub
- als Tool für AI Agents
- Kubernetes ohne Images

---

## devenv

- vereinfachte Abstraktion über Nix durch sinnvolle Defaults
- deklarative Umgebungsdefinition via `devenv.nix`
- automatische Aktivierung beim Betreten des Projektverzeichnisses (mit direnv)
- integrierte Services (Datenbanken, Redis, etc.) über `process-compose`
