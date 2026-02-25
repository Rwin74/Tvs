import os, re

root = r'c:\Users\Atakan\Desktop\tekstil tvs'
skip_dirs = {'node_modules', '.git', 'admin-panel'}

# Pattern: existing inline SVG emoji favicon + any other icon links
icon_pat = re.compile(
    r'<link rel="icon"[^>]*>(\s*<link rel="apple-touch-icon"[^>]*>)?',
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
            img_src = 'img/tvslogo_yeni.webp'
        else:
            img_src = rel.replace('\\', '/') + '/img/tvslogo_yeni.webp'

        new_favicon = (
            '<link rel="icon" href="{src}" type="image/webp" sizes="192x192">\n'
            '  <link rel="apple-touch-icon" href="{src}">\n'
            '  <link rel="shortcut icon" href="{src}">'
        ).format(src=img_src)

        try:
            with open(fp, 'r', encoding='utf-8') as f:
                c = f.read()

            if 'rel="icon"' in c:
                # Replace existing favicon
                nc = icon_pat.sub(new_favicon, c)
            else:
                # No favicon yet - insert before </head>
                nc = c.replace('</head>', '  ' + new_favicon + '\n</head>', 1)

            if nc != c:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(nc)
                print('Updated:', fn)
            else:
                print('No change:', fn)

        except Exception as e:
            print('ERR:', fn, str(e))

print('Done.')
