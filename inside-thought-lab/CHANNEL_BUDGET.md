# INSIDE / PHYSICAL CHANNEL BUDGET — Evidence Review 02

**Date:** 2026-10-08  
**Research question:** Is there an identifiable, repeatable path from the *content* of completely inner speech to a measurable physical signal near the ear, eye, or phone?

**Executive determination:** No verified path that turns arbitrary inner speech into a signal readable by a stock smartphone or normal over-ear headphones was found. This report distinguishes (1) demonstrated neural code, (2) demonstrated top-down peripheral physiology, and (3) the missing content-specific link. A signal showing "eyes moved" or "auditory attention was engaged" does **not** pass as phoneme decoding.

## 1. Mechanistic map: where physical effects can emerge

### Ascending auditory pathway (sound received from outside)
Sound pressure -> ear drum / ossicles -> cochlear hair cells -> auditory nerve -> cochlear nuclei -> superior olivary complex -> inferior colliculus -> thalamic medial geniculate -> auditory cortex.

### Descending influence (top-down control)
Auditory cortex and other auditory-control circuits -> brainstem auditory nuclei / superior olivary complex -> olivocochlear efferents.
- **Medial olivocochlear (MOC)** neurons terminate at outer hair cells; modulate gain of the cochlear amplifier. These cells can generate measurable otoacoustic emissions (OAE) in the ear canal.
- **Lateral olivocochlear (LOC)** neurons terminate on afferent auditory nerve dendrites beneath inner hair cells. Their consequences do not map simply to the same sound channel as MOC/OAE.
- Middle-ear muscles, including tensor tympani and stapedius, are an additional way the CNS can move the ossicular chain / eardrum, producing ear-canal pressure fluctuations.
- These are *control/feedback* systems. Their existence **does not imply** that a full spectrotemporal inner sentence is copied outward.

Anatomy reference: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879449/ ; https://www.mdpi.com/2077-0383/12/13/4553

## 2. The useful newly surfaced clue: eyes can induce sound-free eardrum motion

**Gruters et al., PNAS 2018:** Sensitive custom ear-canal microphones detected eye-movement-related eardrum oscillations (EMREOs) in 16 humans and 3 monkeys. The ear signal existed **without external sound**. In humans it sometimes started ~10 ms before saccade onset; timing, phase and amplitude depended on eye-movement direction and size. An occluded microphone and off-ear artifact control supported a physical ear-canal pressure signal.

Primary paper: https://pmc.ncbi.nlm.nih.gov/articles/PMC5819440/  
**Follow-up, 2025:** EMREOs still occurred when eye movements had no current visual input, supporting an oculomotor-to-ear mechanism, not optical leakage: https://pubmed.ncbi.nlm.nih.gov/40614487/

**Inference for INSIDE:** The *mechanistic concept* sought by the user is real: internally generated control signals can alter an outwardly measurable peripheral sound even when no external sound is present. **But the proven information is eye-motion timing/direction, not silently imagined words.** This is a *positive control for sensing pathways*, not a demonstration of thought recognition. Their microphone sat in the ear canal in a custom interface, which over-ear Soundcore headphones do not reproduce by default.

## 3. What attention-to-speech OAE findings actually show

**Steinebach & Reichenbach, Frontiers in Neuroscience, March 2026:** 40 recruited, 38 analyzed. Researchers delivered special stimuli derived from harmonics of *real* human speech and measured elicited ear-canal distortion-product OAEs while participants selectively attended to one of two externally played talkers or to a visual task. For one resolved-harmonic configuration, attending the target voice reduced emission amplitude by a ratio 0.8 (−2.2 dB), vs attending another voice. The findings are about **modulation of a known stimulus-evoked response**, not spontaneous generation of the imagined spoken words.

Full methods and results: https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2026.1756386/full

**Counterevidence:** 1996 six experiments (70 subjects) did not reproduce attentional OAE effects in predicted directions; a 2019 study across 45 listeners found no systematic effect on SFOAEs. Interpret apparent modulation conservatively.  
https://pubmed.ncbi.nlm.nih.gov/8880181/  
https://pmc.ncbi.nlm.nih.gov/articles/PMC6715442/

**Pre-stimulus activity:** 2022 direct measurements in 16 cochlear implant users distinguished attention to upcoming sounds versus a visual target in silence; this is a direct neural recording with implanted electronics, NOT an ambient microphone detecting mentally spoken words.
https://pmc.ncbi.nlm.nih.gov/articles/PMC8883868/

## 4. Channel budget — instrument, physical quantity, and bottleneck

| Candidate path | Signal if present | Where measured | Instrument needed in peer-reviewed work | What phone + Soundcore currently establish | Word-content evidence |
| --- | --- | --- | --- | --- | --- |
| Cortical neural speech representation | Electrical potential / neuronal firing | Brain | Implanted arrays, scalp or ear-region electrodes | Neither ordinary camera nor mic samples these signals directly | **Some supported by neural sensing**; not free-text on phone |
| Around-ear EEG | Tiny voltage changes, usually much smaller than environmental voltage noise | Skin around ear | Contact electrodes + EEG amplifier with suitable reference and noise control | Bluetooth audio mic does not convert to EEG | **Limited-vocabulary decoding supported with specialized electrodes** |
| MOC -> outer hair cells -> OAE | Acoustic pressure response; often stimulus-evoked | Within sealed ear canal | Calibrated low-noise ear-canal probe and stimulus control | Standard over-ear microphones are not OAE probes; no demonstrated raw inner-facing ANC channel via Android | **No validated imagined-word decoding** |
| Middle-ear movement / EMREO | Low-frequency ear-canal pressure oscillation | Ear canal | Sensitive ear-canal mic physically coupled close to eardrum | Over-ear headset could record other environmental sounds but not shown to sense EMREO through its exposed input | Eye-movement direction, **not** internal words |
| Subtle vocal apparatus movement | Surface EMG / vibration | Face, jaw, throat | EMG electrodes or specialized ultrasonic/acoustic arrangement | Built-in phone camera/mic may capture some motion, but not pure inner speech without movement | Limited silent articulatory commands, not word-free inner hearing |
| Eye visual response | RGB pupil/glint/skin reflectance | Face / eye | Camera, controlled illumination and calibration | Can measure visual changes (INSIDE V0.3) | No validated free inner-speech text |
| Bluetooth headset call microphone | Acoustic waveform through normal Bluetooth voice path | Mic in headphone shell | Android audio capture route | Usually accessible as generic voice input when connected, depending on routing | Audible voice yes; pure internal voice not established |

### Actual measured scale and noise

- A **stimulus-frequency OAE** normative dataset in young adults measured responses from **0.5–8 kHz** with **20–60 dB SPL probe stimuli**. Mean SFOAE peaks were around **6–7 dB SPL** at 1–1.5 kHz *in those conditions* and responses could be strongly variable; peaks often had SNR of 22–34 dB with calibrated collection. This is not a universal magnitude for "thought audio", and zero stimulation could be entirely different. Primary: https://pmc.ncbi.nlm.nih.gov/articles/PMC5770274/
- Experimental resolved-harmonic attentional effect of **−2.2 dB** in a stimulus-elicited emission from the March 2026 study is a **difference** between attention conditions, not an absolute acoustic output of an internally spoken word.
- EMREO signals were measured with a sensitive ear-canal microphone, custom-fitting and experimental noise controls. The PNAS work does not justify a specific signal-to-noise ratio on commercially available ANC headphones.
- Android distinguishes hardware routes such as built-in mic and Bluetooth SCO; \`UNPROCESSED\` capture is conditional (defaults to ordinary input if unsupported). A headset mic route does not imply Android exposes raw internal ANC capsules or a low-frequency ear-canal probe. Docs: https://developer.android.com/reference/android/media/AudioDeviceInfo and https://developer.android.com/reference/android/media/MediaRecorder.AudioSource

## 5. The actual unknown — does information survive each stage?

Let X = which sentence/phoneme the user imagines, Y = peripheral physiology (e.g., cochlear gain, ear drum), Z = data sampled by the phone/headset.

We need X -> Y to encode **content-specific information**, and Y -> Z to preserve enough of it. Even an ideal AI cannot identify X reliably if Z changes only with attention or movement and not with the identity of the internally imagined sentence.

For a future discovery to count, the decoder must succeed on **independently held-out trials and sessions**, outperform a control model using non-ear cues, generalize to new words, and withstand:
1. active phonation and subvocal EMG / throat movement controls;
2. eye-movement / blinking controls (since EMREOs exist);
3. respiratory and jaw controls (middle-ear muscles, swallowing and eustachian tube noise);
4. stimulus exposure / anticipation / visually displayed target controls;
5. microphone-placement, acoustic occlusion and electronics-artifact controls;
6. cross-session preregistration and independent replication.

**Not valid:** a single 24-trial phone-camera classifier, after-the-fact cherry-picked frequencies, rest-vs-think classification, or an AI language model hallucinating plausible sentences from context.

## 6. Research priority / decision gates (not a promise to build)

**Best-grounded route toward words:** around-ear EEG. A 2026 peer-reviewed paper trained on 72 hours of ear EEG from 24 healthy participants and one LIS participant and combined this with older EEG/EMG recordings for **282.4 total hours**; it reported **56.6% offline accuracy in a 64-word task for healthy users**, 47.3% for an LIS participant, with lower real-time top-1 results. Requires dedicated **electrodes and front-end** (not standard audio).  
https://pubmed.ncbi.nlm.nih.gov/41855656/

**Most scientifically provocative peripheral test:** whether *imagining a defined syllable* modulates either (i) the weak evoked cochlear emission spectrum, or (ii) spontaneous/middle-ear pressure at rest, in a way not explained by EMREO/EMG and consistent across sessions. **No published validation of inner phoneme decoding via these acoustic peripheral signals identified in this review.**

**No-purchase constraint verdict:** the user's current phone and over-ear headset can support software-only discovery of exposed camera/mic/audio routes and safe recordings of ordinary audible/peripheral mechanical effects. They cannot be assumed to access ear-contact voltages or calibrated ear-canal emissions. Avoid a fabricated end-to-end 'thought reader' or an unsafe high-output acoustic sensing experiment.

### Go/no-go decision

- **GO for literature and measurement physics**, especially independent verification of EMREO and the distinction between neural electrical potential and acoustic pressure.
- **CONDITIONAL GO for ordinary phone hardware diagnostics** only if needed to learn what physical routes the device actually exposes; explicitly not a word decoder.
- **NO-GO currently for claiming reliable sentence decoding using a consumer Soundcore headset.** The essential imagined-word -> ear-canal content-specific signal is not established, and even if it existed the hardware access problem remains.

## 7. Sources (original papers, not claims from promotional coverage)

1. Anatomy: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879449/
2. Eye-to-ear oscillations, 2018: https://pmc.ncbi.nlm.nih.gov/articles/PMC5819440/
3. EMREO follow-up 2025: https://pubmed.ncbi.nlm.nih.gov/40614487/
4. OAE selective-attention speech harmonics, 2026: https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2026.1756386/full
5. Direct cochlear implant nerve recordings, 2022: https://pmc.ncbi.nlm.nih.gov/articles/PMC8883868/
6. OAE normative stimuli, 2018: https://pmc.ncbi.nlm.nih.gov/articles/PMC5770274/
7. Null OAE attention study, 2019: https://pmc.ncbi.nlm.nih.gov/articles/PMC6715442/
8. Around-ear EEG silent speech 2026: https://pubmed.ncbi.nlm.nih.gov/41855656/
9. Android Audio Device API: https://developer.android.com/reference/android/media/AudioDeviceInfo

**Open question to carry to next research note:** Is there *any* direct experiment of pure auditory/verbal imagery where a microphone in the ear canal, or a calibrated OAE probe, detects phonetic content that was not delivered acoustically? If no, an accessible speech-content channel has not been shown.
