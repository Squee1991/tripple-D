<template>
  <svg class="chest" :class="{ 'chest--open': open, 'chest--locked': locked }" viewBox="0 0 120 112"
       aria-hidden="true">
    <defs>
      <linearGradient :id="uid + 'wood'" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d98a45"/>
        <stop offset="1" stop-color="#9c5524"/>
      </linearGradient>
      <linearGradient :id="uid + 'lid'" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e9a160"/>
        <stop offset="1" stop-color="#b8682f"/>
      </linearGradient>
      <linearGradient :id="uid + 'gold'" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffe27a"/>
        <stop offset="1" stop-color="#e8a317"/>
      </linearGradient>
      <radialGradient :id="uid + 'glow'" cx="0.5" cy="0.6" r="0.6">
        <stop offset="0" stop-color="#fff6c2"/>
        <stop offset="0.6" stop-color="#ffd447"/>
        <stop offset="1" stop-color="#e8a317" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <ellipse cx="60" cy="104" rx="46" ry="6" fill="rgba(0,0,0,0.18)"/>

    <!-- сияние изнутри открытого сундука -->
    <ellipse class="chest__glow" cx="60" cy="50" rx="50" ry="26" :fill="`url(#${uid}glow)`"/>

    <!-- корпус -->
    <rect x="10" y="50" width="100" height="52" rx="8" :fill="`url(#${uid}wood)`" stroke="#6b3a17" stroke-width="3"/>
    <path d="M14 68 H106 M14 85 H106" stroke="rgba(107,58,23,0.35)" stroke-width="2"/>
    <rect x="22" y="50" width="10" height="52" :fill="`url(#${uid}gold)`" stroke="#a8730f" stroke-width="2"/>
    <rect x="88" y="50" width="10" height="52" :fill="`url(#${uid}gold)`" stroke="#a8730f" stroke-width="2"/>
    <!-- тёмное нутро, видно когда крышка открыта -->
    <g class="chest__coins">
      <path d="M16 52 Q60 40 104 52 Z" fill="#5a2f12"/>
    </g>

    <!-- крышка: откидывается назад вокруг петли -->
    <g class="chest__lid">
      <path d="M10 54 V38 Q10 14 60 14 Q110 14 110 38 V54 Z" :fill="`url(#${uid}lid)`" stroke="#6b3a17"
            stroke-width="3" stroke-linejoin="round"/>
      <path d="M22 54 V22 Q26 18 32 17 V54 Z" :fill="`url(#${uid}gold)`" stroke="#a8730f" stroke-width="2"/>
      <path d="M88 54 V17 Q94 18 98 22 V54 Z" :fill="`url(#${uid}gold)`" stroke="#a8730f" stroke-width="2"/>
      <path d="M16 30 Q60 18 104 30" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="3"
            stroke-linecap="round"/>
      <!-- замок -->
      <rect x="50" y="44" width="20" height="20" rx="4" :fill="`url(#${uid}gold)`" stroke="#a8730f"
            stroke-width="2"/>
      <circle cx="60" cy="52" r="3" fill="#6b3a17"/>
      <path d="M60 54 V59" stroke="#6b3a17" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>
</template>

<script setup>
import { useId } from 'vue'

defineProps({
  open: { type: Boolean, default: false },
  locked: { type: Boolean, default: false }
})

// у каждого сундука свои id градиентов, иначе два SVG на странице делят одни и те же
const uid = 'chest' + useId().replace(/[^a-zA-Z0-9]/g, '')
</script>

<style scoped>
.chest {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.chest__lid {
  transform-origin: 104px 54px;
  transition: transform 0.55s cubic-bezier(0.3, 1.7, 0.5, 1);
}

.chest--open .chest__lid {
  transform: translate(4px, -26px) rotate(22deg);
}

.chest__coins,
.chest__glow {
  opacity: 0;
  transition: opacity 0.3s ease 0.15s;
}

.chest--open .chest__coins,
.chest--open .chest__glow {
  opacity: 1;
}

.chest--locked {
  filter: grayscale(0.85) sepia(0.25);
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .chest__lid {
    transition: none;
  }
}
</style>
