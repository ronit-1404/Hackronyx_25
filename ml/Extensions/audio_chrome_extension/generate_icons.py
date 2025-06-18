import os
import cairosvg

# Define icon sizes
ICON_SIZES = [16, 48, 128]

# Path to the SVG file
svg_path = os.path.join('images', 'icon.svg')

# Check if images directory exists
if not os.path.exists('images'):
    os.makedirs('images')

# Convert SVG to PNG for each size
for size in ICON_SIZES:
    output_path = os.path.join('images', f'icon{size}.png')
    print(f"Converting icon to {size}x{size} PNG...")
    
    cairosvg.svg2png(
        url=svg_path,
        write_to=output_path,
        output_width=size,
        output_height=size
    )
    
    print(f"Created {output_path}")

print("All icons generated successfully!")
