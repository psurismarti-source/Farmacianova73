# Farmàcia Nova 73 · farmanova73.cat
## Web completa — Guia de posada en marxa

---

## 📁 Estructura de fitxers

```
farmanova73/
├── index.html          ← Pàgina principal (Home)
├── sobre.html          ← Sobre el 73 / Equip
├── serveis.html        ← Serveis (pendent de crear, estructura definida)
├── b2b.html            ← Empreses i Gimnàs
├── blog.html           ← Blog + Article inicial "Cafè o Vitalitat"
├── contacte.html       ← Formulari reserva + info contacte
├── privacitat.html     ← Política de Privacitat RGPD completa
├── styles.css          ← Tots els estils (mobile-first, CSS variables)
├── main.js             ← JavaScript: nav, formularis, cookies, animacions
└── README.md           ← Aquest fitxer
```

---

## 🚀 Posada en marxa

### 1. Configuració bàsica (OBLIGATORI)
Busca i substitueix `XXXXXXXXX` per el número de telèfon real en tots els fitxers.
Busca i substitueix `[A completar]` per les dades reals (NIF, etc.) a `privacitat.html`.

### 2. Formularis (OBLIGATORI per al funcionament)
Els formularis estan llestos però necessiten un servei d'enviament d'emails.

**Opció A: Formspree (recomanat, gratis fins 50 missatges/mes)**
1. Ves a https://formspree.io i crea un compte
2. Crea un formulari per a cada tipus (reserva, lead magnet, B2B)
3. A `main.js`, substitueix els comentaris `// === PLACEHOLDER: Substituir per Formspree ===`
   per el codi real:
   ```javascript
   const res = await fetch('https://formspree.io/f/TU_ID_AQUI', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
     body: JSON.stringify(Object.fromEntries(new FormData(form)))
   });
   if (!res.ok) throw new Error('Error');
   ```

**Opció B: EmailJS (també gratuït)**
1. https://www.emailjs.com
2. Segueix la guia d'integració del seu dashboard

### 3. reCAPTCHA v3 (recomanat per reduir spam)
1. Ves a https://www.google.com/recaptcha/admin
2. Registra el domini farmanova73.cat
3. Afegeix a cada formulari HTML:
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=LA_TEVA_SITE_KEY"></script>
   ```
4. Obtén el token al submit i envia'l al servidor per verificació

### 4. Google Analytics (opcional)
Afegeix a l'`<head>` de cada pàgina:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXX');
</script>
```
⚠️ Actualitza la taula de cookies a `privacitat.html` amb l'ID real.

### 5. Google Reviews
Per integrar ressenyes reals, tens dues opcions:
- **Widget de tercers**: Elfsight, Trustindex (de pagament)
- **Google Places API**: Gratuït fins a cert ús, requereix backend
- **Actualització manual**: Simplement edita el HTML de `#ressenyes-grid` amb les ressenyes reals

### 6. Vídeo del Hero
Substitueix el placeholder a `index.html`:
```html
<source src="assets/hero-video.mp4" type="video/mp4">
```
Per un vídeo real de La Garriga (slow-motion, gent corrent, mercat, paisatge).
Mida recomanada: 1920x1080px, 10-30s, compressió H.264, màx 10MB.

### 7. Mapa de Google
A `index.html`, substitueix el `<div class="map-placeholder">` per:
```html
<iframe 
  src="https://www.google.com/maps/embed?pb=EL_TEU_EMBED_CODE"
  width="100%" height="350" 
  style="border:0;border-radius:var(--radius-lg);" 
  allowfullscreen="" loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade"
  title="Farmàcia Nova 73 La Garriga">
</iframe>
```

### 8. Fotos de l'equip
Afegeix les fotos a `/assets/` i actualitza `sobre.html`.

---

## 🎨 Personalització de disseny

Les variables CSS estan a l'inici de `styles.css`:
```css
:root {
  --color-primary:    #1a6b3c;   /* Verd forest */
  --color-accent:     #e8a020;   /* Ambre */
  /* ... */
}
```
Canvia els colors aquí per adaptar la marca.

---

## 📱 SEO Local — Checklist

- [ ] Verificar Google Business Profile per "Farmàcia Nova 73 La Garriga"
- [ ] Afegir totes les fotos reals a Google Business
- [ ] Completar schema.org a `index.html` (telèfon, NIF)
- [ ] Crear `sitemap.xml` (format URL de totes les pàgines)
- [ ] Crear `robots.txt`
- [ ] Verificar a Google Search Console
- [ ] Alta a directoris locals (Pàgines Grogues, Top Farmacies, etc.)

---

## 🔒 RGPD — Checklist

- [ ] Completar NIF del titular a `privacitat.html`
- [ ] Afegir nom i dades del DPO si aplica
- [ ] Registre d'activitats de tractament (intern, no web)
- [ ] Contractes amb encarregats del tractament (Formspree/EmailJS)
- [ ] Verificar que reCAPTCHA compleix RGPD (o usar alternativa privada)
- [ ] Si s'usa Google Analytics: implementar anonimització d'IP

---

## 📞 Suport

Web creada per a Farmàcia Nova 73 · farmanova73.cat
Qualsevol dubte tècnic: substituir aquest apartat amb contacte del desenvolupador.
