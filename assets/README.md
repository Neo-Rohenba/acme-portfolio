# assets/ — drop media here

Every media slot in the page is a **self-upgrading placeholder**. It renders as a
styled green panel with a `[Photo: …]` label until the matching file exists in
this folder — then `js/main.js` detects it and swaps the real file in. You never
edit markup to add a photo; you just drop the file in with the exact filename
below and reload.

## Media in place

| File | Where it appears |
|---|---|
| `Acme-Web-Logo_1.png.webp` | **Header** and **footer** — shown whole, uncropped |
| `home-about.webp` | Landing hero, inside the notch-clipped panel |

These two are referenced by their real filenames in `index.html`. If you rename
them, update the three `src` attributes (two logo, one hero).

If you prefer WebP/AVIF (smaller, recommended), save as e.g. `care-ivf.webp` and
update the one `data-img` value in `index.html` to match.

## Envato shortlist

Searched on Envato Elements and picked for this palette — warm, naturally lit,
clinical but human. The connector can find assets but **cannot download them**;
open each link, download, rename to the filename in the table above.

**A higher-resolution hero** — if you replace `home-about.webp`, or want a
moving hero instead. Pick a frame with the subject left-of-centre:

- [Close-up of mother holding her newborn in the ward](https://elements.envato.com/close-up-of-caucasian-mother-holding-her-newborn-b-7XST7AZ) — Wavebreakmedia, 4K
- [Mother embraces her newborn in a hospital bed](https://elements.envato.com/a-mother-embraces-her-newborn-baby-in-a-hospital-b-K6HRDEP) — ProStockMediaHD, 4K
- [Mother comforts her newborn at night](https://elements.envato.com/in-the-hospital-crib-a-mother-provides-comfort-to--7H86784) — ProStockMediaHD, 4K

**`care-ivf.jpg` / `facility-ivf.jpg`**

- [Embryologist performing egg fertilisation](https://elements.envato.com/embryologist-behind-the-procedure-of-fertilization-VGBA53S) — svitlanah
- [Embryologist under microscope](https://elements.envato.com/embryologist-assistant-under-microscope-carries-ou-TK6JUYQ) — svitlanah
- [Microscope and optical equipment, insemination clinic](https://elements.envato.com/microscope-and-optical-equipment-in-the-laboratory-W5VJ63L) — Simol1407

**`care-maternity.jpg` / consultation imagery**

- [Pregnant woman in consultation with gynaecologist](https://elements.envato.com/young-pregnant-woman-having-consultation-with-doct-RR7B7SB) — LightFieldStudios
- [Doctor showing ultrasound scan to pregnant woman](https://elements.envato.com/smiling-doctor-showing-ultrasound-scan-to-young-pr-5YGANHF) — LightFieldStudios
- [Doctor explains ultrasound results](https://elements.envato.com/female-doctor-talks-about-results-of-ultrasound-fo-NXDJC45) — mstandret

A caveat worth weighing: these models all read as European. For a centre in
Imphal, stock that doesn't look like your patients can undercut trust more than
having no photo at all. Prefer in-house photography for anything showing
patients or staff, and keep stock for equipment and interiors — the IVF lab and
microscope shots above carry no such problem.

## Where else to source these

1. **The existing site** — <https://acmefertilitycentre.com/>. Photos there are
   lazy-loaded behind base64 SVG placeholders, so right-click → *Save image as* on
   the live page (after it loads) rather than scraping the HTML.
2. **Envato Elements** — for anything the hospital doesn't have yet. Searches that
   fit this design: "IVF laboratory embryologist", "obstetrician consultation
   patient", "modern operating theatre", "neonatal care nurse", "pregnant woman
   ultrasound clinic", "cryogenic storage tank laboratory". Prefer warm, naturally
   lit, clinical-but-human frames — the palette here is deep green + burnt orange,
   so avoid cold blue-grey stock.
3. **Shoot in-house** for the doctor portraits and the facility shots. Stock
   portraits of "doctors" next to the real doctors' names read as inauthentic and
   will undercut the Manyata-certification trust signal.

## The logo — how it is used

`Acme-Web-Logo_1.png.webp` is the full stacked lockup (1016×461): wordmark,
Meetei Mayek, *Fertility & HealthCare Centre*, *Enhancing Life*.

Both the header and the footer show it **whole, uncropped** — sized by height
with `width:auto`, so nothing is cut off:

- **Header** — 42–62px tall; the pill grows to fit it
- **Footer** — 58–88px tall

At header size the two tagline lines land around 8px. They are legible but
small; that is the trade for showing the complete lockup in a bar. A
**wordmark-only or horizontal variant** would let the header run the logo
larger without the pill getting tall — worth asking your designer for if you
have it.

The placeholder heart mark and text wordmark have been removed from the markup,
so `.brand__img` is `display:block` rather than waiting on JS. If the file goes
missing the header shows nothing, not a fallback.

## The hero image

`header.webp` (2000×1334) is the centre's exterior at night. It suits the
palette almost perfectly — the green neon signage *is* the brand green — which
is why the hero panel carries no colour wash over it, only a light scrim.

It replaced the earlier `home-about.webp` (826×576), which was being upscaled
~1.45× and looked soft. That file is still in the folder but no longer
referenced; delete it once you are happy with the new one.

The source is landscape in a portrait-ish panel, so `object-fit:cover` crops
about 19% horizontally. The crop is anchored `right` to keep the lit "acme"
signage — which sits at the right of the frame — fully in view; the left edge
of the building is what gets trimmed.

## Specs

- Photos: **1600px on the long edge**, JPEG quality ~80, or WebP. Keep each under
  ~300 KB.
- Portraits: shoot/crop **4:5 portrait**; the lead card slot is tall (`min-height:270px`).
- Video: **H.264 MP4**, 1920×1080, under ~8 MB, no audio needed for the hero (it is
  muted and looping). `dr-james-qa.mp4` does get native controls, so audio is fine there.
- Get **written consent** before publishing any patient's face, name or story.

## Copy still to fill in

Search `index.html` for `class="todo"` — those are the bracketed placeholders
carried over from the mockup:

- The four `[Year]` milestones in **Our story**
- The reporting period for the statistics (e.g. "as of 2026")
- Dr. James's pull-quote and the three opinion excerpts
- OPD timings in the **Contact** card
- Real social links in the footer


## Photographs — supplied by the client

Thirteen full-resolution photographs came from the client's Drive folder
("portfolio mock-up"). The originals are 7952×5304 camera JPEGs, 8–29 MB each
(~218 MB total). They were resized and re-encoded to WebP for the web:

- Landscape: 1600px wide, WebP q80 (hero: 2000px)
- Portraits: 1400px tall, WebP q80
- Result: **under 1 MB for the whole set**

Keep the originals safe — re-encode from those, never from these.

| File | Client's name | Used for |
|---|---|---|
| `header.webp` | header | Landing hero + portfolio feature image |
| `dr-james.webp` | dr james | Doctors card, People, avatar, foreword |
| `dr-james-speaking.webp` | dr james speaking | Dr. James Speaks + AcmeImpact |
| `dr-mrinalini.webp` | dr mrinalini | Doctors, People, avatar |
| `dr-monika.webp` | dr monika | Doctors, People, avatar |
| `care-surgery.webp` | keyhole gynae surgery | Care card + AcmeCare |
| `care-maternity.webp` | maternity ward | Care card |
| `facility-ivf.webp` | ivf and infertility complex | Care card + Facilities |
| `facility-cryobank.webp` | cryobank | Facilities |
| `facility-ot.webp` | operation theatre 1 | Facilities + AcmeCare |
| `facility-icu.webp` | icu | Facilities |
| `sterilisation.webp` | ivf lab | AcmeCare (infection control) |
| `manyata-certificate.webp` | Manyata-Certificate_1 | AcmeCare |

Portrait crops are biased to `center 18%` — the subjects' faces sit in the
upper third of the 2:3 frames, so a centred crop takes their heads off.

### One caption correction

The file the client named **"ivf lab"** does not show an embryology lab — it
shows a staff member operating an **autoclave / steriliser**. Captioning that
as an IVF lab would be visibly wrong to any clinician, so it was renamed
`sterilisation.webp` and moved to the infection-control slot, where it fits.
The IVF cards use `facility-ivf.webp` instead (the procedure room with the
ultrasound unit).

If a genuine embryology-lab photograph exists, it belongs in the AcmeFocus
feature — that article currently describes a laboratory the imagery does not
show.

### Still missing

No photograph of an outreach camp, a CME seminar or a nursing workshop was
supplied, and there is no video. Those slots reuse a related photo or keep
their placeholder. The two video slots (`dr-james-qa.mp4`,
`patient-story.mp4`) are still empty and 404 in the console by design.

## The cut-out (index4.html)

`dr-james.webp` is now a **background-removed cut-out** with a real alpha
channel (`pix_fmt yuva420p`). The original framed photograph is kept as
`dr-james-old.webp`.

That changes how `.hero__fig` in `css/bold.css` is sized:

- `background-size: contain`, not `cover` — cover cropped him
- `background-position: center bottom` — he stands on the hero baseline at
  any viewport height
- `background-color: transparent` — the ground shows through the alpha, so
  the giant ACME letters are interrupted by his silhouette rather than by a
  rectangle
- the box stretches the full hero height, putting his head just under the nav

**If you ever swap back to a framed photograph**, restore `cover`, give the
box an `aspect-ratio` and a background colour, or it will float oddly.

The doctor-strip thumbnails still use `cover`, which is right: Dr. Mrinalini
and Dr. Monika are ordinary photographs, not cut-outs.
