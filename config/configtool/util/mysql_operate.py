#!usr/bin/env python3
# -*- coding:utf-8 -*-

from mysql import connector


class MysqlExecute:
    def __init__(self, database_params):
        self.database_name = database_params['database']
        self._conn = connector.connect(**database_params)
        self._cursor = self._conn.cursor()

    def connect(self, database_params):
        self.database_name = database_params['database']
        self._conn = connector.connect(**database_params)
        self._cursor = self._conn.cursor()

    def close(self):
        if self._cursor is not None:
            self._cursor.close()
        if self._conn is not None:
            self._conn.close()

    def insert(self, table_name, field_names, data):
        """

        :param table_name:string
        :param field_names:list or tuple
        :param data:list or tuple
        :return:插入成功返回true,失败返回false,如果存在重复主键,则进行更新操作
        """
        # 构造sql语句
        if len(field_names) == 1:
            # 防止只有一个字段的时候多出来的逗号，这里提前做一下处理
            field_names = "(`%s`)" % field_names[0]
        else:
            field_names = str(tuple(['`%s`' % _ for _ in field_names])).replace("'", "")
        # 为了防止只有一个数据的时候tuple会多出一个逗号,因此这里提前做一下处理
        data = "(%s)" % str(data[0]) if len(data) == 1 else str(tuple(data))
        sql = "replace into %s %s values %s" % (table_name, field_names, data)

        # 插入操作
        try:
            self._cursor.execute(sql)
            self._conn.commit()
            return True
        except Exception as e:
            print(e)
            print(sql)
            return False

    def insert_many(self, table_name, field_names, data, is_clear=True):
        """
        一次性插入多行数据,默认会先把数据库清空,使用需要谨慎

        :param table_name: 要插入数据的表名
        :param field_names: 要插入的数据字段名 list(string)
        :param data: 和字段名对应的数据 list(list)
        :param is_clear: 是否需要先清空表,默认清空
        :return:操作成功返回true,操作失败将返回False,同时打印错误信息
        """
        # 构造sql语句
        n = len(field_names)
        if len(field_names) == 1:
            field_names = "(`%s`)" % field_names[0]
        else:
            field_names = str(tuple(['`%s`' % _ for _ in field_names])).replace("'", "")
        sql = "replace into %s %s" % (table_name, field_names)
        sql_end = "%s," * n
        sql_end = sql_end[:-1]
        sql = sql + " values(" + sql_end + ")"
        # 清空 + 批量插入
        try:
            if is_clear:
                self._cursor.execute("delete from %s" % table_name)
            self._cursor.executemany(sql, data)
            self._conn.commit()
            return True
        except Exception as e:
            print(e)
            print(sql)
            return False

    def get_table_data(self, table_name, field_names):
        """
        获取数据表中对应字段名的数据
        :param table_name: 表名
        :param field_names: 字段名列表
        :return:返回按照字段名排序的数据
        """
        if len(field_names) == 1:
            field_names = "`%s`" % field_names[0]
        else:
            field_names = str(tuple(['`%s`' % _ for _ in field_names])).replace("'", "")
        sql = "select %s from %s" % (field_names, table_name)
        sql = sql.replace("(", "")
        sql = sql.replace(")", "")
        self._cursor.execute(sql)
        return self._cursor.fetchall()

    def delete_from(self, table_name_, **criterion):
        sql = "delete from %s where " % table_name_
        sql_end = " `%s` = '%s'     and"
        for k, v in criterion.items():
            sql += sql_end % (k, v)
        sql = sql[:-3]
        try:
            self._cursor.execute(sql)
            self._conn.commit()
        except Exception as e:
            print(e)
            print(sql)

    def select_from(self, table_name_, field_names, **criterion):
        if len(field_names) == 1:
            field_names = "`%s`" % field_names[0]
        else:
            field_names = str(tuple(['`%s`' % _ for _ in field_names])).replace("'", "")
        sql = "select %s from %s where " % (field_names, table_name_)
        sql_end = " `%s` = '%s'     and"
        for k, v in criterion.items():
            sql += sql_end % (k, v)
        sql = sql[:-3]
        self._cursor.execute(sql)
        return self._cursor.fetchall()

    def execute_custom(self, sql):
        self._cursor.execute(sql)
        self._conn.commit()

    def query_custom(self, sql):
        self._cursor.execute(sql)
        return self._cursor.fetchall()

