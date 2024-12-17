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
      <el-form-item label="最多能认购几单" prop="diyajin">
        <el-input v-model="ruleForm.max_buy_amount" placeholder="请输入最多能认购几单" />
      </el-form-item>
      <el-form-item label="设置提前预约" prop="yuyuetime">
        <el-input v-model="ruleForm.yuyuetime" placeholder="请输入提前多久可以预约的分钟数">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="开盘时间" required>
        <el-form-item prop="opentime">
          <el-date-picker
            v-model="valueTime"
            type="datetime"
            placeholder="选择开盘时间"
            value-format="timestamp"
            align="right"
          />
        </el-form-item>
      </el-form-item>
      <el-form-item label="封盘时间" required>
        <el-form-item prop="stoptime">
          <el-date-picker
            v-model="stopValueTime"
            type="datetime"
            placeholder="选择封盘时间"
            value-format="timestamp"
            align="right"
          />
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
        stoptimeOrigin: '',
        max_buy_amount: ''
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
        max_buy_amount: [
          { required: true, message: '请输入最多能认购几单', trigger: 'blur' }
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
    querySetting() {
      getsettings({}).then((res) => {
        const { opentime, stoptime } = res.data
        this.ruleForm = res.data
        this.valueTime = dayjs(opentime * 1000).valueOf()
        this.stopValueTime = dayjs(stoptime * 1000).valueOf()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { opentimeOrigin, stoptimeOrigin } = this.ruleForm
          const seconds = dayjs(opentimeOrigin).unix()
          const seconds2 = dayjs(stoptimeOrigin).unix()
          const params = {
            point_persent: Number(this.ruleForm.point_persent),
            diyajin: Number(this.ruleForm.diyajin),
            yuyuetime: Number(this.ruleForm.yuyuetime),
            max_buy_amount: Number(this.ruleForm.max_buy_amount),
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
