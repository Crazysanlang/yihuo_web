<template>
  <div>
    <div class="filterBox">
      <el-form ref="form" inline size="small" :model="form" label-width="100px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.valid" size="small" @input="handleValueChange">
            <el-radio-button label="0">未上架</el-radio-button>
            <el-radio-button label="1">首发</el-radio-button>
            <el-radio-button label="2">流通中</el-radio-button>
            <el-radio-button label="3">转售中</el-radio-button>
            <el-radio-button label="4">下架</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left:40px;" size="small" type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <div style="display: flex;justify-content: space-between;">
        <div>
          <el-button type="success" @click="handleBat">合并NFT</el-button>
          <el-button type="primary" @click="handleBatListing">批量上架</el-button>
          <el-button type="primary" @click="handleBatxiajia">批量下架</el-button>
        </div>
        <el-button icon="el-icon-plus" type="primary" @click="handleAddDialog">新增</el-button>
      </div>
      <div class="tableCont">
        <el-table v-loading="loading" style="width: 100%" :data="list" element-loading-text="Loading" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="订单昵称" align="left">
            <template slot-scope="scope">
              {{ scope.row.nickname }}
            </template>
          </el-table-column>
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
          <el-table-column label="图片" align="left" width="150">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="formatUrl(scope.row.img)"
                fit="fit"
              />
            </template>
          </el-table-column>
          <el-table-column label="状态" align="left" width="80">
            <template slot-scope="scope">
              <span>{{ validList[scope.row.valid] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="form.valid == 3" label="是否缴纳上架费" align="center" width="120px">
            <template slot-scope="scope">
              <el-tag :type="scope.row.ischarge ? 'success' : 'danger'" effect="plain">
                {{ scope.row.ischarge ? '已缴纳' : '未缴纳' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="left" label="创建时间" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ formatTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="更新时间" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time" />
              <span>{{ formatTime(scope.row.updatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="180"
          >
            <template slot-scope="scope">
              <el-button style="margin:0 auto;" type="text" size="small" @click="showDialog(scope.row)"><span>修改</span></el-button>
              <el-button style="margin:0 5px;" type="text" size="small" @click="handleDelete(scope.row)"><span>删除</span></el-button>
              <el-button style="margin:0 5px;" type="text" size="small" @click="handleListing(scope.row)"><span>上架</span></el-button>
              <el-button type="text" size="small" @click="handleSplit(scope.row)"><span>拆分</span></el-button>
              <el-button type="text" size="small" @click="handleTransfer(scope.row)"><span>转让</span></el-button>
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
      title="上架"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div class="block">
        <el-date-picker
          v-model="dialogListingForm.time"
          type="date"
          placeholder="选择日期"
          value-format="timestamp"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleListingConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle + 'NFT'"
      :visible.sync="centerDialogVisible"
      width="400px"
      :before-close="handleClose"
      center
    >
      <el-form ref="form" size="small" :model="dialogForm" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialogForm.name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="dialogForm.desc" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="dialogForm.price" />
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <el-upload
            class="avatar-uploader"
            action="https://hongkongbarter.com/admin/upload"
            :show-file-list="false"
            :headers="headers"
            name="img"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="拆分NFT"
      :visible.sync="splitDialogVisible"
      width="600px"
      :before-close="handleClose"
      center
      append-to-body
    >
      <div>
        <div style="font-size: 16px;color: #303133;margin-bottom: 20px;">NFT信息</div>
        <div style="color: #606266;font-size: 14px;margin-bottom: 20px;">昵称：{{ showDialogInfo.nickname }}</div>
        <div style="color: #606266;font-size: 14px;margin-bottom: 20px;">单号：{{ showDialogInfo.id }}</div>
        <div style="color: #606266;font-size: 14px;margin-bottom: 20px;">价格：{{ showDialogInfo.price }}</div>
      </div>
      <el-form ref="splitForm" size="small" :model="splitDialogForm" :rules="rules" label-width="100px">
        <el-form-item label="拆分数量" prop="count">
          <el-input v-model="splitDialogForm.count" disabled />
        </el-form-item>
        <el-form-item label="第一份价格" prop="splitPriceFirst">
          <el-input v-model="splitDialogForm.splitPriceFirst" />
        </el-form-item>
        <el-form-item label="第二份价格" prop="splitPriceSec">
          <el-input v-model="splitDialogForm.splitPriceSec" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="splitDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirmSplit">确定拆分</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, addNft, deleteNft, updateNft, listingNft, splitNft, mergeNft, batListing, batchxiadan, transferNft } from '@/api/table'
import dayjs from 'dayjs'
import ClipboardJS from 'clipboard'
import { getToken } from '@/utils/auth'
import calc from 'calculatorjs'

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
        name: '',
        desc: '',
        price: '',
        img: ''
      },
      splitDialogForm: {
        id: '',
        count: 2,
        splitPrice: '',
        splitPriceFirst: '',
        splitPriceSec: ''
      },

      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        img: [
          { required: true }
        ],
        count: [
          { required: true, message: '请输入拆分数量', trigger: 'blur' }
        ],
        splitPriceFirst: [
          { required: true, message: '请输入第一份拆分价格', trigger: 'blur' }
        ],
        splitPriceSec: [
          { required: true, message: '请输入第二份拆分价格', trigger: 'blur' }
        ]
      },
      centerDialogVisible: false,
      splitDialogVisible: false,
      showDialogInfo: {},
      multipleSelection: [],
      isAdd: false,
      isEdit: false,
      isBat: false,
      dialogTitle: '',
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
    },
    'splitDialogForm.splitPriceFirst': function() {
      this.splitDialogForm.splitPriceSec = calc.sub(Number(this.splitDialogForm.splitPrice), Number(this.splitDialogForm.splitPriceFirst))
    }
  },
  mounted() {
    this.fetchData()
  },
  destroyed() {
    clearInterval(this.interval)
  },
  methods: {
    handleBatListing() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('请选择需要上架的NFT')
        return
      }
      this.$confirm('确定批量上架, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection
        batListing({ ids }).then(() => {
          this.$message.success('上架成功！')
          this.fetchData()
        })
      })
    },
    handleBatxiajia() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('请选择需要下架的NFT')
        return
      }
      this.$confirm('确定批量下架, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection
        batchxiadan({ ids }).then(() => {
          this.$message.success('下架成功')
          this.fetchData()
        })
      })
    },
    handleBat() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('请选择需要合并的NFT')
        return
      }
      this.dialogTitle = '合并'
      this.isAdd = false
      this.isEdit = false
      this.isBat = true
      this.centerDialogVisible = true
      this.dialogForm.price = this.totalPrice
    },
    handleSelectionChange(val) {
      console.log('🚀 ~ handleSelectionChange ~ val:', val)
      this.multipleSelection = val.map(item => item.id)
      this.totalPrice = val.reduce((pre, next) => calc.add(pre, next.price), 0)
    },
    handleSplit(row) {
      this.splitDialogVisible = true
      this.splitDialogForm.id = row.id
      this.splitDialogForm.splitPrice = row.price
      this.showDialogInfo = row
    },
    handleConfirmSplit() {
      this.$refs.splitForm.validate(valid => {
        if (valid) {
          const { count, splitPriceFirst, splitPriceSec } = this.splitDialogForm
          // const prices = Array.from({ length: Number(count) }, (v, i) => Number(splitPrice))
          const prices = [Number(splitPriceFirst), Number(splitPriceSec)]
          const params = {
            id: this.splitDialogForm.id,
            prices: prices
          }
          splitNft(params).then(() => {
            this.$message.success('拆分成功！')
            this.fetchData()
          })
        }
      })
    },
    handleListingConfirm() {
      const { id, time } = this.dialogListingForm
      if (!time) {
        this.$message.error('请选择上架时间')
        return
      }
      listingNft({ id: id, opentime: new Date(time) }).then(() => {
        this.$message.success('上架成功！')
        this.fetchData()
        this.dialogVisible = false
      })
    },
    handleListing(row) {
      this.dialogListingForm.id = row.id
      this.dialogListingForm.time = dayjs().valueOf()
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNft({ id: row.id }).then(() => {
          this.$message.success('操作成功！')
          this.fetchData()
        })
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      if (res.code == 200) {
        this.dialogForm.img = res.filename
      } else {
        this.$message.error('图片filename获取失败')
      }
    },
    handleClose(done) {
      this.dialogForm = {
        title: '',
        content: '',
        publishTime: '',
        visibility: true
      }
      this.showDialogInfo = {}
      done()
    },
    handleAddDialog() {
      this.centerDialogVisible = true
      this.isAdd = true
      this.isEdit = false
      this.isBat = false
      this.dislogTitle = '新增'
    },
    showDialog(row) {
      this.curId = row.id
      this.dialogForm = { ...row }
      this.isAdd = false
      this.isEdit = true
      this.isBat = false
      this.dislogTitle = '编辑'
      this.imageUrl = this.formatUrl(row.img)
      this.centerDialogVisible = true
    },
    handleCopy(item, index) {
      const clipboard1 = new ClipboardJS('#copyBtn' + index)
      console.log(clipboard1)
      clipboard1.on('success', (e) => {
        this.$message.success('复制成功')
        e.clearSelection()
      })
      setTimeout(() => {
        this.fetchData()
      }, 800)
    },
    // 时间格式化
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleTransfer(row) {
      this.$prompt('转让NFT', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        inputValidator: (value) => {
          if (!value) return false
        },
        inputErrorMessage: '请输入转让人的用户ID'
      }).then(({ value }) => {
        transferNft({ nft_id: row.id, user_id: Number(value) }).then(() => {
          this.$message.success('操作成功！')
          this.fetchData()
        })
      })
    },
    handleConfirm(row) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isAdd || this.isEdit) {
            this.$confirm(`确定${this.isAdd ? '新增' : '修改'}, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              const params = {
                ...this.dialogForm,
                price: Number(this.dialogForm.price)
              }
              if (this.isAdd) {
                addNft(params).then(() => {
                  this.$message.success('操作成功！')
                  this.dialogForm = {
                    name: '',
                    desc: '',
                    price: '',
                    img: ''
                  }
                  this.centerDialogVisible = false
                  this.fetchData()
                })
              }
              if (this.isEdit) {
                updateNft(params).then(() => {
                  this.$message.success('操作成功！')
                  this.dialogForm = {
                    name: '',
                    desc: '',
                    price: '',
                    img: ''
                  }
                  this.centerDialogVisible = false
                  this.fetchData()
                })
              }
            })
          }
          if (this.isBat) {
            this.$confirm(`确定合并, 是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              const params = {
                ...this.dialogForm,
                ids: this.multipleSelection
              }
              mergeNft(params).then(() => {
                this.$message.success('操作成功！')
                this.dialogForm = {
                  name: '',
                  desc: '',
                  price: '',
                  img: ''
                }
                this.centerDialogVisible = false
                this.fetchData()
              })
            })
          }
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
        valid: Number(this.form.valid),
        page: this.page,
        pageSize: this.pageSize
      }
      getList(params).then(response => {
        this.list = response.data.rows
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

