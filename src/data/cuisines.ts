import type { Cuisine } from '../types'

export interface PantryItem {
  naam: string
  /** Waar je het vindt. */
  waar: string
}

export interface CuisineInfo {
  id: Cuisine
  emoji: string
  intro: string
  smaken: string[]
  ingredienten: string[]
  voorraadkast: PantryItem[]
}

const AZIA = 'Aziatische supermarkt (toko), ook vaak bij de grote supermarkt in het Aziatische schap'
const SUPER = 'Gewone supermarkt'

/** Kennis per wereldkeuken, voor de pagina's /keukens en /keukens/:id. Volgorde = volgorde van de tegels. */
export const CUISINE_INFO: CuisineInfo[] = [
  {
    id: 'thais',
    emoji: '🌶️',
    intro:
      'De Thaise keuken zoekt altijd balans tussen zoet, zuur, zout, bitter en pittig. Verse kruiden, kokosmelk en vurige pepertjes maken van elk gerecht een feestje, van een rustige curry tot een knallende salade.',
    smaken: ['Zoet, zuur, zout en pittig in één hap', 'Verse kruiden: koriander, basilicum, munt', 'Citroengras, galangal en limoenblad', 'Romige kokosmelk', 'Vurige rode en groene pepertjes'],
    ingredienten: ['Jasmijnrijst', 'Currypasta (rood, groen, geel, massaman)', 'Kokosmelk', 'Vissaus', 'Limoen', 'Thaise basilicum', 'Rijstnoedels', 'Palmsuiker'],
    voorraadkast: [
      { naam: 'Vissaus', waar: AZIA },
      { naam: 'Kokosmelk (blik)', waar: SUPER },
      { naam: 'Currypasta (rood en groen)', waar: `${AZIA}, of zelf maken met onze basisrecepten` },
      { naam: 'Palmsuiker', waar: AZIA },
      { naam: 'Tamarindepasta', waar: AZIA },
      { naam: 'Citroengras, galangal en limoenblad', waar: `${AZIA}; ook verkrijgbaar in de diepvries` },
    ],
  },
  {
    id: 'chinees',
    emoji: '🥢',
    intro:
      'De Chinese keuken is enorm gevarieerd, van vurig Sichuan tot milde Kantonese gerechten. Wokken op hoog vuur, stomen en langzaam sudderen zijn de basistechnieken, met sojasaus, gember en knoflook als vaste smaakmakers.',
    smaken: ['Umami van sojasaus en oestersaus', 'Gember, knoflook en bosui als basis', 'Sichuan-peper: tintelend en pittig', 'Zoetzuur en sesamolie', 'Wokhei: een lichte rooksmaak'],
    ingredienten: ['Sojasaus (licht en donker)', 'Oestersaus', 'Shaoxing-wijn', 'Rijstazijn', 'Sesamolie', 'Hoisinsaus', 'Tofu', 'Pak choi en paksoi'],
    voorraadkast: [
      { naam: 'Sojasaus (licht en donker)', waar: SUPER },
      { naam: 'Oestersaus', waar: `${SUPER}, of Aziatische supermarkt` },
      { naam: 'Shaoxing-wijn', waar: `${AZIA}; vervang eventueel door droge sherry` },
      { naam: 'Zwarte (Chinkiang-)azijn', waar: AZIA },
      { naam: 'Sichuan-peperkorrels en chilibonenpasta (doubanjiang)', waar: AZIA },
      { naam: 'Sesamolie en rijstazijn', waar: SUPER },
    ],
  },
  {
    id: 'japans',
    emoji: '🍣',
    intro:
      'Japans eten draait om pure ingrediënten, seizoen en precisie. Rijst, vis, tofu en zeewier staan centraal, met subtiele smaken als umami van dashi en miso.',
    smaken: ['Umami van dashi, miso en sojasaus', 'Zachte zoetheid van mirin', 'Frisse azijn en gember', 'Zeewier (nori, kombu)', 'Minimalistisch en seizoensgebonden'],
    ingredienten: ['Sushirijst', 'Nori', 'Sojasaus of tamari', 'Mirin', 'Rijstazijn', 'Miso', 'Wasabi', 'Panko'],
    voorraadkast: [
      { naam: 'Sushirijst', waar: SUPER },
      { naam: 'Nori en kombu', waar: `${SUPER} (sushischap) of Aziatische supermarkt` },
      { naam: 'Mirin en sake', waar: AZIA },
      { naam: 'Miso en dashi', waar: AZIA },
      { naam: 'Rijstazijn', waar: SUPER },
      { naam: 'Tamari (glutenvrije sojasaus)', waar: 'Natuurvoedingswinkel of grote supermarkt' },
    ],
  },
  {
    id: 'italiaans',
    emoji: '🍝',
    intro:
      'Italiaans koken is eenvoudig en ingrediëntgedreven: weinig componenten, maar van topkwaliteit. Pasta, olijfolie, tomaat en kaas vormen de basis, met per regio een eigen karakter.',
    smaken: ['Rijpe tomaat en basilicum', 'Fruitige olijfolie', 'Knoflook en peterselie', 'Pecorino en parmezaan', 'Eenvoud en kwaliteit'],
    ingredienten: ['Pasta en risottorijst', 'Olijfolie', 'Gepelde tomaten', 'Parmezaan', 'Mozzarella', 'Verse basilicum', 'Balsamico'],
    voorraadkast: [
      { naam: 'Extra vierge olijfolie', waar: SUPER },
      { naam: 'Gepelde tomaten (blik, bv. San Marzano)', waar: SUPER },
      { naam: 'Parmigiano Reggiano en pecorino', waar: 'Supermarkt of kaasboer' },
      { naam: 'Risottorijst (arborio of carnaroli)', waar: SUPER },
      { naam: 'Tipo 00-bloem', waar: 'Grote supermarkt of Italiaanse delicatessenwinkel' },
    ],
  },
  {
    id: 'belgisch',
    emoji: '🍟',
    intro:
      'De Belgische keuken is stevig en gul: frieten, stoofvlees, mosselen en wafels. Bier, boter en chocolade komen regelmatig terug, en alles wordt met veel liefde en geduld klaargemaakt.',
    smaken: ['Donker bier in de stoofpot', 'Boter en room', 'Mosterd en nootmuskaat', 'Chocolade en karamel', 'Dubbel gebakken frieten'],
    ingredienten: ['Aardappelen', 'Donker abdijbier', 'Prei en witloof', 'Mosselen', 'Speculoos', 'Pure chocolade', 'Boter'],
    voorraadkast: [
      { naam: 'Donker Belgisch bier', waar: 'Supermarkt of slijterij' },
      { naam: 'Mosterd (grof of Dijon)', waar: SUPER },
      { naam: 'Parelsuiker', waar: 'Bakkerij of bakwinkel' },
      { naam: 'Peperkoek en speculaas', waar: SUPER },
    ],
  },
  {
    id: 'nederlands',
    emoji: '🧀',
    intro:
      'Hollandse pot: eerlijk, voedzaam en vaak met aardappelen en groenten uit eigen land. Denk aan stamppot, erwtensoep, appeltaart en kaas.',
    smaken: ['Boter en kaas', 'Mosterd en nootmuskaat', 'Kaneel en appel', 'Rookworst en spek', 'Eenvoudig en herkenbaar'],
    ingredienten: ['Aardappelen', 'Boerenkool en zuurkool', 'Rookworst', 'Gouda', 'Appels', 'Spliterwten', 'Roggebrood'],
    voorraadkast: [
      { naam: 'Mosterd', waar: SUPER },
      { naam: 'Rookworst en spekblokjes', waar: SUPER },
      { naam: 'Oude kaas', waar: 'Supermarkt of kaaswinkel' },
      { naam: 'Speculaaskruiden', waar: SUPER },
    ],
  },
  {
    id: 'frans',
    emoji: '🥐',
    intro:
      'De Franse keuken staat bekend om techniek en smaak: sauzen, gebak en klassiekers die van eenvoudige ingrediënten iets bijzonders maken.',
    smaken: ['Boter, room en wijn', 'Kruiden uit de tuin (tijm, rozemarijn)', 'Dijonmosterd', 'Knoflook en sjalot', 'Vanille en karamel'],
    ingredienten: ['Boter', 'Room', 'Gruyère', 'Rode en witte wijn', 'Sjalotten', 'Bladerdeeg', 'Dijonmosterd'],
    voorraadkast: [
      { naam: 'Dijonmosterd', waar: SUPER },
      { naam: 'Bladerdeeg en pâte brisée', waar: `${SUPER} (koelvak of diepvries)` },
      { naam: 'Gruyère en Comté', waar: 'Supermarkt of kaaswinkel' },
      { naam: 'Herbes de Provence', waar: SUPER },
    ],
  },
  {
    id: 'mexicaans',
    emoji: '🌮',
    intro:
      'Mexicaans eten is kleurrijk en vol smaak: maïs, bonen, pepers en limoen. Tacos, salsa en guacamole zijn de bekendste ambassadeurs.',
    smaken: ['Limoen en koriander', 'Komijn en gerookte paprika', 'Verse en gedroogde chilipepers', 'Maïs en bonen', 'Romige avocado'],
    ingredienten: ['Maïstortilla\'s', 'Zwarte bonen', 'Avocado', 'Jalapeño', 'Limoen', 'Koriander', 'Komijn'],
    voorraadkast: [
      { naam: 'Maïstortilla\'s', waar: `${SUPER} (wereldkeuken-schap)` },
      { naam: 'Zwarte bonen (blik)', waar: SUPER },
      { naam: 'Jalapeño op pot en gerookt paprikapoeder', waar: SUPER },
      { naam: 'Chipotle in adobo', waar: 'Grote supermarkt of speciaalzaak' },
    ],
  },
  {
    id: 'midden-oosten',
    emoji: '🧆',
    intro:
      'De keuken van het Midden-Oosten is geurig en gul: kikkererwten, kruiden, brood en veel olijfolie. Delen aan tafel is vanzelfsprekend.',
    smaken: ['Komijn, koriander en kurkuma', 'Citroen en munt', 'Tahin en olijfolie', 'Gegrild vlees en groenten', 'Honing en noten'],
    ingredienten: ['Kikkererwten', 'Tahin', 'Bulgur en couscous', 'Pitabrood', 'Feta', 'Citroen', 'Pistache'],
    voorraadkast: [
      { naam: 'Tahin (sesampasta)', waar: SUPER },
      { naam: 'Za\'atar en sumak', waar: 'Turkse of Arabische supermarkt' },
      { naam: 'Filodeeg', waar: `${SUPER} (diepvries)` },
      { naam: 'Bulgur', waar: `${SUPER} of Turkse supermarkt` },
    ],
  },
  {
    id: 'amerikaans',
    emoji: '🍔',
    intro:
      'Amerikaans eten is groot, hartig en vrolijk: burgers, barbecue, mac and cheese en gebak met een flinke dosis boter en suiker.',
    smaken: ['Gerookt en gegrild', 'Boter en kaas', 'Zoet en hartig gecombineerd', 'Ranch, ketchup en mosterd', 'Kaneel en bruine suiker'],
    ingredienten: ['Rundergehakt', 'Cheddar', 'Bacon', 'Maïs', 'Bruine suiker', 'Pecannoten', 'Hete saus'],
    voorraadkast: [
      { naam: 'Cheddar', waar: SUPER },
      { naam: 'Hete saus (cayenne-saus)', waar: SUPER },
      { naam: 'Bruine suiker', waar: SUPER },
      { naam: 'Hamburgerbroodjes', waar: 'Supermarkt of bakker' },
    ],
  },
  {
    id: 'mediterraan',
    emoji: '🫒',
    intro:
      'De Mediterrane keuken draait om olijfolie, tomaten, vis en verse groenten. Licht, kleurrijk en gemaakt om te delen op een zonnig terras.',
    smaken: ['Olijfolie en citroen', 'Rijpe tomaat en oregano', 'Knoflook', 'Feta en olijven', 'Saffraan en paprika'],
    ingredienten: ['Olijfolie', 'Tomaten', 'Feta', 'Olijven', 'Paprikapoeder', 'Saffraan', 'Verse vis'],
    voorraadkast: [
      { naam: 'Olijfolie en olijven', waar: SUPER },
      { naam: 'Gerookt paprikapoeder (pimentón)', waar: SUPER },
      { naam: 'Saffraan', waar: 'Supermarkt of delicatessenwinkel' },
      { naam: 'Feta', waar: SUPER },
    ],
  },
  {
    id: 'aziatisch',
    emoji: '🍜',
    intro:
      'Meer Azië dan alleen Thailand, China en Japan: ook India, Indonesië en Vietnam. Hier vind je recepten uit die keukens, vol kruiden, rijst en noedels.',
    smaken: ['Kerrie, gember en kurkuma', 'Ketjap manis en sambal', 'Verse kruiden', 'Kokos en limoen', 'Rijst en noedels'],
    ingredienten: ['Basmatirijst', 'Garam masala', 'Ketjap manis', 'Sambal', 'Rijstpapier', 'Kokosmelk', 'Verse gember'],
    voorraadkast: [
      { naam: 'Garam masala en kurkuma', waar: SUPER },
      { naam: 'Ketjap manis en sambal', waar: SUPER },
      { naam: 'Rijstpapier en rijstnoedels', waar: AZIA },
      { naam: 'Kokosmelk (blik)', waar: SUPER },
    ],
  },
]

export const getCuisineInfo = (id: string) => CUISINE_INFO.find((c) => c.id === id)
