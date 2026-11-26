// Грамматика к заданиям земли opinion-tower (мнение, предположение, плюсы и минусы)
const { ex, t11, pt, finalTitle } = require('../lib.cjs')

const findePoint = pt(['Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...', 'Ich finde, dass ...'], [
	'Ich finde/glaube/denke, dass ...: после dass глагол в конце. Без dass порядок обычный: Ich finde, der Film ist gut.',
	'Ich finde/glaube/denke, dass ...: після dass дієслово в кінці. Без dass порядок звичайний: Ich finde, der Film ist gut.',
	'Ich finde/glaube/denke, dass ...: after dass the verb goes last. Without dass normal order: Ich finde, der Film ist gut.',
	'Ich finde/glaube/denke, dass ...: po dass czasownik na końcu. Bez dass szyk zwykły: Ich finde, der Film ist gut.',
	'Ich finde/glaube/denke, dass ...: tras dass, verbo al final. Sin dass, orden normal: Ich finde, der Film ist gut.',
	'Ich finde/glaube/denke, dass ... : après dass, verbe à la fin. Sans dass, ordre normal : Ich finde, der Film ist gut.',
	'Ich finde/glaube/denke, dass ...: dass’tan sonra fiil sonda. dass olmadan normal sıra: Ich finde, der Film ist gut.',
	'Ich finde/glaube/denke, dass ...: după dass verbul la final. Fără dass, ordine normală: Ich finde, der Film ist gut.',
	"Ich finde/glaube/denke, dass ...: dass dan keyin fe'l oxirida. dass siz oddiy tartib: Ich finde, der Film ist gut.",
	'Ich finde/glaube/denke, dass ...: dass के बाद क्रिया अंत में। बिना dass सामान्य क्रम: Ich finde, der Film ist gut।',
	'Ich finde/glaube/denke, dass ...: بعد dass الفعل في الآخر. وبدون dass الترتيب عادي: Ich finde, der Film ist gut.'
], [ex('Ich finde, dass der Film interessant ist.', t11('Я считаю, что фильм интересный.', 'Я вважаю, що фільм цікавий.', 'I think the film is interesting.', 'Uważam, że film jest ciekawy.', 'Creo que la película es interesante.', 'Je trouve que le film est intéressant.', 'Bence film ilginç.', 'Cred că filmul e interesant.', 'Menimcha, film qiziqarli.', 'मुझे लगता है कि फ़िल्म दिलचस्प है।', 'أرى أن الفيلم ممتع.'))])

const meinungPoint = pt(['Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...', 'Meiner Meinung nach ...'], [
	'Meiner Meinung nach (по-моему) занимает первое место, поэтому сразу после него глагол.',
	'Meiner Meinung nach (на мою думку) займає перше місце, тому одразу після нього дієслово.',
	'Meiner Meinung nach (in my opinion) takes the first position, so the verb comes right after it.',
	'Meiner Meinung nach (moim zdaniem) zajmuje pierwsze miejsce, więc zaraz po nim czasownik.',
	'Meiner Meinung nach (en mi opinión) ocupa el primer lugar, así que justo después va el verbo.',
	'Meiner Meinung nach (à mon avis) occupe la première place, donc le verbe vient juste après.',
	'Meiner Meinung nach (bence) ilk sırayı alır, bu yüzden hemen ardından fiil gelir.',
	'Meiner Meinung nach (după părerea mea) ocupă primul loc, deci imediat după el vine verbul.',
	"Meiner Meinung nach (menimcha) birinchi o'rinni egallaydi, shuning uchun darhol fe'l keladi.",
	'Meiner Meinung nach (मेरी राय में) पहला स्थान लेता है, इसलिए तुरंत बाद क्रिया।',
	'Meiner Meinung nach (في رأيي) تحتل المكان الأول، لذلك يأتي الفعل بعدها مباشرة.'
], [ex('Meiner Meinung nach ist das zu teuer.', t11('По-моему, это слишком дорого.', 'На мою думку, це надто дорого.', 'In my opinion, that’s too expensive.', 'Moim zdaniem to za drogie.', 'En mi opinión, es demasiado caro.', 'À mon avis, c’est trop cher.', 'Bence bu çok pahalı.', 'După părerea mea, e prea scump.', 'Menimcha, bu juda qimmat.', 'मेरी राय में यह बहुत महँगा है।', 'في رأيي هذا غالٍ جداً.'))])

const rechtPoint = pt(['Da hast du recht', 'Da hast du recht', 'Da hast du recht', 'Da hast du recht', 'Da hast du recht', 'Da hast du recht', 'Da hast du recht', 'Da hast du recht', 'Da hast du recht', 'Da hast du recht', 'Da hast du recht'], [
	'Согласие: Da hast du recht. Das stimmt. Несогласие: Das stimmt nicht. Ich bin nicht deiner Meinung. Мягко: Ja, aber ...',
	'Згода: Da hast du recht. Das stimmt. Незгода: Das stimmt nicht. Ich bin nicht deiner Meinung. М’яко: Ja, aber ...',
	'Agreeing: Da hast du recht. Das stimmt. Disagreeing: Das stimmt nicht. Ich bin nicht deiner Meinung. Softly: Ja, aber ...',
	'Zgoda: Da hast du recht. Das stimmt. Niezgoda: Das stimmt nicht. Ich bin nicht deiner Meinung. Łagodnie: Ja, aber ...',
	'Acuerdo: Da hast du recht. Das stimmt. Desacuerdo: Das stimmt nicht. Ich bin nicht deiner Meinung. Con suavidad: Ja, aber ...',
	'Être d’accord : Da hast du recht. Das stimmt. Pas d’accord : Das stimmt nicht. Ich bin nicht deiner Meinung. En douceur : Ja, aber ...',
	'Katılmak: Da hast du recht. Das stimmt. Katılmamak: Das stimmt nicht. Ich bin nicht deiner Meinung. Yumuşak: Ja, aber ...',
	'Acord: Da hast du recht. Das stimmt. Dezacord: Das stimmt nicht. Ich bin nicht deiner Meinung. Blând: Ja, aber ...',
	"Rozilik: Da hast du recht. Das stimmt. Norozilik: Das stimmt nicht. Ich bin nicht deiner Meinung. Yumshoq: Ja, aber ...",
	'सहमति: Da hast du recht। Das stimmt। असहमति: Das stimmt nicht। Ich bin nicht deiner Meinung। नरमी से: Ja, aber ...',
	'الموافقة: Da hast du recht. Das stimmt. وعدم الموافقة: Das stimmt nicht. Ich bin nicht deiner Meinung. وبلطف: Ja, aber ...'
], [ex('Da hast du recht.', t11('Тут ты прав.', 'Тут ти маєш рацію.', 'You’re right there.', 'Tu masz rację.', 'En eso tienes razón.', 'Là, tu as raison.', 'Orada haklısın.', 'Aici ai dreptate.', "Bu yerda haqsan.", 'इसमें तुम सही हो।', 'معك حق في هذا.'))])

const wohlPoint = pt(['wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl, wahrscheinlich, bestimmt', 'wird wohl وwahrscheinlich وbestimmt'], [
	'Предположение: werden + wohl + инфинитив (наверное). Уверенность растёт: vielleicht < wahrscheinlich < bestimmt.',
	'Припущення: werden + wohl + інфінітив (мабуть). Упевненість зростає: vielleicht < wahrscheinlich < bestimmt.',
	'A guess: werden + wohl + infinitive (probably). Rising certainty: vielleicht < wahrscheinlich < bestimmt.',
	'Przypuszczenie: werden + wohl + bezokolicznik (pewnie). Pewność rośnie: vielleicht < wahrscheinlich < bestimmt.',
	'Suposición: werden + wohl + infinitivo (seguramente). La certeza sube: vielleicht < wahrscheinlich < bestimmt.',
	'Supposition : werden + wohl + infinitif (sans doute). La certitude monte : vielleicht < wahrscheinlich < bestimmt.',
	'Tahmin: werden + wohl + mastar (herhalde). Emin olma artar: vielleicht < wahrscheinlich < bestimmt.',
	'Presupunere: werden + wohl + infinitiv (probabil). Siguranța crește: vielleicht < wahrscheinlich < bestimmt.',
	"Taxmin: werden + wohl + infinitiv (ehtimol). Ishonch oshadi: vielleicht < wahrscheinlich < bestimmt.",
	'अनुमान: werden + wohl + इन्फ़िनिटिव (शायद)। यक़ीन बढ़ता है: vielleicht < wahrscheinlich < bestimmt।',
	'التخمين: werden + wohl + المصدر (على الأرجح). والثقة تزداد: vielleicht < wahrscheinlich < bestimmt.'
], [ex('Er wird wohl krank sein.', t11('Он, наверное, болен.', 'Він, мабуть, хворий.', 'He’s probably ill.', 'Pewnie jest chory.', 'Seguramente está enfermo.', 'Il est sans doute malade.', 'Herhalde hasta.', 'Probabil e bolnav.', "U ehtimol kasaldir.", 'वह शायद बीमार है।', 'لعله مريض.'))])

const vorteilPoint = pt(['Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil, Nachteil', 'Vorteil وNachteil'], [
	'Ein Vorteil/Nachteil ist, dass ... (глагол в конце). После einerseits и andererseits сразу глагол.',
	'Ein Vorteil/Nachteil ist, dass ... (дієслово в кінці). Після einerseits і andererseits одразу дієслово.',
	'Ein Vorteil/Nachteil ist, dass ... (verb at the end). After einerseits and andererseits the verb comes right away.',
	'Ein Vorteil/Nachteil ist, dass ... (czasownik na końcu). Po einerseits i andererseits od razu czasownik.',
	'Ein Vorteil/Nachteil ist, dass ... (verbo al final). Tras einerseits y andererseits, verbo enseguida.',
	'Ein Vorteil/Nachteil ist, dass ... (verbe à la fin). Après einerseits et andererseits, verbe tout de suite.',
	'Ein Vorteil/Nachteil ist, dass ... (fiil sonda). einerseits ve andererseits’ten sonra fiil hemen.',
	'Ein Vorteil/Nachteil ist, dass ... (verbul la final). După einerseits și andererseits, verbul imediat.',
	"Ein Vorteil/Nachteil ist, dass ... (fe'l oxirida). einerseits va andererseits dan keyin fe'l darhol.",
	'Ein Vorteil/Nachteil ist, dass ... (क्रिया अंत में)। einerseits और andererseits के बाद क्रिया तुरंत।',
	'Ein Vorteil/Nachteil ist, dass ... (الفعل في الآخر). وبعد einerseits وandererseits الفعل مباشرة.'
], [ex('Ein Vorteil ist, dass die Wohnung im Zentrum liegt.', t11('Плюс в том, что квартира в центре.', 'Плюс у тому, що квартира в центрі.', 'One advantage is that the flat is in the centre.', 'Zaletą jest to, że mieszkanie jest w centrum.', 'Una ventaja es que el piso está en el centro.', 'Un avantage, c’est que l’appartement est au centre.', 'Bir avantajı, dairenin merkezde olması.', 'Un avantaj e că apartamentul e în centru.', "Afzalligi shundaki, kvartira markazda.", 'एक फ़ायदा यह है कि फ़्लैट केंद्र में है।', 'من المزايا أن الشقة في المركز.'))])

const T = (...v) => t11(...v)
const quests = {
	'opinion-tower-one': { title: T('Я считаю, что...', 'Я вважаю, що...', 'I think that...', 'Uważam, że...', 'Creo que...', 'Je trouve que...', 'Bence...', 'Cred că...', 'Menimcha...', 'मुझे लगता है कि...', 'أرى أن...'), points: [findePoint] },
	'opinion-tower-two': { title: T('По-моему', 'На мою думку', 'In my opinion', 'Moim zdaniem', 'En mi opinión', 'À mon avis', 'Bana göre', 'După părerea mea', 'Mening fikrimcha', 'मेरी राय में', 'في رأيي'), points: [meinungPoint] },
	'opinion-tower-three': { title: T('Да, ты прав. Нет, это не так', 'Так, ти правий. Ні, це не так', 'Yes, you’re right. No, it isn’t', 'Tak, masz rację. Nie, to nieprawda', 'Sí, tienes razón. No, no es así', 'Oui, tu as raison. Non, ce n’est pas vrai', 'Evet, haklısın. Hayır, öyle değil', 'Da, ai dreptate. Nu, nu e așa', "Ha, haqsan. Yo'q, unday emas", 'हाँ, तुम सही हो। नहीं, ऐसा नहीं', 'نعم، معك حق. لا، ليس كذلك'), points: [rechtPoint] },
	'opinion-tower-four': { title: T('Наверное: wird wohl', 'Мабуть: wird wohl', 'Probably: wird wohl', 'Pewnie: wird wohl', 'Seguramente: wird wohl', 'Sans doute : wird wohl', 'Herhalde: wird wohl', 'Probabil: wird wohl', 'Ehtimol: wird wohl', 'शायद: wird wohl', 'على الأرجح: wird wohl'), points: [wohlPoint] },
	'opinion-tower-five': { title: T('Может быть, вероятно, точно', 'Можливо, ймовірно, точно', 'Maybe, probably, definitely', 'Może, prawdopodobnie, na pewno', 'Quizá, probablemente, seguro', 'Peut-être, probablement, sûrement', 'Belki, muhtemelen, kesin', 'Poate, probabil, sigur', 'Balki, ehtimol, albatta', 'शायद, संभवतः, ज़रूर', 'ربما، على الأرجح، بالتأكيد'), points: [wohlPoint] },
	'opinion-tower-six': { title: T('Плюсы и минусы', 'Плюси й мінуси', 'Pros and cons', 'Plusy i minusy', 'Ventajas e inconvenientes', 'Avantages et inconvénients', 'Artılar ve eksiler', 'Avantaje și dezavantaje', 'Afzallik va kamchiliklar', 'फ़ायदे और नुकसान', 'المزايا والعيوب'), points: [vorteilPoint] },
	'opinion-tower-seven': { title: T('Практика: город или деревня?', 'Практика: місто чи село?', 'Practice: city or country?', 'Praktyka: miasto czy wieś?', 'Práctica: ¿ciudad o campo?', 'Pratique : ville ou campagne ?', 'Pratik: şehir mi, köy mü?', 'Practică: oraș sau sat?', "Mashq: shahar yoki qishloq?", 'अभ्यास: शहर या गाँव?', 'تدريب: المدينة أم الريف؟'), points: [findePoint, vorteilPoint] },
	'opinion-tower-eight': { title: T('Практика: что будет завтра?', 'Практика: що буде завтра?', 'Practice: what will tomorrow bring?', 'Praktyka: co będzie jutro?', 'Práctica: ¿qué pasará mañana?', 'Pratique : que se passera-t-il demain ?', 'Pratik: yarın ne olacak?', 'Practică: ce va fi mâine?', "Mashq: ertaga nima bo'ladi?", 'अभ्यास: कल क्या होगा?', 'تدريب: ماذا سيحدث غداً؟'), points: [wohlPoint] },
	'opinion-tower-nine': { title: T('Повторение: мнение', 'Повторення: думка', 'Review: opinions', 'Powtórka: opinie', 'Repaso: opiniones', 'Révision : opinions', 'Tekrar: görüşler', 'Recapitulare: păreri', 'Takrorlash: fikrlar', 'दोहराव: राय', 'مراجعة: الآراء'), points: [findePoint, meinungPoint, wohlPoint] },
	'opinion-tower-ten': { title: finalTitle, points: [findePoint, meinungPoint] }
}

module.exports = quests
