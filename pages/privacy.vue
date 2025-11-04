<template>
  <div>
    <div class="btn__back-wrapper">
      <button type="button" @click="path" class="btn__back">Home</button>
    </div>
    <div class="privacy">
      <h1>Privacy Policy</h1>
      <section v-for="(s, i) in sections" :key="i" class="section">
        <h2>{{ s.heading }}</h2>
        <p v-for="(p, j) in s.paragraphs" :key="j">{{ p }}</p>
      </section>
      <p class="last-updated">
        Last updated: {{ lastUpdated }}
      </p>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
const router = useRouter()
const PROJECT = "skill-up-german"
const EMAIL = "skill-up-german@gmail.com"
const COUNTRY = "Poland"


const path = () => {
  router.push('/')
}
const lastUpdated = ref("October 1, 2025")
const sections = ref([
  {
    heading: "1. Introduction",
    paragraphs: [
      `This Privacy Policy describes how Skill-Up-German collects, uses, and protects users' personal data.`,
      `By using the Service, you agree to the terms of this Policy.`
    ]
  },
  {
    heading: "2. What data we collect",
    paragraphs: [
      "— Account data: name (nickname), email address, encrypted password (stored in Firebase). The name may be a pseudonym.",
      "— Usage data: learning progress (learned words, completed tasks), test results, in-game activity.",
      "— Technical data: certain information (e.g., IP address or device identifiers) is automatically processed by our providers (Firebase) for security and service operation. We do not use this information to identify you personally.",
      "— Payment data: transaction information when subscribing (processed by payment systems such as Stripe; we do not store credit card details)."
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
      "— When necessary for the operation of the Service (e.g., to data processing providers such as Firebase/Google).",
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
      "To improve the Service, we collect anonymized usage statistics (e.g., number of section visits, button clicks, time spent on pages). This data does not allow identification of a specific user and is not used for advertising.",
      "If we connect third-party analytics services in the future (e.g., Google Analytics or Firebase Analytics), this Policy will be updated, and users will be notified."
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
      "Since we use international services (e.g., Firebase, Stripe, RevenueCat), your data may be transferred outside your country of residence.",
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
    heading: "10. Changes to the Policy",
    paragraphs: [
      "We may periodically update this Privacy Policy.",
      "The current version is always available on the website; the date of the last update is shown at the bottom of the document.",
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

* {
  font-family: "Nunito", sans-serif ;
}

.btn__back-wrapper{
  position: sticky;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 1110px;
  margin: 0 auto;
  padding: 10px;
  border-bottom: 2px solid black;
  border-radius: 15px;
  background: var(--bg);
}

.btn__back {
  width: 100%;
  max-width: 320px;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid black;
  box-shadow: 3px 3px 0 black;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 1rem;
  background: #f1c40f;
}

@media (min-width: 1024px) {
  .btn__back:hover {
     transform: translate(2px, 2px);
     box-shadow: 1px 1px 0 black;
  }
}

.privacy {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 64px;
  line-height: 1.75;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
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
  margin: 22px 0;
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
