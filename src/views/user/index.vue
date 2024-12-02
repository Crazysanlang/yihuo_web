<template>
  <div>
    <div class="" style="padding-top: 10px;">
      <el-form ref="form" inline size="small" :model="form" label-width="100px">
        <el-form-item label="会员ID">
          <el-input v-model="form.id" clearable />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="form.certif" size="small" @input="handleValueChange">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="2">待审核</el-radio-button>
            <el-radio-button label="3">已审核</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left:40px" size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
          <!-- <el-button @click="onCancel"></el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="tableCont">
      <el-table v-loading="listLoading" size="small" height="100%" :data="list" element-loading-text="Loading">
        <el-table-column label="会员ID" align="left">
          <template slot-scope="scope">
            {{ scope.row.invitecode }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="left">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="left" width="100">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column label="身份证号" align="left" width="150">
          <template slot-scope="scope">
            {{ scope.row.cardid }}
          </template>
        </el-table-column>
        <el-table-column label="身份证照片" align="left" width="150">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cardimg"
              :preview-src-list="[scope.row.cardimg]"
              :fit="fit"
            />
          </template>
        </el-table-column>
        <el-table-column label="提成" align="left">
          <template slot-scope="scope">
            {{ scope.row.commission }}
          </template>
        </el-table-column>
        <el-table-column label="冻结金额" align="left">
          <template slot-scope="scope">
            {{ scope.row.freeze }}
          </template>
        </el-table-column>
        <el-table-column label="余额" align="left" width="150">
          <template slot-scope="scope">
            {{ scope.row.usdtbal }}
          </template>
        </el-table-column>
        <el-table-column label="推荐人" align="left">
          <template slot-scope="scope">
            {{ scope.row.recommendid }}
          </template>
        </el-table-column>
        <el-table-column label="是否实名认证" align="left" width="100">
          <template slot-scope="scope">
            {{ scope.row.certif === 3 ? '是':'否' }}
          </template>
        </el-table-column>
        <el-table-column align="left" label="订单创建时间" width="150">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ formatTime(scope.row.ctime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDialog(scope.row)">设置提成</el-button>
            <el-button v-if="scope.row.certif !==3" type="text" size="small" @click="handleAudit(scope.row)">认证审核</el-button>
            <el-button v-else type="text" size="small" @click="handleCancle(scope.row)">取消审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: right;">
      <el-pagination
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      title="设置会员佣金权益提成"
      :visible.sync="centerDialogVisible"
      width="40%"
      center
    >
      <el-radio-group v-model="commission">
        <!-- 0 , 0.3 , 0.4, 0.5, 0.6 -->
        <el-radio :label="0">0</el-radio>
        <el-radio :label="0.3">0.3</el-radio>
        <el-radio :label="0.4">0.4</el-radio>
        <el-radio :label="0.5">0.5</el-radio>
        <el-radio :label="0.6">0.6</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, setCommission, userAudit } from '@/api/table'
import dayjs from 'dayjs'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      form: {
        id: '',
        certif: ''
      },
      list: null,
      listLoading: true,
      page: 0,
      pageSize: 10,
      total: 0,
      centerDialogVisible: false,
      commission: 0,
      curId: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleAudit(row) {
      this.$confirm(`该操作将通过实名认证审核, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        userAudit({ id: row.invitecode, certif: 3 }).then(() => {
          this.$message.success('操作成功！')
          this.fetchData()
        })
      })
    },
    handleCancle(row) {
      this.$confirm(`该操作将取消实名认证审核, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userAudit({ id: row.invitecode, certif: 1 }).then(() => {
          this.$message.success('操作成功！')
          this.fetchData()
        })
      })
    },
    handleConfirm() {
      this.$confirm(`将该用户的佣金权益提成设置为${this.commission}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setCommission({ id: this.curId, commission: this.commission }).then(() => {
          this.$message.success('操作成功！')
          this.centerDialogVisible = false
          this.fetchData()
        })
      })
    },
    showDialog(row) {
      this.curId = row.invitecode
      this.commission = row.commission
      this.centerDialogVisible = true
    },
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(val) {
      this.page = val === 0 ? val : val - 1
      this.fetchData()
    },
    handleValueChange(e) {
      this.fetchData()
    },
    onSubmit() {
      this.fetchData()
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    fetchData() {
      this.listLoading = true
      const params = {
        page: this.page,
        pageSize: this.pageSize
      }
      if (this.form.id) {
        params.filtered = { invitecode: this.form.id }
      }
      if (this.form.certif) {
        params.filtered = { certif: this.form.certif }
      }
      getUserList(params).then(response => {
        this.list = response.data.data
        this.total = response.data.count
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
    .tableCont{
        height: calc(100vh - 150px);
    }
</style>

