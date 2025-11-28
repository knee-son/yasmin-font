from PIL import Image
import os

src_folder = "assets/processed"
dst_folder = "assets/post-processed"
os.makedirs(dst_folder, exist_ok=True)

# loop over images
for filename in os.listdir(src_folder):
    if not filename.lower().endswith((".png", ".jpg", ".jpeg")):
        continue

    img_path = os.path.join(src_folder, filename)
    img = Image.open(img_path)

    # --- Trim / crop to content ---
    # Convert to RGBA to handle alpha
    img = img.convert("RGBA")
    bbox = img.getbbox()  # bounding box of non-transparent/non-black content
    if bbox:
        img = img.crop(bbox)

    h = 90
    w = int(img.width * h / img.height)
    img = img.resize((w, h), Image.LANCZOS)

    # --- Convert to WebP ---
    output_path = os.path.join(dst_folder, os.path.splitext(filename)[0] + ".webp")
    img.save(output_path, "WEBP", quality=95, method=6)

print("Done!")
