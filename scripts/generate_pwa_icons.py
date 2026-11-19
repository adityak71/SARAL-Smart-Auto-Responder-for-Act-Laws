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
    # 512x512 Canvas
    fig, ax = plt.subplots(figsize=(5.12, 5.12), dpi=100)
    fig.patch.set_facecolor('none')
    ax.set_facecolor('none')
    ax.set_xlim(0, 512)
    ax.set_ylim(0, 512)
    ax.axis('off')

    # 1. Dark Indigo/Purple Squircle Background
    bg_box = FancyBboxPatch(
        (12, 12), 488, 488,
        boxstyle='round,pad=0,rounding_size=112',
        facecolor='#09031d',
        edgecolor='#7c3aed',
        linewidth=4
    )
    ax.add_patch(bg_box)

    # 2. Glowing Ambient Circle
    halo = Circle(
        (256, 280), 142,
        facecolor='#260d52',
        edgecolor='#c084fc',
        linewidth=3.5,
        alpha=0.92
    )
    ax.add_patch(halo)

    # 3. National Emblem Path (Exact Coordinates from SVG)
    # The SVG coordinates are in a 120x140 viewBox, scaled by 2, centered at x=136, y=90
    # In Matplotlib coordinate system (y=0 is bottom, y=512 is top):
    # mat_x = 136 + svg_x * 2
    # mat_y = 512 - (90 + svg_y * 2)
    def to_mat(x, y):
        return (136 + x * 2.0, 512 - (90 + y * 2.0))

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
        (0, 0) # Close
    ]

    mat_coords = [to_mat(x, y) if (x, y) != (0, 0) else (0, 0) for (x, y) in raw_coords]
    codes = [Path.MOVETO] + [Path.CURVE4] * (len(mat_coords) - 2) + [Path.CLOSEPOLY]
    emblem_path = Path(mat_coords, codes)

    patch_lions = PathPatch(emblem_path, facecolor='#c084fc', edgecolor='#e9d5ff', linewidth=1.5, alpha=0.98)
    ax.add_patch(patch_lions)

    # Center chest panel: rect 46, 32, w=28, h=16
    cx1, cy1 = to_mat(46, 32)
    cx2, cy2 = to_mat(74, 48)
    chest = Rectangle((min(cx1, cx2), min(cy1, cy2)), abs(cx2 - cx1), abs(cy2 - cy1),
                      facecolor='#a855f7', edgecolor='none', alpha=0.8)
    ax.add_patch(chest)

    # Core circle: cx=60, cy=62, r=9
    mx, my = to_mat(60, 62)
    core_circle = Circle((mx, my), 9 * 2, facecolor='#818cf8', edgecolor='#38bdf8', linewidth=1.5)
    ax.add_patch(core_circle)

    # Abacus base 1: rect 25, 98, w=70, h=9
    bx1, by1 = to_mat(25, 98)
    bx2, by2 = to_mat(95, 107)
    base1 = FancyBboxPatch((min(bx1, bx2), min(by1, by2)), abs(bx2 - bx1), abs(by2 - by1),
                           boxstyle='round,pad=0,rounding_size=3', facecolor='#38bdf8', edgecolor='none')
    ax.add_patch(base1)

    # Ashoka Chakra: cx=60, cy=115, r=7
    ch_x, ch_y = to_mat(60, 115)
    chakra = Circle((ch_x, ch_y), 7 * 2, facecolor='none', edgecolor='#38bdf8', linewidth=3)
    ax.add_patch(chakra)
    chakra_hub = Circle((ch_x, ch_y), 2.5 * 2, facecolor='#38bdf8', edgecolor='none')
    ax.add_patch(chakra_hub)

    # Lower Pedestal base 2: rect 18, 125, w=84, h=6
    px1, py1 = to_mat(18, 125)
    px2, py2 = to_mat(102, 131)
    base2 = FancyBboxPatch((min(px1, px2), min(py1, py2)), abs(px2 - px1), abs(py2 - py1),
                           boxstyle='round,pad=0,rounding_size=2', facecolor='#818cf8', edgecolor='none')
    ax.add_patch(base2)

    # 4. Clean Bold Typography
    ax.text(256, 104, 'S A R A L', color='#ffffff', fontsize=34, fontweight='bold', ha='center', va='center', fontfamily='sans-serif')
    ax.text(256, 62, 'SMART RTI COPILOT', color='#a78bfa', fontsize=12, fontweight='bold', ha='center', va='center', fontfamily='sans-serif')

    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)

    # Save master 512x512
    out_dir = os.path.join(os.getcwd(), 'public', 'icons')
    os.makedirs(out_dir, exist_ok=True)
    master_512 = os.path.join(out_dir, 'icon-512.png')
    plt.savefig(master_512, dpi=100, facecolor='none', transparent=True)
    plt.close(fig)
    print(f'Rendered {master_512}')

    # 5. Open with PIL and generate all responsive PWA sizes & favicon
    img_512 = Image.open(master_512).convert('RGBA')

    # 192x192
    img_192 = img_512.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(out_dir, 'icon-192.png'), 'PNG')
    print('Generated icon-192.png')

    # 180x180 Apple Touch Icon
    img_apple = img_512.resize((180, 180), Image.Resampling.LANCZOS)
    img_apple.save(os.path.join(out_dir, 'apple-touch-icon.png'), 'PNG')
    print('Generated apple-touch-icon.png')

    # Maskable 512 (with padding safe zone for Android circular crops)
    maskable = Image.new('RGBA', (512, 512), (9, 3, 29, 255))
    padded_content = img_512.resize((410, 410), Image.Resampling.LANCZOS)
    maskable.paste(padded_content, (51, 51), padded_content)
    maskable.save(os.path.join(out_dir, 'icon-maskable-512.png'), 'PNG')
    print('Generated icon-maskable-512.png')

    # Favicon.ico (multisize 16x16, 32x32, 48x48)
    favicon_ico = os.path.join(os.getcwd(), 'public', 'favicon.ico')
    img_512.save(favicon_ico, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    # Also in app/ for Next.js App Router default convention
    app_favicon_ico = os.path.join(os.getcwd(), 'app', 'favicon.ico')
    img_512.save(app_favicon_ico, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    print('Generated favicon.ico in public/ and app/')

    print('All PWA and favicon icons generated successfully!')

if __name__ == '__main__':
    generate_icons()
