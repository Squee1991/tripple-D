<template>
  <main class="page">
    <h1 class="title">🎵 Die vier Fälle</h1>
    <section class="row">
      <div class="col text">
        <div class="stanza staircase">
          <div class="line">Nominativ ist ganz famos,</div>
          <div class="line">
            <span class="R">R</span><span class="E">E</span><span class="S">S</span><span class="E">E</span> hilft – und
            alles bloß:
          </div>
          <div class="line">
            de<span class="R">r</span> Mann, di<span class="E">e</span> Frau, da<span class="S">s</span> Kind, di<span
              class="E">e</span> Leut’,
          </div>
          <div class="line">RESE sing, dann weißt du’s heute.</div>
        </div>
        <div class="refrain kidfont staircase small-steps">
          <div class="line">Refrain (Nominativ):</div>
          <div class="line">RESE RESE – merk es dir,</div>
          <div class="line">Nominativ das lernen wir! (x2)</div>
        </div>
      </div>
      <div class="col art">
        <img :src="NoteIcon" alt="Musical notes" class="note-icon"/>
      </div>
    </section>
    <section class="row row--reverse">
      <div class="col text">
        <div class="stanza staircase">
          <div class="line">Akkusativ kommt gleich danach,</div>
          <div class="line">
            <span class="N">N</span><span class="E">E</span><span class="S">S</span><span class="E">E</span> tanzt – und
            macht dich wach:
          </div>
          <div class="line">
            de<span class="N">n</span> Mann, di<span class="E">e</span> Frau, da<span class="S">s</span> Kind, di<span
              class="E">e</span> Leut’,
          </div>
          <div class="line">NESE sing, das lernst du heute.</div>
        </div>
        <div class="refrain kidfont staircase small-steps">
          <div class="line">Refrain (Akkusativ):</div>
          <div class="line">NESE NESE – merk es dir,</div>
          <div class="line">Akkusativ das lernen wir! (x2)</div>
        </div>
      </div>
      <div class="col art">
        <img :src="NoteIcon" alt="Musical notes" class="note-icon"/>
      </div>
    </section>
    <section class="row">
      <div class="col text">
        <div class="stanza staircase">
          <div class="line">Dativ klingt wie ein Gedicht,</div>
          <div class="line">
            <span class="M">M</span><span class="R">R</span><span class="M">M</span><span class="N">N</span> vergisst
            man nicht:
          </div>
          <div class="line">
            de<span class="M">m</span> Mann, de<span class="R">r</span> Frau, de<span class="M">m</span> Kind, de<span
              class="N">n</span> Leut’,
          </div>
          <div class="line">MRMN sing, es bleibt dir heute.</div>
        </div>
        <div class="refrain kidfont staircase small-steps">
          <div class="line">Refrain (Dativ):</div>
          <div class="line">MRMN MRMN – merk es dir,</div>
          <div class="line">Dativ ja das lernen wir! (x2)</div>
        </div>
      </div>
      <div class="col art">
        <img :src="NoteIcon" alt="Musical notes" class="note-icon"/>
      </div>
    </section>
    <section class="row row--reverse">
      <div class="col text">
        <div class="stanza staircase">
          <div class="line">Genitiv klingt stark und klar,</div>
          <div class="line">
            <span class="S">S</span><span class="R">R</span><span class="S">S</span><span class="R">R</span> ist
            wunderbar:
          </div>
          <div class="line">
            de<span class="S">s</span> Mannes, de<span class="R">r</span> Frau, de<span class="S">s</span> Kindes,
            de<span class="R">r</span> Leut’,
          </div>
          <div class="line">SRSR sing, das kannst du heute.</div>
        </div>
        <div class="refrain kidfont staircase small-steps">
          <div class="line">Refrain (Genitiv):</div>
          <div class="line">SRSR – merk es dir,</div>
          <div class="line">Genitiv das lernen wir! (x2)</div>
        </div>
      </div>
      <div class="col art">
        <img :src="NoteIcon" alt="Musical notes" class="note-icon"/>
      </div>
    </section>
    <section class="row row--center">
      <div class="col text">
        <div class="final kidfont staircase">
          <div class="line"><strong>Finaler Refrain:</strong></div>
          <div class="line">RESE, NESE – klar und fein</div>
          <div class="line">MRMN, SRSR – merk dir’s ein</div>
          <div class="line">Vier Fälle – wir lernen mehr</div>
          <div class="line">sing es laut, dann fällt’s nicht schwer! (x2)</div>
        </div>
      </div>
      <div class="col art">
        <img :src="NoteIcon" alt="Musical notes" class="note-icon note-icon--big"/>
      </div>
    </section>
  </main>
</template>

<script setup>
import NoteIcon from '../assets/images/song-images/musical-notes.svg'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Luckiest+Guy&display=swap');

.page {
  background: #fff;
  color: #222;
  min-height: 100vh;
  padding: clamp(14px, 4vw, 36px);
  font-family: 'Baloo 2', cursive;
  font-size: clamp(18px, 2.7vw, 22px);
  line-height: 1.9;
}

.title {
  font-weight: 800;
  text-align: center;
  font-size: clamp(28px, 6.2vw, 52px);
  margin: 0 0 1rem;
}

/* FLEX */
.row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(16px, 4vw, 36px);
  margin: clamp(12px, 3vw, 24px) 0;
}

.row--reverse {
  flex-direction: row-reverse;
}

.row--center {
  justify-content: center;
}

/* КОЛОНКИ (свои классы у картинок) */
.note-icon {
  width: 100%;
  max-width: 300px; /* ограничение размера */
  height: auto;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, .18));
}

.note-icon--big {
  max-width: 300px; /* даже «большая» не больше 300px */
}

/* СТАНЦЫ + ПРИПЕВЫ */
.stanza {
  font-weight: 600;
}

.refrain, .final {
  font-weight: 800;
}

/* ЛЕСТНИЦА */
.staircase .line {
  margin: .1em 0;
  padding-left: var(--pl, 0px);
}

.staircase .line:nth-child(1) {
  --pl: 0px;
}

.staircase .line:nth-child(2) {
  --pl: 16px;
}

.staircase .line:nth-child(3) {
  --pl: 32px;
}

.staircase .line:nth-child(4) {
  --pl: 48px;
}

.staircase .line:nth-child(5) {
  --pl: 64px;
}

.small-steps .line:nth-child(1) {
  --pl: 0px;
}

.small-steps .line:nth-child(2) {
  --pl: 12px;
}

.small-steps .line:nth-child(3) {
  --pl: 24px;
}

/* ПУХЛЫЕ БУКВЫ */
.R, .E, .S, .N, .M {
  font-family: 'Luckiest Guy', cursive;
  font-weight: 800;
  font-size: 1.15em;
  padding: 0 .05em;
  -webkit-text-stroke: 1px #000;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, .25);
}

.R {
  color: #ff3b30;
}

.E {
  color: #22c55e;
}

.S {
  color: #007aff;
}

.N {
  color: #f59e0b;
}

.M {
  color: #8b5cf6;
}


@media (max-width: 860px) {
  .row, .row--reverse, .row--center {
    flex-direction: column;
  }

  .note-icon {
    max-width: 260px;
  }

  .note-icon--big {
    max-width: 280px;
  }

  .staircase .line:nth-child(2) {
    --pl: 10px;
  }

  .staircase .line:nth-child(3) {
    --pl: 20px;
  }

  .staircase .line:nth-child(4) {
    --pl: 30px;
  }

  .staircase .line:nth-child(5) {
    --pl: 40px;
  }
}
</style>
