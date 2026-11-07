import React from 'react';
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import {
  CollageBoard,
  Cutout,
  Grain,
  LabelChip,
  PaperBG,
  RubberStamp,
  SerifStatement,
  SketchArrow,
  VOX,
} from '../../lib/collage';

// =============================================================================
// COMPOSITION CONFIG — "The Spice Trade: How Pepper Built Empires", vox-2.
// Distinct from vox-1 coffee: map-as-full-canvas, horizontal camera journey
// across the trade route, ships sailing instead of route arrows, gold/yellow
// accent palette instead of paper/red.
// Beats + VO contract: vox-shorts/vox-2-spice/beats.json (real ElevenLabs times).
// =============================================================================
export const compositionConfig = {
  id: 'Vox2Spice',
  durationInSeconds: 40.5,
  fps: 30,
  width: 1080,
  height: 1920,
};

const W = 1080;
const H = 1920;
const asset = (f: string) => staticFile(`projects/vox-2-spice/layers/${f}`);

// =============================================================================
// CUES (GLOBAL frames @30) — retimed to real ElevenLabs word times from
// beats.json. Keep every cue HERE.
// =============================================================================
const CUE = {
  hookTitle: -16,    // title present at f0 (loop match: last frame ≈ f0)
  hookSack: -20,     // pepper sack settled at f0 (loop match: last frame ≈ f0)
  hookChip: -40,     // chapter chip present at f0 (loop match: last frame ≈ f0)

  originStart: 160,       // camera holds center through hook, then to Malabar (right)
  malabarChip: 165,       // "Malabar" chip pins on "Malabar" (5.3s)
  malabarChipFade: 800,   // Malabar chip fades out before the fort arrives (f846)
  pepperSackIndia: 165,   // sack near India (right side) at origin
  removeIndiaSack: 420,   // sack fades out before the boat (f450)

  tradeStart: 318,   // camera pans left across ocean
  routeDraw: 395,    // dashed route draws on "deserts" (12.4s)
  veniceChip: 427,   // "Venice" chip pins on "Venetian" (13.45s)
  shipSail: 450,     // boat leaves Malabar (right) -> Venice (left) along the arrow

  dominionStart: 576, // scene mount; "Kings" hits 19.2s (f576)
  vascoShip: 580,     // Vasco ship arrives at Malabar (right)
  calicutChip: 655,   // "Calicut" chip on "Calicut" (21.85s)
  portugalChip: 683,  // "Portugal" chip (22.78s)
  dutchChip: 720,     // "Dutch VOC" chip
  britishChip: 756,   // "East India Co." chip on "Britain" (24.26s)
  stamp: 765,         // "SEIZED" stamp slams on "seized" (25.2s)

  exchangeStart: 804, // scene mount; line starts 26.8s (f804)
  fortPlace: 846,     // trading post fort places on "empires" (28s)
  statement: 935,     // "Empires. Borders. Modern world." statement

  todayStart: 996,    // scene mount; camera heads home — starts right as map fade ends (f996), closing the blank gap
  sackBack: 996,      // pepper sack returns as camera settles home (sits during the silence before "Today" VO)
  titleBack: 1060,    // title fades back in
  statChip: 1167,     // "The king of spices" chip on "king" (38.9s)
} as const;

// Camera: centered hook -> Malabar/right (origin) -> left across ocean to Venice (trade, with boat)
// -> back to Malabar/right (dominion, chips) -> center (today/loop).
const CAM = [
  { f: 0,    x: 540, y: 960, z: 1 },   // hook: centered, safe (like coffee)
  { f: 80,   x: 540, y: 960, z: 1.06 },// subtle centered zoom-in during hook
  { f: 160,  x: 540, y: 960, z: 1 },   // hold center through the hook
  { f: 205,  x: 780, y: 1000, z: 1.6 },// origin: zoom into Malabar Coast (right)
  { f: 450,  x: 640, y: 920, z: 1.3 }, // trade mid-left with the boat
  { f: 560,  x: 440, y: 860, z: 1.3 }, // Venice (left), trade end
  { f: 700,  x: 760, y: 980, z: 1.25 },// dominion: back to Malabar/right for chips + stamp
  { f: 1000, x: 540, y: 960, z: 1 },   // today: return to center
  { f: 1214, x: 540, y: 960, z: 1 },   // loop back to f0
];

// Map geometry (map layer 1200px wide, centered 540/960; points are source fractions)
const MAP = { cx: 540, cy: 960, w: 1200 };
const mapPt = (fx: number, fy: number) => ({
  x: MAP.cx - MAP.w / 2 + fx * MAP.w,
  y: MAP.cy - MAP.w / 2 + fy * MAP.w,
});
// India / Malabar Coast is on the RIGHT side of a world map
const MALABAR = mapPt(0.72, 0.58);
// Venice / Europe is on the LEFT/upper side of a world map
const VENICE = mapPt(0.38, 0.32);
const ROUTE = `M ${MALABAR.x} ${MALABAR.y} Q ${(MALABAR.x + VENICE.x) / 2} ${Math.min(MALABAR.y, VENICE.y) - 100} ${VENICE.x} ${VENICE.y}`;

const TITLE_WORDS = [{ t: 'The' }, { t: 'spice', hl: true }, { t: 'trade' }, { t: 'built' }, { t: 'empires' }];


// Fades a whole scene's layers out over its last `dur` LOCAL frames.
const SceneFade: React.FC<{ out: number; dur?: number; children: React.ReactNode }> = ({ out, dur = 14, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [out - dur, out], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity: op }}>{children}</div>;
};

const Vox2Spice: React.FC = () => {

  return (
    <AbsoluteFill style={{ backgroundColor: VOX.paperDeep }}>
      <CollageBoard cam={CAM}>
        <PaperBG src={asset('paper_1.png')} w={W} h={H} />

        {/* ---- MAP SCENERY (starts AFTER the centered hook, at origin -> India right) ---- */}
        <Sequence from={CUE.originStart} durationInFrames={830} layout="none">
          <SceneFade out={836} dur={22}>
            <Cutout src={asset('map.png')} x={MAP.cx} y={MAP.cy} w={MAP.w} at={5} dur={16} enter="place" rotate={-1} sticker={0} shadow={3} drift={0.4} />
            {/* Sack near India (right) at origin — removed before the boat at 15s */}
            <SceneFade out={CUE.removeIndiaSack - CUE.originStart} dur={20}>
              <Cutout
                src={asset('pepper.png')}
                x={MALABAR.x}
                y={MALABAR.y + 40}
                w={340}
                at={CUE.pepperSackIndia - CUE.originStart}
                enter="place"
                rotate={4}
                depth={0.12}
                sticker={6}
                shadow={2}
              />
            </SceneFade>
            {/* Malabar chip sits clear of the sack and fades out before the fort arrives */}
            <Sequence from={CUE.malabarChip - CUE.originStart} layout="none">
              <SceneFade out={CUE.malabarChipFade - CUE.malabarChip} dur={22}>
                <LabelChip x={MALABAR.x + 180} y={MALABAR.y + 220} at={0} text="Malabar" kicker="~ 800 AD" accent={VOX.red} size={24} rotate={-2} depth={0.03} />
              </SceneFade>
            </Sequence>
          </SceneFade>
        </Sequence>

        {/* ---- HOOK (0–4s): centered, safe — title + sack + chip, no map yet (like coffee) ---- */}
        <Sequence from={0} durationInFrames={160} layout="none">
          <SceneFade out={157}>
            <SerifStatement x={540} y={380} w={960} at={CUE.hookTitle} size={82} words={TITLE_WORDS} backing />
            <Cutout src={asset('pepper.png')} x={540} y={1150} w={500} at={CUE.hookSack} enter="place" rotate={-2} depth={0.08} shadow={3} />
            <LabelChip x={540} y={1580} at={CUE.hookChip} text="A grain that built empires" kicker="Chapter one" accent={VOX.yellow} size={32} rotate={-1} />
          </SceneFade>
        </Sequence>

        {/* ---- TRADE (10.5–19s): camera left across ocean; sack gone; boat Malabar->Venice along arrow ---- */}
        <Sequence from={CUE.tradeStart} durationInFrames={260} layout="none">
          <SceneFade out={252} dur={20}>
            <SketchArrow id="spiceRoute" d={ROUTE} vb={{ w: W, h: H }} at={CUE.routeDraw - CUE.tradeStart} dur={60} dashed color={VOX.red} width={6} />
            <Sequence from={CUE.veniceChip - CUE.tradeStart} layout="none">
              <LabelChip x={VENICE.x} y={VENICE.y - 60} at={0} text="Venice" kicker="1400s" accent={VOX.teal} size={26} rotate={2} depth={0.03} />
            </Sequence>
          </SceneFade>
        </Sequence>

        {/* ---- DOMINION (19–26s): Vasco ship at Malabar right; chips + SEIZED stamp arranged beautiful, no overlap ---- */}
        <Sequence from={CUE.dominionStart} durationInFrames={230} layout="none">
          <SceneFade out={220} dur={16}>
            <Cutout src={asset('ship.png')} x={MALABAR.x - 60} y={MALABAR.y - 120} w={350} at={CUE.vascoShip - CUE.dominionStart} enter="slide-r" rotate={3} depth={0.06} sticker={5} shadow={3} drift={0} />
            <RubberStamp text="SEIZED" x={MALABAR.x - 244} y={MALABAR.y - 256} at={CUE.stamp - CUE.dominionStart} size={72} rotate={-10} z={6} />
            <LabelChip x={MALABAR.x - 324} y={MALABAR.y + 284} at={CUE.calicutChip - CUE.dominionStart} enter="fade" dur={14} text="Calicut" kicker="1498" accent={VOX.red} size={28} rotate={-2} depth={0.03} />
            <LabelChip x={MALABAR.x - 44} y={MALABAR.y + 284} at={CUE.portugalChip - CUE.dominionStart} enter="fade" dur={14} text="Portugal" kicker="1500s" accent={VOX.yellow} size={28} rotate={1.5} depth={0.03} />
            <LabelChip x={MALABAR.x - 324} y={MALABAR.y + 414} at={CUE.dutchChip - CUE.dominionStart} enter="fade" dur={14} text="Dutch VOC" kicker="1600s" accent={VOX.teal} size={28} rotate={-1} depth={0.03} />
            <LabelChip x={MALABAR.x - 24} y={MALABAR.y + 414} at={CUE.britishChip - CUE.dominionStart} enter="fade" dur={14} text="East India Co." kicker="1600s" accent={VOX.ink} size={28} rotate={2} depth={0.03} />
          </SceneFade>
        </Sequence>

        {/* ---- EXCHANGE (26–33s): fort + statement ---- */}
        <Sequence from={CUE.exchangeStart} durationInFrames={170} layout="none">
          <SceneFade out={166}>
            <Cutout src={asset('fort.png')} x={MALABAR.x - 30} y={MALABAR.y + 80} w={450} at={CUE.fortPlace - CUE.exchangeStart} dur={20} enter="place" rotate={-3} depth={0.05} sticker={5} shadow={3} />
            <SerifStatement
              x={540}
              y={1350}
              w={900}
              at={CUE.statement - CUE.exchangeStart}
              size={80}
              backing
              words={[{ t: 'Empires.' }, { t: 'Borders.' }, { t: 'Modern world.', hl: true }]}
            />
          </SceneFade>
        </Sequence>

        {/* ---- TODAY / LOOP (33–40.5s): back to page-1 composition ≈ frame 0 ---- */}
        <Sequence from={CUE.todayStart} layout="none">
          <Cutout src={asset('pepper.png')} x={540} y={1150} w={500} at={CUE.sackBack - CUE.todayStart} enter="place" rotate={-2} depth={0.08} shadow={3} />
          <Sequence from={CUE.titleBack - CUE.todayStart} layout="none">
            <SerifStatement x={540} y={380} w={960} at={0} size={82} words={TITLE_WORDS} backing />
          </Sequence>
          <LabelChip x={540} y={1580} at={CUE.statChip - CUE.todayStart} text="The king of spices" kicker="Today" accent={VOX.yellow} size={32} rotate={-1} />
        </Sequence>
      </CollageBoard>
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};

export default Vox2Spice;
