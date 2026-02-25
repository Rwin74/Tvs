import os, re

root = r'c:\Users\Atakan\Desktop\tekstil tvs'
skip_dirs = {'node_modules', '.git', 'admin-panel'}

CONTACT_RIGHT = (
    '\n        <div class="header-contact-right">\n'
    '          <a href="tel:+905324770375">\n'
    '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>\n'
    '            +90 532 477 0375\n'
    '          </a>\n'
    '          <a href="mailto:ozkan@tvstekstil.com">\n'
    '            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 4 12 13 22 4"/></svg>\n'
    '            ozkan@tvstekstil.com\n'
    '          </a>\n'
    '        </div>'
)

# Pattern 1: Unwrap header-brand, keep logo link, remove header-contact block
brand_pat = re.compile(
    r'<div class="header-brand">\s*'
    r'(<a [^>]*class="logo"[^>]*>.*?</a>)'
    r'\s*<div class="header-contact">.*?</div>\s*'
    r'</div>',
    re.DOTALL
)

# Pattern 2: Insert contact-right after </nav> before </div></header>
nav_end_pat = re.compile(
    r'(</nav>)(\s*\n\s*</div>\s*\n\s*</header>)',
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

            if 'header-brand' not in c:
                print('Skip:', fn)
                continue

            nc = brand_pat.sub(r'        \1', c)
            nc = nav_end_pat.sub(r'\1' + CONTACT_RIGHT + r'\2', nc)

            if nc != c:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(nc)
                print('Updated:', fn)
            else:
                print('No change:', fn)
        except Exception as e:
            print('ERR:', fn, str(e))

print('Done.')
