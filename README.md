# Manim Interactive

A graphical frontend to the Python animation library [Manim](https://www.manim.community/). Manim Interactive requires zero knowledge of code to make animations.

![demo](./docs/demo.png)

## Installation

### Prerequisites

#### Python

Manim Interactive requires [Python 3](https://www.python.org/downloads/) to be installed.

#### UV

[`uv`](https://github.com/astral-sh/uv) must also be installed:

```bash
pip install uv
```

#### LaTeX

`LaTeX` is also needed to use Manim Interactive. Manim recommends installing it with [MikTeX](https://miktex.org/download).

### Prebuilt Binary

Prebuilt binary releases are available on the releases page.

### Building From Source

Alternatively, you can build from source. The following additional tools are required:

- A JavaScript bundler ([bun](https://bun.sh/), [npm](https://www.npmjs.com/), [deno](https://deno.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), etc.)
- [Rust](https://www.rust-lang.org/)

Then run the following (replacing `bun` with your bundler of choice:)

```bash
git clone https://vi013t/manim-interactive.git
cd manim-interactive
bun install
bun run tauri build
```

The build script will tell you at the end where the compiled executable is. It'll usually be located somewhere in `manim-interactive/src-tauri/target/release/bundle/`.

## Contributing

Issue reports and pull requests are welcome. 

Manim Interactive is written using [Tauri](https://v2.tauri.app/), with a frontend in [Typescript](https://www.typescriptlang.org/)-flavored [Svelte 5](https://svelte.dev/) and a backend in [Rust](https://www.rust-lang.org/).

Please be aware of the project goals before contributing. Manim Interactive aims to be a relatively thin GUI layer over Manim; That is, it does *not* aim to add new features, animations, or object types into Manim. Occasionally, multiple animations are combined into one animation with additional properties. Conventionally, Manim Interactive will occasionally rename something from Manim if a more readable or logical name is determined. Otherwise, the program is relatively faithful to Manim.

I threw most of this together in a spare weekend. Expect some bugs for now.

### Building Locally

You can test the project locally like so:

```bash
git clone https://github.com/vi013t/manim-interactive.git
cd manim-interactive
bun install
bun run tauri dev
```

replacing `bun` with your JavaScript bundler of choice.

## Other Projects

If you like Manim Interactive, check out these other projects!

- [Manim](https://www.manim.community/) - The core backbone Python library of Manim Interactive
- [Manim Slides](https://manim-slides.eertmans.be/latest/reference/gui.html) - A GUI for playing Manim animations as slides
- [Monocurl](https://www.monocurl.com/) - An alternative frontend GUI application for Manim