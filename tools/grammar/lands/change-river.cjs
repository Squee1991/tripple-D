// Грамматика к заданиям земли change-river (Река перемен: глаголы с меняющейся гласной)
const ex = (de, tr) => ({ de, tr })

const quests = {
	'change-river-one': {
		title: {
			ru: 'a → ä: du fährst, er fährt', uk: 'a → ä: du fährst, er fährt', en: 'a → ä: du fährst, er fährt',
			pl: 'a → ä: du fährst, er fährt', es: 'a → ä: du fährst, er fährt', fr: 'a → ä : du fährst, er fährt',
			tr: 'a → ä: du fährst, er fährt', ro: 'a → ä: du fährst, er fährt', uz: 'a → ä: du fährst, er fährt',
			hi: 'a → ä: du fährst, er fährt', ar: 'a → ä: du fährst وer fährt'
		},
		points: [
			{
				t: {
					ru: ['Гласная меняется у du и er', 'У fahren, schlafen, laufen буква a становится ä, но только у du и er/sie/es. У laufen au становится äu.'],
					uk: ['Голосна змінюється у du та er', 'У fahren, schlafen, laufen літера a стає ä, але лише у du та er/sie/es. У laufen au стає äu.'],
					en: ['The vowel changes with du and er', 'In fahren, schlafen, laufen the a becomes ä, but only with du and er/sie/es. In laufen au becomes äu.'],
					pl: ['Samogłoska zmienia się przy du i er', 'W fahren, schlafen, laufen litera a zmienia się w ä, ale tylko przy du i er/sie/es. W laufen au zmienia się w äu.'],
					es: ['La vocal cambia con du y er', 'En fahren, schlafen, laufen la a pasa a ä, pero solo con du y er/sie/es. En laufen au pasa a äu.'],
					fr: ['La voyelle change avec du et er', 'Dans fahren, schlafen, laufen, le a devient ä, mais seulement avec du et er/sie/es. Dans laufen, au devient äu.'],
					tr: ['Ünlü du ve er ile değişir', 'fahren, schlafen, laufen fiillerinde a, ä olur ama sadece du ve er/sie/es ile. laufen’da au, äu olur.'],
					ro: ['Vocala se schimbă la du și er', 'La fahren, schlafen, laufen a devine ä, dar doar la du și er/sie/es. La laufen au devine äu.'],
					uz: ["Unli du va er da o'zgaradi", "fahren, schlafen, laufen da a harfi ä ga aylanadi, lekin faqat du va er/sie/es da. laufen da au äu ga aylanadi."],
					hi: ['du और er के साथ स्वर बदलता है', 'fahren, schlafen, laufen में a बनता है ä, लेकिन सिर्फ़ du और er/sie/es के साथ। laufen में au बनता है äu।'],
					ar: ['يتغير الحرف مع du وer', 'في fahren وschlafen وlaufen يتحول a إلى ä، لكن مع du وer/sie/es فقط. وفي laufen يتحول au إلى äu.']
				},
				examples: [
					ex('ich fahre, du fährst, er fährt', { ru: 'я еду, ты едешь, он едет', uk: 'я їду, ти їдеш, він їде', en: 'I go, you go, he goes (by vehicle)', pl: 'jadę, jedziesz, on jedzie', es: 'voy, vas, él va (en vehículo)', fr: 'je vais, tu vas, il va (en véhicule)', tr: 'gidiyorum, gidiyorsun, gidiyor (araçla)', ro: 'merg, mergi, el merge (cu un vehicul)', uz: 'boraman, borasan, boradi (transportda)', hi: 'मैं जाता हूँ, तुम जाते हो, वह जाता है (सवारी से)', ar: 'أذهب، تذهب، يذهب (بمركبة)' }),
					ex('Das Kind schläft.', { ru: 'Ребёнок спит.', uk: 'Дитина спить.', en: 'The child is sleeping.', pl: 'Dziecko śpi.', es: 'El niño duerme.', fr: 'L’enfant dort.', tr: 'Çocuk uyuyor.', ro: 'Copilul doarme.', uz: 'Bola uxlayapti.', hi: 'बच्चा सो रहा है।', ar: 'الطفل نائم.' }),
					ex('Anna läuft im Park.', { ru: 'Анна бегает в парке.', uk: 'Анна бігає в парку.', en: 'Anna runs in the park.', pl: 'Anna biega w parku.', es: 'Anna corre en el parque.', fr: 'Anna court dans le parc.', tr: 'Anna parkta koşuyor.', ro: 'Anna aleargă în parc.', uz: 'Anna parkda yuguradi.', hi: 'अन्ना पार्क में दौड़ती है।', ar: 'آنا تركض في الحديقة.' })
				]
			}
		]
	},

	'change-river-two': {
		title: {
			ru: 'e → i: du isst, er spricht', uk: 'e → i: du isst, er spricht', en: 'e → i: du isst, er spricht',
			pl: 'e → i: du isst, er spricht', es: 'e → i: du isst, er spricht', fr: 'e → i : du isst, er spricht',
			tr: 'e → i: du isst, er spricht', ro: 'e → i: du isst, er spricht', uz: 'e → i: du isst, er spricht',
			hi: 'e → i: du isst, er spricht', ar: 'e → i: du isst وer spricht'
		},
		points: [
			{
				t: {
					ru: ['e становится i', 'У essen, sprechen, treffen e становится i у du и er/sie/es.'],
					uk: ['e стає i', 'У essen, sprechen, treffen e стає i у du та er/sie/es.'],
					en: ['e becomes i', 'In essen, sprechen, treffen the e becomes i with du and er/sie/es.'],
					pl: ['e zmienia się w i', 'W essen, sprechen, treffen e zmienia się w i przy du i er/sie/es.'],
					es: ['e pasa a i', 'En essen, sprechen, treffen la e pasa a i con du y er/sie/es.'],
					fr: ['e devient i', 'Dans essen, sprechen, treffen, le e devient i avec du et er/sie/es.'],
					tr: ['e, i olur', 'essen, sprechen, treffen fiillerinde du ve er/sie/es ile e, i olur.'],
					ro: ['e devine i', 'La essen, sprechen, treffen e devine i la du și er/sie/es.'],
					uz: ['e i ga aylanadi', "essen, sprechen, treffen da du va er/sie/es da e i ga aylanadi."],
					hi: ['e बनता है i', 'essen, sprechen, treffen में du और er/sie/es के साथ e बनता है i।'],
					ar: ['e تصبح i', 'في essen وsprechen وtreffen يتحول e إلى i مع du وer/sie/es.']
				},
				examples: [
					ex('Sie spricht Spanisch.', { ru: 'Она говорит по-испански.', uk: 'Вона говорить іспанською.', en: 'She speaks Spanish.', pl: 'Ona mówi po hiszpańsku.', es: 'Ella habla español.', fr: 'Elle parle espagnol.', tr: 'O İspanyolca konuşuyor.', ro: 'Ea vorbește spaniolă.', uz: 'U ispancha gapiradi.', hi: 'वह स्पेनिश बोलती है।', ar: 'هي تتكلم الإسبانية.' }),
					ex('Triffst du einen Freund?', { ru: 'Ты встречаешься с другом?', uk: 'Ти зустрічаєшся з другом?', en: 'Are you meeting a friend?', pl: 'Spotykasz się z przyjacielem?', es: '¿Quedas con un amigo?', fr: 'Tu retrouves un ami ?', tr: 'Bir arkadaşınla mı buluşuyorsun?', ro: 'Te întâlnești cu un prieten?', uz: "Do'sting bilan uchrashasanmi?", hi: 'क्या तुम किसी दोस्त से मिल रहे हो?', ar: 'هل تقابل صديقاً؟' })
				]
			},
			{
				t: {
					ru: ['essen: du и er одинаковы', 'У essen формы du и er совпадают: du isst, er isst.'],
					uk: ['essen: du та er однакові', 'У essen форми du та er збігаються: du isst, er isst.'],
					en: ['essen: du and er are the same', 'With essen the du and er forms are the same: du isst, er isst.'],
					pl: ['essen: du i er takie same', 'W essen formy du i er są takie same: du isst, er isst.'],
					es: ['essen: du y er iguales', 'En essen las formas de du y er coinciden: du isst, er isst.'],
					fr: ['essen : du et er identiques', 'Avec essen, les formes de du et er sont identiques : du isst, er isst.'],
					tr: ['essen: du ve er aynı', 'essen’de du ve er biçimleri aynıdır: du isst, er isst.'],
					ro: ['essen: du și er la fel', 'La essen formele pentru du și er sunt la fel: du isst, er isst.'],
					uz: ['essen: du va er bir xil', "essen da du va er shakllari bir xil: du isst, er isst."],
					hi: ['essen: du और er एक जैसे', 'essen में du और er के रूप एक जैसे हैं: du isst, er isst।'],
					ar: ['essen: du وer متشابهتان', 'في essen تتشابه صيغتا du وer: du isst، er isst.']
				},
				examples: [
					ex('Er isst Brot mit Käse.', { ru: 'Он ест хлеб с сыром.', uk: 'Він їсть хліб із сиром.', en: 'He eats bread with cheese.', pl: 'On je chleb z serem.', es: 'Él come pan con queso.', fr: 'Il mange du pain avec du fromage.', tr: 'O peynirli ekmek yiyor.', ro: 'El mănâncă pâine cu brânză.', uz: 'U pishloqli non yeydi.', hi: 'वह पनीर के साथ रोटी खाता है।', ar: 'هو يأكل خبزاً بالجبن.' })
				]
			}
		]
	},

	'change-river-three': {
		title: {
			ru: 'e → ie: sie liest, er sieht', uk: 'e → ie: sie liest, er sieht', en: 'e → ie: sie liest, er sieht',
			pl: 'e → ie: sie liest, er sieht', es: 'e → ie: sie liest, er sieht', fr: 'e → ie : sie liest, er sieht',
			tr: 'e → ie: sie liest, er sieht', ro: 'e → ie: sie liest, er sieht', uz: 'e → ie: sie liest, er sieht',
			hi: 'e → ie: sie liest, er sieht', ar: 'e → ie: sie liest وer sieht'
		},
		points: [
			{
				t: {
					ru: ['e становится ie', 'У lesen и sehen e становится ie у du и er/sie/es. У lesen du и er совпадают: liest.'],
					uk: ['e стає ie', 'У lesen і sehen e стає ie у du та er/sie/es. У lesen du та er збігаються: liest.'],
					en: ['e becomes ie', 'In lesen and sehen the e becomes ie with du and er/sie/es. With lesen du and er are the same: liest.'],
					pl: ['e zmienia się w ie', 'W lesen i sehen e zmienia się w ie przy du i er/sie/es. W lesen du i er są takie same: liest.'],
					es: ['e pasa a ie', 'En lesen y sehen la e pasa a ie con du y er/sie/es. En lesen du y er coinciden: liest.'],
					fr: ['e devient ie', 'Dans lesen et sehen, le e devient ie avec du et er/sie/es. Avec lesen, du et er sont identiques : liest.'],
					tr: ['e, ie olur', 'lesen ve sehen’de du ve er/sie/es ile e, ie olur. lesen’da du ve er aynı: liest.'],
					ro: ['e devine ie', 'La lesen și sehen e devine ie la du și er/sie/es. La lesen du și er sunt la fel: liest.'],
					uz: ['e ie ga aylanadi', "lesen va sehen da du va er/sie/es da e ie ga aylanadi. lesen da du va er bir xil: liest."],
					hi: ['e बनता है ie', 'lesen और sehen में du और er/sie/es के साथ e बनता है ie। lesen में du और er एक जैसे: liest।'],
					ar: ['e تصبح ie', 'في lesen وsehen يتحول e إلى ie مع du وer/sie/es. وفي lesen تتشابه du وer: liest.']
				},
				examples: [
					ex('Sie liest die Zeitung.', { ru: 'Она читает газету.', uk: 'Вона читає газету.', en: 'She reads the newspaper.', pl: 'Ona czyta gazetę.', es: 'Ella lee el periódico.', fr: 'Elle lit le journal.', tr: 'O gazete okuyor.', ro: 'Ea citește ziarul.', uz: "U gazeta o'qiyapti.", hi: 'वह अख़बार पढ़ रही है।', ar: 'هي تقرأ الجريدة.' }),
					ex('Siehst du den Hund?', { ru: 'Ты видишь собаку?', uk: 'Ти бачиш собаку?', en: 'Do you see the dog?', pl: 'Widzisz psa?', es: '¿Ves al perro?', fr: 'Tu vois le chien ?', tr: 'Köpeği görüyor musun?', ro: 'Vezi câinele?', uz: "Itni ko'ryapsanmi?", hi: 'क्या तुम्हें कुत्ता दिख रहा है?', ar: 'هل ترى الكلب؟' })
				]
			},
			{
				t: {
					ru: ['fernsehen: часть уходит в конец', 'fernsehen меняется так же, а fern уходит в конец предложения.'],
					uk: ['fernsehen: частина йде в кінець', 'fernsehen змінюється так само, а fern іде в кінець речення.'],
					en: ['fernsehen: part goes to the end', 'fernsehen changes the same way, and fern goes to the end of the sentence.'],
					pl: ['fernsehen: część idzie na koniec', 'fernsehen zmienia się tak samo, a fern idzie na koniec zdania.'],
					es: ['fernsehen: una parte va al final', 'fernsehen cambia igual, y fern va al final de la frase.'],
					fr: ['fernsehen : une partie va à la fin', 'fernsehen change pareil, et fern va à la fin de la phrase.'],
					tr: ['fernsehen: bir parça sona gider', 'fernsehen de aynı değişir, fern cümlenin sonuna gider.'],
					ro: ['fernsehen: o parte merge la final', 'fernsehen se schimbă la fel, iar fern merge la sfârșitul propoziției.'],
					uz: ["fernsehen: bir qismi oxiriga o'tadi", "fernsehen xuddi shunday o'zgaradi, fern esa gap oxiriga o'tadi."],
					hi: ['fernsehen: एक हिस्सा अंत में', 'fernsehen भी वैसे ही बदलता है, और fern वाक्य के अंत में जाता है।'],
					ar: ['fernsehen: جزء يذهب إلى الآخر', 'يتغير fernsehen بالطريقة نفسها، ويذهب fern إلى آخر الجملة.']
				},
				examples: [
					ex('Papa sieht fern.', { ru: 'Папа смотрит телевизор.', uk: 'Тато дивиться телевізор.', en: 'Dad is watching TV.', pl: 'Tata ogląda telewizję.', es: 'Papá ve la tele.', fr: 'Papa regarde la télé.', tr: 'Babam televizyon izliyor.', ro: 'Tata se uită la televizor.', uz: "Dadam televizor ko'ryapti.", hi: 'पापा टीवी देख रहे हैं।', ar: 'أبي يشاهد التلفاز.' })
				]
			}
		]
	},

	'change-river-four': {
		title: {
			ru: 'Особые: nehmen, geben, wissen', uk: 'Особливі: nehmen, geben, wissen', en: 'Special: nehmen, geben, wissen',
			pl: 'Szczególne: nehmen, geben, wissen', es: 'Especiales: nehmen, geben, wissen', fr: 'Particuliers : nehmen, geben, wissen',
			tr: 'Özel: nehmen, geben, wissen', ro: 'Speciale: nehmen, geben, wissen', uz: 'Alohida: nehmen, geben, wissen',
			hi: 'खास: nehmen, geben, wissen', ar: 'خاصة: nehmen وgeben وwissen'
		},
		points: [
			{
				t: {
					ru: ['nehmen и geben', 'nehmen меняется сильнее всех: du nimmst, er nimmt. geben: du gibst, er gibt.'],
					uk: ['nehmen і geben', 'nehmen змінюється найсильніше: du nimmst, er nimmt. geben: du gibst, er gibt.'],
					en: ['nehmen and geben', 'nehmen changes the most: du nimmst, er nimmt. geben: du gibst, er gibt.'],
					pl: ['nehmen i geben', 'nehmen zmienia się najbardziej: du nimmst, er nimmt. geben: du gibst, er gibt.'],
					es: ['nehmen y geben', 'nehmen es el que más cambia: du nimmst, er nimmt. geben: du gibst, er gibt.'],
					fr: ['nehmen et geben', 'nehmen change le plus : du nimmst, er nimmt. geben : du gibst, er gibt.'],
					tr: ['nehmen ve geben', 'En çok değişen nehmen: du nimmst, er nimmt. geben: du gibst, er gibt.'],
					ro: ['nehmen și geben', 'nehmen se schimbă cel mai mult: du nimmst, er nimmt. geben: du gibst, er gibt.'],
					uz: ['nehmen va geben', "Eng ko'p o'zgaradigani nehmen: du nimmst, er nimmt. geben: du gibst, er gibt."],
					hi: ['nehmen और geben', 'सबसे ज़्यादा nehmen बदलता है: du nimmst, er nimmt। geben: du gibst, er gibt।'],
					ar: ['nehmen وgeben', 'أكثرها تغيراً nehmen: du nimmst، er nimmt. وgeben: du gibst، er gibt.']
				},
				examples: [
					ex('Er nimmt einen Kuchen.', { ru: 'Он берёт пирог.', uk: 'Він бере пиріг.', en: 'He takes a cake.', pl: 'On bierze ciasto.', es: 'Él coge un pastel.', fr: 'Il prend un gâteau.', tr: 'O bir kek alıyor.', ro: 'El ia o prăjitură.', uz: 'U pirog oladi.', hi: 'वह एक केक लेता है।', ar: 'هو يأخذ كعكة.' }),
					ex('Mama gibt eine Banane.', { ru: 'Мама даёт банан.', uk: 'Мама дає банан.', en: 'Mum gives a banana.', pl: 'Mama daje banana.', es: 'Mamá da un plátano.', fr: 'Maman donne une banane.', tr: 'Annem bir muz veriyor.', ro: 'Mama dă o banană.', uz: 'Oyim banan beradi.', hi: 'माँ एक केला देती है।', ar: 'أمي تعطي موزة.' })
				]
			},
			{
				t: {
					ru: ['wissen: ich weiß', 'wissen особенный: у ich и er одинаково и без окончания -t. Ich weiß nicht значит «не знаю».'],
					uk: ['wissen: ich weiß', 'wissen особливе: у ich та er однаково і без закінчення -t. Ich weiß nicht означає «не знаю».'],
					en: ['wissen: ich weiß', 'wissen is special: ich and er are the same, with no -t. Ich weiß nicht means "I don’t know".'],
					pl: ['wissen: ich weiß', 'wissen jest szczególny: ich i er są takie same, bez końcówki -t. Ich weiß nicht znaczy „nie wiem”.'],
					es: ['wissen: ich weiß', 'wissen es especial: ich y er son iguales y sin -t. Ich weiß nicht significa "no sé".'],
					fr: ['wissen : ich weiß', 'wissen est particulier : ich et er sont identiques, sans -t. Ich weiß nicht veut dire « je ne sais pas ».'],
					tr: ['wissen: ich weiß', 'wissen özeldir: ich ve er aynıdır, -t yoktur. Ich weiß nicht "bilmiyorum" demektir.'],
					ro: ['wissen: ich weiß', 'wissen e special: ich și er sunt la fel, fără -t. Ich weiß nicht înseamnă „nu știu”.'],
					uz: ['wissen: ich weiß', "wissen alohida: ich va er bir xil, -t siz. Ich weiß nicht \"bilmayman\" degani."],
					hi: ['wissen: ich weiß', 'wissen खास है: ich और er एक जैसे, बिना -t के। Ich weiß nicht का मतलब "मुझे नहीं पता"।'],
					ar: ['wissen: ich weiß', 'wissen فعل خاص: ich وer متشابهتان وبدون -t. وIch weiß nicht تعني "لا أعرف".']
				},
				examples: [
					ex('ich weiß, du weißt, er weiß', { ru: 'я знаю, ты знаешь, он знает', uk: 'я знаю, ти знаєш, він знає', en: 'I know, you know, he knows', pl: 'wiem, wiesz, on wie', es: 'sé, sabes, él sabe', fr: 'je sais, tu sais, il sait', tr: 'biliyorum, biliyorsun, biliyor', ro: 'știu, știi, el știe', uz: 'bilaman, bilasan, biladi', hi: 'मैं जानता हूँ, तुम जानते हो, वह जानता है', ar: 'أعرف، تعرف، يعرف' }),
					ex('Weißt du die Adresse?', { ru: 'Ты знаешь адрес?', uk: 'Ти знаєш адресу?', en: 'Do you know the address?', pl: 'Znasz adres?', es: '¿Sabes la dirección?', fr: 'Tu connais l’adresse ?', tr: 'Adresi biliyor musun?', ro: 'Știi adresa?', uz: 'Manzilni bilasanmi?', hi: 'क्या तुम्हें पता मालूम है?', ar: 'هل تعرف العنوان؟' })
				]
			}
		]
	},

	'change-river-five': {
		title: {
			ru: 'Главное правило: только du и er', uk: 'Головне правило: лише du та er', en: 'The key rule: only du and er',
			pl: 'Główna zasada: tylko du i er', es: 'La regla clave: solo du y er', fr: 'La règle clé : seulement du et er',
			tr: 'Ana kural: sadece du ve er', ro: 'Regula principală: doar du și er', uz: 'Asosiy qoida: faqat du va er',
			hi: 'मुख्य नियम: सिर्फ़ du और er', ar: 'القاعدة الأهم: du وer فقط'
		},
		points: [
			{
				t: {
					ru: ['wir и ihr без изменений', 'Гласная меняется только у du и er/sie/es. У ich, wir, ihr, sie всё как обычно. Ошибка «wir fähren» или «ihr isst» очень частая.'],
					uk: ['wir та ihr без змін', 'Голосна змінюється лише у du та er/sie/es. У ich, wir, ihr, sie усе як зазвичай. Помилка «wir fähren» чи «ihr isst» дуже часта.'],
					en: ['wir and ihr stay regular', 'The vowel changes only with du and er/sie/es. With ich, wir, ihr, sie everything is normal. "wir fähren" or "ihr isst" is a very common mistake.'],
					pl: ['wir i ihr bez zmian', 'Samogłoska zmienia się tylko przy du i er/sie/es. Przy ich, wir, ihr, sie wszystko normalnie. Błąd „wir fähren” albo „ihr isst” jest bardzo częsty.'],
					es: ['wir e ihr sin cambios', 'La vocal cambia solo con du y er/sie/es. Con ich, wir, ihr, sie todo es normal. "wir fähren" o "ihr isst" es un error muy frecuente.'],
					fr: ['wir et ihr ne changent pas', 'La voyelle change seulement avec du et er/sie/es. Avec ich, wir, ihr, sie tout est normal. « wir fähren » ou « ihr isst » est une erreur très fréquente.'],
					tr: ['wir ve ihr değişmez', 'Ünlü sadece du ve er/sie/es ile değişir. ich, wir, ihr, sie ile her şey normaldir. "wir fähren" ya da "ihr isst" çok sık yapılan hatadır.'],
					ro: ['wir și ihr fără schimbări', 'Vocala se schimbă doar la du și er/sie/es. La ich, wir, ihr, sie totul e normal. „wir fähren” sau „ihr isst” este o greșeală foarte des întâlnită.'],
					uz: ["wir va ihr o'zgarmaydi", "Unli faqat du va er/sie/es da o'zgaradi. ich, wir, ihr, sie da hammasi odatdagidek. \"wir fähren\" yoki \"ihr isst\" juda ko'p uchraydigan xato."],
					hi: ['wir और ihr नहीं बदलते', 'स्वर सिर्फ़ du और er/sie/es के साथ बदलता है। ich, wir, ihr, sie के साथ सब सामान्य। "wir fähren" या "ihr isst" बहुत आम गलती है।'],
					ar: ['wir وihr بدون تغيير', 'يتغير الحرف مع du وer/sie/es فقط. أما مع ich وwir وihr وsie فكل شيء عادي. والخطأ "wir fähren" أو "ihr isst" شائع جداً.']
				},
				examples: [
					ex('du fährst → wir fahren, ihr fahrt', { ru: 'ты едешь → мы едем, вы едете', uk: 'ти їдеш → ми їдемо, ви їдете', en: 'you go → we go, you (all) go', pl: 'jedziesz → jedziemy, jedziecie', es: 'vas → vamos, vais', fr: 'tu vas → nous allons, vous allez', tr: 'gidiyorsun → gidiyoruz, gidiyorsunuz', ro: 'mergi → mergem, mergeți', uz: 'borasan → boramiz, borasizlar', hi: 'तुम जाते हो → हम जाते हैं, तुम सब जाते हो', ar: 'تذهب → نذهب، تذهبون' }),
					ex('er isst → wir essen, ihr esst', { ru: 'он ест → мы едим, вы едите', uk: 'він їсть → ми їмо, ви їсте', en: 'he eats → we eat, you (all) eat', pl: 'on je → jemy, jecie', es: 'él come → comemos, coméis', fr: 'il mange → nous mangeons, vous mangez', tr: 'o yiyor → yiyoruz, yiyorsunuz', ro: 'el mănâncă → mâncăm, mâncați', uz: 'u yeydi → yeymiz, yeysizlar', hi: 'वह खाता है → हम खाते हैं, तुम सब खाते हो', ar: 'يأكل → نأكل، تأكلون' })
				]
			}
		]
	},

	'change-river-six': {
		title: {
			ru: 'Эти глаголы и Akkusativ', uk: 'Ці дієслова і Akkusativ', en: 'These verbs and the accusative',
			pl: 'Te czasowniki i Akkusativ', es: 'Estos verbos y el acusativo', fr: 'Ces verbes et l’accusatif',
			tr: 'Bu fiiller ve Akkusativ', ro: 'Aceste verbe și acuzativul', uz: "Bu fe'llar va Akkusativ",
			hi: 'ये क्रियाएँ और Akkusativ', ar: 'هذه الأفعال وحالة المفعول'
		},
		points: [
			{
				t: {
					ru: ['Две вещи сразу', 'Гласная меняется у du и er, а мужской род после глагола получает den, einen, keinen.'],
					uk: ['Дві речі одразу', 'Голосна змінюється у du та er, а чоловічий рід після дієслова отримує den, einen, keinen.'],
					en: ['Two things at once', 'The vowel changes with du and er, and a masculine noun after the verb takes den, einen, keinen.'],
					pl: ['Dwie rzeczy naraz', 'Samogłoska zmienia się przy du i er, a rodzaj męski po czasowniku dostaje den, einen, keinen.'],
					es: ['Dos cosas a la vez', 'La vocal cambia con du y er, y el masculino después del verbo lleva den, einen, keinen.'],
					fr: ['Deux choses à la fois', 'La voyelle change avec du et er, et un nom masculin après le verbe prend den, einen, keinen.'],
					tr: ['Aynı anda iki şey', 'du ve er ile ünlü değişir, fiilden sonra eril isim den, einen, keinen alır.'],
					ro: ['Două lucruri deodată', 'Vocala se schimbă la du și er, iar masculinul după verb primește den, einen, keinen.'],
					uz: ['Bir vaqtda ikki narsa', "du va er da unli o'zgaradi, fe'ldan keyin erkak rodi den, einen, keinen oladi."],
					hi: ['एक साथ दो बातें', 'du और er के साथ स्वर बदलता है, और क्रिया के बाद पुल्लिंग den, einen, keinen लेता है।'],
					ar: ['أمران معاً', 'يتغير الحرف مع du وer، والاسم المذكر بعد الفعل يأخذ den أو einen أو keinen.']
				},
				examples: [
					ex('Er isst einen Salat.', { ru: 'Он ест салат.', uk: 'Він їсть салат.', en: 'He eats a salad.', pl: 'On je sałatkę.', es: 'Él come una ensalada.', fr: 'Il mange une salade.', tr: 'O salata yiyor.', ro: 'El mănâncă o salată.', uz: 'U salat yeydi.', hi: 'वह सलाद खाता है।', ar: 'هو يأكل سلطة.' }),
					ex('Sie liest den Brief.', { ru: 'Она читает письмо.', uk: 'Вона читає лист.', en: 'She reads the letter.', pl: 'Ona czyta list.', es: 'Ella lee la carta.', fr: 'Elle lit la lettre.', tr: 'O mektubu okuyor.', ro: 'Ea citește scrisoarea.', uz: "U xatni o'qiyapti.", hi: 'वह चिट्ठी पढ़ रही है।', ar: 'هي تقرأ الرسالة.' }),
					ex('Nimmst du den Bus?', { ru: 'Ты едешь на автобусе?', uk: 'Ти їдеш автобусом?', en: 'Are you taking the bus?', pl: 'Jedziesz autobusem?', es: '¿Coges el autobús?', fr: 'Tu prends le bus ?', tr: 'Otobüse mi biniyorsun?', ro: 'Iei autobuzul?', uz: 'Avtobusga minasanmi?', hi: 'क्या तुम बस ले रहे हो?', ar: 'هل تأخذ الحافلة؟' })
				]
			}
		]
	},

	'change-river-seven': {
		title: {
			ru: 'Практика: выходной день', uk: 'Практика: вихідний день', en: 'Practice: a day off',
			pl: 'Praktyka: dzień wolny', es: 'Práctica: un día libre', fr: 'Pratique : un jour de repos',
			tr: 'Pratik: tatil günü', ro: 'Practică: o zi liberă', uz: 'Mashq: dam olish kuni',
			hi: 'अभ्यास: छुट्टी का दिन', ar: 'تدريب: يوم العطلة'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Каждый в семье делает своё, поэтому почти всё про er и sie: тут гласная меняется.'],
					uk: ['Нових правил немає', 'Кожен у родині робить своє, тому майже все про er і sie: тут голосна змінюється.'],
					en: ['No new rules', 'Everyone in the family does their own thing, so it’s mostly er and sie: here the vowel changes.'],
					pl: ['Bez nowych reguł', 'Każdy w rodzinie robi coś swojego, więc prawie wszystko o er i sie: tu samogłoska się zmienia.'],
					es: ['Sin reglas nuevas', 'Cada uno en la familia hace lo suyo, así que casi todo va con er y sie: aquí la vocal cambia.'],
					fr: ['Pas de nouvelle règle', 'Chacun dans la famille fait ce qu’il veut, donc presque tout est avec er et sie : ici la voyelle change.'],
					tr: ['Yeni kural yok', 'Ailede herkes kendi işini yapıyor, yani çoğu er ve sie ile: burada ünlü değişir.'],
					ro: ['Fără reguli noi', 'Fiecare din familie face altceva, deci aproape totul e cu er și sie: aici vocala se schimbă.'],
					uz: ["Yangi qoida yo'q", "Oilada har kim o'z ishini qiladi, shuning uchun deyarli hammasi er va sie haqida: bu yerda unli o'zgaradi."],
					hi: ['कोई नया नियम नहीं', 'परिवार में हर कोई अपना काम करता है, इसलिए ज़्यादातर er और sie: यहाँ स्वर बदलता है।'],
					ar: ['لا قواعد جديدة', 'كل فرد في العائلة يفعل شيئاً مختلفاً، لذا معظم الجمل مع er وsie: وهنا يتغير الحرف.']
				},
				examples: [
					ex('Papa liest die Zeitung.', { ru: 'Папа читает газету.', uk: 'Тато читає газету.', en: 'Dad reads the newspaper.', pl: 'Tata czyta gazetę.', es: 'Papá lee el periódico.', fr: 'Papa lit le journal.', tr: 'Babam gazete okuyor.', ro: 'Tata citește ziarul.', uz: "Dadam gazeta o'qiyapti.", hi: 'पापा अख़बार पढ़ रहे हैं।', ar: 'أبي يقرأ الجريدة.' }),
					ex('Mama fährt Fahrrad.', { ru: 'Мама катается на велосипеде.', uk: 'Мама катається на велосипеді.', en: 'Mum is cycling.', pl: 'Mama jeździ na rowerze.', es: 'Mamá monta en bici.', fr: 'Maman fait du vélo.', tr: 'Annem bisiklete biniyor.', ro: 'Mama merge cu bicicleta.', uz: 'Oyim velosiped haydayapti.', hi: 'माँ साइकिल चला रही हैं।', ar: 'أمي تركب الدراجة.' })
				]
			}
		]
	},

	'change-river-eight': {
		title: {
			ru: 'Практика: языковое кафе', uk: 'Практика: мовне кафе', en: 'Practice: the language café',
			pl: 'Praktyka: kawiarnia językowa', es: 'Práctica: el café de idiomas', fr: 'Pratique : le café des langues',
			tr: 'Pratik: dil kafesi', ro: 'Practică: cafeneaua de limbi', uz: 'Mashq: til kafesi',
			hi: 'अभ्यास: भाषा कैफ़े', ar: 'تدريب: مقهى اللغات'
		},
		points: [
			{
				t: {
					ru: ['Новых правил нет', 'Языки пишутся с большой буквы и без артикля: Ich spreche Deutsch. Помни: du sprichst, но wir sprechen.'],
					uk: ['Нових правил немає', 'Мови пишуться з великої літери і без артикля: Ich spreche Deutsch. Пам’ятай: du sprichst, але wir sprechen.'],
					en: ['No new rules', 'Languages are capitalised and have no article: Ich spreche Deutsch. Remember: du sprichst, but wir sprechen.'],
					pl: ['Bez nowych reguł', 'Języki piszemy wielką literą i bez rodzajnika: Ich spreche Deutsch. Pamiętaj: du sprichst, ale wir sprechen.'],
					es: ['Sin reglas nuevas', 'Los idiomas van con mayúscula y sin artículo: Ich spreche Deutsch. Recuerda: du sprichst, pero wir sprechen.'],
					fr: ['Pas de nouvelle règle', 'Les langues prennent une majuscule et pas d’article : Ich spreche Deutsch. Rappel : du sprichst, mais wir sprechen.'],
					tr: ['Yeni kural yok', 'Diller büyük harfle ve artikelsiz yazılır: Ich spreche Deutsch. Unutma: du sprichst, ama wir sprechen.'],
					ro: ['Fără reguli noi', 'Limbile se scriu cu majusculă și fără articol: Ich spreche Deutsch. Ține minte: du sprichst, dar wir sprechen.'],
					uz: ["Yangi qoida yo'q", "Tillar bosh harf bilan va artiklsiz yoziladi: Ich spreche Deutsch. Esda tut: du sprichst, lekin wir sprechen."],
					hi: ['कोई नया नियम नहीं', 'भाषाएँ बड़े अक्षर से और बिना आर्टिकल के: Ich spreche Deutsch। याद रखो: du sprichst, लेकिन wir sprechen।'],
					ar: ['لا قواعد جديدة', 'أسماء اللغات تُكتب بحرف كبير وبدون أداة: Ich spreche Deutsch. وتذكر: du sprichst لكن wir sprechen.']
				},
				examples: [
					ex('Sprichst du Französisch?', { ru: 'Ты говоришь по-французски?', uk: 'Ти говориш французькою?', en: 'Do you speak French?', pl: 'Mówisz po francusku?', es: '¿Hablas francés?', fr: 'Tu parles français ?', tr: 'Fransızca konuşuyor musun?', ro: 'Vorbești franceza?', uz: 'Fransuzcha gapirasanmi?', hi: 'क्या तुम फ़्रेंच बोलते हो?', ar: 'هل تتكلم الفرنسية؟' }),
					ex('Wir sprechen Deutsch und Englisch.', { ru: 'Мы говорим по-немецки и по-английски.', uk: 'Ми говоримо німецькою та англійською.', en: 'We speak German and English.', pl: 'Mówimy po niemiecku i po angielsku.', es: 'Hablamos alemán e inglés.', fr: 'Nous parlons allemand et anglais.', tr: 'Almanca ve İngilizce konuşuyoruz.', ro: 'Vorbim germana și engleza.', uz: 'Biz nemischa va inglizcha gapiramiz.', hi: 'हम जर्मन और अंग्रेज़ी बोलते हैं।', ar: 'نتكلم الألمانية والإنجليزية.' })
				]
			}
		]
	},

	'change-river-nine': {
		title: {
			ru: 'Повторение: три группы глаголов', uk: 'Повторення: три групи дієслів', en: 'Review: three groups of verbs',
			pl: 'Powtórka: trzy grupy czasowników', es: 'Repaso: tres grupos de verbos', fr: 'Révision : trois groupes de verbes',
			tr: 'Tekrar: üç fiil grubu', ro: 'Recapitulare: trei grupe de verbe', uz: "Takrorlash: fe'llarning uch guruhi",
			hi: 'दोहराव: क्रियाओं के तीन समूह', ar: 'مراجعة: ثلاث مجموعات من الأفعال'
		},
		points: [
			{
				t: {
					ru: ['a → ä', 'fahren, schlafen, laufen.'],
					uk: ['a → ä', 'fahren, schlafen, laufen.'],
					en: ['a → ä', 'fahren, schlafen, laufen.'],
					pl: ['a → ä', 'fahren, schlafen, laufen.'],
					es: ['a → ä', 'fahren, schlafen, laufen.'],
					fr: ['a → ä', 'fahren, schlafen, laufen.'],
					tr: ['a → ä', 'fahren, schlafen, laufen.'],
					ro: ['a → ä', 'fahren, schlafen, laufen.'],
					uz: ['a → ä', 'fahren, schlafen, laufen.'],
					hi: ['a → ä', 'fahren, schlafen, laufen।'],
					ar: ['a → ä', 'fahren، schlafen، laufen.']
				},
				examples: [
					ex('Er fährt schnell Auto.', { ru: 'Он быстро ездит на машине.', uk: 'Він швидко їздить машиною.', en: 'He drives fast.', pl: 'On szybko jeździ samochodem.', es: 'Él conduce rápido.', fr: 'Il conduit vite.', tr: 'O hızlı araba sürüyor.', ro: 'El conduce repede.', uz: 'U mashinani tez haydaydi.', hi: 'वह तेज़ गाड़ी चलाता है।', ar: 'هو يقود السيارة بسرعة.' })
				]
			},
			{
				t: {
					ru: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					uk: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					en: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					pl: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					es: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					fr: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					tr: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					ro: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					uz: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst).'],
					hi: ['e → i', 'essen, sprechen, treffen, geben, nehmen (du nimmst)।'],
					ar: ['e → i', 'essen، sprechen، treffen، geben، nehmen (du nimmst).']
				},
				examples: [
					ex('Du sprichst zu schnell!', { ru: 'Ты говоришь слишком быстро!', uk: 'Ти говориш занадто швидко!', en: 'You speak too fast!', pl: 'Mówisz za szybko!', es: '¡Hablas demasiado rápido!', fr: 'Tu parles trop vite !', tr: 'Çok hızlı konuşuyorsun!', ro: 'Vorbești prea repede!', uz: 'Sen juda tez gapirasan!', hi: 'तुम बहुत तेज़ बोलते हो!', ar: 'أنت تتكلم بسرعة كبيرة!' })
				]
			},
			{
				t: {
					ru: ['e → ie и wissen', 'lesen, sehen, fernsehen. Отдельно wissen: ich weiß, er weiß.'],
					uk: ['e → ie і wissen', 'lesen, sehen, fernsehen. Окремо wissen: ich weiß, er weiß.'],
					en: ['e → ie and wissen', 'lesen, sehen, fernsehen. And separately wissen: ich weiß, er weiß.'],
					pl: ['e → ie i wissen', 'lesen, sehen, fernsehen. Osobno wissen: ich weiß, er weiß.'],
					es: ['e → ie y wissen', 'lesen, sehen, fernsehen. Aparte, wissen: ich weiß, er weiß.'],
					fr: ['e → ie et wissen', 'lesen, sehen, fernsehen. À part, wissen : ich weiß, er weiß.'],
					tr: ['e → ie ve wissen', 'lesen, sehen, fernsehen. Ayrıca wissen: ich weiß, er weiß.'],
					ro: ['e → ie și wissen', 'lesen, sehen, fernsehen. Separat wissen: ich weiß, er weiß.'],
					uz: ['e → ie va wissen', 'lesen, sehen, fernsehen. Alohida wissen: ich weiß, er weiß.'],
					hi: ['e → ie और wissen', 'lesen, sehen, fernsehen। अलग से wissen: ich weiß, er weiß।'],
					ar: ['e → ie وwissen', 'lesen، sehen، fernsehen. وعلى حدة wissen: ich weiß، er weiß.']
				},
				examples: [
					ex('Sie sieht das Auto.', { ru: 'Она видит машину.', uk: 'Вона бачить машину.', en: 'She sees the car.', pl: 'Ona widzi samochód.', es: 'Ella ve el coche.', fr: 'Elle voit la voiture.', tr: 'O arabayı görüyor.', ro: 'Ea vede mașina.', uz: "U mashinani ko'ryapti.", hi: 'उसे गाड़ी दिख रही है।', ar: 'هي ترى السيارة.' })
				]
			}
		]
	},

	'change-river-ten': {
		title: {
			ru: 'Контрольный: что повторить', uk: 'Контрольне: що повторити', en: 'Final test: what to review',
			pl: 'Sprawdzian: co powtórzyć', es: 'Prueba final: qué repasar', fr: 'Contrôle : quoi réviser',
			tr: 'Sınav: neleri tekrar etmeli', ro: 'Test: ce să recapitulezi', uz: 'Nazorat: nimani takrorlash kerak',
			hi: 'टेस्ट: क्या दोहराएँ', ar: 'الاختبار: ماذا تراجع'
		},
		points: [
			{
				t: {
					ru: ['Меняются только du и er', 'du fährst, er isst, sie liest, du nimmst. А wir и ihr как обычно.'],
					uk: ['Змінюються лише du та er', 'du fährst, er isst, sie liest, du nimmst. А wir та ihr як зазвичай.'],
					en: ['Only du and er change', 'du fährst, er isst, sie liest, du nimmst. wir and ihr stay regular.'],
					pl: ['Zmieniają się tylko du i er', 'du fährst, er isst, sie liest, du nimmst. A wir i ihr normalnie.'],
					es: ['Solo cambian du y er', 'du fährst, er isst, sie liest, du nimmst. wir e ihr, normales.'],
					fr: ['Seuls du et er changent', 'du fährst, er isst, sie liest, du nimmst. wir et ihr restent réguliers.'],
					tr: ['Sadece du ve er değişir', 'du fährst, er isst, sie liest, du nimmst. wir ve ihr normal.'],
					ro: ['Se schimbă doar du și er', 'du fährst, er isst, sie liest, du nimmst. wir și ihr rămân normale.'],
					uz: ["Faqat du va er o'zgaradi", "du fährst, er isst, sie liest, du nimmst. wir va ihr odatdagidek."],
					hi: ['सिर्फ़ du और er बदलते हैं', 'du fährst, er isst, sie liest, du nimmst। wir और ihr सामान्य रहते हैं।'],
					ar: ['تتغير du وer فقط', 'du fährst، er isst، sie liest، du nimmst. أما wir وihr فعاديتان.']
				},
				examples: [
					ex('Heute fahren wir lange Zug.', { ru: 'Сегодня мы долго едем на поезде.', uk: 'Сьогодні ми довго їдемо потягом.', en: 'Today we’re on the train for a long time.', pl: 'Dziś długo jedziemy pociągiem.', es: 'Hoy vamos mucho rato en tren.', fr: 'Aujourd’hui nous prenons le train longtemps.', tr: 'Bugün uzun süre trenle gidiyoruz.', ro: 'Azi mergem mult cu trenul.', uz: 'Bugun poyezdda uzoq yuramiz.', hi: 'आज हम बहुत देर ट्रेन में जा रहे हैं।', ar: 'اليوم نسافر بالقطار مدة طويلة.' })
				]
			},
			{
				t: {
					ru: ['wissen', 'ich weiß, du weißt, er weiß.'],
					uk: ['wissen', 'ich weiß, du weißt, er weiß.'],
					en: ['wissen', 'ich weiß, du weißt, er weiß.'],
					pl: ['wissen', 'ich weiß, du weißt, er weiß.'],
					es: ['wissen', 'ich weiß, du weißt, er weiß.'],
					fr: ['wissen', 'ich weiß, du weißt, er weiß.'],
					tr: ['wissen', 'ich weiß, du weißt, er weiß.'],
					ro: ['wissen', 'ich weiß, du weißt, er weiß.'],
					uz: ['wissen', 'ich weiß, du weißt, er weiß.'],
					hi: ['wissen', 'ich weiß, du weißt, er weiß।'],
					ar: ['wissen', 'ich weiß، du weißt، er weiß.']
				},
				examples: [
					ex('Weißt du die Antwort?', { ru: "Ты знаешь ответ?", uk: "Ти знаєш відповідь?", en: "Do you know the answer?", pl: "Znasz odpowiedź?", es: "¿Sabes la respuesta?", fr: "Tu connais la réponse ?", tr: "Cevabı biliyor musun?", ro: "Știi răspunsul?", uz: "Javobni bilasanmi?", hi: "क्या तुम्हें जवाब पता है?", ar: "هل تعرف الجواب؟" })
				]
			},
			{
				t: {
					ru: ['Akkusativ после глагола', 'Мужской род после глагола: den, einen, keinen.'],
					uk: ['Akkusativ після дієслова', 'Чоловічий рід після дієслова: den, einen, keinen.'],
					en: ['Accusative after the verb', 'Masculine after the verb: den, einen, keinen.'],
					pl: ['Akkusativ po czasowniku', 'Rodzaj męski po czasowniku: den, einen, keinen.'],
					es: ['Acusativo tras el verbo', 'Masculino después del verbo: den, einen, keinen.'],
					fr: ['Accusatif après le verbe', 'Masculin après le verbe : den, einen, keinen.'],
					tr: ['Fiilden sonra Akkusativ', 'Fiilden sonra eril: den, einen, keinen.'],
					ro: ['Acuzativ după verb', 'Masculinul după verb: den, einen, keinen.'],
					uz: ["Fe'ldan keyin Akkusativ", "Fe'ldan keyin erkak rodi: den, einen, keinen."],
					hi: ['क्रिया के बाद Akkusativ', 'क्रिया के बाद पुल्लिंग: den, einen, keinen।'],
					ar: ['حالة المفعول بعد الفعل', 'المذكر بعد الفعل: den، einen، keinen.']
				},
				examples: [
					ex('Nimmst du den Koffer?', { ru: 'Ты берёшь чемодан?', uk: 'Ти береш валізу?', en: 'Are you taking the suitcase?', pl: 'Bierzesz walizkę?', es: '¿Coges la maleta?', fr: 'Tu prends la valise ?', tr: 'Bavulu alıyor musun?', ro: 'Iei valiza?', uz: 'Chamadonni olasanmi?', hi: 'क्या तुम सूटकेस ले रहे हो?', ar: 'هل تأخذ الحقيبة؟' })
				]
			}
		]
	}
}

module.exports = quests
