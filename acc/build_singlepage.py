import os

INDEX_FILE = 'index.html'
OUT_FILE = 'fuel_calc_single_page.html'

JS_INJECTION_LINE = '<script type="text/javascript">'
JS_FILE = os.path.join('js', 'main.js')

CSS_INJECTION_LINE = '<link rel="stylesheet" href="res/style.css">'
CSS_FILE = os.path.join('res', 'style.css')

LINES_TO_REMOVE = ['<link rel="icon" href="res/favicon.ico">', '<link rel="icon" type="image/png" href="res/icon.png">']


def read_file_content(file: str):
    with open(file, 'r') as f:
        return f.read()


def create_single_page_lines() -> list:
    index_lines = list()
    with open(INDEX_FILE, 'r') as i:
        index_lines:list = i.readlines()

    if not index_lines:
        return list()

    # Find lines to replace/inject at
    js_injection_index, css_injection_index = 0, 0
    for idx, line in enumerate(index_lines):
        if JS_INJECTION_LINE in line:
            js_injection_index = idx
        if CSS_INJECTION_LINE in line:
            css_injection_index = idx

    # Inject js file content
    index_lines.insert(js_injection_index + 1, read_file_content(JS_FILE))
    # Inject css file content
    index_lines.insert(css_injection_index + 2, 
        '<style type="text/css">\n' + read_file_content(CSS_FILE) + '\n</style>'
        )
    
    # Remove lines
    index_lines.pop(js_injection_index - 1)
    index_lines.pop(css_injection_index)

    for rem_line in LINES_TO_REMOVE:
        for line in index_lines:
            if rem_line in line:
                index_lines.remove(line)

    index_lines.insert(0, '<!-- Auto generated single file self-contained html page -->\n')
    return index_lines


if __name__ == '__main__':
    sinlge_page_lines = create_single_page_lines()

    if os.path.exists(OUT_FILE):
        os.remove(OUT_FILE)

    with open(OUT_FILE, 'w') as f:
        f.writelines(sinlge_page_lines)

    print('Successfully generated self-contained html.')
