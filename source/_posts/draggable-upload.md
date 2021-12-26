---
title: draggable_upload
date: 2021-12-26 10:10:17
tags:
---
# [draggable_upload 开源库](https://github.com/zjjaxx/draggable-upload)
## 功能
- 基于vuedraggable的拖拽排序
- 原生的drag事件的拖拽上传和普通上传
- 上传3种状态
- 数量限制属性
- 对于拖拽上传accept可接收类型的校验
- 删除 预览
### jest 单元测试 覆盖率100%
### github action 持续集成
### typescipt 支持

## 已上传图片左右拖拽排序
对于以上产图片数组使用了[vuedraggable](https://github.com/SortableJS/vue.draggable.next)
```
    <!-- tag="transition-group"
      :animation="200" 
      拖拽动画,animation时长需配置，不然无动画效果 -->
    <draggable
      :list="fileList"
      tag="transition-group"
      item-key="url"
      :animation="200"
    >
    ...
    </draggable>
```
## 拖拽上传
使用了原生的drop drapover drapleave事件,   dragover.prevent阻止默认事件否则不会触发drop 
```
      <div
        class="draggalbe-container"
        :class="{ 'drag-enter-active': isDragEnter }"
        v-else
        @click="handleClick"
        @drop.prevent="handleDrop"
        @dragover.prevent="handleDragover"
        @dragleave.prevent="handleDragleave"
      >
      ...
      </div>
```
相关事件处理
```
    //文件是否被拖拽至指定区域
    const isDragEnter = ref(false);
     //处理Dragover事件
    const handleDragover = () => {
      isDragEnter.value = true;
    };
    //处理Dragleave事件
    const handleDragleave = () => {
      isDragEnter.value = false;
    };
     //处理Dragover事件
    const handleDrop = (event: { dataTransfer: { files: File[] } }) => {
      let files: File[] = Array.from(event.dataTransfer.files);
      ...
    }
```
## 对于拖拽上传accept可接收类型的校验
accept 原生属性 对于点击上传生效，但对于拖拽上传无效
```
  let files: File[] = Array.from(event.dataTransfer.files);
      // 处理原生配置的accept属性
      const accept = attrs.accept as Nullable<string>;
      if (accept) {
        // 基于原生配置的accept属性对拖拽的files文件进行过滤
        files = files.filter((file) => {
          let { type, name } = file;
          const extension =
            name.indexOf(".") > -1 ? `.${name.split(".").pop()}` : "";
          const baseType = type.replace(/\/.*$/, "");
          const flag = accept
            .split(",")
            .map((type) => type.trim())
            .filter((type) => type)
            .some((acceptedType) => {
              // 对于accept多种格式的匹配
              // 对于.png格式的校验
              if (acceptedType.startsWith(".")) {
                return extension === acceptedType;
              }
              // image/* 格式的校验
              if (/\/\*$/.test(acceptedType)) {
                return baseType === acceptedType.replace(/\/\*$/, "");
              }
              // image/jpg 格式的校验
              if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
                //jpg jpeg是同一种类型 做下兼容
                acceptedType = acceptedType.replace("jpg", "jpeg");
                type = type.replace("jpg", "jpeg");
                return type === acceptedType;
              }
              return false;
            });
          if (!flag) {
            console.warn(`不支持${extension}类型的文件`);
          }
          return flag;
        });
      }
```

## 原生属性 accept multiple
``` <input
        ref="inputRef"
        class="input"
        type="file"
        v-bind="$attrs"
        @change="handleChange"
      />
  ...
  inheritAttrs: false,
```