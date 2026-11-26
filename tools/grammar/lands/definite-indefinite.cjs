// Грамматика к заданиям земли definite-indefinite (ein или der + прилагательное)
const { ex, t11, pt } = require('../lib.cjs')
const pick = (land, questId, index) => {
	const quest = require(`./${land}.cjs`)[questId]
	if (!quest || !quest.points[index]) throw new Error(`definite-indefinite: нет пункта ${land}/${questId}/${index}`)
	return quest.points[index]
}

const oneShows = pt(['Род показывает кто-то один', 'Рід показує хтось один', 'Only one shows the gender', 'Rodzaj pokazuje tylko jeden', 'Solo uno muestra el género', 'Un seul montre le genre', 'Cinsiyeti sadece biri gösterir', 'Genul îl arată unul singur', "Rodni faqat bittasi ko'rsatadi", 'लिंग कोई एक ही बताता है', 'واحد فقط يُظهر الجنس'], [
	'Если артикль уже показал род (der, den, das), прилагательное получает -e или -en. Если не показал (ein), род показывает прилагательное: ein neuer, ein neues.',
	'Якщо артикль уже показав рід (der, den, das), прикметник отримує -e або -en. Якщо ні (ein), рід показує прикметник: ein neuer, ein neues.',
	'If the article already shows the gender (der, den, das), the adjective takes -e or -en. If not (ein), the adjective shows it: ein neuer, ein neues.',
	'Jeśli rodzajnik już pokazał rodzaj (der, den, das), przymiotnik dostaje -e albo -en. Jeśli nie (ein), rodzaj pokazuje przymiotnik: ein neuer, ein neues.',
	'Si el artículo ya muestra el género (der, den, das), el adjetivo lleva -e o -en. Si no (ein), lo muestra el adjetivo: ein neuer, ein neues.',
	'Si l’article montre déjà le genre (der, den, das), l’adjectif prend -e ou -en. Sinon (ein), c’est l’adjectif qui le montre : ein neuer, ein neues.',
	'Artikel cinsiyeti zaten gösteriyorsa (der, den, das) sıfat -e ya da -en alır. Göstermiyorsa (ein) cinsiyeti sıfat gösterir: ein neuer, ein neues.',
	'Dacă articolul arată deja genul (der, den, das), adjectivul primește -e sau -en. Dacă nu (ein), genul îl arată adjectivul: ein neuer, ein neues.',
	"Artikl rodni allaqachon ko'rsatgan bo'lsa (der, den, das), sifat -e yoki -en oladi. Ko'rsatmasa (ein), rodni sifat ko'rsatadi: ein neuer, ein neues.",
	'अगर आर्टिकल ने लिंग बता दिया (der, den, das), तो विशेषण -e या -en लेता है। अगर नहीं (ein), तो लिंग विशेषण बताता है: ein neuer, ein neues।',
	'إذا أظهرت الأداة الجنس (der، den، das) تأخذ الصفة -e أو -en. وإن لم تُظهره (ein) تُظهره الصفة: ein neuer، ein neues.'
], [
	ex('Ein neuer Schrank steht im Zimmer. Der neue Schrank ist groß.', t11('В комнате стоит новый шкаф. Новый шкаф большой.', 'У кімнаті стоїть нова шафа. Нова шафа велика.', 'There’s a new wardrobe in the room. The new wardrobe is big.', 'W pokoju stoi nowa szafa. Nowa szafa jest duża.', 'En la habitación hay un armario nuevo. El armario nuevo es grande.', 'Il y a une nouvelle armoire dans la chambre. La nouvelle armoire est grande.', 'Odada yeni bir dolap var. Yeni dolap büyük.', 'În cameră e un dulap nou. Dulapul nou e mare.', 'Xonada yangi shkaf turibdi. Yangi shkaf katta.', 'कमरे में एक नई अलमारी है। नई अलमारी बड़ी है।', 'في الغرفة خزانة جديدة. الخزانة الجديدة كبيرة.'))
])

const firstKnown = pt(['ein впервые, der потом', 'ein уперше, der потім', 'ein the first time, der after', 'ein za pierwszym razem, der potem', 'ein la primera vez, der después', 'ein la première fois, der ensuite', 'İlk kez ein, sonra der', 'ein prima dată, der apoi', 'Birinchi marta ein, keyin der', 'पहली बार ein, बाद में der', 'ein أول مرة ثم der'], [
	'Впервые называем предмет с ein, дальше, когда он уже знаком, с der: Ich sehe ein neues Kleid. Das neue Kleid ist schön.',
	'Уперше називаємо предмет з ein, далі, коли він уже знайомий, з der: Ich sehe ein neues Kleid. Das neue Kleid ist schön.',
	'Mention a thing first with ein, then, once it’s known, with der: Ich sehe ein neues Kleid. Das neue Kleid ist schön.',
	'Pierwszy raz mówimy o rzeczy z ein, potem, gdy jest znana, z der: Ich sehe ein neues Kleid. Das neue Kleid ist schön.',
	'Primero mencionamos la cosa con ein y, cuando ya se conoce, con der: Ich sehe ein neues Kleid. Das neue Kleid ist schön.',
	'On présente d’abord la chose avec ein, puis, une fois connue, avec der : Ich sehe ein neues Kleid. Das neue Kleid ist schön.',
	'Bir şeyi ilk kez ein ile, bilinir olunca der ile söyleriz: Ich sehe ein neues Kleid. Das neue Kleid ist schön.',
	'Prima dată numim lucrul cu ein, apoi, când e cunoscut, cu der: Ich sehe ein neues Kleid. Das neue Kleid ist schön.',
	"Narsani birinchi marta ein bilan, tanish bo'lgach der bilan aytamiz: Ich sehe ein neues Kleid. Das neue Kleid ist schön.",
	'पहली बार चीज़ का ज़िक्र ein से, फिर जानी-पहचानी होने पर der से: Ich sehe ein neues Kleid. Das neue Kleid ist schön।',
	'نذكر الشيء أول مرة مع ein، ثم بعد أن يصبح معروفاً مع der: Ich sehe ein neues Kleid. Das neue Kleid ist schön.'
], [
	ex('Ich kaufe einen neuen Fernseher. Den neuen Fernseher stelle ich ins Wohnzimmer.', t11('Я покупаю новый телевизор. Новый телевизор я поставлю в гостиную.', 'Я купую новий телевізор. Новий телевізор я поставлю у вітальню.', 'I’m buying a new TV. I’ll put the new TV in the living room.', 'Kupuję nowy telewizor. Nowy telewizor postawię w salonie.', 'Compro un televisor nuevo. El televisor nuevo lo pongo en el salón.', 'J’achète une nouvelle télé. La nouvelle télé, je la mets au salon.', 'Yeni bir televizyon alıyorum. Yeni televizyonu salona koyacağım.', 'Cumpăr un televizor nou. Televizorul nou îl pun în sufragerie.', "Yangi televizor sotib olaman. Yangi televizorni mehmonxonaga qo'yaman.", 'मैं नया टीवी खरीद रहा हूँ। नया टीवी मैं बैठक में रखूँगा।', 'أشتري تلفازاً جديداً. سأضع التلفاز الجديد في الصالة.'))
])

const derE = pick('edge-images', 'adjective-one', 0)
const derEn = pick('edge-images', 'adjective-one', 1)
const einNom = pick('secret-lands', 'secret-one', 0)
const einAkk = pick('secret-lands', 'secret-two', 0)
const einDat = pick('secret-lands', 'secret-eight', 0)

const T = (...v) => t11(...v)
const mixTitle = T('ein или der', 'ein чи der', 'ein or der', 'ein czy der', 'ein o der', 'ein ou der', 'ein mi, der mi', 'ein sau der', 'ein yoki der', 'ein या der', 'ein أم der')
const rotation = [[oneShows], [firstKnown], [einNom, derE], [einAkk, derEn], [oneShows, firstKnown], [einDat], [einAkk, derEn], [oneShows], [einNom, derE], [firstKnown], [einAkk], [oneShows], [einAkk, derEn], [firstKnown], [oneShows, firstKnown]]
const ids = ['one-def', 'two-def', 'three-def', 'four-def', 'five-def', 'six-def', 'seven-def', 'eight-def', 'nine-def', 'ten-def', 'eleven-def', 'twelve-def', 'thirteen-def', 'fourteen-def', 'fifteen-def']

const quests = Object.fromEntries(ids.map((id, i) => [id, { title: mixTitle, points: rotation[i] }]))

module.exports = quests
