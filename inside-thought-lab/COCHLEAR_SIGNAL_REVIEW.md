# INSIDE / THE MISSING CHANNEL — Evidence Review 01
**Date:** 2026-10-08  
**State:** Research only. No claim of silent thought reading.  
**Question:** Can the content (not merely the presence) of inner speech be inferred from a peripheral, non-implanted signal that an ordinary phone or over-ear headset can measure?

## A. The scientific chain (do not skip steps)

1. **Internal words have neural representations.** Internal speech, inner hearing, and silently attempting to articulate may use overlapping but nonidentical systems. Evidence for cortical phonetic encoding exists even with no observable speech movement.
2. **Auditory processing has descending connections.** Cortico-brainstem-olivocochlear feedback can modify cochlear mechanics and auditory nerve activity.
3. **Some cochlear outputs are measurable.** Otoacoustic emissions (OAE) are exceptionally faint sounds measurable in the ear canal using a special, calibrated probe. In cochlear-implant users, auditory nerve electrical activity has been directly recorded.
4. **A link from imagined-word ID to peripheral ear signals is NOT established.** Attention, task difficulty and externally perceived acoustic frequency information should not be confused with internal phonetic content.
5. **A generic headphone microphone isn't an OAE probe.** Even if a headset's ANC has feedback microphones, third-party audio API access to individual raw ANC channels cannot be assumed.

## B. Key original studies and what they actually demonstrate

| Study | Readout | Task and result | Does it decode inner words from ear? |
|---|---|---|---|
| [Direct Cochlear Recordings, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC8883868/) | Cochlear-implant electrode, neural activity | 16 CI wearers: auditory vs visual attention distinguishable during silence preceding stimuli | **No.** Decodes *attention modality*, not word identity; CI users and instrumented nerve |
| [Steinebach & Reichenbach, 2026](https://doi.org/10.3389/fnins.2026.1756386) | Speech-like DPOAEs from ear-canal probe | 38 analyzed participants: target speech harmonics affected by attending to one of two **externally audible** voices | **No.** Externally delivered stimuli, calibrated elicitation |
| [Francis et al., 2018 — Replicability](https://pmc.ncbi.nlm.nih.gov/articles/PMC6246073/) | SFOAE | Initial effect N=15 did not independently replicate N=15 | No |
| [Beim et al., 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6715442/) | SFOAE | No systematic attentional effect across 45 subjects in two experiments | No |
| [No MOC attentional change, 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7700184/) | Contralateral OAE suppression + EEG ERPs | Reliable auditory vs visual task-related ERPs without OAE suppression difference | No |
| [Motion confound, 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC6146202/) | Ear-canal noise | Attentional differences in ear-canal noise explained by subject motion, not necessarily by efferents | No |
| [Neural internal speech representations, 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11199147/) | Implanted neuronal microelectrode arrays | Word classes distinguishable from brain neurons in humans with tetraplegia; no required articulation in the internal speech condition | **Yes at cortical neural level, not through ears** |
| [Common/different neural regions for imagined/perceived speech, 2023](https://academic.oup.com/cercor/article/33/10/6486/6966059) | fMRI | Shared and distinct cortical activations during imagining and hearing speech | Brain signals, not cochlea |
| [Inner speaking vs inner hearing, 2023](https://pubmed.ncbi.nlm.nih.gov/37922641/) | Human neuroscience | Phenomenologically similar inner experiences can follow distinct neural generation pathways | Not a decoder |
| [Around-ear EEG decoding, 2026](https://pubmed.ncbi.nlm.nih.gov/41855656/) | Electrodes around ear + substantial training | Classifies limited silent/attempted speech vocabulary using *special electrodes*, not commercial headphone audio | **EEG (electrical), not ear-canal acoustics** |

**Most important distinction:** Speech-like DPOAE refers to the **eliciting test signal built from the acoustics of spoken speech played into the ear**. It does **not** mean recording an internally imagined sentence from the cochlea.

## C. What is actually accessible on a phone?

- Android can enumerate connected audio capture/render devices: https://developer.android.com/reference/kotlin/android/media/AudioManager
- Android supports `UNPROCESSED` as an audio source **if the device exposes it**; otherwise it behaves like the default input: https://developer.android.com/reference/android/media/MediaRecorder.AudioSource
- These APIs do not promise access to multiple separate ANC feedback microphone channels inside a Soundcore headset. Do **not** assume a consumer Bluetooth headset can expose its raw internal ear-facing ANC microphone.
- OAE probes require low-noise, calibrated microphones and carefully controlled acoustic coupling: https://pmc.ncbi.nlm.nih.gov/articles/PMC3189966/ and https://pmc.ncbi.nlm.nih.gov/articles/PMC5848844/.
- Until the exact headset model's input routing and microphone characteristics have been measured, the actual accessible channels remain unknown.
- Do not attempt DIY high-output or ultrasonic acoustic stimulation directly into the ears. Sound exposure is a separate safety question and should follow calibrated audio research protocols.

## D. Ranked research hypotheses — *not* engineering promises

### H1 — Strongly grounded: cortical phonetic content
- Neural populations can carry imagined-word information.
- A viable decoder from *neural sensors* already exists in limited settings.
- Constraint: phone/headphones alone do not constitute EEG sensors.

### H2 — Established but limited: brain-to-ear modulation of attention
- Descending pathways and some physiological modulation exist.
- A causal effect is credible, but its strength in hearing participants and particular OAE paradigms is inconsistent.
- Constraint: attention type, not word identity.

### H3 — Open, risky: imagined *specific* speech phoneme changes cochlear emission spectral pattern
- **As of this review, no directly validating inner-speech-to-OAE phoneme-decoding paper was found.**
- Decisive test needs calibrated OAE probe; multiple controlled participants; matched auditory imagery vs perceptual attention vs rest; randomized *unseen* phoneme labels; respiratory, postural, jaw and middle-ear controls; acoustic artifact monitoring; replication across sessions and held-out words.
- A result that only identifies rest vs "thinking" does not pass the gate.
- If no reproducible speech-content-specific signal is measured, reject this channel for decoding.

### H4 — Most convenient but weakest: phone / commercial headphone microphones
- Feasible for *audible* input and some facial/physical motion effects.
- Not a validated tool for observing the pure inner voice.
- Testing ordinary available audio inputs may establish hardware limitations; don't claim it can reveal mental words.

## E. Next action, NOT another classification website

1. Review any published direct test of auditory imagery / internal speech versus OAEs (current literature search found no convincing word-content decoder).
2. Construct a channel budget: signal source → anatomical transmission → sensor location → amplitude/frequency → ambient/system noise → raw API access.
3. If channel is missing or below detectable noise, **stop** and label it unsupported. Better signal processing cannot restore information never measured.
4. If realistic OAE or around-ear EEG studies are available, design a preregistered content-specific protocol with genuine positive/negative controls and unseen classes.
5. Only after an independent lab-level proof of phoneme-specific peripheral signal consider translating the technique to ordinary portable hardware. Do not promise a phone-only implementation.

## F. Explicit exclusions

This note does not claim (a) audible inner speech exists in the external auditory canal, (b) commercial ANC mics are accessible, (c) positive cortical word decoding implies peripheral word decoding, or (d) a spiritual/scriptural text supplies a frequency or sensor mechanism. The Qur'anic reflection in the earlier conversation concerns motivation and epistemology, not empirical proof.

## Short bottom line

**The one missing empirical link is:** brain-generated internal *phoneme / word identity* → reproducible measurable physical output at/near the ear → enough bandwidth/SNR for unseen-word decoding. Until all links are demonstrated, this remains a research hypothesis, not an app feature.
