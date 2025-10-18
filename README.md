# 🏎️ F1 Word Racer

A Chrome extension that brings Formula 1 racing to your browser. Type a trigger word, and watch F1 cars race across your screen with engine sounds and a finish line.

Because even your emails deserve a podium finish.

## Why This Exists

F1 races happen on weekends. The rest of the time, we're just... typing. Emails, code, messages, documents.

I wanted to bring a bit of that F1 magic into the everyday. So when you type "ferrari" or "lights-out" or whatever word means racing to you, you get a moment of speed and spectacle. A reminder that even routine tasks can be exciting.

It's playful, sure. But it's also genuine. Formula 1 is about passion, precision, and the thrill of watching something impossibly fast. This extension is that feeling, in browser form.

## Features

- **Animated races on demand** — Type your trigger words anywhere, get an instant F1 race
- **Your words, your race** — Customize triggers with driver names, teams, or any F1 terminology
- **Engine sounds included** — Because what's F1 without the roar?
- **Smooth and fast** — Hardware-accelerated animations that respect your browser
- **Ferrari red UI** — A warm, welcoming interface inspired by motorsport
- **Works everywhere** — Any website with text input becomes a potential race track

## Installation

### Chrome Web Store
Coming soon (navigating Google's review process).

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/ojusharma/f1-trigger-chrome-extension.git
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable **Developer mode** (top-right toggle)

4. Click **Load unpacked** and select the extension folder

5. The F1 icon appears in your toolbar—you're ready to race

## How to Use

1. Click the extension icon and toggle **Enable Racing** on
2. Click **Edit Trigger Words** to customize your list
3. Add words that matter to you: `verstappen`, `leclerc`, `lights-out`, `podium`
4. Go to any website and start typing
5. Type a trigger word followed by a space

Ten F1 cars race across your screen in two waves, 200ms apart. It's fast. It's unexpected. It's F1.

## Technical Details

**Built with:**
- Vanilla JavaScript (ES6+) — No frameworks, just pure speed
- Chrome Extension Manifest V3
- CSS3 hardware-accelerated animations
- Web Audio API for concurrent engine sounds

**Performance considerations:**
- Maximum 5 concurrent races (your browser will thank you)
- Preloaded audio for instant vroom
- Cloned audio instances for overlapping races
- Responsive design that works on any screen size

**File structure:**
```
content_script.js     → The main event (animation logic)
background.js         → Message relay
popup.js/html         → Extension popup
options.js/html       → Settings page
styles/               → Ferrari red and warm colors
images/               → Car assets and finish line
sounds/               → VROOOM
```

## Contributing

Have an idea? Found a bug? Want to add more liveries or sounds? Contributions are welcome.

Fork the repo, make your changes, and open a pull request. Let's make this better together.

**Ideas worth exploring:**
- More car liveries (McLaren papaya, Mercedes silver, Alpine pink?)
- Different sound effects (classic V10 anyone?)
- Animation variations
- Performance improvements
- Accessibility features

## License

MIT License — Build on it, improve it, make it yours.

---

**Created by Ojus Sharma**

*Always expect the unexpected.*
