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

          <p v-if="section.paragraphs" v-for="(paragraph, j) in section.paragraphs" :key="'p-' + j">
            {{ paragraph }}
          </p>

          <ul v-if="section.listItems && section.listItems.length" class="privacy-list">
            <li v-for="(item, k) in section.listItems" :key="'li-' + k">
              {{ item }}
            </li>
          </ul>

          <p v-if="section.postParagraphs" v-for="(postParagraph, l) in section.postParagraphs" :key="'pp-' + l">
            {{ postParagraph }}
          </p>
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
import { PROJECT_NAME, SUPPORT_EMAIL } from "~/constants/legal.constants.js"

const router = useRouter()
const { t } = useI18n()

const PROJECT = PROJECT_NAME
const EMAIL = SUPPORT_EMAIL
const COUNTRY = "Poland"
const CITY = "Szczecin"
const lastUpdated = ref("November 22, 2026")

const sections = ref([
  {
    heading: "1. Who we are",
    paragraphs: [
      `${PROJECT} (https://www.skillupgerman.com and the ${PROJECT} apps for Android and iOS, together the "Service") is a gamified German language learning platform. This Privacy Policy explains what personal data we collect, why we collect it, how we use and share it, and how you can delete it.`,
      `The data controller is the administrator of ${PROJECT}, located in ${CITY}, ${COUNTRY}. Contact: ${EMAIL}.`
    ]
  },
  {
    heading: "2. What data we collect",
    paragraphs: ["We collect only the data needed to run the Service:"],
    listItems: [
      "Account data: your display name (nickname, can be a pseudonym), email address and a unique user ID. If you register with email and password, the password is stored only in hashed form by Firebase Authentication; we never see it.",
      "Data from Google Sign-In or Sign in with Apple: see section 3.",
      "Learning data: progress in lessons and quests, learned words, flashcards you create, exercise and exam results, points, streaks, achievements, rank, chosen avatar, friends list and battle or duel results.",
      "Text answers you submit in writing exercises and messages you send to the in-app assistant.",
      "Voice recordings: only when you use speaking or dictation exercises and allow microphone access. Recordings are sent for transcription and are not stored by us after the text is returned.",
      "Purchase data: subscription status, plan and expiry date. Payments are processed by Stripe (website), Google Play or the App Store (apps). We never receive or store your card details.",
      "Usage and device data: pages and screens visited, time spent, button clicks, app version, device type, operating system, language and approximate region, collected through Firebase / Google Analytics. Technical data such as the IP address is processed by our hosting and Firebase providers for security and to operate the Service.",
      "Push notification token (apps only), if you allow notifications, to send learning reminders.",
      "Advertising identifier (apps only, free plan): used by Google AdMob to show ads, according to your consent choices."
    ]
  },
  {
    heading: "3. Google Sign-In: how we use your Google account data",
    paragraphs: [
      "You can sign in with your Google account. In that case we request only the basic scopes openid, email and profile. We do not request access to Gmail, Google Drive, Contacts, Calendar or any other Google service.",
      "From your Google account we receive and use only:"
    ],
    listItems: [
      "Your email address: to create and identify your account, to let you sign in again, and to contact you about your account (for example password or subscription issues).",
      "Your name: as the initial display name in your profile. You can change it at any time in the app.",
      "Your Google user ID (through Firebase Authentication): to link your Google account to your SkillUpGerman account."
    ],
    postParagraphs: [
      "Your Google profile photo is not used; you choose an avatar inside the app instead.",
      "Google user data is used only to provide sign-in and your account in the Service. It is not sold, not used for advertising, not used to build advertising profiles, not used to train AI models, and not shared with anyone except Google Firebase, which provides our authentication and database.",
      "SkillUpGerman's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
      "Sign in with Apple works the same way: we receive your email (or an Apple private relay address) and name, if you choose to share them, and use them only for your account."
    ]
  },
  {
    heading: "4. Why we use the data",
    listItems: [
      "To create your account and let you sign in (performance of the contract).",
      "To save your learning progress and show statistics, leaderboards, achievements and multiplayer battles (performance of the contract).",
      "To check your written and spoken answers and to answer your questions in the in-app assistant (performance of the contract).",
      "To process subscriptions and restore purchases (performance of the contract, legal accounting obligations).",
      "To send learning reminders and important service messages, which you can turn off at any time (consent / legitimate interest).",
      "To understand how the Service is used, fix errors and improve lessons (legitimate interest).",
      "To show ads in the free version of the mobile apps (consent, where required).",
      "To protect the Service against fraud and abuse and to comply with the law (legitimate interest, legal obligation)."
    ],
    postParagraphs: ["We do not use your data for automated decisions that have legal or similarly significant effects on you."]
  },
  {
    heading: "5. Sharing data with third parties",
    paragraphs: ["We do not sell your personal data. We share data only with service providers that process it on our behalf, and only to the extent needed for the purposes above:"],
    listItems: [
      "Google Firebase (Google): authentication, database, cloud functions, push notifications and analytics.",
      "Google Gemini API (Google): checking text answers, the in-app assistant and speech transcription. We send only the content of the answer, question or recording, not your name or email.",
      "Google AdMob (apps, free plan only): advertising.",
      "Stripe: payment processing on the website.",
      "Google Play, Apple App Store and RevenueCat: in-app purchases and subscription status in the mobile apps.",
      "Vercel: website hosting.",
      "Resend: sending account emails such as password reset.",
      "Public authorities, if we are required to do so by law or a court order."
    ],
    postParagraphs: ["Other users can see only your display name, avatar, rank and scores in leaderboards, friends lists and battles. Your email address is never shown to other users."]
  },
  {
    heading: "6. How to delete your account and data",
    paragraphs: ["You can delete your account and all associated data at any time:"],
    listItems: [
      "In the app or on the website: open Profile and tap Delete account, then confirm. Your account, profile, progress and leaderboard entries are deleted immediately and permanently.",
      `By email: write to ${EMAIL} from the email address of your account with the subject "Delete my account". We will delete your account and data within 30 days and confirm by email.`,
      "If you signed in with Google, you can also remove SkillUpGerman's access at any time at https://myaccount.google.com/permissions. This stops further sign-ins with Google but does not delete data already stored with us, so please also use one of the options above.",
      "A subscription purchased through Google Play or the App Store must be cancelled in the store; deleting the account does not cancel it automatically."
    ],
    postParagraphs: ["After deletion, limited records are kept only where the law requires it (for example payment records for tax purposes), as well as anonymized analytics data that cannot identify you."]
  },
  {
    heading: "7. Data retention",
    listItems: [
      "Account and learning data: as long as your account exists; deleted immediately when you delete the account.",
      "Voice recordings: processed only for transcription and not stored by us.",
      "Analytics data: kept for up to 14 months in aggregated or pseudonymized form.",
      "Payment records: as long as required by tax and accounting law (up to 5 years in Poland)."
    ]
  },
  {
    heading: "8. Your rights",
    paragraphs: ["Under the GDPR (RODO) and similar laws you have the right to:"],
    listItems: [
      "access your data and receive a copy of it;",
      "correct inaccurate data;",
      "delete your data;",
      "restrict or object to processing, including for analytics and advertising;",
      "data portability;",
      "withdraw consent at any time (for example for notifications, microphone access or personalized ads);",
      "file a complaint with a supervisory authority; in Poland this is the President of the Personal Data Protection Office (UODO)."
    ],
    postParagraphs: [`To exercise your rights, contact us at ${EMAIL}. We reply within 30 days.`]
  },
  {
    heading: "9. Cookies and similar technologies",
    paragraphs: ["We use local storage and cookies required for sign-in, settings (language, dark mode) and correct operation of the Service. Firebase / Google Analytics uses identifiers to measure usage. In the mobile apps, AdMob may use the advertising identifier; you can change your consent at any time in the app privacy settings or reset the identifier in your device settings."]
  },
  {
    heading: "10. Data security and international transfers",
    paragraphs: [
      "Data is transmitted over HTTPS and stored on Google Firebase servers. Access to the database is restricted by security rules, so each user can access only their own private data.",
      "Some of our providers are located outside the European Economic Area (mainly in the USA). Such transfers are protected by the EU-US Data Privacy Framework or Standard Contractual Clauses approved by the European Commission.",
      "No method of transmission over the Internet is completely secure, but we take reasonable technical and organizational measures to protect your data."
    ]
  },
  {
    heading: "11. Children",
    paragraphs: [`The Service is not directed at children under 13 (or under 16 where local law requires parental consent). We do not knowingly collect data from them. If you believe a child has given us personal data, contact ${EMAIL} and we will delete it.`]
  },
  {
    heading: "12. Changes to this Policy",
    paragraphs: ["We may update this Privacy Policy. The current version is always available at https://www.skillupgerman.com/privacy with the date of the last update. If the changes are significant, we will notify you in the Service."]
  },
  {
    heading: "13. Contact",
    paragraphs: [`For any questions about privacy or your data, contact us at ${EMAIL}.`]
  }
])
</script>

<style scoped>
.privacy__title {
  font-size: 23px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
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
  font-family: "Nunito", sans-serif;
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
  font-size: 15px;
}

.privacy-list {
  margin: 8px 0;
  padding-left: 20px;
  list-style-type: disc;
  font-size: 15px;
}

.privacy-list li {
  margin-bottom: 6px;
}
</style>
