#!/usr/bin/env python3
"""Monta o index.html a partir de src/ e embute os logos da Divina Terra em base64.

Uso:  python3 build.py
Fontes: src/shell.html ({{CSS}} {{BODY}} {{JS}}), src/style.css, src/slides.html, src/script.js
Tokens de imagem: __LOGO_GOLD__, __LOGO_TERRA__, __SYM_GOLD__ (gerados de dt-logo.png)
"""
import base64
import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
GOLD = (222, 152, 53)
TERRA = (71, 50, 37)


def recolor(im, rgb):
    out = im.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            a = px[x, y][3]
            if a:
                px[x, y] = (rgb[0], rgb[1], rgb[2], a)
    return out


def data_uri(im):
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def symbol(im):
    """Recorta o símbolo circular do meio do logotipo (o trecho mais alto entre colunas vazias)."""
    alpha = im.split()[3].load()
    w, h = im.size
    filled = [any(alpha[x, y] > 20 for y in range(h)) for x in range(w)]
    segments, x = [], 0
    while x < w:
        if filled[x]:
            start = x
            while x < w and filled[x]:
                x += 1
            segments.append((start, x))
        else:
            x += 1

    def height(seg):
        box = im.crop((seg[0], 0, seg[1], h)).getbbox()
        return box[3] - box[1] if box else 0

    best = max(segments, key=lambda s: (height(s), s[1] - s[0]))
    crop = im.crop((best[0], 0, best[1], h))
    return crop.crop(crop.getbbox())


logo = Image.open(ROOT / "dt-logo.png").convert("RGBA")
sym = symbol(logo)
tokens = {
    "__LOGO_GOLD__": data_uri(recolor(logo, GOLD)),
    "__LOGO_TERRA__": data_uri(recolor(logo, TERRA)),
    "__SYM_GOLD__": data_uri(recolor(sym, GOLD)),
}

html = (SRC / "shell.html").read_text(encoding="utf-8")
html = html.replace("{{CSS}}", (SRC / "style.css").read_text(encoding="utf-8"))
html = html.replace("{{BODY}}", (SRC / "slides.html").read_text(encoding="utf-8"))
html = html.replace("{{JS}}", (SRC / "script.js").read_text(encoding="utf-8"))
for key, value in tokens.items():
    html = html.replace(key, value)

leftover = [k for k in ("{{CSS}}", "{{BODY}}", "{{JS}}", "__LOGO_", "__SYM_") if k in html]
assert not leftover, f"tokens sem substituir: {leftover}"

(ROOT / "index.html").write_text(html, encoding="utf-8")
slides = html.count('<section class="slide')
print(f"index.html: {len(html):,} bytes | telas: {slides} | símbolo recortado: {sym.size[0]}x{sym.size[1]}px")
