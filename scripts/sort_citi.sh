#!/bin/bash

# 检查是否提供了足够的参数
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <input_file> <output_file>"
    exit 1
fi

# 读取输入参数
input_file=$1
output_file=$2

# 检查输入文件是否存在
if [ ! -f "$input_file" ]; then
    echo "Error: The file $input_file does not exist."
    exit 1
fi

# 使用sort命令对文件进行排序，-k2指定按照第二列排序，-o指定输出文件
sort -k2 "$input_file" -o "$output_file" -s

# ./sort_citi.sh ./codings/single.txt ../public/static/codings24.04.10.txt
# ./sort_citi.sh ./codings/words.txt ../public/static/codingsCi24.04.10.txt