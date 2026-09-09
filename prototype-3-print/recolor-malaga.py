#!/usr/bin/env python3
"""
One-off recolor pass for the Malaga map technical images used on Scene 6.
These are NOT photographs (per the print brief they are treated as technical
map graphics), so their green-glow-on-black rendering is remapped to the
print palette: background -> #F1F3EC, glowing line/label -> a target dark
tone. The source images are a flat dark background with an anti-aliased
bright green/cyan glow (line art + text labels) -- brightness alone (max of
R,G,B) is a clean proxy for "how much foreground glow is here", so each
pixel is remapped by lerping between the new background and new foreground
color using that brightness as a 0..1 mix, with a smoothstep + threshold to
keep flat background truly flat and the line core truly solid.

Usage: python3 recolor-malaga.py
Run once; outputs overwrite the *-print copies in place (this script only
ever touches files inside prototype-3-print/photos/, never the original
prototype-3/photos/ source).
"""
from PIL import Image
import os

PHOTOS = os.path.join(os.path.dirname(__file__), 'photos')

BG = (241, 243, 236)          # print background #F1F3EC
LINE_FG = (96, 123, 105)      # print technical-line color #607B69 (base map outline)
LABEL_FG = (23, 60, 42)       # print heading/label color #173C2A (POI pin+label crops)

LOW, HIGH = 20, 210           # brightness thresholds for the glow-falloff ramp

def smoothstep(lo, hi, x):
    t = max(0.0, min(1.0, (x - lo) / (hi - lo)))
    return t * t * (3 - 2 * t)

def recolor(path, fg):
    source = os.path.join(os.path.dirname(__file__), '..', 'prototype-3', 'photos', os.path.basename(path))
    im = Image.open(source).convert('RGB')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            brightness = max(r, g, b)
            t = smoothstep(LOW, HIGH, brightness)
            nr = round(BG[0] + (fg[0] - BG[0]) * t)
            ng = round(BG[1] + (fg[1] - BG[1]) * t)
            nb = round(BG[2] + (fg[2] - BG[2]) * t)
            px[x, y] = (nr, ng, nb)
    im.save(path)
    print('recolored', os.path.basename(path))

recolor(os.path.join(PHOTOS, 's6-malaga-base.png'), LINE_FG)
for name in [
    's6-malaga-alcazaba.png',
    's6-malaga-gibralfaro.png',
    's6-malaga-picasso.png',
    's6-malaga-city-centre.png',
    's6-malaga-botanical.png',
]:
    recolor(os.path.join(PHOTOS, name), LABEL_FG)
