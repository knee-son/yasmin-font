import json
import os
from PIL import Image

HEIGHT = 200  # pixels

base_dir = os.path.dirname(__file__)
assets_dir = os.path.join(base_dir, '../src/assets/')

fontmap_dir = os.path.join(assets_dir, "fonts/font-map.json")
kerning_dir = os.path.join(assets_dir, "fonts/kerning.json")
images_dir = os.path.join(assets_dir, "images/")

pairs : list = []
fontmap : dict = {}

def get_rightmost_pixel(image, index):
    width, height = image.size
    pixels = image.load()

    for x in range(width):
        r, g, b, a = pixels[-x-1, index]
        if a != 0:
            return x

    return width

def get_leftmost_pixel(image, index):
    width, height = image.size
    pixels = image.load()

    for x in range(width):
        r, g, b, a = pixels[x, index]
        if a != 0:
            return x

    return width
    

def get_image(path):
    with Image.open(path) as im:
        return im.convert("RGBA")

def calculate_kerning(left, right):
    print("processing pair:", left, right)

    a_image = get_image(base_dir + "/../" + fontmap[left]["filename"])
    a_scaling = fontmap[left]["height"]
    a_distance = HEIGHT * fontmap[left]["distance"]
    b_image = get_image(base_dir + "/../" + fontmap[right]["filename"])
    b_scaling = fontmap[right]["height"]
    b_distance = HEIGHT * fontmap[right]["distance"]

    w, h = a_image.size
    a_image = a_image.resize(
        (int(w * a_scaling), int(h * a_scaling)),Image.LANCZOS)
    w, h = b_image.size
    b_image = b_image.resize(
        (int(w * b_scaling), int(h * b_scaling)), Image.LANCZOS)

    y_alignment = a_distance - b_distance
    if y_alignment < 0:
        bbox = list(b_image.getbbox())
        bbox[1] = min(abs(y_alignment), bbox[3])
        b_image = b_image.crop(bbox)
    elif y_alignment > 0:
        bbox = list(a_image.getbbox())
        bbox[1] = min(abs(y_alignment), bbox[3])
        a_image = a_image.crop(bbox)

    if not (a_image.getbbox() and b_image.getbbox()):
        return 1

    # minimum height to check
    cap = min(a_image.getbbox()[3], b_image.getbbox()[3])

    touching_distance = max(a_image.getbbox()[2], b_image.getbbox()[2])
    for i in range(cap):
        row_distance = get_rightmost_pixel(a_image, -i-1) + \
            get_leftmost_pixel(b_image, -i-1)
        if touching_distance > row_distance:
            touching_distance = row_distance

    print(f"kerning is {touching_distance} pixels.")
    return touching_distance / HEIGHT

def export_frequency_map(data):
    import matplotlib.pyplot as plt

    plt.figure()
    plt.hist(data, bins=100, range=(0,1))
    plt.title("Value Distribution (0 to 1)")
    plt.xlabel("Value Range (0-1)")
    plt.ylabel("Count")
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    with open(fontmap_dir, 'r') as f:
        fontmap = json.load(f)
    
    letters = fontmap.keys()

    for a in letters:
        for b in letters:
            pairs.append((a,b))
    
    kernings = {}

    for left, right in pairs:
        k = calculate_kerning(left, right)
        if k > 0.08 and k < 0.8:
            if not kernings.get(left):
                kernings[left] = {}
            kernings[left][right] = k
    
    with open(kerning_dir, 'w') as f:
        json.dump(kernings, f, indent=2)