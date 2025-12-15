<template>
  <div>
    <div class="btn__back-wrapper">
      <button type="button" @click="path" class="btn__back">Home</button>
    </div>
    <div class="terms">
      <h1>Terms of Service</h1>
      <p class="last-updated">
        Please note that these Terms of Service were last reviewed on {{ lastUpdated }}.
      </p>
      <p class="legal-note">
        PLEASE NOTE THAT SOME SECTIONS OF THESE TERMS CONTAIN IMPORTANT PROVISIONS
        REGARDING LIMITATIONS OF LIABILITY, CONTENT RIGHTS, AND DISPUTE RESOLUTION PROCEDURES.
        PLEASE READ THEM CAREFULLY.
      </p>
      <section v-for="(s, i) in sections" :key="i" class="section">
        <h2>{{ s.heading }}</h2>
        <p v-for="(p, j) in s.paragraphs" :key="j">{{ p }}</p>
      </section>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
const PROJECT = "Skillupgerman"
const EMAIL = "skillupgerman@gmail.com"
const COUNTRY = "Poland"
const router = useRouter()
const lastUpdated = ref("01 october 2025")

const path = () => {
  router.push('/')
}

const sections = ref([
  {
    heading: "1. General",
    paragraphs: [
      `The website and related services of skillupGerman (collectively, the “Service”) are operated by the rights holder Skillupgerman. Access to and use of the Service are governed by these Terms of Service (“Terms”). By accessing or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms, as well as other documents referenced herein (including, without limitation, the Privacy Policy provided separately). If you do not agree with the Terms, you are not authorized to use the Service.`,
      `SkillupGerman develops products for learning the German language in a gamified form. We periodically update the Service by adding or modifying features, interfaces, and materials. We reserve the right to amend these Terms. We may notify users of material changes by publishing a new version, and the effective date will be indicated at the top of this document. Continued use of the Service after the effective date of the updated Terms constitutes your acceptance of them.`
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
      "To access certain features of the Service, you may need to register an account. You agree to provide accurate, current, and complete information during registration and to keep it up to date. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.",
      `You agree to promptly notify Skillupgerman of any unauthorized access to or use of your account. You can contact us at ${EMAIL}. Skillupgerman reserves the right to suspend or terminate account access in case of Terms violations or for security reasons.`
    ]
  },
  {
    heading: "5. License and permitted use",
    paragraphs: [
      `Subject to compliance with these Terms, Skillupgerman grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service solely for personal educational purposes. Any other use, including commercial use, requires prior written consent from Skill-Up-German.`,
      "You agree not to interfere with the Service, bypass technical limitations, perform reverse engineering, distribute malicious code, or use the Service for illegal purposes or in violation of third-party rights. We reserve the right to implement and modify technical protection and access control measures."
    ]
  },
  {
    heading: "6. Subscriptions, payment, and renewal",
    paragraphs: [
      "The Service may be offered free of charge or as a paid subscription (Premium) providing access to extended features and materials. The exact scope of subscription features and its price may vary.",
      "Subscriptions are offered for a period (for example, monthly or yearly) and generally renew automatically until canceled. If auto-renewal is available in your country and payment system, the subscription fee will be charged at the beginning of each new period. You can cancel auto-renewal before the next billing date in your account interface (if available) or by contacting support.",
      "We may offer trial periods and promotions. Unless stated otherwise, after the trial period ends, the subscription becomes paid unless you cancel in advance. Refunds are provided in accordance with applicable laws and/or our refund policy (if any). We may notify users of price changes in advance; the new price applies from the next billing cycle."
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
      `All rights to the Content of Skillupgerman and the Service itself (including design, texts, exercises, images, audio, video, source code, and other elements) belong to Skillupgerman or are used under a valid license. No rights are transferred to you except those expressly granted by these Terms.`,
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
      `Skillupgerman may modify, suspend, or discontinue the Service (in whole or in part) at any time, including for technical maintenance, updates, or new releases. In certain cases, access to the Service may be restricted for security reasons or to comply with legal requirements.`
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
      "In any event, the total liability of Skillupgerman for any claims shall not exceed the amount actually paid by you for access to the Service during the twelve (12) months preceding the event giving rise to such liability, unless otherwise required by mandatory law."
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
      `These Terms are governed by the laws of ${COUNTRY}, without regard to conflict of laws principles. Any disputes arising out of or in connection with these Terms shall be resolved by the competent courts at the place of registration of Skillupgerman, unless mandatory law provides otherwise.`,
      "If any provision of these Terms is found invalid or unenforceable, it shall not affect the validity of the remaining provisions; such provision shall be modified to the minimum extent necessary to achieve the intent of the original text."
    ]
  },
  {
    heading: "17. Assignment, entire agreement, and headings",
    paragraphs: [
      `Skillupgerman may assign its rights and obligations under these Terms to third parties in accordance with the law; you may not transfer your rights without our prior written consent. These Terms, together with any referenced documents, constitute the entire agreement between you and Skillupgerman regarding the subject matter and supersede all prior understandings or agreements.`,
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

.terms {
  max-width: 940px;
  margin: 0 auto;
  padding: 32px 20px 90px;
  line-height: 1.75;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
}

h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 12px;
}

.last-updated {
  margin: 0 0 22px;
  font-size: 15px;
  opacity: 0.9;
}

.legal-note {
  margin: 18px 0 26px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
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
