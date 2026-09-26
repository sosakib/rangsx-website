# BRIEF: RangsX homepage opening

Interviewed in chat (22-23 Sep 2026). User answers are quoted; everything marked **Authored** is my decision
inside the direction the user chose (HOMEPAGE-PLAN.md, direction A).

1. **Vibe**: the concept image: night city, big confident headline, red accent. **Authored**: calm, proud, local,
   premium. References: the user's concept screen; the site's own dark showroom stage.
2. **Journey (user)**: "after seeing this text, I will scroll down, and after a good slide-in animation, the current
   homepage visuals will come up, and I can see and interact with the products."
3. **Energy curve (Authored)**: calm read → building split → immersive descent → loud arrival → calm control.
4. **Feeling (Authored, from the plan the user approved)**: pride, anticipation, immersion, arrival, control.
   The one moment: the van and the scooter braking into place either side of the red line.
5. **Only-here move (user chose A)**: the red bar under the headline becomes the beam that divides the two lanes.
6. **Range**: premium-minimal, matching the other 23 pages ("more sophisticated, minimal, and attractive").
7. **World**: distinct scenes (city, then showroom), joined by one continuous element (the red line). Not a worldflight.
8. **Assets (user)**: "Use the photo I have provided" (night aerial of a Dhaka intersection from a rooftop, 1672×941).
   Existing: showroom backdrop, EM-26 and ES3 cut-outs.

Other user constraints: "giving an overlay in front of the photo" so the text sits with it; "Keep the menu just
like the beta"; "The scroll length should be very optimized so that the user doesn't have to spend a very long time
scrolling."

## Feeling curve
| Act | Feeling | Cause on screen |
|---|---|---|
| Opening (hold) | Pride, "this is ours" | Our own city at night, one headline, rooftop ledge in the foreground |
| Split | Anticipation | Headline lines part, the red bar swings upright and stretches into a beam |
| Descent | Immersion | The camera dives toward the intersection; the ledge falls away; the showroom rises in |
| **Arrival (peak)** | Arrival, "whoa" | EM-26 in from the left, ES3 from the right, both brake either side of the beam; the floor flashes |
| Chooser | Control | Copy settles; the page answers the pointer; pick a lane |

**Peak**: "The van and the scooter slide in and stop either side of the red line." Lives in Arrival, which gets the
largest share of the scroll (about 35%).

**Tell-someone**: "It's the site where the red line splits Dhaka into two lanes, and the van and the scooter slide in
on either side."

**Authored silence**: the first ~6% of the scroll is a deliberate hold so the headline can be read. Not dead scroll.

## Structure
Grammar: a two-scene pinned hand-off (one act, not a long page); the homepage stays short by the user's own request.
Total pinned travel: about 1.3 screens on desktop and 1.05 on phones, then today's interactive chooser.

## Revision, 26 Sep 2026: the intro film
User: "update the homepage scroll effect with this video. Initially, the first frame, and at the end, the last frame
will be the end frame ... calculate everything and make it a smooth scroll effect."
Asset: `_research/hero/intro-video.mp4` (10 s, 1280x720, 24 fps): red light trails warp toward a city, slow to a
horizon, a beam ignites at the centre, a floor line and two chevrons light up, then it holds.

Scroll is mapped to measured events in the film, not to clock time (the static last 2 s are compressed):
| Scroll p | Film | On screen | Our layers |
|---|---|---|---|
| .00-.05 | 0.0 s | first frame, hold | headline reads |
| .05-.34 | 0-2.7 s | warp | headline parts with the trails, scrim lifts |
| .34-.52 | 2.7-4.9 s | slow-down to the horizon | red bar flies to the ignition point, stands upright |
| .52-.60 | 4.9-5.6 s | beam ignites (x 50%, y 69%) | bar hands over to the film's beam |
| .60-.70 | 5.6-6.8 s | floor line | chooser fades in, van sets off |
| .70-.84 | 6.8-7.7 s | chevrons light (peak) | van and scooter land, floor flash |
| .84-1 | 7.7-10 s | settles on the last frame | chooser copy, goes live at .9 |
Film is a 98-frame WebP sequence on a canvas (every 2nd frame to 8 s, plus the last), adjacent frames blended by the
fraction; phones get a centre crop. Travel 1.4 screens desktop, 1.2 phone. Previous photo build: tag `v2-photo-intro`.
