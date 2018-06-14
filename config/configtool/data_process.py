import util.excel_operate as eo
from type_trans import type_trans
import json


class ExcelData:
    def __init__(self, excel_path):
        self.table_name, raw_data = eo.data_load(excel_path)
        self.col_names = raw_data[0]
        self.col_types = raw_data[1]
        self.data = raw_data[2:]

    def data_process(self, json_path):
        data_dict = {}
        # type process
        for data_row in self.data:
            for i in range(len(self.col_types)):
                data_dict[self.col_names[i]] = type_trans(
                    data_row[i],
                    self.col_types[i]
                )
        with open(json_path + self.table_name + '.json', 'w+', encoding='utf-8') as f:
            json.dump(data_dict, f)


