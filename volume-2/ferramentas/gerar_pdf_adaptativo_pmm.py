#!/usr/bin/env python3
"""
Gerador adaptativo de PDF - Coleção Palavra, Mesa e Missão

Uso:
    python gerar_pdf_adaptativo_pmm.py conteudo.json saida.pdf

O JSON deve conter:
- capa
- titulo
- paginas: lista com 19 páginas internas
  - titulo
  - subtitulo
  - texto
  - destaque
"""

from pathlib import Path
import json, re, sys
from reportlab.lib.pagesizes import A5
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

for name, path in {
    "Serif": "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
    "SerifBold": "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
    "SerifItalic": "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf",
    "Sans": "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "SansBold": "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
}.items():
    pdfmetrics.registerFont(TTFont(name, path))

GREEN = HexColor("#12462E")
GOLD = HexColor("#B17E24")
DARK = HexColor("#464642")
LIGHT_GREEN = HexColor("#E8F0E8")
BLACK = HexColor("#161616")

PAGE_W, PAGE_H = A5
LEFT = RIGHT = 1.0 * cm
TOP = 1.1 * cm
BOTTOM = 1.05 * cm
CONTENT_W = PAGE_W - LEFT - RIGHT
CONTENT_TOP = PAGE_H - TOP
AVAILABLE_H = CONTENT_TOP - BOTTOM

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def markup(block):
    out = []
    for line in block.splitlines():
        s = line.strip()
        if not s:
            continue
        if s.isupper() and len(s) < 95:
            out.append(f'<font color="#12462E"><b>{esc(s)}</b></font>')
        elif s.startswith(("Dirigente:", "Congregação:", "Todos:")):
            a, b = s.split(":", 1)
            out.append(f"<b>{esc(a)}:</b>{esc(b)}")
        elif s.startswith("◆"):
            out.append(f'<font color="#12462E">◆</font> {esc(s[1:].strip())}')
        else:
            out.append(esc(s))
    return "<br/>".join(out)

def build(page, fs):
    brand = ParagraphStyle(
        "brand", fontName="SansBold", fontSize=7.4, leading=8,
        textColor=GOLD, alignment=TA_CENTER, spaceAfter=2
    )
    title = ParagraphStyle(
        "title", fontName="SerifBold", fontSize=16.0, leading=17.0,
        textColor=GREEN, alignment=TA_CENTER, spaceAfter=1
    )
    subtitle = ParagraphStyle(
        "subtitle", fontName="SerifItalic", fontSize=10.2, leading=11.0,
        textColor=DARK, alignment=TA_CENTER, spaceAfter=6
    )
    body = ParagraphStyle(
        "body", fontName="Serif", fontSize=fs, leading=fs * 1.06,
        textColor=BLACK, alignment=TA_JUSTIFY, spaceAfter=4,
        allowWidows=0, allowOrphans=0
    )
    left = ParagraphStyle("left", parent=body, alignment=TA_LEFT)
    call_head = ParagraphStyle(
        "call_head", fontName="SansBold", fontSize=max(8.0, fs - 3.0),
        leading=max(9.0, fs - 2.2), textColor=GREEN
    )
    call_body = ParagraphStyle(
        "call_body", fontName="SerifItalic", fontSize=max(9.0, fs - 1.8),
        leading=max(10.0, fs - 1.0), textColor=DARK
    )

    flows = [
        Paragraph("PALAVRA • MESA • MISSÃO", brand),
        Paragraph(esc(page["titulo"]), title),
        Paragraph(esc(page.get("subtitulo", "")), subtitle),
    ]

    for block in [b.strip() for b in page.get("texto", "").split("\n\n") if b.strip()]:
        use_left = bool(re.match(
            r"^(◆|\d+\.|[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]{3,}$|Dirigente:|Congregação:|Todos:)",
            block
        ))
        flows.append(Paragraph(markup(block), left if use_left else body))

    callout = Table(
        [[
            Paragraph("PARA GUARDAR NO CORAÇÃO", call_head),
            Paragraph(esc(page.get("destaque", "")), call_body)
        ]],
        colWidths=[3.7 * cm, CONTENT_W - 3.7 * cm]
    )
    callout.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIGHT_GREEN),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("LEFTPADDING", (0,0), (-1,-1), 7),
        ("RIGHTPADDING", (0,0), (-1,-1), 7),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ]))
    return flows, callout

def height_sum(flows):
    return sum(f.wrap(CONTENT_W, 1000 * cm)[1] for f in flows)

def fit_page(page):
    low, high = 9.0, 20.0
    best = None
    for _ in range(30):
        fs = (low + high) / 2
        flows, callout = build(page, fs)
        total = height_sum(flows) + callout.wrap(CONTENT_W, AVAILABLE_H)[1] + 8
        if total <= AVAILABLE_H:
            best = (fs, flows, callout)
            low = fs
        else:
            high = fs
    if best is None:
        return (*build(page, 8.5), 8.5)
    fs, flows, callout = best
    return flows, callout, fs

def generate(data, output_pdf):
    if len(data["paginas"]) != 19:
        raise ValueError("O padrão exige 19 páginas internas, além da capa.")

    c = canvas.Canvas(str(output_pdf), pagesize=A5)
    c.drawImage(
        ImageReader(data["capa"]), 0, 0, width=PAGE_W, height=PAGE_H,
        preserveAspectRatio=False, mask="auto"
    )
    c.showPage()

    for pnum, page in enumerate(data["paginas"], start=2):
        c.setFillColor(DARK)
        c.setFont("Sans", 6.1)
        c.drawCentredString(
            PAGE_W/2, PAGE_H - 0.5*cm,
            "COLEÇÃO PALAVRA, MESA E MISSÃO • CADERNOS DE FORMAÇÃO CRISTÃ REFORMADA"
        )
        c.setFillColor(GREEN)
        c.setFont("Sans", 6.2)
        c.drawCentredString(
            PAGE_W/2, 0.38*cm,
            f"PALAVRA PROCLAMADA • FÉ FORTALECIDA • IGREJA ENVIADA   |   {pnum}"
        )

        flows, callout, fs = fit_page(page)
        y = CONTENT_TOP
        for f in flows:
            _, h = f.wrap(CONTENT_W, AVAILABLE_H)
            f.drawOn(c, LEFT, y - h)
            y -= h

        _, ch = callout.wrap(CONTENT_W, AVAILABLE_H)
        callout.drawOn(c, LEFT, y - ch - 4)
        c.showPage()

    c.save()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Uso: python gerar_pdf_adaptativo_pmm.py conteudo.json saida.pdf")
    data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    generate(data, Path(sys.argv[2]))
