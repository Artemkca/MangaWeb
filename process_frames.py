import os
from PIL import Image

def floodfill_background(img, start_points, threshold=30):
    width, height = img.size
    pixels = img.load()
    visited = set()
    to_visit = []
    
    for sx, sy in start_points:
        if (sx, sy) not in visited:
            to_visit.append((sx, sy))
            visited.add((sx, sy))
            
    # We will assume the background color is the color at (0,0)
    bg_color = pixels[0, 0][:3]
    # If the center pixel is significantly different from the corner, it might have a different bg color
    # but usually it's the same. We'll use a dynamic check: compare to the pixel's own start region if we wanted,
    # but comparing to (0,0) is usually safe for these frames (solid white or black).
    # Let's get the center color just in case.
    center_color = pixels[200, 200][:3]
    
    def color_dist(c1, c2):
        return sum(abs(c1[i] - c2[i]) for i in range(3))
        
    transparent_pixels = set()

    while to_visit:
        x, y = to_visit.pop(0)
        
        # Check against both corner bg and center bg
        c = pixels[x, y][:3]
        if color_dist(c, bg_color) < threshold or color_dist(c, center_color) < threshold:
            transparent_pixels.add((x, y))
            
            # Add neighbors
            for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        to_visit.append((nx, ny))
                        
    # Apply transparency
    for x, y in transparent_pixels:
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        
    return img

def process_frame(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        img = img.resize((400, 400), Image.Resampling.LANCZOS)
        
        # Start floodfill from the 4 corners and the center
        starts = [(0, 0), (399, 0), (0, 399), (399, 399), (200, 200)]
        img = floodfill_background(img, starts, threshold=30)
        
        img.save(output_path, "PNG")
        print(f"Processed file successfully")
    except Exception as e:
        print(f"Error processing: {e}")

if __name__ == "__main__":
    frames_dir = "frontend/public/frames"
    os.makedirs(frames_dir, exist_ok=True)
    
    raw_dir = "frontend/public/frames_raw"
    if os.path.exists(raw_dir):
        for f in os.listdir(raw_dir):
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                in_path = os.path.join(raw_dir, f)
                # Ensure output is always png
                out_name = f.rsplit('.', 1)[0] + '.png'
                
                # We rename them to what we expect in code
                if 'Ho' in f:
                    out_name = 'frame_kitsune.png'
                elif '1.png' in f:
                    out_name = 'frame_oni.png'
                else:
                    base_name = f.rsplit('.', 1)[0].replace(' ', '_').lower()
                    out_name = f"frame_{base_name}.png"
                    
                out_path = os.path.join(frames_dir, out_name)
                process_frame(in_path, out_path)
