import util.file_operate as fo
import re
import os
import sys
from data_process import ExcelData

if len(sys.argv) > 1:
    excel_path = sys.argv[1]
    json_path = sys.argv[2]
else:
    excel_path = '../xlsx'
    json_path = '../../resource/json_config/'
root = fo.get_child_path(excel_path)
excel_names_raw = os.listdir(root)
excel_paths = list()
for name in excel_names_raw:
    if re.match(r'^\w+\.xlsx$', name):
        excel_paths.append(root + '/' + name)
for path in excel_paths:
    data_dict = ExcelData(path).data_process(json_path)
