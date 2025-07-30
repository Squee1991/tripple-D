<template>
    <div class="tree-container">
        <svg class="tree-lines">
            <line
                    v-for="link in links"
                    :key="link.from + '-' + link.to"
                    :x1="getNode(link.from).x + size / 2"
                    :y1="getNode(link.from).y + size / 2"
                    :x2="getNode(link.to).x + size / 2"
                    :y2="getNode(link.to).y + size / 2"
                    stroke="#444"
                    stroke-width="3"
                    marker-end="url(#arrow)"
            />
            <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
                    <path d="M0,0 L10,5 L0,10 Z" fill="#444" />
                </marker>
            </defs>
        </svg>

        <div
                v-for="node in nodes"
                :key="node.id"
                class="sticker"
                :style="{ top: node.y + 'px', left: node.x + 'px', backgroundColor: node.color }"
        >
            {{ node.title }}
        </div>
    </div>
</template>

<script setup>
    const size = 100

    const nodes = [
        { id: 'start', title: '🚪 Старт', x: 100, y: 100, color: '#ffd54f' },
        { id: 'a', title: '📘 A', x: 300, y: 100, color: '#90caf9' },
        { id: 'b', title: '📗 B', x: 500, y: 100, color: '#a5d6a7' },
        { id: 'c', title: '📕 C', x: 700, y: 100, color: '#ef9a9a' },
        { id: 'd', title: '📙 D', x: 400, y: 250, color: '#ffcc80' },
        { id: 'e', title: '📒 E', x: 600, y: 250, color: '#ce93d8' },
        { id: 'f', title: '📓 F', x: 800, y: 250, color: '#b0bec5' },
        { id: 'g', title: '🧩 G', x: 500, y: 400, color: '#b2dfdb' },
        { id: 'h', title: '📔 H', x: 700, y: 400, color: '#f48fb1' },
        { id: 'i', title: '🏁 I', x: 900, y: 400, color: '#d4e157' },
        { id: 'j', title: '🌟 J', x: 300, y: 400, color: '#ffe082' },
        { id: 'k', title: '🧠 K', x: 100, y: 300, color: '#f8bbd0' },
        { id: 'l', title: '🎯 L', x: 100, y: 500, color: '#c5e1a5' },
        { id: 'm', title: '👑 M', x: 300, y: 550, color: '#ffab91' },
        { id: 'n', title: '🔥 N', x: 500, y: 550, color: '#a1887f' },
    ]

    const links = [
        { from: 'start', to: 'a' },
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' },
        { from: 'b', to: 'd' },
        { from: 'c', to: 'e' },
        { from: 'd', to: 'e' },
        { from: 'e', to: 'f' },
        { from: 'd', to: 'g' },
        { from: 'e', to: 'h' },
        { from: 'f', to: 'i' },
        { from: 'g', to: 'h' },
        { from: 'd', to: 'j' },
        { from: 'start', to: 'k' },
        { from: 'k', to: 'l' },
        { from: 'l', to: 'm' },
        { from: 'm', to: 'n' },
        { from: 'j', to: 'm' },
    ]

    const getNode = (id) => nodes.find((n) => n.id === id)
</script>

<style scoped>
    .tree-container {
        position: relative;
        width: 100%;
        height: 100vh;
        background: radial-gradient(circle, #fffde7, #fce4ec);
        overflow: hidden;
    }

    .tree-lines {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .sticker {
        position: absolute;
        width: 100px;
        height: 100px;
        border: 3px solid #333;
        border-radius: 20px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        font-weight: bold;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(-1deg);
        transition: transform 0.2s;
        cursor: pointer;
        user-select: none;
    }

    .sticker:hover {
        transform: scale(1.05);
        z-index: 2;
    }
</style>
