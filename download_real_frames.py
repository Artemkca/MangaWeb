import os
import io
import json
import time
from duckduckgo_search import DDGS
import requests
from PIL import Image

FRAMES_DIR = "frontend/public/frames"
os.makedirs(FRAMES_DIR, exist_ok=True)

# Clean old svg frames
for f in os.listdir(FRAMES_DIR):
    if f.endswith('.svg') or f.endswith('.png'):
        os.remove(os.path.join(FRAMES_DIR, f))

def is_valid_frame(img_bytes):
    try:
        img = Image.open(io.BytesIO(img_bytes))
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Check center transparency
        w, h = img.size
        # get center 40%
        center_box = (int(w*0.3), int(h*0.3), int(w*0.7), int(h*0.7))
        center_region = img.crop(center_box)
        
        # calculate percentage of transparent pixels in center
        pixels = center_region.getdata()
        transparent_count = sum(1 for p in pixels if p[3] < 50) # alpha < 50
        
        if transparent_count / len(pixels) > 0.8: # at least 80% transparent in the center
            return True, img
        return False, None
    except Exception as e:
        return False, None

def main():
    queries = ["twitch avatar frame png transparent", "discord avatar frame transparent", "avatar border png transparent"]
    frames_data = []
    downloaded = 0
    seen_urls = set()
    
    with DDGS() as ddgs:
        for query in queries:
            if downloaded >= 20: break
            
            print(f"Searching: {query}")
            results = ddgs.images(query, safesearch="Off", type_image="transparent")
            
            for res in results:
                if downloaded >= 20: break
                url = res.get('image')
                if not url or url in seen_urls: continue
                seen_urls.add(url)
                
                try:
                    r = requests.get(url, timeout=5)
                    if r.status_code == 200:
                        is_frame, img = is_valid_frame(r.content)
                        if is_frame:
                            filename = f"frame_{downloaded + 10}.png"
                            filepath = os.path.join(FRAMES_DIR, filename)
                            # resize to something reasonable like 256x256 to save space
                            img = img.resize((256, 256), Image.Resampling.LANCZOS)
                            img.save(filepath, "PNG")
                            
                            title = res.get('title', f"Frame {downloaded + 10}").split()[0].title()
                            if len(title) > 15: title = f"Frame {downloaded+10}"
                            
                            frames_data.append({
                                "id": downloaded + 10,
                                "name": title,
                                "img": f"/frames/{filename}",
                                "type": "frame",
                                "price": 1500
                            })
                            
                            downloaded += 1
                            print(f"Downloaded {downloaded}/20: {title}")
                except Exception as e:
                    pass
                time.sleep(0.5)

    print("\n--- COPY THIS TO SettingsPage.jsx Frames ---")
    print(json.dumps(frames_data, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
