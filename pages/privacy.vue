<template>
  <div class="privacy_wrapper">
    <div class="privacy">
      <div class="privacy_header">
        <button @click="router.back()" class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="privacy__title">Privacy Policy</div>
      </div>
      <div class="privacy_section-inner">
        <section v-for="(section, index) in sections" :key="index" class="section">
          <h2>{{ section.heading }}</h2>
          <p v-for="(paragraph, j) in section.paragraphs" :key="j">{{ paragraph }}</p>
        </section>
      </div>
      <p class="last-updated">
        Last updated: {{ lastUpdated }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import VBanner from "~/src/components/V-banner.vue";
import Privacy from "~/pages/privacy.vue";
const router = useRouter()
const PROJECT = "skillupgerman"
const EMAIL = "skillupgerman@gmail.com"
const COUNTRY = "Poland"

const lastUpdated = ref("Januar 4, 2026")
const sections = ref([
  {
    heading: "1. Introduction",
    paragraphs: [
      `This Privacy Policy describes how SkillUpGerman ("we", "Service") collects, uses, and protects users' personal data.`,
      `This Policy applies to the SkillUpGerman website and mobile applications (Android and future iOS versions).`,
      `The data controller is the administrator of SkillUpGerman, located in ${COUNTRY}.`,
      `By using the Service, you agree to the terms of this Policy.`
    ]
  },
  {
    heading: "2. What data we collect",
    paragraphs: [
      "— Account data: name (nickname), email address, encrypted password (stored in Firebase). The name may be a pseudonym.",
      "— Usage data: learning progress (learned words, completed tasks), test results, in-game activity.",
      "— Technical data: certain information (e.g., IP address or device identifiers) is automatically processed by our providers (Firebase) for security and service operation.",
      "— Payment data: transaction information is processed by third-party payment providers depending on the platform used.",
      "For mobile applications (Android), payments are processed by Google Play (Google LLC) and managed via services such as RevenueCat.",
      "For web payments, transactions are processed by providers such as Stripe.",
      "We do not store credit card or payment details."
    ]
  },
  {
    heading: "3. How we use the data",
    paragraphs: [
      "— To provide access to the Service and its features.",
      "— To save and display your learning progress.",
      "— To process subscriptions and payments.",
      "— To improve the quality and personalization of the Service.",
      "— To send notifications and messages about important updates."
    ]
  },
  {
    heading: "4. Data sharing with third parties",
    paragraphs: [
      "We do not sell your personal data. Data sharing is only possible in the following cases:",
      "— When necessary for the operation of the Service (e.g., Firebase, Google Play services, RevenueCat, Stripe).",
      "— When required by law (e.g., by court order or governmental request)."
    ]
  },
  {
    heading: "5. Data storage and protection",
    paragraphs: [
      "We take reasonable technical and organizational measures to protect data from unauthorized access, alteration, or destruction.",
      "Data transmission is performed over HTTPS; database access is restricted by security rules (e.g., Firestore Security Rules).",
      "Data is stored on secure servers of our providers (e.g., Google Firebase).",
      "Despite all security measures, no method of data transmission over the Internet is completely secure."
    ]
  },
  {
    heading: "6. Cookies and analytics",
    paragraphs: [
      "We use cookies only for authentication and the correct operation of the Service.",
      "We may use analytics tools such as Firebase Analytics or similar services to understand user behavior and improve the Service.",
      "Collected analytics data is anonymized and does not allow identification of a specific user."
    ]
  },
  {
    heading: "7. User rights",
    paragraphs: [
      "You have the right to:",
      "— Request a copy of your personal data.",
      "— Correct inaccurate or outdated data.",
      "— Delete your account and associated data.",
      "— Restrict or object to data processing.",
      `To exercise your rights, please contact us at: ${EMAIL}.`
    ]
  },
  {
    heading: "8. International data transfer",
    paragraphs: [
      "Since we use international services (e.g., Firebase, Google Play, RevenueCat, Stripe), your data may be transferred outside your country of residence.",
      "We take measures to protect your data in accordance with applicable laws, including GDPR/RODO within the EU."
    ]
  },
  {
    heading: "9. Data retention period",
    paragraphs: [
      "We retain data for as long as necessary to achieve the purposes described in this Policy.",
      "When an account is deleted, all associated data is removed from our systems."
    ]
  },
  {
    heading: "10. Changes to the Policy",
    paragraphs: [
      "We may periodically update this Privacy Policy.",
      "The current version is always available on the website.",
      "By continuing to use the Service after updates, you agree to the revised Policy."
    ]
  },
  {
    heading: "11. Contacts",
    paragraphs: [
      `For questions regarding data protection and privacy, please contact us at: ${EMAIL}.`
    ]
  }
])

</script>

<style scoped>

.privacy__title{
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

.privacy_wrapper{
  height: 100vh;
  overflow: hidden;
}

.privacy__banner {
  padding: 15px;
  margin-bottom: 10px;
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

h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 12px;
  text-align: center;
}

.last-updated {
  margin: 0 0 22px;
  font-size: 15px;
  opacity: 0.9;
}

.section {
  padding: 0 15px;
}

.privacy_section-inner{
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto ;
}

.section h2 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 10px;
}

.section p {
  margin: 8px 0;
}
</style>
