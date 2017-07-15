# tetris.gb.js
Reverse Engineered Tetris Assembly Code from the Original DMG Gameboy

# Deploy to Github pages branch
```bash
gulp deploy
```

#TODO
* Add additional non-banked games
* Disassembly output of code areas
* find a way to save vram in a way in which it supports multiple tiles for each key

## Visulisation
* IDA-like graphics of code/data areas (interactive) (svg)
    - Need to make area clickable like canvas
    - Need to rotate the svg

## CSS & HTML
* Use materialize-css to make the interface look more presentable
* Add rom box-art (api?)