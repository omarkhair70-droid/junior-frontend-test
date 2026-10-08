# INSIDE / LIGHT PROBE — Research Note 003

## Original question

Could we repurpose only a phone’s front-facing camera and screen into a novel measurement instrument, rather than treating the camera as an ordinary image/video recorder?

**Current scope:** active visible-light reflectance imaging. This is not a thought reader, brain scanner, retinal imager, medical device, or a claimed novel physical phenomenon.

## Background that actually supports the experiment

1. Holz & Ofek (IEEE EMBC 2018) use a smartphone screen as a selective RGB illuminant and its camera as an optical detector for pulse oximetry. The task, tissue, illumination and clinical claims differ from ours. https://www.microsoft.com/en-us/research/publication/doubling-the-signal-quality-of-smartphone-camera-pulse-oximetry-using-the-display-screen-as-a-controllable-selective-light-source/
2. Iqbal et al. (2010), *Spectral Fingerprinting on a Standard Mobile Phone*, explore a screen + front-camera optical measurement system for chemical samples; they highlight ambient light and alignment. This does **not** establish that thought content can be derived from an eye. https://onlinelibrary.wiley.com/doi/10.1155/2010/381796
3. Research on accurate visible-light pupillometry may require an optical filter, specific illumination, and validation. We do **not** implement that technique and do not claim precise pupil measurement. https://www.nature.com/articles/s41598-023-40796-0
4. Browser camera capture requires the user to grant access and an HTTPS secure context. Capabilities may differ across hardware. https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
5. Smartphone camera automatic white balance and exposure are major confounders when modulating screen illumination. https://www.tdcommons.org/dpubs_series/6137/

## Implementation V0.3

- The user grants camera permission and manually selects one eye on a mirrored live view; a same-size patch 0.25 normalized image heights lower provides an approximate cheek control. **This is manual patch selection, not face tracking.**
- The screen changes smoothly between warm (#d6b293) and cool (#accbd7) light. Eight capture phases are in this order:
  W C W C | C W C W.
- The first ~1100 ms of each phase are used for settling after the transition; video samples are collected for ~1400 ms per phase. Timing is approximate and dependent on browser/frame scheduling.
- Video frames are processed in an in-browser canvas at 192 × 144 pixels. Each patch is 44 × 30 pixels. For each phase, RGB values are averaged; raw frames are not exported or sent to a server.
- For each pixel, define chromaticity fractions r=R/max(0.04,R+G+B), b=B/max(0.04,R+G+B). Compute difference between warm and cool phase averages. Subtract the **mean** corresponding difference across the cheek patch from each eye-patch pixel.
- A diverging false-color map visualizes the signed **red-fraction** difference in the eye (warm minus cool, cheek-corrected). **The heat-map is displayed using adaptive contrast; color magnitude in the UI is not a calibrated spectrum.**
- Show a raw magnified eye patch, two uncalibrated optical difference magnitudes, and spatial correlation of the first four phases against the last four.
- Download a JSON of the phase counts, signed map and measurement summaries. The download contains no raw photos.

## Key limitations

- Automatic exposure / white balance, screen brightness/ambient light, pixel noise, eye motion and facial motion are uncontrolled. A bright map could be almost entirely due to those sources.
- A phone's RGB camera is not a spectrometer; it cannot see optical wavelengths outside its physical filter/sensor range, and software cannot reconstruct arbitrary invisible channels.
- The metric is a **visible-light optical response**, not a proxy for specific internal speech content.
- Pixel maps are not spatially registered between phases. If the eye shifts, boundaries can appear as strong false differences. Until that is addressed, don't infer biological causes from the map.
- “Spatial repeatability” across halves does not prove an eye-specific, neural, or thought-specific effect. Even a printed photo or a cheek can produce a repeated optical response under changing illumination.
- The V0.3 experiment contains **no word training or thought classification** deliberately.

## Next research gate

To claim a genuinely useful physical measurement, rather than just camera post-processing, replicate with stationary reference samples and measure:
(a) warm/cool signal vs ambient drift;
(b) between-scan repeatability under identical conditions;
(c) motion and automatic camera compensation;
(d) whether eye-specific geometry adds information beyond cheek or a paper target.

Only once basic physical sensing is reproducible should any future study ask whether that signal has an independent connection to silent internal speech. That connection is currently **unestablished**.

## Ethical / comfort notes

Screen illumination transitions slowly; no strobe or flashlight is used. Stop if uncomfortable. All image analysis is local browser JavaScript and requires explicit camera permission.
