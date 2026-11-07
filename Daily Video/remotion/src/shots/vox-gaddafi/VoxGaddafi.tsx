import React from 'react';
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { FONT_EDITORIAL } from '../../fonts';
import beats from '../../../../vox-shorts/gaddafi-story/beats.json';
import {
  ArchivalPhoto,
  CollageBoard,
  Cutout,
  EASE_OUT,
  Grain,
  LabelChip,
  PaperBG,
  RubberStamp,
  SerifStatement,
  SketchArrow,
  VOX,
} from '../../lib/collage';

// =============================================================================
// COMPOSITION CONFIG — "The Captain Who Owned a Nation" (Gaddafi, vox short).
// Beats + VO contract: vox-shorts/gaddafi-story/beats.json.
// Duration 42s, 1080×1920 @30. Frame 0 ≈ last frame for seamless loop.
// =============================================================================
export const compositionConfig = {
  id: 'VoxGaddafi',
  durationInSeconds: 42,
  fps: 30,
  width: 1080,
  height: 1920,
};

const W = 1080;
const H = 1920;
const asset = (f: string) => staticFile(`projects/gaddafi-story/layers/${f}`);

// =============================================================================
// CUES (GLOBAL frames @30) — estimated from beats.json windows; retimed to real
// word starts after gen_voice.py writes actual times. Keep every cue HERE.
// =============================================================================
const CUE = {
  // Hook — real ElevenLabs timings (0.4–4.58s)
  // Frame 0 shows the fully composed hook (title + portrait + chip) so the
  // seamless loop (frame-0 == last-frame) holds: the loop sequence returns
  // to this same composition at the end.
  hookTitle: -30,    // title fully visible at f0 (enter lead-in)
  hookPortrait: -10, // portrait fully visible at f0 (enter lead-in)
  crownFall: 45,     // ~1.5s — crown falls (dynamic element)
  hookChip: -10,     // chip fully visible at f0 (enter lead-in)
  // Setup (4.1–10.17s)
  setupStart: 123,   // "It" 4.1s — scene mount
  oilDerrick: 131,   // "1969." 4.38s — derrick rises
  moneyFlow: 246,    // "—" 8.19s — money flows
  setupChip: 275,    // "oil." 9.17s — 1969 chip
  // Quiz/Tension (10.6–14.82s)
  quizStart: 318,    // "How" 10.6s — scene mount
  timeline: 363,     // "absolute" 12.09s — timeline unspools
  clock: 409,        // "42" 13.15s — clock ticks
  quizChip: 445,     // "years?" 14.83s — "42 years" chip
  // Reveal (16.6–23.79s)
  revealStart: 498,  // "The" 16.6s — scene mount
  greenBook: 505,    // "Green" 16.82s — Green Book slams
  govCrumbles: 513,  // "Book." 17.11s — governments crumble
  riverStart: 589,   // "Great" 19.62s — pipeline draws
  riverEnd: 621,     // "River" 20.71s — pipeline lands
  // Twist (26.1–32.32s)
  twistStart: 783,   // "Then" 26.1s — scene mount
  goldCoins: 810,    // ~27.0s — dinar coins scatter
  crowdRise: 930,    // ~31.0s — crowds rise
  regimeFall: 970,   // ~32.3s — regime falls
  // Seamless Loop (35.1–42s)
  loopStart: 1053,   // 35.1s — scene mount
  titleBack: 1080,   // 36.0s — title returns
  portraitBack: 1110, // 37.0s — portrait returns
  loopChip: 1140,    // 38.0s — loop chip
  lastFrame: 1260,   // 42.0s = frame 0
} as const;

// Camera: one journey across the collage board.
// Push on hook → dive into map (setup) → pan right (quiz) → center (reveal) →
// hold (twist) → return to page-1 framing for the loop.
const CAM = [
  { f: 0, x: 540, y: 960, z: 1 },
  { f: 137, x: 540, y: 960, z: 1.08 },
  { f: 306, x: 380, y: 820, z: 1.7 },
  { f: 445, x: 380, y: 820, z: 1.7 },
  { f: 498, x: 700, y: 950, z: 1.3 },
  { f: 714, x: 700, y: 950, z: 1.3 },
  { f: 783, x: 540, y: 950, z: 1.15 },
  { f: 970, x: 540, y: 950, z: 1.05 },
  { f: 1053, x: 540, y: 960, z: 1 },
  { f: 1260, x: 540, y: 960, z: 1 },
];

// Map geometry (map layer 1100px wide, centered 540/960; points are source fractions)
const MAP = { cx: 540, cy: 960, w: 1100 };
const mapPt = (fx: number, fy: number) => ({
  x: MAP.cx - MAP.w / 2 + fx * MAP.w,
  y: MAP.cy - MAP.w / 2 + fy * MAP.w,
});
const TRIPOLI = mapPt(0.25, 0.30);
const BENGHAZI = mapPt(0.75, 0.30);
const SABHA = mapPt(0.50, 0.70);
const SIRTE = mapPt(0.55, 0.35);
const OIL = mapPt(0.45, 0.65);

const TITLE_WORDS = [
  { t: 'The' }, { t: 'Captain', hl: true },
  { t: 'Who' }, { t: 'Owned', hl: true },
  { t: 'a' }, { t: 'Nation' },
];

// Fades a whole scene's layers out over its last `dur` local frames.
const SceneFade: React.FC<{ out: number; dur?: number; children: React.ReactNode }> = ({ out, dur = 14, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [out - dur, out], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div style={{ opacity: op }}>{children}</div>;
};

const capWords = beats.vo.flatMap((b) =>
  b.words.map((w) => ({ text: w.w, startF: Math.round(w.start * 30), endF: Math.round(w.end * 30) }))
);

// Word-exact subtitles synced to the ElevenLabs timings in beats.json. Fixed on
// screen (outside the camera board) so they stay readable under the zoom.
const CaptionStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const active = capWords.find((w) => frame >= w.startF && frame <= w.endF);
  if (!active) return null;
  // Fully opaque for the whole spoken window; 1-frame fade in/out at the edges
  // so the word lands exactly when spoken instead of fading in after it.
  const enterP = interpolate(frame, [active.startF - 1, active.startF], [0, 1], {
    easing: EASE_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitP = interpolate(frame, [active.endF, active.endF + 1], [1, 0], {
    easing: EASE_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p = Math.min(enterP, exitP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 540,
        top: 1720,
        transform: 'translateX(-50%)',
        opacity: p,
        fontFamily: FONT_EDITORIAL,
        fontSize: 52,
        fontWeight: 700,
        color: VOX.ink,
        textAlign: 'center',
        lineHeight: 1.2,
        textShadow:
          '0 2px 8px rgba(255,255,255,0.9), 0 1px 2px rgba(40,28,12,0.35)',
      }}
    >
      {active.text}
    </div>
  );
};

const VoxGaddafi: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: VOX.paper }}>
      <CollageBoard cam={CAM}>
        <PaperBG src={asset('paper.png')} w={W} h={H} />

        {/* ---- HOOK (0–4s): portrait + map + crown fall, slow push ---- */}
        <Sequence from={0} durationInFrames={120} layout="none">
          <SceneFade out={117}>
            <SerifStatement
              x={540} y={380} w={960} at={CUE.hookTitle} size={84}
              words={TITLE_WORDS}
            />
            <Cutout
              src={asset('gaddafi-portrait.png')} x={540} y={1250} w={560}
              at={CUE.hookPortrait} enter="place" rotate={2} depth={0.09} shadow={3}
            />
            <Cutout
              src={asset('crown.png')} x={540} y={200} w={260}
              at={CUE.crownFall} enter="slide-l" rotate={-4} depth={0.06} shadow={2}
            />
            <LabelChip
              x={540} y={1560} at={CUE.hookChip} text="At 27 — without a shot"
              kicker="Loop" accent={VOX.yellow} kickerColor={VOX.inkSoft} size={34} rotate={-1.2}
            />
          </SceneFade>
        </Sequence>

        {/* ---- MAP scenery (persists under setup → reveal, leaves before loop) ---- */}
        <Sequence from={60} durationInFrames={990} layout="none">
          <SceneFade out={986} dur={24}>
            <Cutout
              src={asset('libya-map.png')} x={MAP.cx} y={MAP.cy} w={MAP.w}
              at={5} dur={16} enter="place" rotate={-1} sticker={0} shadow={3} drift={0.4}
            />
          </SceneFade>
        </Sequence>

        {/* ---- SETUP (4.1–10.5s): oil derricks rise, money flows ---- */}
        <Sequence from={CUE.setupStart} durationInFrames={195} layout="none">
          <SceneFade out={191}>
            <Cutout
              src={asset('oil-derrick.png')} x={OIL.x} y={OIL.y + 100} w={320}
              at={CUE.oilDerrick - CUE.setupStart} enter="rise" rotate={-3} depth={0.08} sticker={4} shadow={2}
            />
            <Cutout
              src={asset('money.png')} x={540} y={1450} w={420}
              at={CUE.moneyFlow - CUE.setupStart} enter="slide-r" rotate={2} depth={0.07} sticker={4} shadow={2}
            />
            <LabelChip
              x={TRIPOLI.x} y={TRIPOLI.y + 70} at={CUE.setupChip - CUE.setupStart}
              text="1969 · bloodless coup" kicker="Free Officers" accent={VOX.red}
              size={26} rotate={-2} depth={0.03}
            />
          </SceneFade>
        </Sequence>

        {/* ---- QUIZ/TENSION (10.6–16.5s): timeline, clock, 42 years ---- */}
        <Sequence from={CUE.quizStart} durationInFrames={180} layout="none">
          <SceneFade out={176}>
            <SketchArrow
              id="timeline1" d={`M ${TRIPOLI.x} ${TRIPOLI.y} L ${SIRTE.x} ${SIRTE.y} L ${SABHA.x} ${SABHA.y}`}
              vb={{ w: W, h: H }} at={CUE.timeline - CUE.quizStart} dur={45} dashed
              color={VOX.ink} width={5}
            />
            <Cutout
              src={asset('clock.png')} x={700} y={1100} w={300}
              at={CUE.clock - CUE.quizStart} enter="place" rotate={5} depth={0.09} sticker={4} shadow={2}
            />
            <LabelChip
              x={700} y={1220} at={CUE.quizChip - CUE.quizStart}
              text="42 years" kicker="absolute rule" accent={VOX.red}
              size={30} rotate={1.5} depth={0.03}
            />
          </SceneFade>
        </Sequence>

        {/* ---- REVEAL (16.6–26.0s): Green Book, crumbling governments, Great Man-Made River ---- */}
        <Sequence from={CUE.revealStart} durationInFrames={315} layout="none">
          <SceneFade out={311}>
            <Cutout
              src={asset('green-book.png')} x={540} y={700} w={460}
              at={CUE.greenBook - CUE.revealStart} enter="place" rotate={-3} depth={0.1} sticker={6} shadow={3}
            />
            <ArchivalPhoto
              src={asset('government.png')}
              x={320} y={1050} w={420}
              at={CUE.govCrumbles - CUE.revealStart} enter="place" rotate={-4} depth={0.06}
              caption="Royal government — dismantled"
            />
            <SketchArrow
              id="river1" d={`M ${SABHA.x} ${SABHA.y} Q ${(SABHA.x + TRIPOLI.x) / 2} ${SABHA.y - 80} ${TRIPOLI.x} ${TRIPOLI.y}`}
              vb={{ w: W, h: H }} at={CUE.riverStart - CUE.revealStart} dur={60}
              color={VOX.teal} width={8}
            />
            <SerifStatement
              x={540} y={1350} w={920} at={CUE.govCrumbles - CUE.revealStart + 20} size={78} backing
              words={[
                { t: 'The' }, { t: 'Green', hl: true }, { t: 'Book' },
                { t: '—' }, { t: 'direct' }, { t: 'democracy', hl: true },
                { t: 'for' }, { t: 'the' }, { t: 'masses' },
              ]}
            />
          </SceneFade>
        </Sequence>

        {/* ---- TWIST (26.1–35.0s): gold dinar, Arab Spring, regime falls ---- */}
        <Sequence from={CUE.twistStart} durationInFrames={270} layout="none">
          <SceneFade out={266}>
            <Cutout
              src={asset('gold-coin.png')} x={400} y={900} w={340}
              at={CUE.goldCoins - CUE.twistStart} enter="slide-r" rotate={6} depth={0.09} sticker={4} shadow={2}
            />
            <Cutout
              src={asset('crowd.png')} x={740} y={1150} w={400}
              at={CUE.crowdRise - CUE.twistStart} enter="rise" rotate={-2} depth={0.08} sticker={4} shadow={2}
            />
            <Cutout
              src={asset('fire-smoke.png')} x={540} y={1400} w={480}
              at={CUE.regimeFall - CUE.twistStart} enter="place" rotate={3} depth={0.07} shadow={3}
            />
            <LabelChip
              x={540} y={1580} at={CUE.regimeFall - CUE.twistStart + 30}
              text="2011 · Sirte" kicker="Arab Spring" accent={VOX.red}
              size={30} rotate={-1} depth={0.03}
            />
          </SceneFade>
        </Sequence>

        {/* ---- SEAMLESS LOOP (35.1–42s): back to frame-0 composition ---- */}
        <Sequence from={CUE.loopStart} layout="none">
          <Cutout
            src={asset('gaddafi-portrait.png')} x={540} y={1250} w={560}
            at={-10} enter="place" rotate={2} depth={0.09} shadow={3}
          />
          <SerifStatement x={540} y={380} w={960} at={-30} size={84} words={TITLE_WORDS} />
          <LabelChip
            x={540} y={1560} at={-10}
            text="At 27 — without a shot" kicker="Loop" accent={VOX.yellow}
            kickerColor={VOX.inkSoft} size={34} rotate={-1.2}
          />
        </Sequence>
      </CollageBoard>
      <Grain opacity={0.055} />
      <CaptionStrip />
    </AbsoluteFill>
  );
};

export default VoxGaddafi;
