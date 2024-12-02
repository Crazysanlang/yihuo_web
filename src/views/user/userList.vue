<template>
  <div class="listTable">
    <div class="header flexBetween">
      <div>地址</div>
      <div>邀请人</div>
      <div>是否封禁</div>
      <div>bnb积分</div>
      <div>商城积分</div>
      <div>创建时间</div>
      <div>操作</div>
    </div>
    <div class="listContent">
      <div v-for="item in list" :key="item.id" v-loading="listLoading" class="item flexBetween">
        <div>{{ item.addr }}</div>
        <div>{{ item.inviter }}</div>
        <div>
          <span v-if="item.banned === 3" style="color:#2EBD85">是</span>
          <span v-else style="color:#F6465D">否</span>
        </div>
        <div>{{ item.gold_point }}</div>
        <div>{{ item.points }}</div>

        <div>{{ formatTime(item.createdAt) }}</div>
        <div>
          <el-button type="text" @click="handelSet(item)">设置用户积分</el-button>
        </div>
      </div>
    </div>

    <div style="text-align: right;margin-top: 20px;">
      <el-pagination
        :page-size="pageSize"
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getUserList, setUserPoint } from '@/api/table'
import moment from 'moment'
export default {
  data() {
    return {
      list: null,
      page: 0,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const params = {
        page: this.page,
        pageSize: this.pageSize
      }
      getUserList(params).then(response => {
        this.list = response.data.rows
        this.total = response.data.count
        this.listLoading = false
      })
    },
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(val) {
      this.page = val === 0 ? val : val - 1
      this.fetchData()
    },
    handelSet(item) {
      this.$prompt('请输入设置的积分数量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'number',
        inputErrorMessage: '输入格式不正确'
      }).then(({ value }) => {
        setUserPoint({ uid: item.id, amount: Number(value) }).then(res => {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.fetchData()
        }).catch(() => {})
      })
    }

  }
}
</script>

<style scoped lang="scss">
  .listContent{
    height: calc(100vh - 220px);
    overflow-y: auto;
    background: #FFFFFF;
  }
  .header{
    height: 70px;
    background: #FFFFFF;
    box-shadow: 0px 2px 0px 0px rgba(0,0,0,0.06);
    border-radius: 20px 20px 0px 0px;
    div{
      flex: 1;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0,0,0,0.5);
      padding: 0 20px;

    }
  }
  .item{
    height: 70px;
    background: #FFFFFF;
    border-top:1px solid  rgba(0,0,0,0.06);
    // box-shadow: 0px 2px 0px 0px rgba(0,0,0,0.06);
    div{
      flex: 1;
      text-align: left;
      font-size: 14px;
      font-weight: 400;
      color: #242833;
        padding: 0 20px;
        box-sizing: border-box;
        word-break: break-all;
    }
  }

</style>
