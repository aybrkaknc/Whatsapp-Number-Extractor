# Animation system

[Türkçe](ANIMATIONS.tr.md)

Every animation of the panel uses one shared set of durations, easings and helpers, so they all move the same way. The tokens and keyframes live in `src/ui/panel.css`, the helpers in `src/ui/motion.js`.

## Tokens

| Token | Value | Used for |
|---|---|---|
| `--wa-dur-fast` | 100 ms | micro feedback: status flash, new log line, staggering |
| `--wa-dur` | 160 ms | window, view changes, elements entering and leaving |
| `--wa-dur-slow` | 240 ms | size changes: log panel, progress bar |
| `--wa-ease` | `steps(5, end)` | movement and entering, in five visible steps |
| `--wa-ease-fade` | `steps(3, end)` | fades and flashes |
| `--wa-ease-grow` | `steps(8, end)` | size changes |

Step easings keep the Windows 98 look: things move in a few visible steps instead of gliding. Scripts read the same tokens through `WA.motion('--wa-dur')`, so a timing is defined in one place only.

## What animates

| Where | Animation | Class / mechanism |
|---|---|---|
| Panel opens | scales up with a small overshoot | `win98-anim` (`win98-appear`) |
| Panel closes | scales down, then hides | `win98-anim-out` (`win98-disappear`) |
| WA button | grows back when the panel is gone | `wa-grow` |
| Panel while dragged | dims slightly | `wa-dragging` on the wrapper |
| Main and settings view | the new view slides in from the right (settings) or left (main), the old one hides at once | `wa-enter` with `--wa-dx` |
| Minimize / restore | the content slides away and back | `wa-leave`, `wa-enter` |
| Start, Auto Scroll, Copy, Finish | the new group enters one button after the other | `wa-enter` with a delay |
| First-use note | leaves when dismissed | `wa-leave` |
| Progress bar | appears, and its fill grows in steps | `wa-enter`, `transition: width` |
| System logs panel | opens and closes by height, opacity and margin | `transition` in `panel.css` |
| Clear button | enters after the log has started opening, leaves when it closes | `wa-enter` with a delay, `wa-leave` |
| Status box | flashes when its text changes | `wa-tick` |
| Notices (yellow, red) | slide in | `wa-pop` |
| New log lines | slide in (lines redrawn after a language switch do not) | `wa-new` |

Not animated on purpose: the dropdowns and check boxes in the settings (the operating system draws them) and the Win98 button press (98.css does it).

## Helpers (`src/ui/motion.js`)

- `WA.setHidden(el, hidden, { instant, dx, dy, delay, enter })` shows or hides an element with the shared enter / leave animation. Use it instead of toggling the `hide` class.
- `WA.replay(el, cls, { restart })` plays a one-shot animation class again. With `restart: false` a running animation is left alone.
- `WA.motion(token)` reads a duration token in milliseconds from the CSS.
- `WA.motionAllowed()` is false when animations are off.

When a group of elements swaps (Start to the three scan buttons, main to settings), the outgoing ones hide with `instant: true` and only the incoming ones animate, so two groups never stack on top of each other.

## Reduced motion and the Animations setting

The settings have an **Animations** option:

- **Follow the system setting** (default): no animation when the operating system asks for reduced motion.
- **Always on**: animates even if the system asks for reduced motion.
- **Off**: never animates.

If no animation plays at all, check the system setting first: Windows 11, Settings > Accessibility > Visual effects > Animation effects. With it off, the default option shows no animation, on purpose. The setting is applied as `data-motion` on the panel wrapper; in the "no animation" cases `panel.css` sets all duration tokens to 0 and turns off animations and transitions, and the scripts use `WA.motionAllowed()` to skip waiting.

## Adding an animation

1. Reuse a token for the duration and an `--wa-ease*` token for the easing. Do not write literal times.
2. Prefer the existing classes (`wa-enter`, `wa-leave`, `wa-grow`, `wa-pop`, `wa-tick`) or `WA.setHidden()`.
3. Give a new keyframe set the same shape as the existing ones (small distance, opacity) and list it in the table above.
4. Check that it stops with **Animations: Off**.

## Checking by eye

Animations are short, so slow them down: set `--wa-dur`, `--wa-dur-fast` and `--wa-dur-slow` to a few seconds on `#wa-98-scope`, trigger the action, then freeze it with `document.getAnimations().forEach(a => { a.pause(); a.currentTime = 800; })` and look at the frame.
