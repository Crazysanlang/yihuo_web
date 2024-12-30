<template>
  <div>
    <div class="filterBox">
      <el-form ref="form" inline size="small" :model="form" label-width="100px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status" size="small" @input="handleValueChange">
            <el-radio-button label="0">未成交</el-radio-button>
            <el-radio-button label="1">已竞拍未付款</el-radio-button>
            <el-radio-button label="2">已竞拍已付款未确认</el-radio-button>
            <el-radio-button label="3">已竞拍已付款已确认收款</el-radio-button>
            <el-radio-button label="4">流拍</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left:40px;" size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <div class="tableCont">
        <el-table v-loading="loading" style="width: 100%" :data="list" element-loading-text="Loading">
          <el-table-column label="名称" align="left">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column label="描述" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.desc }}</span>
            </template>
          </el-table-column>

          <el-table-column label="卖方Id" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.seller || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="卖方昵称" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.seller_nickname || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="买方Id" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.buyer || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="买方昵称" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.buyer_nickname || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否第一次上架" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.first }}</span>
            </template>
          </el-table-column>
          <el-table-column label="图片" align="left" width="150">
            <template slot-scope="scope">
              <div style="position: relative;">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="formatUrl(scope.row.img)"
                  fit="fit"
                />
                <div class="tag">{{ genId(scope.row.nftid) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="left" width="100">
            <template slot-scope="scope">
              <span>{{ statusList[scope.row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="创建时间" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ formatTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button style="margin:0 20px;" type="text" size="small" @click="handleUpdate(scope.row)"><span>更新状态</span></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
      title="更新订单状态"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <el-form ref="form" size="small" :model="dialogForm" :rules="rules" label-width="80px">
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="dialogForm.status" placeholder="请选择">
            <el-option v-for="item in statusListArry" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>

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
import { subscriptionList, orderUpdate } from '@/api/table'
import dayjs from 'dayjs'
import { getToken } from '@/utils/auth'

export default {
  name: 'Order',
  data() {
    return {
      statusList: {
        0: '未成交',
        1: '已竞拍未付款',
        2: '已竞拍已付款未确认',
        3: '已竞拍已付款已确认收款',
        4: '流拍'
      },
      statusListArry: [
        { label: '未成交', value: 0 },
        { label: '已竞拍未付款', value: 1 },
        { label: '已竞拍已付款未确认', value: 2 },
        { label: '已竞拍已付款已确认收款', value: 3 },
        { label: '流拍', value: 4 }
      ],
      centerDialogVisible: false,
      dialogForm: {
        id: null,
        status: 0
      },
      rules: {
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      imageUrl: '',
      headers: {
        'authorization': getToken()
      },
      loading: false,
      form: {
        status: 0
      },
      list: null,
      listLoading: true,
      page: 0,
      pageSize: 10,
      total: 0
    }
  },
  watch: {
  },
  mounted() {
    this.fetchData()
  },

  methods: {
    genId(id) {
      return "HK" + ("0000" + id).slice(-5);
    },
    handleUpdate(row) {
      this.dialogForm.id = row.id
      this.dialogForm.status = row.status
      this.centerDialogVisible = true
    },
    handleConfirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm('确定操作, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            orderUpdate({ id: this.dialogForm.id, status: this.dialogForm.status }).then(() => {
              this.$message.success('操作成功！')
              this.fetchData()
              this.centerDialogVisible = false
            })
          })
        }
      })
    },
    formatUrl(url) {
      // 判断是否是https链接 是的话直接return 否的话拼接https链接
      if (url.indexOf('https') === 0) {
        return url
      } else {
        return 'https://hongkongbarter.com/' + url
      }
    },
    // 时间格式化
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
    fetchData() {
      this.loading = true
      const params = {
        status: Number(this.form.status),
        page: this.page,
        pageSize: this.pageSize
      }
      subscriptionList(params).then(response => {
        this.list = response.data.data
        this.total = response.data.count
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.tag{
  position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(90deg, #68E9FE 0%, #37CFFC 100%);
    color: rgb(0, 0, 0);
    padding: 0px 5px;
    height: 20px;
    line-height: 20px;
    border-radius:0  5px 5px 0;
    font-size: 12px;
}
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
    // ::v-deep .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    //   color: #242833
    // }
    .botInfo{
      justify-content: flex-start;
      &>div{
        flex: 1;
      }
    }
</style>

