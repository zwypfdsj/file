import os
import time

path = r"C:\Users\ZWY\Desktop\rename" #可以在这里定义你需要重命名的文件路径

index = 1
for parent, dirnames, filenames in os.walk(path):
    for filename in filenames:
        #获得文件创建时间戳
        t = os.path.getmtime(os.path.join(parent, filename))
        #把时间戳转化为时间: 1479264792 to 2016-11-16 10:53
        timeStruct = time.localtime(t)
        t = time.strftime('%Y-%m-%d-%H-%M-%S', timeStruct)
        #获取文件后缀
        type = os.path.splitext(os.path.join(parent, filename))[-1]
        newName = str(t) + str(index) + str(type)
        print(filename, "---->", newName)
        #重命名
        os.rename(os.path.join(parent, filename), os.path.join(parent, newName))
        index += 1 #防止生成文件时间相同