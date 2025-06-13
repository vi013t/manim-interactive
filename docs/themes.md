# Custom Themes

Manim Interactive supports custom themes. In particular, if you know how to write CSS, themes can *completely* rewrite the entire UI.

## Making a Custom Theme


To make a custom theme, the easiest way is to do so in the UI. Navigate to `Window > Preferences > Appearance > Theme`, and click `Create New Theme`. From there, you can add various styles to different parts of the program through the UI.

## Scripting a Custom Theme

**Warning: Updates to Manim Interactive can break scripted themes. Use at your own risk.**

Themes can also be scripted, allowing for more control and flexibility. To script a custom theme, make a new CSS file. In your CSS file, any CSS you write will be applied to the program and override any existing colors. For example, your theme script could simply be:

```css
#navbar {
	background-color: red;
}
```

As with themes made in the UI, any colors that are not set will fallback to the default theme (Catppuccin Mocha).

Most of theme scripting is just knowing what selectors to use. Here's a list of some common ones:

- `#navbar` - The navigation bar at the top
- `#object-panel` - The object panel on the left side
- `#timeline` - The timeline panel on the right side
- `#properties-panel` - The properties panel on the bottom

You can also of course use descendant selectors to customize things that don't have classes or IDs built in. For example:

```css
#properties-panel {
	background-color: blue;

	input {
		background-color: red;
	}
}
```

If you can read Svelte, feel free to [browse the source code](https://github.com/vi013t/manim-interactive/tree/main/src) to get a better understanding of what selectors are available. You should be able to select basically any element with a combination of `>`, `:has()`, `:nth-child()`, etc.

This is why scripted themes may break when Manim Interactive is updated. The layout of the elements on the page may change.