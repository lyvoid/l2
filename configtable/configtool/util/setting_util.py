#!usr/bin/env python3
# -*- coding:utf-8 -*-

import configparser


class Setting:
    def __init__(self, setting_path, encoding='utf-8'):
        self._setting_path = setting_path
        self.setting = dict()
        cf = configparser.ConfigParser()
        cf.read(setting_path, encoding=encoding)
        self._cf = cf
        for section_name in cf:
            self.setting[section_name] = dict()
            for k, v in cf.items(section_name):
                self.setting[section_name][str(k)] = str(v)

    def add_setting(self, section_name, content, encoding='utf-8'):
        self._cf.add_section(section_name)
        for k, v in content.items():
            self._cf.set(section_name, str(k), str(v))
        self._cf.write(open(self._setting_path, "w", encoding=encoding))
        self.setting[section_name] = content
