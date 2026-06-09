import os
from PIL import Image

def main():
    print("Starting crop process...")
    # Paths
    src_path = r'C:\Users\user\.gemini\antigravity\brain\b210e717-87c2-4e6d-99d9-bff86e236fd2\media__1781011049489.png'
    dest_symbol = r'website\static\img\logo_symbol.png'
    dest_horizontal = r'website\static\img\logo_horizontal.png'
    
    if not os.path.exists(src_path):
        print(f"Source file not found: {src_path}")
        return

    # Load original logo
    img = Image.open(src_path)
    img_rgba = img.convert('RGBA')
    w, h = img.size
    print(f"Image loaded: {w}x{h}")

    # 1. Crop symbol A (strictly between x=70 and x=335)
    bbox_symbol = []
    for x in range(70, 335):
        for y in range(h):
            r, g, b, a = img_rgba.getpixel((x, y))
            if r < 240 or g < 240 or b < 240:
                bbox_symbol.append((x, y))
    
    if bbox_symbol:
        min_x = min([p[0] for p in bbox_symbol])
        max_x = max([p[0] for p in bbox_symbol])
        min_y = min([p[1] for p in bbox_symbol])
        max_y = max([p[1] for p in bbox_symbol])
        print(f"Symbol box: x={min_x}..{max_x}, y={min_y}..{max_y}")
        
        # Crop symbol
        symbol = img.crop((min_x - 5, min_y - 5, max_x + 5, max_y + 5)).convert('RGBA')
        
        # Convert blue to white and white to transparent
        newData = []
        for item in symbol.getdata():
            r, g, b, a = item
            if r > 245 and g > 245 and b > 245:
                newData.append((255, 255, 255, 0)) # Transparent background
            elif r > 130 and g > 100:
                newData.append((r, g, b, a)) # Keep gold
            else:
                newData.append((255, 255, 255, a)) # Make blue white
        symbol.putdata(newData)
        symbol.save(dest_symbol, 'PNG')
        print(f"Symbol saved to {dest_symbol}")
    else:
        print("Symbol bbox not found!")

    # 2. Crop horizontal logo (overall bounding box of all non-white pixels)
    bbox_all = []
    for x in range(w):
        for y in range(h):
            r, g, b, a = img_rgba.getpixel((x, y))
            if r < 240 or g < 240 or b < 240:
                bbox_all.append((x, y))
                
    if bbox_all:
        min_x_all = min([p[0] for p in bbox_all])
        max_x_all = max([p[0] for p in bbox_all])
        min_y_all = min([p[1] for p in bbox_all])
        max_y_all = max([p[1] for p in bbox_all])
        print(f"Horizontal box: x={min_x_all}..{max_x_all}, y={min_y_all}..{max_y_all}")
        
        # Crop horizontal logo
        horizontal = img.crop((min_x_all - 10, min_y_all - 10, max_x_all + 10, max_y_all + 10)).convert('RGBA')
        
        # Make background transparent
        newData_h = []
        for item in horizontal.getdata():
            r, g, b, a = item
            if r > 245 and g > 245 and b > 245:
                newData_h.append((255, 255, 255, 0)) # Transparent background
            else:
                newData_h.append((r, g, b, a))
        horizontal.putdata(newData_h)
        horizontal.save(dest_horizontal, 'PNG')
        print(f"Horizontal logo saved to {dest_horizontal}")
    else:
        print("Horizontal bbox not found!")

if __name__ == '__main__':
    main()
