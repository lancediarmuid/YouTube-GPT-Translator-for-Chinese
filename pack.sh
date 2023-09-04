#!/bin/bash

# 检查dist文件夹是否存在
if [ ! -d "dist" ]; then
    echo "dist文件夹不存在"
    exit 1
fi

# 创建dist.zip文件
zip -r dist.zip dist

echo "成功创建dist.zip文件"
