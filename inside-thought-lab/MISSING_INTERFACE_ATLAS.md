# INSIDE / THE MISSING INTERFACE — Research Atlas 04
**Date:** 2026-10-08 · **Track:** Physics-first research · **Status:** Hypothesis map, NOT a thought-decoder

## Original goal — not silent mouth movement

**User's exact objective:** freely think/“hear” an arbitrary sentence *inside the mind*, no audible output, no deliberately moving the jaw, tongue, lips or hands, and have a normal smartphone receive and transcribe it. Phone and commercially available Soundcore over-ear headphones are the constraint. User welcomes speculative, cross-disciplinary physical mechanisms—but does not want repeated meaningless binary classifiers.

**Three distinct targets** that must not be conflated:
1. Audible speech: conventional acoustic information external to the body.
2. Silent articulation: motor commands or micro-movements accompanying unvoiced speech, which multiple wearable systems sense.
3. Pure inner hearing / imagined speech: a conscious phonological representation with no necessary articulator movement. This is the **real target**, and published success with (2) does not imply (3).

## 1. First-principles: find the information channel

Let X = inner-speech content (what exact words), Y = physically coupled peripheral changes (skin, eye, ear, electrical/magnetic/acoustic), and Z = actual samples accessible to a software application. Need **X → Y → Z**.

The data-processing principle says software cannot reliably reconstruct distinctions that never reach Z. A sensor may detect that you are *thinking*, *attending*, *breathing*, or *moving* without distinguishing which sentence you imagined.

**Every purported channel gets six questions:**
1. Source: what anatomical/electromagnetic process responds to inner word identity?
2. Carrier: photons, acoustic pressure, mechanical motion, electrostatic potential, magnetic field, radio reflection, thermal changes?
3. Coupling: how does that carrier travel from inside the body to the sensing surface?
4. Detector: which *specific physical element* measures it?
5. Access: can Android/browser expose the required RAW channel, sample rate, precision and timestamp?
6. Evidence: independently replicated correlation to *unseen content* in fully covert inner speech, after removing motor/attention artifacts?

## 2. Phone × body physical channel atlas (12 investigated routes)

| Route | Physical measurement and coupling | What actually exists | Stock phone/headset verdict | Does it prove pure inner words? |
|---|---|---|---|---|
| **A. Camera RGB + screen light** | Reflectance, pupil appearance, face motion, color/PPG | Screen-controlled illumination, remote pulse extraction demonstrated | **Possible now** for optical physiology; exposure/white balance confounds | **No** |
| **B. Active acoustic phone sonar** | Speaker sends waveform, mic senses shape/motion echoes | SonarSnoop and EchoWhisper / SilentTalk show phone transducer repurposing, usually for touch/lip/jaw movement | **Potentially possible** with supported speaker/mic capture, constrained by OS/audio fidelity and acoustic safety | **No** for no-movement inner hearing |
| **C. Headphone echo / jaw coupling** | Speaker + microphone inside over-ear cup see TMJ-related echo changes | **HPSpeech 2023**: 18 participants, 2 commercially sourced headset platforms but **modified research hardware**; 8 silent-articulated commands >90% | **Not established without hardware/firmware access**, model-specific inward-facing ANC mic not public Bluetooth feed | **No**; mouth/jaw commands |
| **D. In-ear canal echo + pressure** | Sensitive mic sees deformation of ear canal | EarCommand and EMREOs demonstrate ear signals due to silent articulatory / eye movements | **No** for normal over-ear exterior call mic as a calibrated ear probe | **No** |
| **E. Touch capacitance and pressure** | Fingers change electrode capacitance and touch ellipse; grip variation may reflect pulse/posture | Experimental touchscreen capacitive heartbeat sensing; Android MotionEvent can expose x/y/pressure/size/major/minor but **not necessarily per-electrode capacitance** | **Touch metadata possible** while finger is on the screen; specialized raw capacitance measurement may require hardware/controller access | **No** |
| **F. Inertial coupling (IMU)** | Accel/gyro sense microvibrations transferred through held phone / cheek contact | Phone accelerometer and gyro are available; small motion can be measurable under certain setups | **Device-dependent possible**, dominated by hand/head movement | **No** |
| **G. Passive phone microphones** | Airborne sounds, clothing rustle, jaw/breath mechanical noise | Ordinary speech, respiration, mechanical artifacts | **Yes**, user permission and device route | **No**, an entirely internal sound is not necessarily an acoustic wave |
| **H. Electrical biosignals (EEG/EMG)** | Microvolt-scale body surface potentials from neural/muscular currents | Neuroprostheses; around-ear EEG / facial EMG systems; 2026 Arabic 31-class imagined-speech EEG paper | **Needs electrodes and suitable analog front-end**, not provided by touchscreen or headphone call mic | **Limited classes via special instruments, not stock phone** |
| **I. Brain magnetic field** | Cortical current magnetic flux typically femtotesla-level | MEG uses OPM/SQUID with magnetic noise cancellation / shielding | **Phone compass not MEG**; geomagnetic readings in μT and much lower precision vs brain MEG requirements | **No** |
| **J. Near-field wireless / Wi-Fi / UWB** | RF waves and reflections affected by body movement | Various movement-sensing schemes; UWB supported only on some premium Android devices and generally as ranging API | **Ordinary radio interfaces do not promise raw CSI/radar waveforms; device dependent** | **No** |
| **K. Light-based neural hemodynamics (fNIRS)** | Brain oxygenation changes captured with NIR emitters/detectors through scalp | EEG–fNIRS 2026 study classified four imagined phonemes offline in specialized setup | **Normal RGB selfie camera and screen are not equivalent to a calibrated fNIRS instrument** | **Yes restricted lab readout, not phone** |
| **L. Temperature / barometer / proximity / NFC** | Surface or environmental changes, device proximity, near-field coupling | Commodity sensors measure their designed observables on some devices | **Some accessible**, but bandwidth/signal coupling to imagined words not established | **No** |

### Two dramatic orders-of-magnitude facts

- Earth's background field is typically ~50 **microtesla** (50,000 nT) in cited OPM-MEG context, while brain MEG requires detecting **femtotesla** signals. 1 microtesla = **1,000,000,000 femtoteslas**. The fact a phone has a magnetometer does **not** turn it into an OPM-MEG instrument. NIST: https://www.nist.gov/news-events/news/2007/11/new-nist-mini-sensor-may-have-biomedical-and-security-applications ; wearable OPM review: https://pmc.ncbi.nlm.nih.gov/articles/PMC9805039/
- A **capacitance-based heartbeat** was demonstrated using a specific touchscreen electrode configuration: https://pmc.ncbi.nlm.nih.gov/articles/PMC7412254/ . The operating system's MotionEvent touch size or pressure is NOT equivalent to that full raw analog measurement. Android interface: https://developer.android.com/reference/android/view/MotionEvent.html

## 3. Closest discovery to the user's Soundcore setup: HPSpeech

**HPSpeech — Ruidong Zhang et al., ISWC 2023.**
Original team page: https://ruidongzhang.com/research/hpspeech
DOI: https://doi.org/10.1145/3594738.3611365

- Plays controlled acoustic signals from headphones; inner-earcup microphone sees reflected changes from **temporomandibular joint** (jaw movements).
- Evaluated 18 participants using 2 headphone designs/platforms; **8 silent articulated commands**, over 90% recognition in that experimental task.
- Used **modified commodity hardware**. The paper argues firmware integration might one day allow a headset with existing inward-facing ANC mic to run it; **does not validate that unmodified Soundcore via Android can do so**.
- **Difference from target:** silent articulation is NOT pure inner audition without necessary jaw movement.
- **Question for hardware reconnaissance:** What exact mic/capsule orientation, raw capture path, codec sample frequency, ANC firmware capabilities, and Android routing does the user's Soundcore model expose? No speculation substituted for device verification.

## 4. Most relevant genuine inner-speech information sensing

- **31-class ARABIC imagined speech, August 2026**: EEG benchmark with subject/session variability, authors report 51.88% accuracy and 60.29% after data cleaning using 10-fold evaluation. This is a strongly relevant **language** research dataset, but it captures **EEG**, not phone microphone signals. Whether split designs have subject/session independence must be assessed before strong generalization claims. PubMed: https://pubmed.ncbi.nlm.nih.gov/42128168/
- **Hybrid EEG-fNIRS phoneme decoding, February 2026**: 22 participants imagine/perceive four phonemes (/a/, /i/, /b/, /k/) with dedicated EEG and fNIRS sensors; not a consumer phone sensor. https://doi.org/10.3389/fnrgo.2026.1696865
- **Silent speech sensing survey, Nature Sensors January 2026:** distinguishes off-body, on-body, and in-body sensors and emphasizes proximity/coupling. Full text is subscription-limited; abstract/reference list accessible. https://www.nature.com/articles/s44460-025-00010-2
- **Camera PPG validation:** Phone front camera can measure pulse on face; this is physiology, not imagined word content. https://pmc.ncbi.nlm.nih.gov/articles/PMC5368348/
- **Phone active sonar real (SonarSnoop):** phone speaker/mic can be repurposed to sense other physical interactions; again not inner speech. https://link.springer.com/article/10.1007/s10207-019-00449-8
- **Android OS microphone policy:** "UNPROCESSED" may revert to DEFAULT if unsupported, and ANC raw capsule access isn't guaranteed. https://developer.android.com/reference/android/media/MediaRecorder.AudioSource

## 5. How we will handle the truly speculative

Include *CIA Gateway / Stargate, Soviet psychotronics, unusual eye-to-ear coupling, and unconventional quantum sensing* in the broader archive, **not as data supporting a valid phone decoder**. An actual published/declassified document proves someone wrote something; a reproducible measurable correlation proves a much narrower scientific claim. Cross-reference: [STRANGE_SIGNALS_ATLAS.md](./STRANGE_SIGNALS_ATLAS.md).

Retain four levels:
- **Demonstrated:** replicated/measured as claimed within stated experimental conditions.
- **Derived:** clear physical inference from demonstrated channels, but not validated on target device.
- **Hypothesis:** plausible or unusual information flow, no direct content evidence.
- **Unsupported claim:** asserts sentence decoding without demonstrating source→carrier→sensor→held-out result.

**Brain fields, quantum sensing, biophotons, 'water memory', RF telepathy** are not shortcuts: each requires a measurable interaction, precision and bandwidth. A camera cannot capture invisible spectra it is physically blind to; firmware cannot create missing electrodes. Conversely, historic skepticism alone is not grounds to reject a properly measured new effect.

## 6. Research priorities (not another 24-prompt guessing game)

### Priority 1 — Write a SENSOR PASSPORT for an *actual* phone and headphones
For each source: sensor model; API access; permissions; sampling rate; noise floor / spectral response; whether measurement is raw or OS-processed; user control; tests with a known positive signal; and whether hardware needs modification. Produce a reproducible device capability report without asking the user to think target words.

Phone-native Android access may be needed for precise inspection; a browser page is insufficient to enumerate arbitrary sensor, microphone, and controller internals. Don't assert that the ANC mic is exposed without an actual route test.

### Priority 2 — Prove transduction with known signals, not with words
- Optical: can video detect a *known* pulse or deliberately introduced light waveform? Show a control channel, movement suppression and calibrated time windows.
- Acoustics: is a *known safe audible test signal* actually present in recorded samples and are echoes stable? Do not DIY high-amplitude ultrasound into ears.
- Touch/IMU: can a controlled, known mechanical grip or phone motion be recovered?
- Magnetic: can a known small magnet orientation change be measured? This calibrates phone magnetometer only—**not** neural magnetic sensing.
- Every test should yield quantitative sensor specificity, timing, and noise, not AI text.

### Priority 3 — Look for an actual inner-phoneme-bearing peripheral signature *only if source physics exists*
Pre-register controls: silent thought vs silent articulation vs audible speaking vs passive imagery of sound vs rest; track eyes, jaw, respiration and EMG where possible. Never use models whose information came from the displayed word labels. Separate training sessions from blinded testing and hold out *novel* phrases.

### Decisive fail / pass
- **GO:** Peripheral data Z shows reproducible *content-specific* information above matched controls on withheld prompts and sessions. A realistic instrument and independent lab confirmation exist.
- **STOP:** Z merely contains lip movements, breathing changes, eye movements, known experiment schedule, or no detectable content-dependent signal.
- **NEVER CLAIM:** arbitrary private thought transcription from chance-level small samples.

## 7. Engineering conclusion — current as of October 2026

Most promising **stock phone physics**: camera PPG/reflectance; microphone + speaker sonar; accelerometer/gyro with physical contact; accessible touchscreen contact geometry. These can demonstrate **previously overlooked body–phone couplings** today, without proving mental text.

Most relevant **commodity-headphone precedent**: HPSpeech, but **its tested setup was modified** and its target was silent *articulatory* commands.

Most promising **information-carrying channels of pure imagined speech**: EEG and more invasive brain interfaces with proper electrodes/sensors, not unmodified consumer audio hardware.

**Unknown:** any experimentally verified path that transmits arbitrary inner-voice phonemes into stock phone camera, touchscreen, mic, magnetometer or headset ANC audio. The main research objective is to discover/test whether such a path exists. Until that gate passes, writing more AI software cannot manufacture it.

## Sources index (primary papers and platform docs)
1. Nature Sensors 2026 field survey: https://www.nature.com/articles/s44460-025-00010-2
2. HPSpeech author paper/abstract: https://ruidongzhang.com/research/hpspeech
3. HPSpeech DOI: https://doi.org/10.1145/3594738.3611365
4. Arabic imagined-speech EEG 2026: https://pubmed.ncbi.nlm.nih.gov/42128168/
5. Hybrid EEG–fNIRS phonemes 2026: https://doi.org/10.3389/fnrgo.2026.1696865
6. Capacitive touch heart rate: https://pmc.ncbi.nlm.nih.gov/articles/PMC7412254/
7. Android touch metadata: https://developer.android.com/reference/android/view/MotionEvent.html
8. NIST magnetic sensing: https://www.nist.gov/news-events/news/2007/11/new-nist-mini-sensor-may-have-biomedical-and-security-applications
9. OPM-MEG review: https://pmc.ncbi.nlm.nih.gov/articles/PMC9805039/
10. Android unprocessed audio: https://developer.android.com/reference/android/media/MediaRecorder.AudioSource
11. Smartphone sonar: https://link.springer.com/article/10.1007/s10207-019-00449-8
12. Camera face-PG: https://pmc.ncbi.nlm.nih.gov/articles/PMC5368348/
