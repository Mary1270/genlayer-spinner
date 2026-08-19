# GenLayer Spinner

An animated loading spinner designed for the GenLayer Portal, submitted to the
**"Design the GenLayer Spinner"** mission.

![preview](spinner_preview.gif)

## Concept — "Consensus Ring"

GenLayer's core idea is validators reaching consensus. The spinner turns that
into motion instead of using a generic loading icon:

- **Three fading arcs** rotate continuously, like a validator signal decaying
  as newer confirmations arrive.
- **One leading green node** travels at the front of the ring — the
  "confirming validator" that has just settled.

## Brand compliance

Colors are taken directly from the official GenLayer brand kit
([genlayer.com/brand](https://genlayer.com/brand)):

| Role | Color | Hex |
|---|---|---|
| Ring / arcs | Kinetic Cobalt | `#110FFF` |
| Leading node | Success | `#00FF66` |

## Format

- Single self-contained `.svg` file — the CSS animation is embedded inside
  the `<style>` tag, so it works anywhere an `<img>`, `<object>`, or inline
  SVG can be dropped in. No external CSS or JS required.
- Linear, constant-speed rotation (1.15s loop) for a smooth, professional
  spinner feel.
- Respects `prefers-reduced-motion` (falls back to a gentle pulse instead of
  spinning).
- Tested readable down to 16px, and works on both light and dark
  backgrounds since the shape has no background fill of its own.

## Files

- `genlayer-spinner.svg` — the deliverable, ready to embed.
- `spinner_preview.gif` — animated preview on light and dark backgrounds
  (for reviewers; not required for use in the Portal).

## Usage

```html
<img src="genlayer-spinner.svg" width="28" height="28" alt="Loading" />
```

or inline it directly in HTML/JSX for full control over sizing via CSS.
