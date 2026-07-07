<template>
  <div class="terms_wrapper">
    <div class="terms">
      <div class="terms__header">
        <button @click="router.back()" class="btn-icon-back" aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="terms__title">{{ t('helpCenter.terms') }}</div>
      </div>

      <div class="terms__content">
        <h1>Terms of Service</h1>
        <p class="last-updated">
          Please note that these Terms of Service were last reviewed on {{ lastUpdated }}.
        </p>

        <blockquote class="legal-note">
          PLEASE NOTE THAT SOME SECTIONS OF THESE TERMS CONTAIN IMPORTANT PROVISIONS
          REGARDING LIMITATIONS OF LIABILITY, CONTENT RIGHTS, AND DISPUTE RESOLUTION PROCEDURES.
          PLEASE READ THEM CAREFULLY.
        </blockquote>

        <section v-for="(section, index) in sections" :key="index" class="section">
          <h2 class="section__title">{{ section.heading }}</h2>
          <p class="section__paragraph" v-for="(paragraph, j) in section.paragraphs" :key="j" v-html="paragraph"></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue"
import {useRouter} from "vue-router"

const router = useRouter()
const {t} = useI18n()

const PROJECT = "SkillUpGerman"
const EMAIL = "skillupgerman@gmail.com"
const COUNTRY = "Poland"
const lastUpdated = ref("January 1, 2026")

const sections = ref([
  {
    heading: "1. General",
    paragraphs: [
      `The website and related services of ${PROJECT} (collectively, the “Service”) are operated by the rights holder ${PROJECT}. Access to and use of the Service are governed by these Terms of Service (“Terms”). By accessing or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms, as well as other documents referenced herein (including, without limitation, the Privacy Policy provided separately). If you do not agree with the Terms, you are not authorized to use the Service.`,
      `${PROJECT} develops products for learning the German language in a gamified form. We periodically update the Service by adding or modifying features, interfaces, and materials. We reserve the right to amend these Terms. We may notify users of material changes by publishing a new version, and the effective date will be indicated at the top of this document. Continued use of the Service after the effective date of the updated Terms constitutes your acceptance of them.`
    ]
  },
  {
    heading: "2. Definitions",
    paragraphs: [
      "“User” means any individual who accesses or uses the Service in any way. “Account” means a User profile created to access certain features. “Content” means any materials of the Service (texts, exercises, tests, interfaces, images, audio, video, source code, and other objects). “User Content” means any data submitted, entered, or uploaded by the User (including test results, learning progress, comments, etc.). “Subscription” or “Premium” means paid access to additional Service features for a specified period."
    ]
  },
  {
    heading: "3. Right to use and age restrictions",
    paragraphs: [
      "By using the Service, you confirm that you have the legal capacity to enter into a binding agreement under applicable law and meet the minimum age required by law. If you are a minor, you represent that you have obtained consent from your legal guardian to use the Service and accept these Terms.",
      "You are responsible for complying with all laws and regulations of your jurisdiction when accessing and using the Service."
    ]
  },
  {
    heading: "4. Registration and account security",
    paragraphs: [
      "To access certain features, you may register an account using a name (real or pseudonymous) and an email address. You are not required to provide your real name, but you are entirely responsible for providing a valid and accessible email address.",
      `Account Recovery Warning: If you choose to register with a fake, temporary, or inaccessible email address, YOU ACKNOWLEDGE THAT ACCOUNT RECOVERY WILL BE IMPOSSIBLE if you forget your password. ${PROJECT} is not responsible for lost accounts, progress, or active Subscriptions resulting from the use of invalid email addresses.`,
      `You are responsible for maintaining the confidentiality of your login credentials. You agree to promptly notify us of any unauthorized access at ${EMAIL}.`
    ]
  },
  {
    heading: "5. License and permitted use",
    paragraphs: [
      `Subject to compliance with these Terms, ${PROJECT} grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service solely for personal educational purposes. Any other use, including commercial use, requires prior written consent from ${PROJECT}.`,
      "You agree not to interfere with the Service, bypass technical limitations, perform reverse engineering, distribute malicious code, or use the Service for illegal purposes or in violation of third-party rights. We reserve the right to implement and modify technical protection and access control measures."
    ]
  },
  {
    heading: "6. Subscriptions, payment, and renewal",
    paragraphs: [
      "The Service offers paid subscription plans (Premium). All fees are billed in advance on a recurring cycle (e.g., monthly or annually) and are non-refundable, except as expressly required by applicable law or specific app store policies.",
      `In-App Purchases (Apple App Store & Google Play): If you purchase a Subscription through a mobile platform, your payment, billing, and any refund requests are handled exclusively by Apple or Google in accordance with their respective terms and conditions. ${PROJECT} does not process these payments directly and cannot issue refunds for in-app purchases.`,
      "No-Refund Policy & EU Waiver: For purchases made directly through our website, you expressly agree that Premium access is provided immediately upon purchase. By accessing the Premium content, you acknowledge and agree that you lose your statutory 14-day right of withdrawal under EU consumer law, and ALL SALES ARE FINAL. No refunds or credits will be provided for partially used subscription periods.",
      "Cancellation: You can cancel your subscription auto-renewal at any time through your Account settings or your Apple/Google subscription management menu. To avoid being charged for the next period, you must cancel at least 24 hours before your current billing cycle ends."
    ]
  },
  {
    heading: "7. Learning, tests, and data storage",
    paragraphs: [
      "The Service provides access to exercises, game modes, and tests designed for learning the German language. To display your progress, personalize your experience, and improve learning quality, we may store your results, statistics, and related technical logs.",
      "We strive to ensure reliable data storage but do not guarantee permanent availability of all historical records and reserve the right to aggregate, archive, or delete outdated data. Processing of personal data is governed by our separate Privacy Policy.",
      "You understand and agree that individual learning results depend on many factors, and the Service does not guarantee achievement of any specific level of proficiency or particular outcomes."
    ]
  },
  {
    heading: "8. Intellectual property",
    paragraphs: [
      `All rights to the Content of ${PROJECT} and the Service itself (including design, texts, exercises, images, audio, video, source code, and other elements) belong to ${PROJECT} or are used under a valid license. No rights are transferred to you except those expressly granted by these Terms.`,
      "You may not copy, modify, distribute, publicly display, publish, or otherwise use the Content beyond the scope of the granted license, except as expressly permitted by applicable law. By submitting feedback, ideas, or suggestions, you agree that we may use them without any obligation to compensate you."
    ]
  },
  {
    heading: "9. User content",
    paragraphs: [
      "By posting User Content in the Service, you confirm that you have the rights, permissions, or legal basis necessary to do so. You grant us a non-exclusive license to store, process, reproduce, and display such content as necessary for the operation of the Service.",
      "We reserve the right to delete or restrict access to User Content that violates the Terms, third-party rights, or applicable law."
    ]
  },
  {
    heading: "10. Privacy and data security",
    paragraphs: [
      "The collection, use, storage, and disclosure of Users’ personal data are governed by the Privacy Policy available on a separate page. Please review it to understand what data we process and on what basis.",
      "We take reasonable technical and organizational measures to protect your data; however, no system can guarantee absolute security."
    ]
  },
  {
    heading: "11. Availability and modifications of the Service",
    paragraphs: [
      `${PROJECT} may modify, suspend, or discontinue the Service (in whole or in part) at any time, including for technical maintenance, updates, or new releases. In certain cases, access to the Service may be restricted for security reasons or to comply with legal requirements.`
    ]
  },
  {
    heading: "12. Disclaimer of warranties",
    paragraphs: [
      "THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE MAKE NO EXPRESS OR IMPLIED WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, UNINTERRUPTED, OR MEET YOUR EXPECTATIONS."
    ]
  },
  {
    heading: "13. Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential, punitive damages, loss of profits, data, goodwill, or other intangible losses arising from or related to your use or inability to use the Service, even if we have been advised of the possibility of such damages.",
      `In any event, the total liability of ${PROJECT} for any claims shall not exceed the amount actually paid by you for access to the Service during the twelve (12) months preceding the event giving rise to such liability, unless otherwise required by mandatory law.`
    ]
  },
  {
    heading: "14. Indemnification",
    paragraphs: [
      "You agree to defend and indemnify us (to the extent permitted by law) against any third-party claims arising from your violation of these Terms, third-party rights, or applicable laws, provided that such claims are not the result of our willful misconduct or gross negligence."
    ]
  },
  {
    heading: "15. Termination of access",
    paragraphs: [
      "We may, without prior notice, suspend or terminate your access to the Service (in whole or in part) if you violate the Terms, pose risks to the Service or other Users, or if required by law. You may stop using the Service at any time; account deletion is carried out according to the procedures described in the Privacy Policy."
    ]
  },
  {
    heading: "16. Governing law and jurisdiction",
    paragraphs: [
      `These Terms are governed by the laws of ${COUNTRY}, without regard to conflict of laws principles. Any disputes arising out of or in connection with these Terms shall be resolved by the competent courts at the place of registration of ${PROJECT}, unless mandatory law provides otherwise.`,
      "If any provision of these Terms is found invalid or unenforceable, it shall not affect the validity of the remaining provisions; such provision shall be modified to the minimum extent necessary to achieve the intent of the original text."
    ]
  },
  {
    heading: "17. Assignment, entire agreement, and headings",
    paragraphs: [
      `${PROJECT} may assign its rights and obligations under these Terms to third parties in accordance with the law; you may not transfer your rights without our prior written consent. These Terms, together with any referenced documents, constitute the entire agreement between you and ${PROJECT} regarding the subject matter and supersede all prior understandings or agreements.`,
      "Section headings are provided for convenience only and do not affect interpretation. Our failure to enforce any right shall not be deemed a waiver of it."
    ]
  },
  {
    heading: "18. Contacts",
    paragraphs: [
      `For any questions related to these Terms or the Service, you can contact us at: ${EMAIL}. We strive to respond promptly.`
    ]
  }
])
</script>

<style scoped>
.terms_wrapper {
  height: 100vh;
  overflow: hidden;
}

.terms {
  max-width: 1100px;
  margin: 0 auto;
  height: 100%;
  line-height: 1.75;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
}

.terms__content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 70px);
  padding: 0 15px 40px 15px;
  overflow-y: auto;
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

.terms__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  margin-bottom: 15px;
}

h1 {
  font-size: 30px;
  font-weight: 800;
  margin: 0 0 12px;
}

.terms__title {
  color: var(--title);
  font-size: 23px;
  font-weight: 600;
  margin-left: 15px;
  text-shadow: 1px 1px var(--title);
}

.last-updated {
  margin: 0 0 15px;
  font-size: 15px;
  opacity: 0.7;
}

.legal-note {
  margin: 10px 0 25px;
  font-weight: 800;
  letter-spacing: 0.5px;
  border-left: 4px solid var(--title);
  padding-left: 15px;
  opacity: 0.85;
}

.section {
  margin-bottom: 25px;
}

.section__title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 10px;
}

.section__paragraph {
  font-size: 15px;
  margin-bottom: 8px;
}
</style>