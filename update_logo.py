import os, re

root = r'c:\Users\Atakan\Desktop\tekstil tvs'
skip_dirs = {'node_modules', '.git', 'admin-panel'}

# Pattern: match existing icon/apple-touch-icon/shortcut links
# Replace with SVG favicon (white circle background)
icon_block_pat = re.compile(
    r'<link rel="icon"[^>]*>\s*<link rel="apple-touch-icon"[^>]*>\s*<link rel="shortcut icon"[^>]*>',
    re.DOTALL
)

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in skip_dirs]
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        fp = os.path.join(dirpath, fn)

        # Relative path to img folder
        rel = os.path.relpath(root, dirpath)
        if rel == '.':
            svg_src = 'img/favicon.svg'
            webp_src = 'img/tvslogo_yeni.webp'
        else:
            pref = rel.replace('\\', '/')
            svg_src = pref + '/img/favicon.svg'
            webp_src = pref + '/img/tvslogo_yeni.webp'

        new_icons = (
            '<link rel="icon" href="{svg}" type="image/svg+xml">\n'
            '  <link rel="icon" href="{webp}" type="image/webp" sizes="192x192">\n'
            '  <link rel="apple-touch-icon" href="{webp}">\n'
            '  <link rel="shortcut icon" href="{svg}">'
        ).format(svg=svg_src, webp=webp_src)

        try:
            with open(fp, 'r', encoding='utf-8') as f:
                c = f.read()

            nc = icon_block_pat.sub(new_icons, c)

            if nc != c:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(nc)
                print('Updated:', fn)
            else:
                print('No change:', fn)

        except Exception as e:
            print('ERR:', fn, str(e))

print('Done.')
