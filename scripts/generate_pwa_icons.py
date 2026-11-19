import os
import sys

# Ensure matplotlib uses a writable temp config directory
os.environ['MPLCONFIGDIR'] = os.path.join(os.environ.get('TEMP', '.'), 'mpl_cache')

import matplotlib
import matplotlib.pyplot as plt
from matplotlib.patches import PathPatch, FancyBboxPatch, Circle, Rectangle
from matplotlib.path import Path
from PIL import Image

def generate_icons():
    # 512x512 Canvas for High-DPI Master
    fig, ax = plt.subplots(figsize=(5.12, 5.12), dpi=100)
    fig.patch.set_facecolor('none')
    ax.set_facecolor('none')
    ax.set_xlim(0, 512)
    ax.set_ylim(0, 512)
    ax.axis('off')

    # 1. Dark Navy Squircle Background
    bg = FancyBboxPatch(
        (8, 8), 496, 496,
        boxstyle='round,pad=0,rounding_size=108',
        facecolor='#0d062e',
        edgecolor='#818cf8',
        linewidth=8
    )
    ax.add_patch(bg)

    # 2. Glowing Inner Border (Cyan/Indigo)
    inner_border = FancyBboxPatch(
        (16, 16), 480, 480,
        boxstyle='round,pad=0,rounding_size=100',
        facecolor='none',
        edgecolor='#9333ea',
        linewidth=3,
        alpha=0.65
    )
    ax.add_patch(inner_border)

    # 3. National Emblem Path (Exact Coordinates from SVG)
    # The SVG coordinates are in a 120x140 viewBox, scaled by 2.75, centered at (ox, oy)
    scale = 2.75
    ox = (512 - 120 * scale) / 2
    oy = 64

    def to_mat(x, y):
        return (ox + x * scale, 512 - (oy + y * scale))

    raw_coords = [
        (60, 4),
        (56, 4), (48, 10), (44, 14),
        (40, 18), (42, 24), (38, 27),
        (34, 30), (28, 32), (28, 38),
        (28, 44), (34, 47), (36, 53),
        (38, 59), (34, 65), (37, 70),
        (40, 75), (48, 76), (52, 82),
        (56, 88), (56, 94), (60, 94),
        (64, 94), (64, 88), (68, 82),
        (72, 76), (80, 75), (83, 70),
        (86, 65), (82, 59), (84, 53),
        (86, 47), (92, 44), (92, 38),
        (92, 32), (86, 30), (82, 27),
        (78, 24), (80, 18), (76, 14),
        (72, 10), (64, 4), (60, 4),
        (0, 0)
    ]
    mat_coords = [to_mat(x, y) if (x, y) != (0, 0) else (0, 0) for (x, y) in raw_coords]
    codes = [Path.MOVETO] + [Path.CURVE4] * (len(mat_coords) - 2) + [Path.CLOSEPOLY]
    emblem_path = Path(mat_coords, codes)

    # Lions crest: SOLID HIGH-CONTRAST WHITE
    lions = PathPatch(emblem_path, facecolor='#ffffff', edgecolor='#f8fafc', linewidth=2, alpha=1.0)
    ax.add_patch(lions)

    # Chest panel: Crisp silver-white for 3D depth
    cx1, cy1 = to_mat(46, 32)
    cx2, cy2 = to_mat(74, 48)
    chest = Rectangle((min(cx1, cx2), min(cy1, cy2)), abs(cx2 - cx1), abs(cy2 - cy1),
                      facecolor='#cbd5e1', edgecolor='none')
    ax.add_patch(chest)

    # Core circle: Solid White
    mx, my = to_mat(60, 62)
    core = Circle((mx, my), 9 * scale, facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1.5)
    ax.add_patch(core)

    # Abacus base: Solid White
    bx1, by1 = to_mat(25, 98)
    bx2, by2 = to_mat(95, 107)
    base1 = FancyBboxPatch((min(bx1, bx2), min(by1, by2)), abs(bx2 - bx1), abs(by2 - by1),
                           boxstyle='round,pad=0,rounding_size=4', facecolor='#ffffff', edgecolor='none')
    ax.add_patch(base1)

    # Ashoka Chakra: Cyan outline with dark center and cyan hub
    ch_x, ch_y = to_mat(60, 115)
    chakra_bg = Circle((ch_x, ch_y), 7 * scale, facecolor='#0d062e', edgecolor='#38bdf8', linewidth=3)
    ax.add_patch(chakra_bg)
    chakra_hub = Circle((ch_x, ch_y), 2.5 * scale, facecolor='#38bdf8', edgecolor='none')
    ax.add_patch(chakra_hub)

    # Lower Pedestal base: Solid White
    px1, py1 = to_mat(18, 125)
    px2, py2 = to_mat(102, 131)
    base2 = FancyBboxPatch((min(px1, px2), min(py1, py2)), abs(px2 - px1), abs(py2 - py1),
                           boxstyle='round,pad=0,rounding_size=3', facecolor='#ffffff', edgecolor='none')
    ax.add_patch(base2)

    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)

    # Save master 512x512
    out_dir = os.path.join(os.getcwd(), 'public', 'icons')
    os.makedirs(out_dir, exist_ok=True)
    master_512 = os.path.join(out_dir, 'icon-512.png')
    plt.savefig(master_512, dpi=100, facecolor='none', transparent=True)
    plt.close(fig)
    print(f'Rendered {master_512}')

    # 4. Open with PIL and generate all responsive PWA sizes & favicon
    img_512 = Image.open(master_512).convert('RGBA')

    # 256x256 (Windows standard shortcut icon)
    img_256 = img_512.resize((256, 256), Image.Resampling.LANCZOS)
    img_256.save(os.path.join(out_dir, 'icon-256.png'), 'PNG')
    print('Generated icon-256.png')

    # 192x192 (Android standard launcher icon)
    img_192 = img_512.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(out_dir, 'icon-192.png'), 'PNG')
    print('Generated icon-192.png')

    # 128x128
    img_128 = img_512.resize((128, 128), Image.Resampling.LANCZOS)
    img_128.save(os.path.join(out_dir, 'icon-128.png'), 'PNG')
    print('Generated icon-128.png')

    # 48x48 (Windows small taskbar / desktop icon)
    img_48 = img_512.resize((48, 48), Image.Resampling.LANCZOS)
    img_48.save(os.path.join(out_dir, 'icon-48.png'), 'PNG')
    print('Generated icon-48.png')

    # 180x180 Apple Touch Icon
    img_apple = img_512.resize((180, 180), Image.Resampling.LANCZOS)
    img_apple.save(os.path.join(out_dir, 'apple-touch-icon.png'), 'PNG')
    print('Generated apple-touch-icon.png')

    # Maskable 512 (with padding safe zone for Android circular adaptive icons)
    maskable = Image.new('RGBA', (512, 512), (13, 6, 46, 255))
    padded_content = img_512.resize((410, 410), Image.Resampling.LANCZOS)
    maskable.paste(padded_content, (51, 51), padded_content)
    maskable.save(os.path.join(out_dir, 'icon-maskable-512.png'), 'PNG')
    print('Generated icon-maskable-512.png')

    # Windows multi-size ICO: 16, 24, 32, 48, 64, 128, 256
    ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    favicon_ico = os.path.join(os.getcwd(), 'public', 'favicon.ico')
    img_512.save(favicon_ico, format='ICO', sizes=ico_sizes)

    # Also in app/ for Next.js App Router default convention
    app_favicon_ico = os.path.join(os.getcwd(), 'app', 'favicon.ico')
    img_512.save(app_favicon_ico, format='ICO', sizes=ico_sizes)

    # Dedicated icons/icon.ico for Windows PWA shortcuts
    icon_ico = os.path.join(out_dir, 'icon.ico')
    img_512.save(icon_ico, format='ICO', sizes=ico_sizes)
    print('Generated multi-res favicon.ico and icon.ico (16 to 256px)')

    # 5. Write matching SVG icons for web & PWA
    svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f0728" />
      <stop offset="100%" stop-color="#08031d" />
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9333ea" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>

  <!-- Background Squircle -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)" />
  <rect x="8" y="8" width="496" height="496" rx="100" fill="none" stroke="url(#borderGrad)" stroke-width="8" opacity="0.9" />

  <!-- National Emblem of India (Centered & High-Contrast Pure White) -->
  <g transform="translate(91, 64) scale(2.75)">
    <!-- Lions Crest -->
    <path
      d="M60 4C56 4 48 10 44 14C40 18 42 24 38 27C34 30 28 32 28 38C28 44 34 47 36 53C38 59 34 65 37 70C40 75 48 76 52 82C56 88 56 94 60 94C64 94 64 88 68 82C72 76 80 75 83 70C86 65 82 59 84 53C86 47 92 44 92 38C92 32 86 30 82 27C78 24 80 18 76 14C72 10 64 4 60 4Z"
      fill="#ffffff"
    />
    <!-- Chest Plate -->
    <path d="M46 32H74V48H46z" fill="#cbd5e1" />
    <!-- Core Circle -->
    <circle cx="60" cy="62" r="9" fill="#ffffff" />
    <!-- Abacus Bar -->
    <rect x="25" y="98" width="70" height="9" rx="2" fill="#ffffff" />
    <!-- Ashoka Chakra -->
    <circle cx="60" cy="115" r="7" fill="#0d062e" stroke="#38bdf8" stroke-width="2" />
    <circle cx="60" cy="115" r="2.5" fill="#38bdf8" />
    <!-- Pedestal Base -->
    <rect x="18" y="125" width="84" height="6" rx="2" fill="#ffffff" />
  </g>
</svg>'''

    for svg_path in [
        os.path.join(os.getcwd(), 'app', 'icon.svg'),
        os.path.join(os.getcwd(), 'public', 'favicon.svg'),
        os.path.join(os.getcwd(), 'public', 'icons', 'icon.svg')
    ]:
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        print(f'Wrote SVG to {svg_path}')

    print('All crisp PWA and favicon icons generated successfully!')

if __name__ == '__main__':
    generate_icons()
