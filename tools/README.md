# Offline Audio Generation Guide for KCI KG Worksheets

This folder contains the offline text-to-speech (TTS) generator `make_audio.py` using the Apache-2.0 **Kokoro-82M** open-weights model.

The web app itself uses a three-tier voice fallback:
1. Local MP3 audio clip (`audio/en/<key>.mp3`) if present.
2. Browser `window.speechSynthesis` (British English `en-GB`, rate 0.85, pitch 1.1) when MP3s have not been generated yet.
3. Silent fallback if neither audio nor speech synthesis is available.

---

## Option A: Local Installation & Run

### Prerequisites
1. **Python 3.10+**
2. **espeak-ng** (required by phonemizer in Kokoro):
   - **Ubuntu/Debian:** `sudo apt-get install -y espeak-ng ffmpeg`
   - **macOS (Homebrew):** `brew install espeak-ng ffmpeg`
   - **Windows:** Download espeak-ng MSI from [espeak-ng releases](https://github.com/espeak-ng/espeak-ng/releases) and ensure `ffmpeg.exe` is in your system PATH.
3. **Python dependencies:**
   ```bash
   pip install "kokoro>=0.9.2" soundfile numpy
   ```

### Running the Generator
From the `KCI_TableOf2_App` root:
```bash
python tools/make_audio.py --voice bf_emma --speed 0.9 --bitrate 48k
```

This reads `audio/manifest.json` (154 entries) and writes mono MP3 files into `audio/en/`. Existing files are skipped automatically.

---

## Option B: Free Google Colab / Kaggle Notebook (Recommended for Fast GPU Generation)

If you do not want to configure espeak-ng and PyTorch locally, run the following cells in a Google Colab notebook (T4 GPU or CPU):

```python
# Cell 1: Setup dependencies
!apt-get install -y espeak-ng ffmpeg
!pip install -q "kokoro>=0.9.2" soundfile numpy

# Cell 2: Clone or upload KCI repository
# Ensure audio/manifest.json is present in the working directory

# Cell 3: Run generator
!python tools/make_audio.py --voice bf_emma --speed 0.9 --bitrate 48k

# Cell 4: Zip generated audio clips for download
!zip -r kci_audio_en.zip audio/en
```

Download `kci_audio_en.zip`, extract into `KCI_TableOf2_App/audio/en/`, and reload the web app!
