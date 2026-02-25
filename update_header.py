import os, re

root = r'c:\Users\Atakan\Desktop\tekstil tvs'
skip_dirs = {'node_modules', '.git', 'admin-panel'}

# Remove orphan </div> between header-contact-right closing and mobile-menu-toggle button
orphan_pat = re.compile(
    r'(</div>)\s*\n(\s*</div>)(\s*\n\s*<button class="mobile-menu-toggle")',
    re.DOTALL
)

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in skip_dirs]
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        fp = os.path.join(dirpath, fn)
        try:
            with open(fp, 'r', encoding='utf-8') as f:
                c = f.read()
            nc = orphan_pat.sub(r'\1\3', c)
            if nc != c:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(nc)
                print('Fixed:', fn)
            else:
                print('Skip:', fn)
        except Exception as e:
            print('ERR:', fn, str(e))
print('Done.')
