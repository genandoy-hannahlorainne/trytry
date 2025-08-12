import os
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from typing import List
from pathlib import Path
import uuid

class PhotoService:
    def __init__(self):
        self.upload_dir = Path("/app/backend/uploads")
        self.upload_dir.mkdir(exist_ok=True)
        self.strips_dir = self.upload_dir / "strips"
        self.strips_dir.mkdir(exist_ok=True)

    def save_photo(self, session_id: str, photo_index: int, image_data: str) -> str:
        """Save base64 image data to file and return file path"""
        try:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            image = Image.open(BytesIO(image_bytes))
            
            # Generate filename
            filename = f"{session_id}_photo_{photo_index}_{uuid.uuid4().hex[:8]}.jpg"
            file_path = self.upload_dir / filename
            
            # Apply vintage filter
            filtered_image = self.apply_vintage_filter(image)
            
            # Save image
            filtered_image.save(file_path, "JPEG", quality=90)
            
            return str(file_path)
            
        except Exception as e:
            raise Exception(f"Failed to save photo: {str(e)}")

    def apply_vintage_filter(self, image: Image.Image) -> Image.Image:
        """Apply vintage/dreamy filter effects"""
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to standard size
        image = image.resize((400, 400), Image.Resampling.LANCZOS)
        
        # Apply sepia effect
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(0.7)  # Reduce saturation
        
        # Add warm tone
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.1)
        
        # Slight blur for dreamy effect
        image = image.filter(ImageFilter.GaussianBlur(0.5))
        
        # Add film grain (noise)
        image = self.add_grain(image)
        
        return image

    def add_grain(self, image: Image.Image) -> Image.Image:
        """Add film grain effect"""
        width, height = image.size
        grain = Image.new('RGB', (width, height))
        
        # Create random grain pattern
        import random
        pixels = []
        for _ in range(width * height):
            grain_value = random.randint(-10, 10)
            pixels.append((grain_value, grain_value, grain_value))
        
        grain.putdata(pixels)
        
        # Blend with original image
        return Image.blend(image, grain, 0.05)

    def generate_photo_strip(self, session_id: str, photos: List[dict], layout: dict) -> str:
        """Generate a photobooth strip from multiple photos"""
        try:
            strip_width = 400
            photo_size = 380
            margin = 10
            caption_height = 60
            
            # Calculate strip dimensions based on layout
            if layout['photo_count'] == 2:
                strip_height = (photo_size * 2) + (margin * 3) + caption_height
                cols, rows = 1, 2
            elif layout['photo_count'] == 3:
                strip_height = (photo_size * 3) + (margin * 4) + caption_height
                cols, rows = 1, 3
            elif layout['photo_count'] == 4:
                strip_height = (photo_size * 2) + (margin * 3) + caption_height
                cols, rows = 2, 2
            else:  # 6 photos
                strip_height = (photo_size * 3) + (margin * 4) + caption_height
                cols, rows = 2, 3

            # Create strip background
            strip = Image.new('RGB', (strip_width, strip_height), (255, 248, 245))
            
            # Add vintage paper texture
            strip = self.add_paper_texture(strip)
            
            # Place photos
            for i, photo_data in enumerate(photos[:layout['photo_count']]):
                if os.path.exists(photo_data['file_path']):
                    photo = Image.open(photo_data['file_path'])
                    
                    # Calculate position
                    if layout['photo_count'] <= 3:
                        x = margin
                        y = margin + (i * (photo_size + margin))
                    else:
                        col = i % cols
                        row = i // cols
                        x = margin + (col * (photo_size // cols + margin))
                        y = margin + (row * (photo_size // rows + margin))
                    
                    # Resize photo to fit
                    if layout['photo_count'] == 4:
                        photo_width = (strip_width - margin * 3) // 2
                        photo_height = (strip_height - caption_height - margin * 4) // 2
                    elif layout['photo_count'] == 6:
                        photo_width = (strip_width - margin * 3) // 2
                        photo_height = (strip_height - caption_height - margin * 5) // 3
                    else:
                        photo_width = photo_size
                        photo_height = photo_size // 2 if layout['photo_count'] > 2 else photo_size
                    
                    photo = photo.resize((photo_width, photo_height), Image.Resampling.LANCZOS)
                    strip.paste(photo, (x, y))
            
            # Add caption at bottom
            self.add_caption(strip, layout['layout_name'])
            
            # Save strip
            strip_filename = f"strip_{session_id}_{uuid.uuid4().hex[:8]}.jpg"
            strip_path = self.strips_dir / strip_filename
            strip.save(strip_path, "JPEG", quality=95)
            
            return str(strip_path)
            
        except Exception as e:
            raise Exception(f"Failed to generate photo strip: {str(e)}")

    def add_paper_texture(self, image: Image.Image) -> Image.Image:
        """Add vintage paper texture"""
        # Add slight sepia tone to background
        overlay = Image.new('RGB', image.size, (255, 248, 240))
        return Image.blend(image, overlay, 0.1)

    def add_caption(self, image: Image.Image, layout_name: str):
        """Add handwritten-style caption to the photo strip"""
        draw = ImageDraw.Draw(image)
        
        # Try to use a serif font, fallback to default
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf", 16)
        except:
            font = ImageFont.load_default()
        
        # Add main caption
        caption_text = '"about you..."'
        text_width = draw.textlength(caption_text, font=font)
        x = (image.width - text_width) // 2
        y = image.height - 45
        
        draw.text((x, y), caption_text, fill=(100, 100, 100), font=font)
        
        # Add date and layout info
        import datetime
        date_text = f"- {datetime.datetime.now().strftime('%B %d, %Y')} • {layout_name} -"
        try:
            small_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf", 10)
        except:
            small_font = ImageFont.load_default()
        
        date_width = draw.textlength(date_text, font=small_font)
        x = (image.width - date_width) // 2
        y = image.height - 20
        
        draw.text((x, y), date_text, fill=(150, 150, 150), font=small_font)