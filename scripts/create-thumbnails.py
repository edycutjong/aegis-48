from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

def create_thumbnail(bg_path, out_path, title, subtitle):
    # Load the background
    bg = Image.open(bg_path)
    
    # The pure background is 1024x1024.
    # To make a seamless 1280x720 without just hard cropping the middle and losing scale,
    # let's crop the center 1024x576 of the background.
    left = 0
    top = (1024 - 576) // 2
    right = 1024
    bottom = top + 576
    
    bg_cropped = bg.crop((left, top, right, bottom))
    
    # Now resize it to 1280x720 with high quality anti-aliasing
    canvas = bg_cropped.resize((1280, 720), Image.Resampling.LANCZOS)
    
    # Create drawing context
    draw = ImageDraw.Draw(canvas)
    
    # Let's add a slight dark gradient/box on the left or center to make text super readable
    # Actually, YouTube thumbnails often have the text on the left or center. Let's do Center.
    # We will draw a dark semi-transparent rectangle in the center.
    overlay = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    d_overlay = ImageDraw.Draw(overlay)
    
    # Draw a gradient or just a dark box across the middle
    d_overlay.rectangle([0, 180, 1280, 540], fill=(0, 0, 0, 150))
    
    # Composite the overlay
    canvas = Image.alpha_composite(canvas.convert('RGBA'), overlay)
    draw = ImageDraw.Draw(canvas)
    
    # Load fonts
    try:
        font_title = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 140, index=11) # Condensed Black or similar
        font_subtitle = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", 60, index=2)     # Regular or Medium
    except:
        # Fallback
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()

    # Calculate text sizes to center them
    # For Pillow >= 8.0, textbbox is preferred
    title_bbox = draw.textbbox((0,0), title, font=font_title)
    title_w = title_bbox[2] - title_bbox[0]
    title_h = title_bbox[3] - title_bbox[1]
    
    sub_bbox = draw.textbbox((0,0), subtitle, font=font_subtitle)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_h = sub_bbox[3] - sub_bbox[1]
    
    # Draw text with cyan drop shadow for a cyber effect
    # Shadow offset
    sx, sy = 6, 6
    
    # Title shadow
    draw.text(((1280 - title_w)/2 + sx, (720 - title_h)/2 - 40 + sy), title, font=font_title, fill=(0, 255, 255, 200)) # cyan shadow
    # Title main
    draw.text(((1280 - title_w)/2, (720 - title_h)/2 - 40), title, font=font_title, fill=(255, 255, 255, 255))
    
    # Subtitle shadow
    draw.text(((1280 - sub_w)/2 + 3, (720 - title_h)/2 + title_h + 30 + 3), subtitle, font=font_subtitle, fill=(255, 0, 255, 200)) # subtle magenta shadow
    # Subtitle main
    draw.text(((1280 - sub_w)/2, (720 - title_h)/2 + title_h + 30), subtitle, font=font_subtitle, fill=(230, 230, 230, 255))
    
    # Finally save as JPG
    canvas.convert('RGB').save(out_path, "JPEG", quality=95)
    print(f"Generated {out_path}!")

if __name__ == "__main__":
    create_thumbnail(
        "/Users/edycu/.gemini/antigravity/brain/6dc1a88e-ab00-46e6-ba7c-9ab27a8a65e4/aegis48_demo_bg_1775899106641.png",
        "/Users/edycu/Projects/Hackathon/Aegis-48/youtube_thumbnail_main_16x9_perfect.jpg",
        "AEGIS-48",
        "AI CRITICAL SMART CONTRACT AUDIT"
    )
    
    create_thumbnail(
        "/Users/edycu/.gemini/antigravity/brain/6dc1a88e-ab00-46e6-ba7c-9ab27a8a65e4/aegis48_broll_bg_1775899132571.png",
        "/Users/edycu/Projects/Hackathon/Aegis-48/youtube_thumbnail_broll_16x9_perfect.jpg",
        "AEGIS-48",
        "DEVELOPER DASHBOARD WALKTHROUGH"
    )
