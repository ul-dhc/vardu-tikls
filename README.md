# Vārdu tīkls

Latviešu valodas vārdu veidošanas spēle ResearchGames.eu vizuālajā stilā. Spēlētājs kombinē pieejamos klucīšus, pārbauda vārdus lokālajā Tēzaura datu indeksā, pilda misijas un audzē dinamisku vārdu karti.

## Lokāla palaišana

Spēle ir pilnībā statiska; tai nav nepieciešams būvēšanas solis. Definīciju ielādei lapa jāatver caur lokālu HTTP serveri, nevis `file://` adresi.

```bash
python -m http.server 8765
```

Pēc tam atveriet `http://127.0.0.1:8765/`.

## Publicēšana ar GitHub Pages

1. Ievietojiet šīs mapes saturu GitHub repozitorijā.
2. Repozitorija sadaļā **Settings → Pages → Build and deployment** izvēlieties **GitHub Actions**.
3. Ievietojiet izmaiņas `main` zarā. Darbplūsma `.github/workflows/deploy-pages.yml` sagatavos tikai spēlei vajadzīgos failus un publicēs tos.

Visas pārlūka resursu adreses ir relatīvas, tādēļ spēle darbojas gan domēna saknē, gan GitHub Pages projekta apakšceļā, piemēram, `https://lietotajs.github.io/vardu-tikls/`.

## Publiskās vietnes saturs

- `index.html`, `styles.css`, `tree.css`, `script.js` — spēles saskarne un loģika;
- `tezaurs-words.js`, `tezaurs-index.js`, `tezaurs-dialects.js` — lokālie vārdu indeksi;
- `definitions/` — definīciju fragmenti, kas tiek ielādēti pēc vajadzības;
- `assets/brand/` — ResearchGames.eu zīmola resursi;
- `.nojekyll` — neļauj GitHub Pages izlaist statiskos resursus.

Python indeksu veidošanas skripti un pārējais izstrādes karkass nav vajadzīgs publicētajai lapai; GitHub Actions darbplūsma tos neiekļauj.

## Datu un dizaina avoti

Vārdu un definīciju pārbaude balstās lokāli sagatavotā Tēzaura datu indeksā. Dizaina valoda un zīmola grafika pielāgota no pievienotā `researchgames.eu` projekta. Pirms publiskas izplatīšanas pārliecinieties, ka repozitorijā ir norādītas jūsu datu kopai un zīmola resursiem atbilstošās licences.
