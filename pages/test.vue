<template>
  <div class="book-container">
    <div class="book3d" :class="stageClass">
      <!-- левая обложка -->
      <div class="cover cover--left" aria-hidden="true">
        <div class="cover__grain"></div>
        <div class="spine"></div>
      </div>

      <!-- листы -->
      <div
          v-for="(page, i) in pages"
          :key="i"
          class="page"
          :class="['z-' + (pages.length - i), { flipped: i < currentPage, turning: i === turningIndex }]"
          @click="flip(i)"
      >
        <div class="page__front">
          <div class="page__inner">
            <h2 class="ttl">{{ page.title }}</h2>
            <p class="txt">{{ page.content }}</p>
          </div>
        </div>
        <div class="page__back">
          <div class="page__inner page__inner--center">
            <template v-if="isUnlocked(page)">
              <p class="ok">✅ Доступ открыт</p>
              <button class="btn" @click.stop="go(page)">Перейти</button>
            </template>
            <p v-else class="lock">🔒 С уровня {{ page.level }}</p>
          </div>
        </div>
        <span class="edge edge--f" aria-hidden="true"></span>
        <span class="edge edge--b" aria-hidden="true"></span>
      </div>

      <!-- правая обложка (по клику — открыть/листнуть) -->
      <button
          class="cover cover--right"
          @click="stage==='closed' ? openCover() : flip(currentPage)"
          :aria-label="stage==='closed' ? 'Открыть книгу' : 'Листнуть вперёд'"
      >
        <div class="cover__grain"></div>
        <div class="cover__title">Немецкий</div>
      </button>

      <div class="stack stack--l" aria-hidden="true"></div>
      <div class="stack stack--r" aria-hidden="true"></div>
    </div>

    <div class="controls">
      <button class="nav" :disabled="stage!=='open' || currentPage===0" @click="prev">← Назад</button>
      <div class="progress">Стр. {{ Math.max(1, currentPage + 1) }} / {{ pages.length }}</div>
      <button class="nav" :disabled="stage==='open' ? currentPage>=pages.length-1 : false" @click="stage==='closed' ? openCover() : next">Вперёд →</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({ currentLevel: { type: Number, default: 1 } })
const router = useRouter()

// состояния: closed -> opening -> open
const stage = ref('closed')
const currentPage = ref(0)
const turningIndex = ref(-1)

const stageClass = computed(() => ({
  'is-closed': stage.value === 'closed',
  'is-opening': stage.value === 'opening',
  'is-open': stage.value === 'open'
}))

const pages = [
  { title: 'Глава 1', content: 'Артикли: der, die, das', level: 1, path: 'chapter-1' },
  { title: 'Глава 2', content: 'Правильные глаголы', level: 2, path: 'chapter-2' },
  { title: 'Глава 3', content: 'Падежи: Nominativ, Akkusativ', level: 3, path: 'chapter-3' },
  { title: 'Глава 4', content: 'Прилагательные', level: 4, path: 'chapter-4' },
]

function isUnlocked(p){ return props.currentLevel >= p.level }
function go(p){ if(isUnlocked(p)) router.push(`/quest/${p.path}`) }

function openCover(){
  stage.value = 'opening'
  // показываем страницы только после поворота обложки
  setTimeout(() => { stage.value = 'open' }, 650)
}

function flip(i){
  if(stage.value !== 'open'){ openCover(); return }
  turningIndex.value = i
  setTimeout(()=> turningIndex.value = -1, 900)
  if (i === currentPage.value) currentPage.value++
  else if (i < currentPage.value) currentPage.value = i
}
function next(){ if (currentPage.value < pages.length - 1) flip(currentPage.value) }
function prev(){ if (currentPage.value > 0) flip(currentPage.value - 1) }
</script>

<style scoped>
/* ===== сцена и наклон ===== */
.book-container{
  display:flex; flex-direction:column; align-items:center; gap:18px;
  padding:36px 16px; background:linear-gradient(#efe8d6,#e6dcc1);
}
.book3d{
  --w:820px; --h:520px;
  --cover-th: 12px;         /* толщина обложек */
  --inset: 14px;            /* утопление страниц внутрь обложки */
  --sheet-th: 2px;          /* визуальная толщина листа */
  --dur: .9s;
  width:var(--w); height:var(--h); position:relative;
  transform-style:preserve-3d; perspective:2200px;
  transform: rotateX(7deg) rotateZ(-2deg);
}
.book3d::after{
  content:""; position:absolute; inset:auto 6% -16px 6%;
  height:28px; filter:blur(12px);
  background:radial-gradient(120% 70% at 50% 0,#0005,#0000);
}

/* ===== закрыто/открывается/открыто ===== */
.book3d.is-closed .page{ visibility:hidden; pointer-events:none; }
.book3d.is-closed .stack{ opacity:0 }
.book3d.is-opening .page{ visibility:hidden; pointer-events:none; }
.book3d.is-open .page{ visibility:visible }

/* ===== обложки ===== */
.cover{
  position:absolute; top:0; width:calc(var(--w)/2); height:100%;
  border-radius:10px; overflow:hidden; transform-style:preserve-3d;
  box-shadow:0 20px 35px rgba(0,0,0,.25); border:1px solid #6f5a3a; z-index:90;
}
.cover--left{ left:0; background:#8b6b3e; }
.cover--right{
  right:0; background:#8b6b3e; cursor:pointer;
  transform-origin:left center;
  transition: transform var(--dur) cubic-bezier(.22,.61,.36,1);
}
/* обложка поворачивается только после клика (стадия opening) */
.book3d.is-closed   .cover--right{ transform: rotateY(0) }
.book3d.is-opening  .cover--right{ transform: rotateY(-175deg) }
.book3d.is-open     .cover--right{ transform: rotateY(-180deg) }

/* текстура и заголовок */
.cover__grain{
  position:absolute; inset:0;
  background:
      repeating-linear-gradient(90deg,#0000 0 6px,#0001 6px 7px),
      linear-gradient(180deg,#9a7a49,#7b5b2e);
  opacity:.65;
}
.cover__title{
  position:absolute; top:34px; left:40px;
  font: 800 30px/1.2 "Georgia", serif;
  letter-spacing:.04em; color:#f8f3e3;
  text-shadow:0 2px 2px #0006, 0 0 12px #fff4;
  backface-visibility:hidden; transform:translateZ(2px);
}

/* корешок */
.spine{
  position:absolute; left:calc(50% - 6px); top:0; width:12px; height:100%;
  background:linear-gradient(90deg,#0002,#0000,#0002);
}
.cover--left::before,.cover--right::before{
  content:""; position:absolute; top:0; width:var(--cover-th); height:100%;
  background:linear-gradient(#6b522f,#785b33); transform:translateZ(-1px);
}
.cover--left::before{ right:-1px; box-shadow:6px 0 10px #0003 inset; }
.cover--right::before{ left:-1px; box-shadow:-6px 0 10px #0003 inset; }

/* ===== листы ===== */
.page{
  position:absolute; top:var(--inset);
  left:calc(var(--w)/2 + var(--inset));
  width:calc(var(--w)/2 - var(--inset)*2);
  height:calc(var(--h) - var(--inset)*2);
  transform-origin:left center; transform-style:preserve-3d;
  transition: transform var(--dur) ease; cursor:pointer; z-index:40;
}
.page.flipped{ transform: rotateY(-180deg) }

.page__front,.page__back{
  position:absolute; inset:0; backface-visibility:hidden;
  background:#fff8de; border:1px solid #bfa97a; border-left:none;
  box-shadow:0 10px 25px rgba(0,0,0,.18);
}
.page__front{ z-index:2 }
.page__back{ transform:rotateY(180deg) }

.page__inner{
  height:100%; padding:42px 44px 40px 36px; box-sizing:border-box;
  display:flex; flex-direction:column; justify-content:center;
  font-family:"Georgia", serif; color:#2b2112;
}
.page__inner--center{ align-items:center; text-align:center }

.ttl{ margin:0 0 10px; font-size:28px; font-weight:700; }
.txt{ font-size:18px; line-height:1.5 }
.ok{ margin:0 0 12px; font-weight:700; color:#0a7f52 }
.lock{ margin:0; font-weight:700; color:#b72e2e }

/* толщина листов */
.edge{ position:absolute; top:0; width:var(--sheet-th); height:100%;
  background:linear-gradient(#d6c7a4,#f3e9cd); transform:translateZ(1px) }
.edge--f{ left:-1px; box-shadow:1px 0 0 #c5b38f }
.edge--b{ right:-1px; box-shadow:-1px 0 0 #c5b38f }

/* блик/сгиб при перевороте */
.page.turning .page__front::after,
.page.turning .page__back::after{
  content:""; position:absolute; inset:0;
  background:
      radial-gradient(120% 120% at 0% 50%, #00000018 0%, #00000006 40%, #0000 65%),
      linear-gradient(100deg,#ffffff00 20%, #ffffff80 45%, #ffffff00 70%);
  mix-blend-mode:soft-light; animation: curl var(--dur) ease both;
}
@keyframes curl{
  0%{ opacity:.0; transform:translateX(0) }
  20%{ opacity:.55; transform:translateX(-6px) }
  60%{ opacity:.35; transform:translateX(-16px) }
  100%{ opacity:.0; transform:translateX(-22px) }
}

/* стопки */
.stack{
  position:absolute; top:calc(var(--inset) + 4px);
  width:calc(var(--w)/2 - var(--inset)*2 - 8px);
  height:calc(var(--h) - var(--inset)*2 - 8px);
  pointer-events:none;
  background:
      repeating-linear-gradient(#0000 0 7px,#0001 7px 8px),
      linear-gradient(#00000010,#00000003);
  border-radius:6px; filter:blur(.3px)
}
.stack--l{ left:calc(var(--inset) + 6px); transform:translateZ(-2px) }
.stack--r{ right:calc(var(--inset) + 6px); transform:translateZ(-2px) }

/* управление */
.controls{ display:flex; align-items:center; gap:16px; font-family:Nunito, system-ui, sans-serif }
.progress{ font-weight:800; opacity:.75 }
.nav,.btn{
  height:38px; padding:0 14px; border-radius:10px; font-weight:800; letter-spacing:.02em;
  border:1px solid #a58d6f; background:#fff6d8; color:#2b2112; cursor:pointer;
  box-shadow:0 4px 10px rgba(0,0,0,.08)
}
.nav:disabled{ opacity:.45; cursor:not-allowed }

/* z-index классы (до 60 листов) */
.z-1{z-index:1}.z-2{z-index:2}.z-3{z-index:3}.z-4{z-index:4}.z-5{z-index:5}
.z-6{z-index:6}.z-7{z-index:7}.z-8{z-index:8}.z-9{z-index:9}.z-10{z-index:10}
.z-11{z-index:11}.z-12{z-index:12}.z-13{z-index:13}.z-14{z-index:14}.z-15{z-index:15}
.z-16{z-index:16}.z-17{z-index:17}.z-18{z-index:18}.z-19{z-index:19}.z-20{z-index:20}
.z-21{z-index:21}.z-22{z-index:22}.z-23{z-index:23}.z-24{z-index:24}.z-25{z-index:25}
.z-26{z-index:26}.z-27{z-index:27}.z-28{z-index:28}.z-29{z-index:29}.z-30{z-index:30}
.z-31{z-index:31}.z-32{z-index:32}.z-33{z-index:33}.z-34{z-index:34}.z-35{z-index:35}
.z-36{z-index:36}.z-37{z-index:37}.z-38{z-index:38}.z-39{z-index:39}.z-40{z-index:40}
.z-41{z-index:41}.z-42{z-index:42}.z-43{z-index:43}.z-44{z-index:44}.z-45{z-index:45}
.z-46{z-index:46}.z-47{z-index:47}.z-48{z-index:48}.z-49{z-index:49}.z-50{z-index:50}
.z-51{z-index:51}.z-52{z-index:52}.z-53{z-index:53}.z-54{z-index:54}.z-55{z-index:55}
.z-56{z-index:56}.z-57{z-index:57}.z-58{z-index:58}.z-59{z-index:59}.z-60{z-index:60}
</style>
