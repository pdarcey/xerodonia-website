import os
import hashlib
from PIL import Image, ImageDraw, ImageFont

# Constants
IMAGE_SIZE = (256, 256)
RADIUS = 30
FONT_SIZE = 24
OUTPUT_DIR = "output_images"
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

# Text items
base_texts = [
    "Scoreboard", "Borderstamp", "Travel Bingo", "Distance Mapper",
    "Slideshow", "Swimming Timer", "Fallout", "Disk Catalogue", "Safari Extensions"
]

variations = [
    ("", 1),  # base only
    (" (full)", 3),
    (" (thumbnail)", 3)
]

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)

def hash_to_color(text):
    """Generate a consistent RGB color from text."""
    hash_bytes = hashlib.md5(text.encode("utf-8")).digest()
    r = 50 + hash_bytes[0] % 150  # Limit range to avoid too-light or too-dark
    g = 50 + hash_bytes[1] % 150
    b = 50 + hash_bytes[2] % 150
    return (r, g, b)

def get_text_color(bg_color):
    """Choose black or white text based on contrast."""
    r, g, b = bg_color
    luminance = (0.299*r + 0.587*g + 0.114*b)
    return (0, 0, 0) if luminance > 186 else (255, 255, 255)

def generate_image(text, file_name, bg_color):
    text_color = get_text_color(bg_color)

    # Create transparent base image
    img = Image.new("RGBA", IMAGE_SIZE, (0, 0, 0, 0))
    rounded_rect = Image.new("RGBA", IMAGE_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(rounded_rect)

    # Draw filled rounded rectangle
    draw.rounded_rectangle(
        [(0, 0), IMAGE_SIZE],
        radius=RADIUS,
        fill=bg_color
    )

    # Composite onto transparent background
    img = Image.alpha_composite(img, rounded_rect)

    # Draw text
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype(FONT_PATH, FONT_SIZE)
    except IOError:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_position = (
        (IMAGE_SIZE[0] - text_width) / 2,
        (IMAGE_SIZE[1] - text_height) / 2
    )

    draw.text(text_position, text, font=font, fill=text_color)

    # Save image
    img.save(os.path.join(OUTPUT_DIR, file_name), format="PNG")

def sanitize_filename(text):
    return text.lower().replace(" ", "")

# Generate all images
for base in base_texts:
    base_file = sanitize_filename(base)
    bg_color = hash_to_color(base)  # Deterministic color for this label

    for suffix, count in variations:
        for i in range(1, count + 1):
            full_text = base + suffix
            suffix_part = ""
            if "full" in suffix:
                suffix_part = f"-full-{i}"
            elif "thumbnail" in suffix:
                suffix_part = f"-thumbnail-{i}"

            file_name = f"{base_file}{suffix_part}.png"
            generate_image(full_text, file_name, bg_color)

print("✅ Images with deterministic colors and rounded transparent corners saved to 'output_images'.")
