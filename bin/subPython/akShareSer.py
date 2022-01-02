from akShareSer.worker import worker
# os.getppid() 这个是当前进程主进程ID  os.getpid()但前进程ID


def main():
    workers = worker()
    workers.init()
    while True:
        pass


if __name__ == "__main__":
    main()
