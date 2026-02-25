import os, re

root = r'c:\Users\Atakan\Desktop\tekstil tvs'
skip_dirs = {'node_modules', '.git', 'admin-panel'}

# Match the full icon block we set previously
icon_block_pat = re.compile(
    r'<link rel="icon"[^>]*>\s*<link rel="icon"[^>]*>\s*<link rel="apple-touch-icon"[^>]*>\s*<link rel="shortcut icon"[^>]*>',
    re.DOTALL
)

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in skip_dirs]
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        fp = os.path.join(dirpath, fn)

        rel = os.path.relpath(root, dirpath)
        if rel == '.':
            pref = ''
        else:
            pref = rel.replace('\\', '/') + '/'

        png_src = pref + 'img/favicon.png'

        new_icons = (
            '<link rel="icon" href="{png}" type="image/png" sizes="512x512">\n'
            '  <link rel="apple-touch-icon" href="{png}">\n'
            '  <link rel="shortcut icon" href="{png}">'
        ).format(png=png_src)

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
