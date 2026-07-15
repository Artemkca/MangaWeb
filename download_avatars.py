import urllib.request
import json
import os
import time

URL = "https://graphql.anilist.co"
QUERY = '''
query {
  Page(page: 1, perPage: 15) {
    characters(sort: FAVORITES_DESC) {
      id
      name {
        full
      }
      image {
        large
      }
    }
  }
}
'''
OUTPUT_DIR = "frontend/public/avatars"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Fetching from AniList...")
req = urllib.request.Request(URL, data=json.dumps({'query': QUERY}).encode('utf-8'), headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
except Exception as e:
    print(f"Error: {e}")
    exit(1)

characters = data['data']['Page']['characters']
avatars_data = []

for i, char in enumerate(characters):
    name = char['name']['full']
    img_url = char['image']['large']
    
    filename = f"char_{char['id']}.jpg"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    print(f"Downloading {name}...")
    try:
        req_img = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req_img) as response_img:
            with open(filepath, 'wb') as f:
                f.write(response_img.read())
        
        avatars_data.append({
            "id": i + 10,
            "name": name,
            "img": f"/avatars/{filename}",
            "type": "avatar"
        })
        time.sleep(0.5)
    except Exception as e:
        print(f"Failed {name}: {e}")

print("\n--- COPY THIS INTO SettingsPage.jsx ---")
print(json.dumps(avatars_data, indent=2, ensure_ascii=False))
