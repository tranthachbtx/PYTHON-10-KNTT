
import os

path = r'd:\GITHUB\PYTHON 10 KNTT\web\content\lessons'
cp1252_map = {
    '\u20ac': 0x80, '\u201a': 0x82, '\u0192': 0x83, '\u201e': 0x84, '\u2026': 0x85,
    '\u2020': 0x86, '\u2021': 0x87, '\u02c6': 0x88, '\u2030': 0x89, '\u0160': 0x8a,
    '\u2039': 0x8b, '\u0152': 0x8c, '\u017d': 0x8e, '\u2018': 0x91, '\u2019': 0x92,
    '\u201c': 0x93, '\u201d': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
    '\u02dc': 0x98, '\u2122': 0x99, '\u0161': 0x9a, '\u203a': 0x9b, '\u0153': 0x9c,
    '\u017e': 0x9e, '\u0178': 0x9f
}

def fix_mojibake(content):
    out_bytes = bytearray()
    for char in content:
        if char in cp1252_map:
            out_bytes.append(cp1252_map[char])
        else:
            cp = ord(char)
            if cp < 256:
                out_bytes.append(cp)
            else:
                out_bytes.extend(char.encode('utf-8'))
    return out_bytes.decode('utf-8')

for f in os.listdir(path):
    if f.endswith('.mdx'):
        full_path = os.path.join(path, f)
        print(f"Checking {f}...")
        try:
            with open(full_path, 'r', encoding='utf-8-sig') as file:
                content = file.read()
            
            # Simple heuristic for mojibake: frequent occurrence of characters that are often part of misinterpreted UTF-8
            if 'Ã' in content or 'Â' in content or 'á' in content and 'º' in content: 
                print(f"  Fixing {f}...")
                fixed = fix_mojibake(content)
                with open(full_path, 'w', encoding='utf-8') as file:
                    file.write(fixed)
        except Exception as e:
            print(f"  Error fixing {f}: {e}")
