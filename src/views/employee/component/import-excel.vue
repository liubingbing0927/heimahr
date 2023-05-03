<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="handlechange"
        >
        <div class="drop">
          <i class="el-icon-upload" />
          <!-- 点击下载模板时，调用接口 -->
          <el-button type="text" @click="importexcel">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="handleclick">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
import { importexcel, uploadexcel } from '@/api/employee'
import FileSaver from 'file-saver'
export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async importexcel() {
      const res = await importexcel()// 二进制数据流
      FileSaver.saveAs(res, '员工下载导入模板.xlsx')
    },
    handleclick() {
      // 使type=file的input文本框点击
      this.$refs['excel-upload-input'].click()
    },
    async handlechange(event) {
      const file = event.target.files[0]
      const data = new FormData()
      data.append('file', file)
      try {
        await uploadexcel(data)
        // 上传成功以后，子传父重新渲染，并关闭弹框
        this.$emit('updatesuccess')
        this.$emit('update:showExcelDialog', false)
      } catch (e) {

      } finally {
        // 成功和失败都需要清空文件，不需要关闭弹框，直到成功为止
        this.$refs['excel-upload-input'].value = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .upload-excel {
      display: flex;
      justify-content: center;
      margin: 20px;
      width: 360px;
      height: 180px;
      align-items: center;
      color: #697086;
      .excel-upload-input {
        display: none;
        z-index: -9999;
      }
      .btn-upload,
      .drop {
        border: 1px dashed #dcdfe6;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 160px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .drop {
        line-height: 40px;
        color: #bbb;
        i {
          font-size: 60px;
          display: block;
          color: #c0c4cc;
        }
      }
    }
</style>
