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
            row_dict = {}
            index = 0
            for i in range(len(self.col_types)):
                if self.col_names[i].startswith("~"):
                    continue
                cell_data = type_trans(
                    data_row[i],
                    self.col_types[i]
                )
                if i == 0:
                    index = cell_data
                else:
                    row_dict[self.col_names[i]] = cell_data
            data_dict[index] = row_dict
        with open(json_path + self.table_name + '.json', 'w+', encoding='utf-8') as f:
            json.dump(data_dict, f)


