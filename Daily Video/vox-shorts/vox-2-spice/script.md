# vox-2-spice — "The Spice Trade: How Pepper Built Empires"

40.5s vertical (1080×1920) · voice: ElevenLabs Liam · no music bed (SFX only)

## STATUS: composition written + registered · AWAITING IMAGE LAYERS (Gemini quota exhausted)

- vox-shorts/vox-2-spice/script.md — this file (done)
- vox-shorts/vox-2-spice/beats.json — real ElevenLabs word times (done, gen_voice.py ran)
- vox-shorts/vox-2-spice/voice/voice.wav — generated (done, cached by text-hash)
- vox-shorts/vox-2-spice/sfx-plan.json — done (distinct palette from coffee)
- remotion/src/shots/vox-2/Vox2Spice.tsx — done (registered via `npm run gen`)
- remotion/src/shots/vox-2/vo.gen.ts — done (auto-generated)
- BLOCKED: 6 image layers (paper, map, pepper, ship, coin, fort) — Gemini 429 quota, ~21h wait

Reference: vox-1-coffee (completed). Same 6-beat grammar, same seamless-loop rule, no CTA outro.

## Facts (to verify before voice gen)

- Black pepper is native to the Malabar Coast (Kerala, India)
- In medieval Europe, pepper was worth more than gold by weight
- Arab traders controlled overland routes; Venetian merchants controlled Mediterranean distribution and marked prices up ~1000%
- Vasco da Gama reached Calicut (Kozhikode), India in 1498 — opening the sea route
- Portugal, then the Dutch VOC, then the British East India Company each dominated the spice trade in turn
- The spice trade funded colonial empires, drew borders, and launched the modern global economy
- Today black pepper is the world's most traded spice and sits on nearly every table

## Beat sheet

| t (s) | beat | on screen | VO |
|---|---|---|---|
| 0–4.5 | HOOK | Title "The spice trade built empires" + pepper sack places on paper; chapter chip. Slow push. | Pepper wasn't just a spice. It was gold you could eat. |
| 4.5–10.5 | ORIGIN | Map places on Malabar Coast; PEPPER chip pins on "Malabar"; peppercorn branch parallax | On India's Malabar Coast, black peppercorns grew wild—worth their weight in silver. |
| 10.5–19 | TRADE | Dashed route draws across the Indian Ocean to Venice; ship cutout sails | Arab caravans carried them across deserts. Venetian merchants sold them in Europe at a thousand percent markup. |
| 19–26 | DOMINION | Vasco da Gama ship arrives; PORTUGAL chip; then DUTCH, then BRITISH EAST INDIA chips slide in | Kings sent fleets. Vasco da Gama sailed to Calicut. Portugal, then Holland, then Britain—each seized the spice trade by force. |
| 26–33 | EXCHANGE | Archival trading post / fort places over map; statement "Empires. Borders. **Modern world.**" | The spice trade built empires, drew borders, and launched the modern world. |
| 33–40 | TODAY/LOOP | Camera returns to page-1 wide; pepper sack pops back; title fades back in; stat chip. Last frame ≈ frame 0 → seamless replay. | Today pepper sits on every table. Cheap. Common. And still the king of spices. |

## Layers (to generate — new assets, not reused from coffee)

- paper.png · map.png · pepper.png (cutout) · ship.png (cutout) · coin.png (cutout) · fort.png (cutout)

## Production notes

- Cues estimated from beats.json windows first; after gen_voice.py writes REAL times, retime the CUES table in the shot
- Loop rule: frame 0 == last frame (pepper sack + title ≈ frame 0)
- No CTA outro — the loop IS the ending
- SFX pass after voice: paper slides, place thuds, ship creaks, coin clinks, stamp slam (hero moment on "seized"), route scribble, soft whoosh per camera move
