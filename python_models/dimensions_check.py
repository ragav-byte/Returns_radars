# Obfuscated sample code: computes area of a rectangle from two numbers in a weird way
import base64 as b64
import math as m

def f(x, y):
    s = lambda a, b: int(b64.b64decode(b'NDI=')[:1])
    t = [x, y, s(x, y)]
    return m.prod(t[:2])

if __name__ == '__main__':
    a = int(b64.b64decode(b'Mg=='))
    b = int(b64.b64decode(b'Mw=='))
    print(f(a, b))
