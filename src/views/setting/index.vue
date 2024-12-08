<template>
  <div class="container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm">
      <el-form-item label="给上级返点的百分比" prop="point_persent">
        <el-input v-model="ruleForm.point_persent" placeholder="请输入给上级返点的百分比">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item label="预约的抵押金" prop="diyajin">
        <el-input v-model="ruleForm.diyajin" placeholder="请输入预约的抵押金" />
      </el-form-item>
      <el-form-item label="设置提前预约" prop="yuyuetime">
        <el-input v-model="ruleForm.yuyuetime" placeholder="请输入提前多久可以预约的分钟数">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="开盘时间" required>
        <el-form-item prop="opentime">
          <el-time-picker v-model="valueTime" format="HH:mm" value-format="HH:mm" placeholder="选择时间" style="width: 100%;" />
        </el-form-item>
      </el-form-item>
      <el-form-item label="封盘时间" required>
        <el-form-item prop="stoptime">
          <el-time-picker v-model="stopValueTime" format="HH:mm" value-format="HH:mm" placeholder="选择时间" style="width: 100%;" />
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { setting, getsettings } from '@/api/table'
export default {
  data() {
    return {
      valueTime: '',
      stopValueTime: '',
      ruleForm: {
        point_persent: '',
        diyajin: '',
        yuyuetime: '',
        opentimeOrigin: '',
        stoptimeOrigin: ''
      },
      rules: {
        point_persent: [
          { required: true, message: '请输入上级返点百分比', trigger: 'blur' }
        ],
        diyajin: [
          { required: true, message: '请输入预约的抵押金', trigger: 'blur' }
        ],
        yuyuetime: [
          { required: true, message: '请输入提前预约的分钟数', trigger: 'blur' }
        ],
        opentimeOrigin: [
          { required: true, message: '请选择开盘时间', trigger: 'change' }
        ],
        stoptimeOrigin: [
          { required: true, message: '请选择封盘时间', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'valueTime': function(newVal) {
      if (newVal) {
        this.ruleForm.opentimeOrigin = newVal
      } else {
        this.ruleForm.opentimeOrigin = ''
      }
    },
    'stopValueTime': function(newVal) {
      if (newVal) {
        this.ruleForm.stoptimeOrigin = newVal
      } else {
        this.ruleForm.stoptimeOrigin = ''
      }
    }
  },
  mounted() {
    this.querySetting()
  },
  methods: {
    setTimeFromString(timeString) {
      const [hours, minutes] = timeString.split(':').map(Number)
      const time = dayjs().hour(hours).minute(minutes).second(0).millisecond(0)
      this.valueTime = time.format('HH:mm')
      this.ruleForm.opentimeOrigin = time.format('HH:mm')
    },
    setTimeFromString2(timeString) {
      const [hours, minutes] = timeString.split(':').map(Number)
      const time = dayjs().hour(hours).minute(minutes).second(0).millisecond(0)
      this.stopValueTime = time.format('HH:mm')
      this.ruleForm.stoptimeOrigin = time.format('HH:mm')
    },
    querySetting() {
      getsettings({}).then((res) => {
        this.ruleForm = res.data
        const tt = `${Math.floor(res.data.opentime / 3600)}:${Math.floor((res.data.opentime % 3600) / 60)}`
        const tt2 = `${Math.floor(res.data.stoptime / 3600)}:${Math.floor((res.data.stoptime % 3600) / 60)}`
        this.setTimeFromString(tt)
        this.setTimeFromString2(tt2)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { opentimeOrigin, stoptimeOrigin } = this.ruleForm
          // 把opentimeOrigin时间转换为秒数
          const [hours, minutes] = opentimeOrigin.split(':').map(Number)
          const seconds = hours * 3600 + minutes * 60
          const [hours2, minutes2] = stoptimeOrigin.split(':').map(Number)
          const seconds2 = hours2 * 3600 + minutes2 * 60
          const params = {
            point_persent: Number(this.ruleForm.point_persent),
            diyajin: Number(this.ruleForm.diyajin),
            yuyuetime: Number(this.ruleForm.yuyuetime),
            opentime: seconds,
            stoptime: seconds2
          }
          delete params.opentimeOrigin
          delete params.stoptimeOrigin
          setting(params).then((res) => {
            this.$message.success('操作成功')
            this.querySetting()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang='scss'>
.container{
  width: 600px;
}
</style>
