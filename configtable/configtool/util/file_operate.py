#!usr/bin/env python3
# -*- coding:utf-8 -*-

import os
from urllib import request
import pickle


# 获取目录下的n重目录的绝对目录
def get_child_path(root, *args):
    path = os.path.abspath(root)
    for name in args:
        path = os.path.join(path, name)
    return path


# 获取当前目录下的子目录路径
def get_child_path_below(*args):
    return get_child_path(".", *args)


# 创建新目录
def mk_dir(dir_name):
    current_path = os.path.abspath(".")
    path = os.path.join(current_path, dir_name)
    if os.path.exists(path=path):
        pass
    else:
        os.makedirs(path)
    return path


# 在当前目录下创建一个目录
def mk_dir_below(dir_name):
    return mk_dir(os.path.join(os.path.abspath('.'), dir_name))


# 保存网络图片
def save_image_from_url(url, path, name):
    img_type = url.split(".").pop()
    if len(img_type) > 3:
        img_type = "jpg"
    file_name = name + "." + img_type
    file_name = os.path.join(path, file_name)
    with request.urlopen(url, timeout=2) as f_url:
        data = f_url.read()
        with open(file_name, 'wb') as f_save:
            f_save.write(data)


# 将当前数据dump到指定文件中
def save_dump(data, path):
    with open(path, 'wb') as f:
        pickle.dump(data, f)
    return path


# 将本地文件dump数据读取出来
def read_dump(path):
    with open(path, 'rb') as f:
        return pickle.load(f)


# 写入文件
def write(path, content, encoding='utf-8'):
    with open(path, 'w', encoding=encoding) as f:
        f.write(content)
    return path


# 追加写入
def add_line(path, line, encoding='utf-8'):
    with open(path, 'a+', encoding=encoding) as f:
        f.write(line + "\n")
    return path


# 读取固定字节，并处理
def read_fix_bit_operate(file_name, n=1, operate=print):
    file_object = open(file_name, 'rb')
    try:
        while True:
            chunk = file_object.read(n)
            if not chunk:
                break
            operate(chunk)
    finally:
        file_object.close()


# 看一下文件是否存在，不存在的话就创建一下
def create_no_exist_file(file_name):
    if not os.path.exists(file_name):
        with open(file_name, "a") as _:
            pass

