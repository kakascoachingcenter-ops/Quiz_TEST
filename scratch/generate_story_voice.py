import asyncio
import edge_tts

STORY_TEXT = """
Zara lived in a small house with a green gate. Behind the house was a big mango tree.

One sunny morning, Zara went out to play. She heard a soft sound. "Chirp, chirp!" She looked down and saw a little bird on the ground. It had a hurt wing.

"Don't be afraid, little bird," said Zara. She picked it up gently and ran to her mother. Her mother gave her a soft cloth and a small box. Zara put the bird in the box. She gave it some water and rice.

For three days, Zara took care of the bird. On the fourth day, the bird flapped its wings and flew up, up, up! It sat on the mango tree and sang a happy song. "Goodbye, my friend!" said Zara. She waved and smiled.

After that, the little bird came to the mango tree every morning to sing for Zara.
"""

VOICE = "en-US-AnaNeural"  # Professional expressive, friendly children's story voice
OUTPUT_FILE = "f:/Tution/Worksheets/Webs/KCI_TableOf2_App/zara_story_voice.mp3"

async def generate():
    print(f"Generating story narration using {VOICE}...")
    communicate = edge_tts.Communicate(STORY_TEXT, VOICE, rate="-4%", pitch="+2Hz")
    await communicate.save(OUTPUT_FILE)
    print("Done generating zara_story_voice.mp3!")

if __name__ == "__main__":
    asyncio.run(generate())
