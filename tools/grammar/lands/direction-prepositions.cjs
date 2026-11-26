// Грамматика к заданиям земли direction-prepositions (zu, nach, bei, aus, von, mit)
const { ex, t11, pt, noRules, finalTitle } = require('../lib.cjs')

const alwaysDativ = pt(['Всегда Dativ', 'Завжди Dativ', 'Always dative', 'Zawsze Dativ', 'Siempre dativo', 'Toujours le datif', 'Her zaman Dativ', 'Mereu dativ', 'Doim Dativ', 'हमेशा Dativ', 'دائماً حالة الجر'], [
	'После zu, bei, aus, von, mit всегда Dativ: dem, der, dem, во множественном den.',
	'Після zu, bei, aus, von, mit завжди Dativ: dem, der, dem, у множині den.',
	'After zu, bei, aus, von, mit always use the dative: dem, der, dem, plural den.',
	'Po zu, bei, aus, von, mit zawsze Dativ: dem, der, dem, w liczbie mnogiej den.',
	'Después de zu, bei, aus, von, mit siempre dativo: dem, der, dem, en plural den.',
	'Après zu, bei, aus, von, mit, toujours le datif : dem, der, dem, au pluriel den.',
	'zu, bei, aus, von, mit’ten sonra her zaman Dativ: dem, der, dem, çoğulda den.',
	'După zu, bei, aus, von, mit mereu dativ: dem, der, dem, la plural den.',
	"zu, bei, aus, von, mit dan keyin doim Dativ: dem, der, dem, ko'plikda den.",
	'zu, bei, aus, von, mit के बाद हमेशा Dativ: dem, der, dem, बहुवचन में den।',
	'بعد zu وbei وaus وvon وmit دائماً حالة الجر: dem وder وdem، وفي الجمع den.'
])

const threeQuestions = pt(['Куда, где, откуда', 'Куди, де, звідки', 'Where to, where, where from', 'Dokąd, gdzie, skąd', 'Adónde, dónde, de dónde', 'Où (vers), où, d’où', 'Nereye, nerede, nereden', 'Încotro, unde, de unde', 'Qayerga, qayerda, qayerdan', 'किधर, कहाँ, कहाँ से', 'إلى أين، أين، من أين'], [
	'Wohin? zum Arzt. Wo? beim Arzt. Woher? vom Arzt. С домом: nach Hause (домой), zu Hause (дома).',
	'Wohin? zum Arzt. Wo? beim Arzt. Woher? vom Arzt. З домом: nach Hause (додому), zu Hause (удома).',
	'Wohin? zum Arzt. Wo? beim Arzt. Woher? vom Arzt. With home: nach Hause (home), zu Hause (at home).',
	'Wohin? zum Arzt. Wo? beim Arzt. Woher? vom Arzt. Z domem: nach Hause (do domu), zu Hause (w domu).',
	'Wohin? zum Arzt. Wo? beim Arzt. Woher? vom Arzt. Con casa: nach Hause (a casa), zu Hause (en casa).',
	'Wohin ? zum Arzt. Wo ? beim Arzt. Woher ? vom Arzt. Avec la maison : nach Hause (à la maison, direction), zu Hause (à la maison, lieu).',
	'Wohin? zum Arzt. Wo? beim Arzt. Woher? vom Arzt. Ev için: nach Hause (eve), zu Hause (evde).',
	'Wohin? zum Arzt. Wo? beim Arzt. Woher? vom Arzt. Cu casa: nach Hause (acasă, direcție), zu Hause (acasă, loc).',
	"Wohin? zum Arzt. Wo? beim Arzt. Woher? vom Arzt. Uy bilan: nach Hause (uyga), zu Hause (uyda).",
	'Wohin? zum Arzt। Wo? beim Arzt। Woher? vom Arzt। घर के साथ: nach Hause (घर की ओर), zu Hause (घर पर)।',
	'Wohin؟ zum Arzt. Wo؟ beim Arzt. Woher؟ vom Arzt. ومع البيت: nach Hause (إلى البيت)، zu Hause (في البيت).'
], [
	ex('Ich gehe zum Arzt.', t11('Я иду к врачу.', 'Я йду до лікаря.', 'I’m going to the doctor’s.', 'Idę do lekarza.', 'Voy al médico.', 'Je vais chez le médecin.', 'Doktora gidiyorum.', 'Merg la medic.', 'Men shifokorga boryapman.', 'मैं डॉक्टर के पास जा रहा हूँ।', 'أذهب إلى الطبيب.')),
	ex('Ich bin beim Arzt.', t11('Я у врача.', 'Я в лікаря.', 'I’m at the doctor’s.', 'Jestem u lekarza.', 'Estoy en el médico.', 'Je suis chez le médecin.', 'Doktordayım.', 'Sunt la medic.', 'Men shifokordaman.', 'मैं डॉक्टर के पास हूँ।', 'أنا عند الطبيب.')),
	ex('Ich komme vom Arzt.', t11('Я иду от врача.', 'Я йду від лікаря.', 'I’m coming from the doctor’s.', 'Wracam od lekarza.', 'Vengo del médico.', 'Je reviens de chez le médecin.', 'Doktordan geliyorum.', 'Vin de la medic.', 'Men shifokordan kelyapman.', 'मैं डॉक्टर के पास से आ रहा हूँ।', 'أعود من عند الطبيب.'))
])

const contract = (title, texts, examples) => pt(title, texts, examples)

const quests = {
	'direction-prep-1': {
		title: t11('zu: куда идём', 'zu: куди йдемо', 'zu: where we go', 'zu: dokąd idziemy', 'zu: adónde vamos', 'zu : où on va', 'zu: nereye gidiyoruz', 'zu: unde mergem', 'zu: qayerga boramiz', 'zu: कहाँ जा रहे हैं', 'zu: إلى أين نذهب'),
		points: [contract('zum, zur', [
			'zu значит «к» человеку или месту. zu + dem = zum, zu + der = zur.',
			'zu означає «до» людини чи місця. zu + dem = zum, zu + der = zur.',
			'zu means "to" a person or place. zu + dem = zum, zu + der = zur.',
			'zu znaczy „do” osoby lub miejsca. zu + dem = zum, zu + der = zur.',
			'zu significa "a" una persona o lugar. zu + dem = zum, zu + der = zur.',
			'zu veut dire « chez, à » une personne ou un lieu. zu + dem = zum, zu + der = zur.',
			'zu bir kişiye ya da yere "-e" demektir. zu + dem = zum, zu + der = zur.',
			'zu înseamnă „la” o persoană sau un loc. zu + dem = zum, zu + der = zur.',
			"zu odamga yoki joyga \"-ga\" degani. zu + dem = zum, zu + der = zur.",
			'zu मतलब किसी व्यक्ति या जगह "की ओर"। zu + dem = zum, zu + der = zur।',
			'zu تعني "إلى" شخص أو مكان. zu + dem = zum، zu + der = zur.'
		], [ex('Ich gehe zu meinem Freund.', t11('Я иду к своему другу.', 'Я йду до свого друга.', 'I’m going to my friend’s.', 'Idę do mojego przyjaciela.', 'Voy a casa de mi amigo.', 'Je vais chez mon ami.', 'Arkadaşıma gidiyorum.', 'Merg la prietenul meu.', "Do'stimnikiga boryapman.", 'मैं अपने दोस्त के पास जा रहा हूँ।', 'أذهب إلى صديقي.'))]), alwaysDativ]
	},
	'direction-prep-2': {
		title: t11('nach: в город и домой', 'nach: у місто і додому', 'nach: to a city and home', 'nach: do miasta i do domu', 'nach: a la ciudad y a casa', 'nach : vers une ville et à la maison', 'nach: şehre ve eve', 'nach: în oraș și acasă', 'nach: shaharga va uyga', 'nach: शहर और घर', 'nach: إلى مدينة وإلى البيت'),
		points: [contract('nach', [
			'nach ставим перед городом и страной без артикля и в nach Hause (домой).',
			'nach ставимо перед містом і країною без артикля та в nach Hause (додому).',
			'Use nach before cities and countries without an article, and in nach Hause (home).',
			'nach stawiamy przed miastem i krajem bez rodzajnika oraz w nach Hause (do domu).',
			'nach va delante de ciudades y países sin artículo, y en nach Hause (a casa).',
			'nach s’emploie devant une ville ou un pays sans article, et dans nach Hause (à la maison).',
			'nach artikelsiz şehir ve ülke adlarından önce ve nach Hause (eve) ifadesinde kullanılır.',
			'nach se pune înaintea orașelor și țărilor fără articol și în nach Hause (acasă).',
			"nach artiklsiz shahar va davlat nomidan oldin hamda nach Hause (uyga) iborasida ishlatiladi.",
			'nach बिना आर्टिकल वाले शहर और देश से पहले, और nach Hause (घर की ओर) में आता है।',
			'نضع nach قبل المدن والدول بدون أداة، وفي nach Hause (إلى البيت).'
		], [ex('Wir fliegen nach Spanien.', t11('Мы летим в Испанию.', 'Ми летимо до Іспанії.', 'We’re flying to Spain.', 'Lecimy do Hiszpanii.', 'Volamos a España.', 'Nous partons en avion en Espagne.', 'İspanya’ya uçuyoruz.', 'Zburăm în Spania.', 'Biz Ispaniyaga uchamiz.', 'हम स्पेन जा रहे हैं।', 'نسافر جواً إلى إسبانيا.'))])]
	},
	'direction-prep-3': {
		title: t11('bei: у кого мы', 'bei: у кого ми', 'bei: at someone’s place', 'bei: u kogo jesteśmy', 'bei: en casa de alguien', 'bei : chez quelqu’un', 'bei: kimdeyiz', 'bei: la cineva', 'bei: kimnikida', 'bei: किसके पास', 'bei: عند من'),
		points: [contract('bei, beim', [
			'bei значит «у кого-то» или место работы. bei + dem = beim.',
			'bei означає «у когось» або місце роботи. bei + dem = beim.',
			'bei means "at someone’s place" or where you work. bei + dem = beim.',
			'bei znaczy „u kogoś” albo miejsce pracy. bei + dem = beim.',
			'bei significa "en casa de alguien" o el lugar de trabajo. bei + dem = beim.',
			'bei veut dire « chez quelqu’un » ou le lieu de travail. bei + dem = beim.',
			'bei "birinin yanında" ya da çalışılan yer demektir. bei + dem = beim.',
			'bei înseamnă „la cineva” sau locul de muncă. bei + dem = beim.',
			"bei \"kimnikida\" yoki ish joyi degani. bei + dem = beim.",
			'bei मतलब "किसी के यहाँ" या काम की जगह। bei + dem = beim।',
			'bei تعني "عند شخص" أو مكان العمل. bei + dem = beim.'
		], [ex('Ich wohne bei meinen Eltern.', t11('Я живу у родителей.', 'Я живу в батьків.', 'I live with my parents.', 'Mieszkam u rodziców.', 'Vivo con mis padres.', 'J’habite chez mes parents.', 'Ailemin yanında yaşıyorum.', 'Locuiesc la părinții mei.', 'Ota-onamnikida yashayman.', 'मैं अपने माता-पिता के साथ रहता हूँ।', 'أسكن عند والديّ.'))])]
	},
	'direction-prep-4': {
		title: t11('aus: откуда', 'aus: звідки', 'aus: from where', 'aus: skąd', 'aus: de dónde', 'aus : d’où', 'aus: nereden', 'aus: de unde', 'aus: qayerdan', 'aus: कहाँ से', 'aus: من أين'),
		points: [contract('aus', [
			'aus значит «из» чего-то наружу или из какой страны.',
			'aus означає «з» чогось назовні або з якої країни.',
			'aus means "out of" something or from a country.',
			'aus znaczy „z” czegoś na zewnątrz albo z jakiego kraju.',
			'aus significa "de dentro de" algo o de un país.',
			'aus veut dire « hors de » quelque chose ou de quel pays.',
			'aus bir şeyin "içinden dışarı" ya da hangi ülkeden demektir.',
			'aus înseamnă „din” ceva în afară sau din ce țară.',
			"aus biror narsaning \"ichidan\" yoki qaysi davlatdan degani.",
			'aus मतलब किसी चीज़ के अंदर "से" या किस देश से।',
			'aus تعني "من داخل" شيء أو من أي بلد.'
		], [ex('Ich komme aus der Türkei.', t11('Я из Турции.', 'Я з Туреччини.', 'I’m from Turkey.', 'Jestem z Turcji.', 'Soy de Turquía.', 'Je viens de Turquie.', 'Türkiyeliyim.', 'Sunt din Turcia.', 'Men Turkiyadanman.', 'मैं तुर्की से हूँ।', 'أنا من تركيا.'))])]
	},
	'direction-prep-5': {
		title: t11('von: от кого и откуда', 'von: від кого і звідки', 'von: from whom and where', 'von: od kogo i skąd', 'von: de quién y de dónde', 'von : de qui et d’où', 'von: kimden ve nereden', 'von: de la cine și de unde', 'von: kimdan va qayerdan', 'von: किससे और कहाँ से', 'von: من مَن ومن أين'),
		points: [contract('von, vom', [
			'von значит «от» человека или «с» места, где мы были. von + dem = vom.',
			'von означає «від» людини або «з» місця, де ми були. von + dem = vom.',
			'von means "from" a person or a place you were at. von + dem = vom.',
			'von znaczy „od” osoby albo „z” miejsca, gdzie byliśmy. von + dem = vom.',
			'von significa "de" una persona o del lugar donde estuvimos. von + dem = vom.',
			'von veut dire « de » une personne ou d’un lieu où l’on était. von + dem = vom.',
			'von bir kişiden ya da bulunduğumuz yerden "-den" demektir. von + dem = vom.',
			'von înseamnă „de la” o persoană sau un loc unde am fost. von + dem = vom.',
			"von odamdan yoki biz bo'lgan joydan \"-dan\" degani. von + dem = vom.",
			'von मतलब किसी व्यक्ति "से" या जहाँ हम थे उस जगह "से"। von + dem = vom।',
			'von تعني "من" شخص أو من مكان كنا فيه. von + dem = vom.'
		], [ex('Ich komme von der Arbeit.', t11('Я иду с работы.', 'Я йду з роботи.', 'I’m coming from work.', 'Wracam z pracy.', 'Vengo del trabajo.', 'Je reviens du travail.', 'İşten geliyorum.', 'Vin de la muncă.', 'Ishdan kelyapman.', 'मैं काम से आ रहा हूँ।', 'أعود من العمل.'))])]
	},
	'direction-prep-6': {
		title: t11('mit: с кем и на чём', 'mit: з ким і чим', 'mit: with whom and how', 'mit: z kim i czym', 'mit: con quién y en qué', 'mit : avec qui et comment', 'mit: kiminle ve neyle', 'mit: cu cine și cu ce', 'mit: kim bilan va nima bilan', 'mit: किसके साथ और किससे', 'mit: مع مَن وبماذا'),
		points: [contract('mit', [
			'mit значит «с кем-то» и «на каком транспорте». После mit всегда Dativ.',
			'mit означає «з кимось» і «яким транспортом». Після mit завжди Dativ.',
			'mit means "with someone" and "by what transport". mit always takes the dative.',
			'mit znaczy „z kimś” i „czym” jedziemy. Po mit zawsze Dativ.',
			'mit significa "con alguien" y "en qué transporte". Tras mit siempre dativo.',
			'mit veut dire « avec quelqu’un » et « en quel transport ». Après mit, toujours le datif.',
			'mit "biriyle" ve "hangi araçla" demektir. mit’ten sonra her zaman Dativ.',
			'mit înseamnă „cu cineva” și „cu ce mijloc de transport”. După mit mereu dativ.',
			"mit \"kim bilandir\" va \"qanday transportda\" degani. mit dan keyin doim Dativ.",
			'mit मतलब "किसी के साथ" और "किस सवारी से"। mit के बाद हमेशा Dativ।',
			'mit تعني "مع شخص" و"بأي وسيلة نقل". وبعد mit دائماً حالة الجر.'
		], [ex('Ich fahre mit dem Fahrrad.', t11('Я еду на велосипеде.', 'Я їду на велосипеді.', 'I go by bike.', 'Jadę rowerem.', 'Voy en bici.', 'Je vais à vélo.', 'Bisikletle gidiyorum.', 'Merg cu bicicleta.', 'Men velosipedda boraman.', 'मैं साइकिल से जाता हूँ।', 'أذهب بالدراجة.')), ex('Er spricht mit dem Lehrer.', t11('Он говорит с учителем.', 'Він говорить з учителем.', 'He’s talking to the teacher.', 'On rozmawia z nauczycielem.', 'Él habla con el profesor.', 'Il parle avec le professeur.', 'O öğretmenle konuşuyor.', 'El vorbește cu profesorul.', "U o'qituvchi bilan gaplashyapti.", 'वह शिक्षक से बात कर रहा है।', 'هو يتكلم مع المعلم.'))])]
	},
	'direction-prep-7': {
		title: t11('Куда, где, откуда', 'Куди, де, звідки', 'Where to, where, where from', 'Dokąd, gdzie, skąd', 'Adónde, dónde, de dónde', 'Où, où, d’où', 'Nereye, nerede, nereden', 'Încotro, unde, de unde', 'Qayerga, qayerda, qayerdan', 'किधर, कहाँ, कहाँ से', 'إلى أين، أين، من أين'),
		points: [threeQuestions]
	},
	'direction-prep-9': {
		title: t11('Практика: поездка к бабушке', 'Практика: поїздка до бабусі', 'Practice: visiting grandma', 'Praktyka: wyjazd do babci', 'Práctica: visita a la abuela', 'Pratique : chez mamie', 'Pratik: büyükanneye ziyaret', 'Practică: drumul la bunica', "Mashq: buvinikiga safar", 'अभ्यास: दादी के पास', 'تدريب: زيارة الجدة'),
		points: [threeQuestions, alwaysDativ]
	},
	'direction-prep-10': {
		title: t11('Практика: мой день', 'Практика: мій день', 'Practice: my day', 'Praktyka: mój dzień', 'Práctica: mi día', 'Pratique : ma journée', 'Pratik: günüm', 'Practică: ziua mea', 'Mashq: mening kunim', 'अभ्यास: मेरा दिन', 'تدريب: يومي'),
		points: [pt(noRules, [
			'Повторяем три вопроса: zur Arbeit (куда), bei der Arbeit (где), von der Arbeit (откуда).',
			'Повторюємо три питання: zur Arbeit (куди), bei der Arbeit (де), von der Arbeit (звідки).',
			'Review the three questions: zur Arbeit (where to), bei der Arbeit (where), von der Arbeit (where from).',
			'Powtarzamy trzy pytania: zur Arbeit (dokąd), bei der Arbeit (gdzie), von der Arbeit (skąd).',
			'Repasamos las tres preguntas: zur Arbeit (adónde), bei der Arbeit (dónde), von der Arbeit (de dónde).',
			'On révise les trois questions : zur Arbeit (où on va), bei der Arbeit (où on est), von der Arbeit (d’où on vient).',
			'Üç soruyu tekrar ediyoruz: zur Arbeit (nereye), bei der Arbeit (nerede), von der Arbeit (nereden).',
			'Recapitulăm cele trei întrebări: zur Arbeit (încotro), bei der Arbeit (unde), von der Arbeit (de unde).',
			"Uch savolni takrorlaymiz: zur Arbeit (qayerga), bei der Arbeit (qayerda), von der Arbeit (qayerdan).",
			'तीन सवाल दोहराते हैं: zur Arbeit (किधर), bei der Arbeit (कहाँ), von der Arbeit (कहाँ से)।',
			'نراجع الأسئلة الثلاثة: zur Arbeit (إلى أين)، bei der Arbeit (أين)، von der Arbeit (من أين).'
		], [ex('Am Morgen fahre ich mit dem Bus zur Arbeit.', t11('Утром я еду на автобусе на работу.', 'Уранці я їду автобусом на роботу.', 'In the morning I take the bus to work.', 'Rano jadę autobusem do pracy.', 'Por la mañana voy al trabajo en autobús.', 'Le matin, je vais au travail en bus.', 'Sabah otobüsle işe giderim.', 'Dimineața merg cu autobuzul la muncă.', 'Ertalab avtobusda ishga boraman.', 'सुबह मैं बस से काम पर जाता हूँ।', 'في الصباح أذهب إلى العمل بالحافلة.'))])]
	},
	'direction-prep-8': {
		title: finalTitle,
		points: [threeQuestions, alwaysDativ]
	}
}

module.exports = quests
