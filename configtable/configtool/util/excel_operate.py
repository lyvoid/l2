#!usr/bin/env python3
# -*- coding:utf-8 -*-

import xlrd


def data_load(excel_path):
    """
    载入excel表格的首张sheet中的数据，以list的形式给出，数据的行列数均采用首行与首列的长度来确定
    :param excel_path:excel表的路径
    :return: (table_name, table_data)
    """
    table_name = excel_path.split("\\")[-1].split(".")[0]
    table = xlrd.open_workbook(excel_path).sheets()[0]

    # 根据第一行与第一列判断表格长度
    first_row = table.row_values(0)
    first_col = table.col_values(0)
    col_num = 0
    for _ in first_row:
        if _ == "":
            break
        col_num += 1
    row_num = 0
    for _ in first_col:
        if _ == "" and row_num > 6:
            break
        row_num += 1

    # 将数据转换为list(list())的形式
    table_data = list()
    for n_row in range(row_num):
        table_data.append(table.row_values(n_row)[:col_num])
    return table_name, table_data
