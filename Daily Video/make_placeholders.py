#!/usr/bin/env python3
"""Create placeholder images for the Gaddafi vox composition.

These are temporary stand-ins so the Remotion composition can render
for QA. Real AI-generated assets (via gen_image.py + cutout.py) should
replace them once the Gemini API quota resets (~15h from now).
"""
import os
from PIL import Image, ImageDraw, ImageFilter

OUT = "media/projects/gaddafi-story/layers"
os.makedirs(OUT, exist_ok=True)

PAPER = (239, 230, 211)      # VOX.paper  #efe6d3
PAPER_DEEP = (224, 210, 184) # VOX.paperDeep
INK = (40, 34, 23)           # VOX.ink    #282217
GOLD = (232, 183, 58)        # VOX.yellow #e8b73a
TEAL = (51, 105, 93)         # VOX.teal   #33695d
RED = (192, 57, 43)          # VOX.red    #c0392b


def save(img, name):
    img.save(os.path.join(OUT, name), "PNG")
    print(f"  {name}  {img.size}")


# 1. paper.png — full canvas kraft paper
img = Image.new("RGB", (1080, 1920), PAPER)
# subtle vignette
ov = Image.new("L", (1080, 1920), 0)
d = ImageDraw.Draw(ov)
for r in range(900, 0, -10):
    d.ellipse([540 - r, 960 - r, 540 + r, 960 + r], fill=int(200 * (1 - r / 900)))
img.putalpha(ov)
save(img.convert("RGB"), "paper.png")

# 2. libya-map.png — sepia map texture, 1100x1100
img = Image.new("RGB", (1100, 1100), (180, 150, 100))
d = ImageDraw.Draw(img)
# draw some "coastline" squiggles
for i in range(20):
    x = 100 + i * 45
    y = 300 + (i % 3) * 80
    d.arc([x - 60, y - 60, x + 60, y + 60], 0, 360, fill=(120, 90, 50), width=3)
img = img.filter(ImageFilter.GaussianBlur(2))
save(img, "libya-map.png")

# 3. gaddafi-portrait.png — portrait silhouette on transparent
img = Image.new("RGBA", (700, 900), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.ellipse([150, 100, 550, 450], fill=(130, 100, 70, 255))  # head
d.rectangle([200, 400, 500, 850], fill=(90, 70, 50, 255))   # body
save(img, "gaddafi-portrait.png")

# 4. crown.png — gold crown shape on transparent
img = Image.new("RGBA", (400, 400), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.polygon([(50, 300), (120, 150), (160, 300), (200, 150), (240, 300), (280, 150), (320, 300), (350, 350)], fill=GOLD, outline=INK)
save(img, "crown.png")

# 5. oil-derrick.png — derrick on transparent
img = Image.new("RGBA", (450, 450), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.line([(225, 50), (100, 350)], fill=(100, 80, 60), width=8)
d.line([(225, 50), (350, 350)], fill=(100, 80, 60), width=8)
d.rectangle([200, 300, 250, 350], fill=(80, 60, 40))
save(img, "oil-derrick.png")

# 6. money.png — green bills on transparent
img = Image.new("RGBA", (500, 500), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
for i in range(5):
    x = 50 + i * 90
    y = 50 + (i % 2) * 100
    d.rounded_rectangle([x, y, x + 120, y + 80], fill=(50, 150, 50), outline=INK, width=3, radius=8)
save(img, "money.png")

# 7. clock.png — clock face on transparent
img = Image.new("RGBA", (400, 400), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.ellipse([50, 50, 350, 350], fill=(240, 240, 230), outline=INK, width=4)
d.line([200, 200, 200, 100], fill=INK, width=6)   # minute hand
d.line([200, 200, 280, 180], fill=INK, width=6)   # hour hand
save(img, "clock.png")

# 8. green-book.png — green book on transparent
img = Image.new("RGBA", (500, 500), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rounded_rectangle([100, 150, 400, 350], fill=TEAL, outline=INK, width=4, radius=12)
d.line([250, 150, 250, 350], fill=INK, width=3)   # spine
save(img, "green-book.png")

# 9. government.png — building on transparent
img = Image.new("RGBA", (500, 500), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rectangle([150, 100, 350, 400], fill=(180, 170, 150), outline=INK, width=3)
d.rectangle([180, 150, 320, 250], fill=(200, 190, 170), outline=INK, width=2)  # windows
save(img, "government.png")

# 10. gold-coin.png — gold coin on transparent
img = Image.new("RGBA", (400, 400), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.ellipse([50, 50, 350, 350], fill=GOLD, outline=INK, width=4)
d.ellipse([90, 90, 310, 310], outline=(200, 150, 30), width=2)
save(img, "gold-coin.png")

# 11. crowd.png — dark silhouette on transparent
img = Image.new("RGBA", (500, 500), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
for i in range(12):
    x = 40 + i * 35
    y = 200 + (i % 3) * 40
    d.ellipse([x, y, x + 50, y + 200], fill=(60, 50, 40, 255))
save(img, "crowd.png")

# 12. fire-smoke.png — smoke/fire on transparent
img = Image.new("RGBA", (550, 550), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
for i in range(15):
    x = 100 + i * 25
    y = 400 - i * 20
    r = 30 + i * 8
    color = (200 - i * 10, 80 - i * 4, 20, max(0, 255 - i * 15))
    d.ellipse([x - r, y - r, x + r, y + r], fill=color)
save(img, "fire-smoke.png")

print("\nAll placeholder images created in", OUT)
print("NOTE: Replace these with real AI-generated assets (gen_image.py + cutout.py)")
print("      when the Gemini API quota resets.")
