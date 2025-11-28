from rembg import remove

for c in range(ord('a'), ord('z') + 1):
    c = chr(c)

    with open(f"assets/alphabetical/letter_{c}.jpg", "rb") as i, open(f"assets/processed/letter_{c}.png", "wb") as o:
        o.write(remove(i.read()))
