<template>
  <div class="privacy_wrapper">
    <div class="privacy">
      <div class="privacy_header">
        <button @click="router.back()" class="btn-icon-back" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="privacy__title">{{ t('helpCenter.privacy') }}</div>
      </div>
      <div class="privacy_section-inner">
        <section v-for="(section, index) in sections" :key="index" class="section">
          <h2>{{ section.heading }}</h2>
          <p v-for="(paragraph, j) in section.paragraphs" :key="'p-' + j">
            {{ paragraph }}
          </p>
          <ul v-if="section.listItems && section.listItems.length" class="privacy-list">
            <li v-for="(item, k) in section.listItems" :key="'li-' + k">
              {{ item }}
            </li>
          </ul>
        </section>
        <p class="last-updated">
          Last updated: {{ lastUpdated }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const { t } = useI18n()

const PROJECT = "SkillUpGerman"
const EMAIL = "skillupgerman@gmail.com"
const COUNTRY = "Poland"
const lastUpdated = ref("June 29, 2026")

const sections = ref([
  {
    heading: "1. Introduction",
    paragraphs: [
      `This Privacy Policy describes how ${PROJECT} ("we", "Service") collects, uses, and protects users' personal data. The data controller is the administrator of ${PROJECT}, located in ${COUNTRY}.`,
      "By using the Service, you agree to the terms of this Policy."
    ]
  },
  {
    heading: "2. What data we collect",
    listItems: [
      "Account data: name (nickname), email address, encrypted password (stored in Firebase). The name may be a pseudonym.",
      "Usage data: learning progress (learned words, completed tasks), test results, in-game activity.",
      "Technical data: certain information (e.g., IP address or device identifiers) is automatically processed by our providers (Firebase) for security and service operation. We do not use this information to identify you personally.",
      "Payment data: transaction information when subscribing (processed by payment systems such as Stripe; we do not store credit card details).",
      "Advertising data: third-party advertising networks may collect device identifiers (e.g., IDFA or Google Advertising ID) and usage data to serve advertisements."
    ]
  },
  {
    heading: "3. How we use the data",
    listItems: [
      "To provide access to the Service and its features.",
      "To save and display your learning progress.",
      "To process subscriptions and payments.",
      "To improve the quality and personalization of the Service.",
      "To send notifications and messages about important updates.",
      "To display advertisements provided by third-party ad networks."
    ]
  },
  {
    heading: "4. Data sharing with third parties",
    paragraphs: [
      "We do not sell your personal data. Data sharing is only possible in the following cases:"
    ],
    listItems: [
      "When necessary for the operation of the Service (e.g., to data processing providers such as Firebase/Google).",
      "With third-party advertising partners (e.g., Google AdMob) to serve ads within the application.",
      "When required by law (e.g., by court order or governmental request)."
    ]
  },
  {
    heading: "5. Data storage and protection",
    listItems: [
      "We take reasonable technical and organizational measures to protect data from unauthorized access, alteration, or destruction.",
      "Data transmission is performed over HTTPS; database access is restricted by security rules (e.g., Firestore Security Rules).",
      "Data is stored on secure servers of our providers (e.g., Google Firebase).",
      "Despite all security measures, no method of data transmission over the Internet is completely secure."
    ]
  },
  {
    heading: "6. Cookies, analytics, and advertising",
    paragraphs: [
      "We use cookies and similar technologies for authentication and the correct operation of the Service.",
      "To improve the Service, we use analytics tools (e.g., Firebase Analytics) to collect anonymized usage statistics (e.g., number of section visits, button clicks, time spent on pages).",
      "We use third-party advertising networks that may collect device identifiers to serve personalized or non-personalized ads. You can manage personalized ad preferences in your device settings."
    ]
  },
  {
    heading: "7. User rights",
    paragraphs: [
      "You have the right to:"
    ],
    listItems: [
      "Request a copy of your personal data.",
      "Correct inaccurate or outdated data.",
      "Delete your account and associated data.",
      "Restrict or object to data processing."
    ],
    get paragraphsAfter() {
      return [`To exercise your rights or to delete your account, you can use the account settings in the app, visit our website at skillupgerma.com/delete, or contact us at: ${EMAIL}.`]
    }
  },
  {
    heading: "8. International data transfer",
    paragraphs: [
      "Since we use international services (e.g., Firebase, Stripe), your data may be transferred outside your country of residence.",
      "We take measures to protect your data in accordance with applicable laws, including GDPR/RODO within the EU."
    ]
  },
  {
    heading: "9. Data retention period",
    paragraphs: [
      "We retain data for as long as necessary to achieve the purposes described in this Policy.",
      "When an account is deleted, all associated data is removed immediately and not stored on our servers."
    ]
  },
  {
    heading: "10. Children's Privacy",
    paragraphs: [
      "Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13.",
      "If we become aware that a child under 13 has provided us with personal data, we will take steps to delete such information immediately."
    ]
  },
  {
    heading: "11. Changes to the Policy",
    paragraphs: [
      "We may periodically update this Privacy Policy.",
      "The current version is always available on the website; the date of the last update is shown at the bottom of the document.",
      "By continuing to use the Service after updates, you agree to the revised Policy."
    ]
  },
  {
    heading: "12. Contacts",
    paragraphs: [
      `For questions regarding data protection and privacy, please contact us at: ${EMAIL}.`
    ]
  }
])

sections.value[6].paragraphs.push(`To exercise your rights, please contact us at: ${EMAIL}.`);
</script>

<style scoped>
.privacy__title {
  font-size: 23px;
  font-weight: 600;
  font-family: Nunito, sans-serif;
  color: var(--title);
  text-shadow: 1px 1px var(--title);
  margin-left: 15px;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.privacy_wrapper {
  height: 100vh;
  overflow: hidden;
}

.privacy_header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  margin-bottom: 15px;
}

.privacy {
  max-width: 1100px;
  margin: 0 auto;
  height: 100%;
  line-height: 1.75;
  color: var(--titleColor);
}

.last-updated {
  margin: 20px 0 22px;
  font-size: 13px;
  opacity: 0.7;
  text-align: center;
}

.section {
  padding: 0 15px;
  margin-bottom: 25px;
}

.privacy_section-inner {
  display: flex;
  flex-direction: column;
  height: calc(100% - 70px);
  padding-bottom: 40px;
  overflow-y: auto;
}

.section h2 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 12px;
}

.section p {
  margin: 8px 0;
}

.privacy-list {
  margin: 8px 0;
  padding-left: 20px;
  list-style-type: disc;
}

.privacy-list li {
  margin-bottom: 6px;
}
</style>