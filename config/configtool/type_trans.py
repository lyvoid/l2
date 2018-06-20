import functools
import re

_type_trans_funcs = {}
_re_check_0_0 = re.compile(r"^\d+\.0$")


def type_trans(data, data_type):
    return _type_trans_funcs[data_type](data)


def _add_to_trans_funcs(name):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(data):
            if "[]" in name:
                data = _trans_str(data)
            return func(data)

        _type_trans_funcs[name] = wrapper
        return wrapper
    return decorator


@_add_to_trans_funcs('str')
def _trans_str(data):
    data = str(data)
    if _re_check_0_0.match(data):
        data = str(int(float(data)))
    return data


@_add_to_trans_funcs('int')
def _trans_num(data):
    if data == '':
        return 0
    data = int(data)
    return data


@_add_to_trans_funcs('float')
def _trans_num(data):
    if data == '':
        return 0.0
    data = float(data)
    return data


@_add_to_trans_funcs('bool')
def _trans_bool(data):
    if data == '':
        return False
    data = bool(data)
    return data


@_add_to_trans_funcs('int[]')
def _trans_num_ls(data):
    if data == '':
        return []
    data = [int(x) for x in data.split(',')]
    return data


@_add_to_trans_funcs('float[]')
def _trans_num_ls(data):
    if data == '':
        return []
    data = [float(x) for x in data.split(',')]
    return data


@_add_to_trans_funcs('str[]')
def _trans_str_ls(data):
    if data == '':
        return []
    data = [str(x) for x in data.split(',')]
    return data
