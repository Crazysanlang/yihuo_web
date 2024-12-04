<template>
  <div>
    <div class="filterBox">
      <el-form ref="form" inline size="small" :model="form" label-width="100px">
        <el-form-item>
          <el-button style="margin-left:40px;" size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <div style="display: flex;justify-content: flex-end;">
        <el-button icon="el-icon-plus" type="primary" @click="()=>{centerDialogVisible=true;isAdd = true}">新增</el-button>
      </div>
      <div class="tableCont">
        <el-table v-loading="loading" style="width: 100%" :data="list" element-loading-text="Loading">
          <el-table-column label="用户名" align="left">
            <template slot-scope="scope">
              {{ scope.row.user }}
            </template>
          </el-table-column>
          <!-- <el-table-column align="left" label="创建时间" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ formatTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button style="margin:0 20px;" type="danger" size="small" @click="handleDelete(scope.row)"><span>删除</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-if="false" style="text-align: right;">
      <el-pagination
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="isAdd ? '新增':'修改'"
      :visible.sync="centerDialogVisible"
      width="400px"
      :before-close="handleClose"
      center
    >
      <el-form ref="form" size="small" :model="dialogForm" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="user">
          <el-input v-model="dialogForm.user" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dialogForm.password" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAccountList, addAccount, deleteAccount } from '@/api/table'
import dayjs from 'dayjs'
import ClipboardJS from 'clipboard'
import { getToken } from '@/utils/auth'

export default {
  name: 'Order',
  data() {
    return {
      dialogListingForm: {
        id: '',
        time: ''
      },
      validList: {
        0: '未上架',
        1: '首发',
        2: '流通中',
        3: '转售中',
        4: '下架'
      },
      imageUrl: '',
      headers: {
        'authorization': getToken()
      },
      dialogForm: {
        user: '',
        password: ''
      },

      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      centerDialogVisible: false,
      isAdd: false,
      dialogVisible: false,
      rmbAmount: '',
      uPrice: 0,
      curOrderAmount: 0,
      curOrderId: '',
      loading: false,
      form: {
        valid: 0
      },
      list: null,
      listLoading: true,
      page: 0,
      pageSize: 10,
      total: 0,
      interval: null
    }
  },
  computed: {
    convertedRmbAmount() {
      return (Number(this.rmbAmount) / Number(this.uPrice)).toFixed(2)
    },
    residueAmount() {
      return Number(this.curOrderAmount) - Number(this.convertedRmbAmount)
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.rmbAmount = ''
        this.curOrderAmount = 0
        this.curOrderId = ''
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {

    handleDelete(row) {
      this.$confirm('确定删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAccount({ id: row.id }).then(() => {
          this.$message.success('操作成功！')
          this.fetchData()
        })
      })
    },

    handleClose(done) {
      this.dialogForm = {
        user: '',
        password: ''
      }
      done()
    },
    showDialog(row) {
      this.curId = row.id
      this.dialogForm = { ...row }
      this.isAdd = false
      this.imageUrl = this.formatUrl(row.img)
      this.centerDialogVisible = true
    },
    // 时间格式化
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },

    handleConfirm(row) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.dialogForm.password.length < 6) {
            this.$message.error('密码长度不能小于6位')
            return
          }
          this.$confirm(`确定${this.isAdd ? '新增' : '修改'}, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            const params = {
              ...this.dialogForm
            }
            if (this.isAdd) {
              addAccount(params).then(() => {
                this.$message.success('操作成功！')
                this.dialogForm = {
                  user: '',
                  password: ''

                }
                this.centerDialogVisible = false
                this.fetchData()
              })
            }
          })
        }
      })
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
    fetchData() {
      this.loading = true
      const params = {
        page: this.page,
        pageSize: this.pageSize
      }
      getAccountList(params).then(response => {
        this.list = response.data
        this.total = response.data.count
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
    .tableCont{
        height: calc(100vh - 150px);
    }
    .filterBox{
      width: 100%;
      height: 70px;
      background: #FFFFFF;
      border-radius: 10px;
      margin-bottom: 20px;
      display: flex;
      align-items: flex-end;
    }
    .list{
      height: calc(100vh - 220px);
      overflow-y:auto ;

      .listItem{
        // height: 130px;
        background: #FFFFFF;
        border-radius: 10px;
        padding: 20px;
        box-sizing: border-box;
        width: 100%;
        overflow-x: auto;
        margin-bottom: 20px;
      }
      .changeName{
        display: inline-block;
        cursor: pointer;
        margin-left: 10px;
        width: 60px;
        height: 24px;
        background: rgba(250,191,95,0.09);
        border-radius: 2px;
        border: 1px solid #37cffc;
        text-align: center;
        line-height: 24px;
        color: rgba(0,0,0,0.85);
        font-size: 12px;
      }
      .ppz{
        color: #37cffc;
        font-size: 14px;
        display: inline;
      }
      .maijia{

        font-size: 14px;
        display: inline;
        font-weight: 500;
      }
      .itemL{
        width: 85%;
      }
      .left{
        width:46%;
        min-width:385px;
        p{
          // padding: 0;
          // margin: 0;
          // padding-bottom: 6px;
        }
      }
      .middle{
        width:40%;
        min-width: 420px;
        box-sizing: border-box;
        padding-left: 30px;
        padding-right: 16px;
        border-left:1px solid rgba(0, 0, 0, .06);
        border-right: 1px solid rgba(0, 0, 0, .06);
        .font12{
          margin-bottom: 10px;
        }
      }
      .itemR{
        text-align: center;
      }
    }
    .gray{
      color: rgba(0,0,0,0.5);
      font-size: 12px;
      margin-right: 10px;
    }
    .font12{
      font-size: 12px;

    }
    .font16{
      font-size: 16px;

    }
    .calcle{
      padding: 0;
      margin: 0;
      width: 120px;
      height: 40px;
      background: rgba(246,70,93,0.1);
      border-radius: 5px;
      border: 1px solid #F6465D;
      text-align: center;
      line-height: 40px;
      color: #F6465D;
      margin-bottom: 10px;
      display: block;
    }
    .finish{
      padding: 0;
      margin: 0;
      width: 120px;
      height: 40px;
      background: rgba(46,189,133,0.1);
      border-radius: 5px;
      border: 1px solid #2EBD85;
      text-align: center;
      line-height: 40px;
      color: #2EBD85;
      margin-bottom: 10px;
      display: block;

    }
    .copy{
      padding: 0;
      margin: 0;
      width: 120px;
      height: 40px;
      background: rgba(250,191,95,0.09);
      border-radius: 5px;
      border: 1px solid #37cffc;
      text-align: center;
      line-height: 40px;

      margin-bottom: 10px;
      cursor: pointer;
      display: block;

    }

    .reciveOrder{
      padding: 0;
      margin: 0;
      width: 55px;
      height: 40px;
      // background: #37cffc;
      box-shadow: 0px 4px 10px 0px rgba(250,191,95,0.4);
      border-radius: 5px;
      text-align: center;
      line-height: 40px;

      font-size: 12px;
      margin-bottom: 10px;
      display: block;

    }
    .reciveOrder2{
      background: rgba(250,191,95,0.09);

      border: 1px solid #37cffc;
    }
    ::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner{
      color: #242833
    }
    .botInfo{
      justify-content: flex-start;
      &>div{
        flex: 1;
      }
    }
</style>

