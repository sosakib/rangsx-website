# Homepage scroll intro: plan

Status: **plan only, nothing built yet.** Decisions needed are at the bottom.

## Your brief (your words)
> "I want this type of text on the homepage. After scrolling down, we can see there are two types of products in our
> brand, just like it is right now. I want a scrolling effect where, after seeing this text, I will scroll down, and
> after a good slide-in animation, the current homepage visuals will come up, and I can see and interact with the
> products. It should look visually very good and appealing. The effect has to be very smooth and relevant."

Concept image: night aerial of a city, big headline "Electric mobility, built for Bangladesh.", one supporting line,
two outline buttons, a short red bar under everything.

---

## The idea: "The red line"

The short red bar under the headline is the thread that ties both screens together. As you scroll, it stretches and
turns vertical, and becomes the red light beam that already splits the current homepage in two: four wheels on the
left, two wheels on the right. The headline parts around it, the city drops away beneath you, and the van and the
scooter slide in on either side of the line.

It is relevant, not decoration: **one brand, two lanes**, and the line is literally the road dividing them.

> The sentence a visitor would tell a friend: *"The red line splits Dhaka into two lanes, and the van and the scooter
> slide in on either side."*

---

## Frame by frame (desktop)

The section is pinned for about **2.5 screens** of scrolling. Everything is tied to scroll position, so it plays
backwards exactly when you scroll up, and it never runs on its own.

| Scroll | What you see | Feeling |
|---|---|---|
| **0%** | The concept screen. Night Dhaka seen from above, built from separate layers (sky, far skyline, mid city, foreground rooftops, haze). Headline, one line of copy, two buttons, the short red bar. City lights twinkle slowly; moving the mouse shifts the layers slightly for real depth. | Calm pride: "this is ours" |
| **0-15%** | A deliberate hold so the headline can be read. Only a slow camera push into the city. | |
| **15-40%** | The supporting line and buttons sink and fade. The headline splits: "Electric mobility," glides left, "built for Bangladesh." glides right, both fading. The red bar stretches up and down to full height and becomes a vertical beam. | Anticipation |
| **35-70%** | The camera descends. The aerial city scales up and darkens; the showroom floor from the current homepage (red neon chevrons, wet floor, skyline) rises in behind, with its horizon lined up to the aerial skyline. | Immersion |
| **55-85%** | **The peak.** The EM-26 slides in from the left, the ES3 from the right. They decelerate like real vehicles braking and stop either side of the beam. Their reflections fade in on the wet floor, and a light sweep flashes across the floor the moment they land. | Arrival, the "wow" |
| **85-100%** | "Four-Wheeler EVs" and "Two-Wheeler EVs" slide in from the edges with their buttons, then the Drive Next badge. The pin releases. | |
| **After** | Exactly today's homepage, fully interactive: hover a side and the other dims, pointer parallax, click through. | Control: pick your lane |

### Layers (so it has real depth, not one flat photo)
1. Sky and far skyline (moves slowest)
2. Mid city with lit windows
3. **Headline (real HTML text)**, sitting between the city and the foreground
4. Foreground rooftop silhouettes in the lower corners (moves fastest; never covers the headline)
5. Haze band and faint traffic light trails (atmosphere, in front)

Then the showroom stage that already exists: floor and neon backdrop, EM-26, ES3, their reflections, the light sweep.

### Phone version (designed separately, not shrunk)
On a phone the split turns 90 degrees: the red bar stays **horizontal** and becomes the divider between the van
(top half) and the scooter (bottom half). Headline lines part up and down instead of left and right. Portrait crop of
the city photo, about 2 screens of scroll. Same story, built for a tall screen.

---

## How it stays smooth
- **Native scrolling, no scroll-hijacking.** The page scrolls normally; one smoothed (eased) progress value drives
  every layer, so fast flicks and trackpads both feel fluid.
- **Only cheap-to-animate properties:** position, scale, opacity. No blur on the big photos while scrolling (that is
  what makes scroll effects stutter). Six moving layers at most.
- **Everything preloaded** before the sequence switches on, so nothing pops in half-drawn. A complete still image shows
  until then.
- **Reversible and interruptible:** stop mid-scroll and it holds that frame; scroll up and it rewinds.
- **Reduced motion** (accessibility setting): no pinning. The headline screen, then the product chooser below it, with
  a simple fade.
- The two hero buttons still go straight to Electric Bikes and the Electric Fleet, so nobody is forced through the
  intro.

## Copy (house style: no dashes)
- **Headline:** Electric mobility, built for Bangladesh.
- **Line:** RangsX brings electric two-wheelers and commercial EVs to Bangladeshi roads. Designed for real conditions,
  backed by Rangs Group.
- **Buttons:** Explore Electric Bikes (red outline, to /electric-bikes) · Commercial EV Fleet (to /dongfeng)
- The chooser copy stays exactly as it is today.
- The headline becomes the page's main heading (for Google); today's small "Choose your electric future" label goes.
- Type: the headline and buttons use the site's existing fonts, not the monospace buttons in the concept, so it
  matches the other 23 pages.

---

## Other directions, if you want to compare

| | A. The red line *(recommended)* | B. The descent | C. The curtain |
|---|---|---|---|
| What happens | Bar becomes the dividing beam, headline parts, city drops away, vehicles slide in either side | Camera flies straight through the headline, down the beam and into the showroom | The headline screen slides up and away like a shutter, revealing the chooser underneath as the vehicles slide in |
| Wow | High | Highest | Medium |
| Meaning | Strong: two lanes, one line | Weak: spectacle only | Weak |
| Smoothness risk | Low | Medium (huge zoom on photos softens them; may need a video clip) | Very low |
| Effort | Medium | High | Low |

---

## What I need to build it
- **One night photo of Dhaka from above** (wide, plus a portrait crop for phones), cut into the layers above. Options:
  1. **Your own or a commissioned drone shot** (best: authentic, recognisable; for example Hatirjheel or the Gulshan
     skyline at night). I cut it into layers.
  2. **Generated photoreal image** through the scroll-craft asset pipeline (needs a kie.ai API key; a few cents per image).
  3. **Licensed stock photo.** The photo in your concept can't be used unless we know where it came from and hold the licence.
- Everything else already exists: the showroom backdrop, EM-26 and ES3 cut-outs.

## Decisions needed from you
1. **Direction:** A (recommended), B or C?
2. **City photo:** your own drone shot, generated, or stock?
3. **Navigation:** the concept shows a different menu (Electric Bikes, Commercial EVs, Shop, Dealers, About, Contact,
   hotline far left). Keep today's menu (matches the beta), or switch to the concept's across the whole site?
4. **Light mode:** the intro is a night scene. I recommend the homepage stays dark in both themes, as it does now. OK?
5. **Scroll length:** about 2.5 screens before the chooser is fully in place. Longer feels more cinematic, shorter gets
   to the products faster.

## After you decide
1. Prepare the city layers (clean plates, cut-outs, phone crop) and check every edge.
2. Build the pinned section into `site/pages/home.mjs` with real HTML text; motion code in `site.js`, styles in `site.css`.
3. Phone version and reduced-motion version.
4. Check with the scroll-craft test tool: screenshots at every scroll position on desktop, phone and reduced motion,
   plus a real-phone check by you (a desktop browser can't reproduce an iPhone exactly).

Optional before any photo work: a **rough motion prototype** using the current showroom art as a stand-in city, so you
can feel the scroll timing in the browser before we commit to assets.
