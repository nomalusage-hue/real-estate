from PIL import Image

input_path = "properties.jpg"
output_path = "properties-optimized.jpg"

img = Image.open(input_path)

# Keep same dimensions
img.save(
    output_path,
    format="JPEG",
    quality=80,       # adjust 70–85
    optimize=True,
    progressive=True
)

print("Optimized successfully")