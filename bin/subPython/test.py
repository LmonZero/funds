
import sys
import os
import time

a = {
    'x': "xxxx",
    '123': 'sss'
}


def main():
    print(str('123') in a)
    for i in range(1):
        print('arg--', sys.argv)
        print('ok!!!!!')
        print(os.getpid())
        print(os.getppid())
        # sys.stdout.write(sys.stdin.read())
        time.sleep(150)


if __name__ == '__main__':
    main()
    # os._exit(0)
