#!/usr/bin/env python3
"""
tools/make_audio.py
Offline Audio Clip Generator for KCI KG Worksheets using Kokoro-82M TTS.

Usage:
    python tools/make_audio.py [--voice bf_emma] [--speed 0.9] [--bitrate 48k]

Requirements:
    pip install kokoro>=0.9.2 soundfile
    System package: espeak-ng, ffmpeg
"""

import os
import sys
import json
import argparse
import subprocess
import tempfile
from pathlib import Path

def check_dependencies():
    missing = []
    try:
        import kokoro
    except ImportError:
        missing.append("kokoro (install via: pip install kokoro>=0.9.2)")
    try:
        import soundfile
    except ImportError:
        missing.append("soundfile (install via: pip install soundfile)")

    # Check ffmpeg
    try:
        res = subprocess.run(["ffmpeg", "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if res.returncode != 0:
            missing.append("ffmpeg (ensure ffmpeg is on system PATH)")
    except FileNotFoundError:
        missing.append("ffmpeg (not found on PATH)")

    return missing

def main():
    parser = argparse.ArgumentParser(description="Generate MP3 audio clips for KCI KG worksheets.")
    parser.add_argument("--voice", default="bf_emma", help="Kokoro British female voice name (default: bf_emma)")
    parser.add_argument("--speed", type=float, default=0.9, help="TTS speech rate (default: 0.9)")
    parser.add_argument("--bitrate", default="48k", help="MP3 encoding bitrate (default: 48k)")
    parser.add_argument("--manifest", default="audio/manifest.json", help="Path to manifest.json")
    parser.add_argument("--output-dir", default="audio/en", help="Target output folder for MP3s")
    parser.add_argument("--overwrite", action="store_true", help="Regenerate already existing MP3 files")
    args = parser.parse_args()

    project_root = Path(__file__).resolve().parent.parent
    manifest_path = project_root / args.manifest
    output_dir = project_root / args.output_dir

    if not manifest_path.exists():
        print(f"Error: Manifest file not found at {manifest_path}", file=sys.stderr)
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)

    missing_deps = check_dependencies()
    if missing_deps:
        print("=" * 65)
        print("MISSING DEPENDENCIES FOR OFFLINE TTS GENERATION:")
        for dep in missing_deps:
            print(f"  - {dep}")
        print("=" * 65)
        print("\nPlease install prerequisites or run on Google Colab / Kaggle.")
        print("See tools/README.md for full step-by-step setup instructions.")
        sys.exit(1)

    from kokoro import KPipeline
    import soundfile as sf

    print(f"Initializing Kokoro pipeline for British English (lang_code='b', voice='{args.voice}')...")
    pipeline = KPipeline(lang_code='b')

    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    total_keys = len(manifest)
    print(f"Found {total_keys} entries in {args.manifest}")

    generated_count = 0
    skipped_count = 0

    with tempfile.TemporaryDirectory() as temp_dir:
        for idx, (key, item) in enumerate(manifest.items(), start=1):
            target_mp3 = output_dir / f"{key}.mp3"

            if target_mp3.exists() and not args.overwrite:
                skipped_count += 1
                continue

            text = item.get("text", key)
            print(f"[{idx}/{total_keys}] Generating: {key} -> \"{text}\"")

            try:
                # Kokoro generation
                generator = pipeline(text, voice=args.voice, speed=args.speed, split_pattern=r'\n+')
                audio_segments = []
                for _, _, audio in generator:
                    audio_segments.append(audio)

                if not audio_segments:
                    print(f"  Warning: No audio generated for key {key}", file=sys.stderr)
                    continue

                import numpy as np
                combined_audio = np.concatenate(audio_segments) if len(audio_segments) > 1 else audio_segments[0]

                # Write to temp WAV
                temp_wav = Path(temp_dir) / f"{key}.wav"
                sf.write(str(temp_wav), combined_audio, 24000)

                # Convert to mono MP3 at specified bitrate (48-64 kbps) using ffmpeg
                cmd = [
                    "ffmpeg", "-y",
                    "-i", str(temp_wav),
                    "-ac", "1",
                    "-b:a", args.bitrate,
                    "-ar", "24000",
                    str(target_mp3)
                ]
                res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
                if res.returncode != 0:
                    print(f"  ffmpeg error encoding {key}: {res.stderr.decode('utf-8', errors='ignore')}", file=sys.stderr)
                else:
                    generated_count += 1

            except Exception as e:
                print(f"  Error processing key {key}: {e}", file=sys.stderr)

    print("\n" + "=" * 50)
    print(f"TTS Generation Complete!")
    print(f"  - Newly generated: {generated_count}")
    print(f"  - Skipped (existing): {skipped_count}")
    print(f"  - Total target files: {total_keys}")
    print(f"Output directory: {output_dir}")
    print("=" * 50)

if __name__ == "__main__":
    main()
