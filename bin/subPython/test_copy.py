import sys
import os
import time


def test(x: str = "sa", b: int = 10):
    print(x, '--', b)


def main():
    x = test(z=47, v=40)


if __name__ == '__main__':
    main()
    # os._exit(0)
