import os, re

root = r'c:\Users\Atakan\Desktop\tekstil tvs'
skip_dirs = {'node_modules', '.git', 'admin-panel'}

# Pattern: <div class="logo-text">TVS<span>T E K S T İ L</span></div>
logo_pat = re.compile(
    r'<div class="logo-text">\s*TVS\s*<span>T E K S T [İI] L</span>\s*</div>',
    re.DOTALL
)

# Pattern: about-circle with TVS text
circle_pat = re.compile(
    r'<div class="about-circle">\s*<div class="about-circle-title">TVS</div>\s*<div class="about-circle-subtitle">T E K S T [İI] L</div>\s*</div>',
    re.DOTALL
)

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in skip_dirs]
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        fp = os.path.join(dirpath, fn)

        # Relative path from the HTML file's dir to the img folder
        rel = os.path.relpath(root, dirpath)
        if rel == '.':
            img_src = 'img/tvslogo_yeni.webp'
        else:
            img_src = rel.replace('\\', '/') + '/img/tvslogo_yeni.webp'

        try:
            with open(fp, 'r', encoding='utf-8') as f:
                c = f.read()

            # Replace header logo text with img tag
            logo_img = '<img src="{}" alt="TVS Tekstil" class="site-logo" style="height:54px;width:auto;display:block;">'.format(img_src)
            nc = logo_pat.sub(logo_img, c)

            # Replace about-circle text logo with img (only root-level pages)
            if 'about-circle' in nc:
                circle_img = '<div class="about-circle"><img src="img/tvslogo_yeni.webp" alt="TVS Tekstil" style="width:130px;height:auto;object-fit:contain;padding:15px;"></div>'
                nc = circle_pat.sub(circle_img, nc)

            if nc != c:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(nc)
                print('Updated:', fn)
            else:
                print('No change:', fn)

        except Exception as e:
            print('ERR:', fn, str(e))

print('Done.')
