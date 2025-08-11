<template>
  <section class="faq-wrapper">
    <h2 class="faq-title">Вопрос–ответ</h2>

    <div
        v-for="(section, si) in sections"
        :key="si"
        class="faq-section"
    >
      <button
          class="section-head"
          @click="toggleSection(si)"
          :aria-expanded="openedSections.has(si)"
          :aria-controls="`section-${si}`"
      >
        <span class="section-title">{{ section.title }}</span>
        <img class="section-arrow" :class="{ rotated: openedSections.has(si) }" src="../assets/images/arrowNav.svg" alt=""/>
      </button>

      <transition name="fade">
        <div
            v-show="openedSections.has(si)"
            class="section-body"
            :id="`section-${si}`"
        >
          <!-- Внутренние аккордионы -->
          <div
              v-for="(item, qi) in section.items"
              :key="qi"
              class="qa-item"
          >
            <button
                class="qa-head"
                @click="toggleQA(si, qi)"
                :aria-expanded="isQAOpen(si, qi)"
                :aria-controls="`qa-${si}-${qi}`"
            >
              <span class="qa-question">{{ item.q }}</span>
              <img class="qa-arrow" :class="{ rotated: isQAOpen(si, qi) }" src="../assets/images/arrowNav.svg" alt=""/>
            </button>

            <transition name="fade">
              <div
                  v-show="isQAOpen(si, qi)"
                  class="qa-body"
                  :id="`qa-${si}-${qi}`"
                  v-html="item.a"
              />
            </transition>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/**
 * Данные FAQ.
 * Можно подтянуть с бэка, но пока статически.
 * Ответы в HTML, чтобы легко делать списки/жирный текст.
 */
const sections = ref([
  {
    title: 'Как пользоваться',
    items: [
      {
        q: 'Что такое достижение?',
        a: `
          <p>Достижения — это награды за активность в сервисе.
          Вы получаете их за прогресс, отгадки в режимах, ежедневные задания и другие действия.
          Открытые достижения отображаются в разделе <b>Кабинет → Награды</b>.</p>
        `
      },
      {
        q: 'Как попасть в рейтинг?',
        a: `
          <p>Нужно получить как минимум <b>2 уровень</b>.
          Уровень поднимается за отгадывание артиклей в режиме <b>Практика артиклей</b>.</p>
        `
      },
      {
        q: 'Что такое ежедневные задания?',
        a: `
          <p>Это задания по темам, которые можно выполнять <b>раз в день</b>.
          Выполняйте их регулярно, чтобы получать прогресс и дополнительные награды.</p>
        `
      }
    ]
  },

  {
    title: 'Управление аккаунтом',
    items: [
      {
        q: 'Как поменять имя или почту?',
        a: `
          <p>Перейдите в <b>Кабинет → Настройки</b>.
          Там можно изменить имя и электронную почту.</p>
        `
      },
      {
        q: 'Как удалить аккаунт?',
        a: `
          <p>В <b>Кабинет → Настройки</b> нажмите <b>Удалить аккаунт</b>.
          Важно: после удаления <b>данные восстановить невозможно</b>.</p>
        `
      },
      {
        q: 'Как восстановить пароль?',
        a: `
          <p>Откройте форму входа/регистрации и выберите <b>Забыли пароль?</b>.
          Мы отправим письмо со ссылкой на восстановление на указанный e-mail.
          Убедитесь, что указываете <b>реальную почту</b> — письмо придёт именно туда.
          Если указан фейковый адрес, восстановление <b>невозможно</b>.</p>
        `
      }
    ]
  },

  {
    title: 'Подписка (Премиум)',
    items: [
      {
        q: 'Что даёт подписка?',
        a: `
          <ul>
            <li>Доступ к тестам всех уровней с проверкой с помощью ИИ.</li>
            <li>Озвучка и встроенный переводчик на сайте без лимита.</li>
          </ul>
        `
      },
      {
        q: 'Как отключить Премиум?',
        a: `
          <p>В <b>Кабинет → Настройки</b> можно отключить подписку.
          После отмены премиум останется активным <b>до конца оплаченного периода</b>.
          <i>Пока что так:</i> возврат за оставшиеся дни не производится.</p>
        `
      }
    ]
  }
])

/** Открытые секции и QA */
const openedSections = ref(new Set())
const openedQA = ref(new Map()) // key: `${si}-${qi}` → true

const toggleSection = (si) => {
  if (openedSections.value.has(si)) openedSections.value.delete(si)
  else openedSections.value.add(si)
}

const keyFor = (si, qi) => `${si}-${qi}`

const toggleQA = (si, qi) => {
  const key = keyFor(si, qi)
  openedQA.value.set(key, !openedQA.value.get(key))
}

const isQAOpen = (si, qi) => !!openedQA.value.get(keyFor(si, qi))
</script>

<style scoped>
.faq-wrapper{
  display: block;
  border-radius: 24px;
  padding: 12px;
}

.faq-title{
  font-weight: 900;
  font-size: 1.6rem;
  margin: 0 0 10px;
}

.faq-section{
  background: #fff7dd;
  border: 3px solid #000;
  border-radius: 18px;
  box-shadow: 4px 4px 0 #000;
  margin-bottom: 14px;
  overflow: hidden;
}

/* Section head (верхний аккордион) */
.section-head{
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #fffbea;
  border: 0;
  cursor: pointer;
  outline: none;
}

.section-title{
  font-weight: 900;
  font-size: 1.15rem;
}

.section-arrow{
  width: 22px;
  transition: transform .2s ease;
}

.section-arrow.rotated{ transform: rotate(180deg); }

.section-body{
  padding: 10px 10px 14px;
}

.qa-item{
  background: #ffffff;
  border: 3px solid #000;
  border-radius: 16px;
  box-shadow: 3px 3px 0 #000;
  margin: 10px 0;
  overflow: hidden;
}

.qa-head{
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: #f3f4f6;
  border: 0;
  cursor: pointer;
  font-weight: 800;
  outline: none;
}

.qa-question{ font-weight: 900; }

.qa-arrow{
  width: 20px;
  transition: transform .2s ease;
}

.qa-arrow.rotated{ transform: rotate(180deg); }

.qa-body{
  padding: 10px 12px 14px;
  font-weight: 700;
}

/* анимация */
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* убираем webkit highlight */
button { -webkit-tap-highlight-color: transparent; -webkit-focus-ring-color: transparent; }
</style>
