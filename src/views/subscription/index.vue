<template>
  <div class="listTable">
    <div class="header flexBetween">
      <div>名称</div>
      <div>描述</div>
      <div>图片</div>
      <div>卖家</div>
      <div>价格</div>
      <div>是否第一次上架</div>
      <div>发布时间</div>
    </div>
    <div class="listContent">
      <div v-for="item in list" :key="item.id" v-loading="listLoading" class="item flexBetween">
        <div>{{ item.name }}</div>
        <div>{{ item.desc }}</div>
        <div>
          <el-image
            style="width: 100px;"
            :src="formatUrl(item.img)"
            fit="fit"
          />
        </div>
        <div>{{ item.seller || '-' }}</div>
        <div>{{ item.price }}</div>
        <div>{{ item.first }}</div>
        <div>{{ formatTime(item.opentime) }}</div>
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
import { subscriptionList } from '@/api/table'
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
    formatUrl(url) {
      // 判断是否是https链接 是的话直接return 否的话拼接https链接
      if (url.indexOf('https') === 0) {
        return url
      } else {
        return 'https://hongkongbarter.com/' + url
      }
    },
    fetchData() {
      this.listLoading = true
      const params = {
        page: this.page,
        pageSize: this.pageSize
      }
      subscriptionList(params).then(response => {
        this.list = response.data
        // this.total = response.data.count
        this.listLoading = false
      })
    },
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(val) {
      this.page = val === 0 ? val : val - 1
      this.fetchData()
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
