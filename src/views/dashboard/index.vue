<template>
  <div class="home">
    <div class="flexBox box2">
      <div class="leftBox">
        <div class="title">
          <span />出场总额
        </div>
        <div class="flexBox ">
          <div class="item">
            <p>{{ handleTofixed(homeData.ccze) }}</p>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="title">
          <span />出始单总额
        </div>
        <div class="flexBox">
          <div class="item">
            <p>{{ handleTofixed(homeData.csdze) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flexBox box2">
      <div class="leftBox">
        <div class="title">
          <span />复利倍增总额
        </div>
        <div class="flexBox ">
          <div class="item">
            <p>{{ handleTofixed(homeData.flbzze) }}</p>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="title">
          <span />复利倍增总额
        </div>
        <div class="flexBox">
          <div class="item">
            <p>{{ handleTofixed(homeData.sfze) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flexBox box2">
      <div class="leftBox">
        <div class="title">
          <span />新增总额
        </div>
        <div class="flexBox ">
          <div class="item">
            <p>{{ handleTofixed(homeData.xzze) }}</p>
          </div>
        </div>
      </div>
      <div class="rightBox">
        <div class="title">
          <span />认购地址总数
        </div>
        <div class="flexBox">
          <div class="item">
            <p>{{ handleTofixed(homeData.rgdzzs) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ajaxUser } from '@/api/user'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  // eslint-disable-next-line vue/order-in-components
  data() {
    return {
      homeData: {},
    }
  },
  mounted() {
    this.handleAjax()
  },
  methods: {
    handleAjax() {
      ajaxUser.tongji({}).then(res => {
        this.homeData = {
          ccze: res.data['出场总额'],
          csdze: res.data['出始单总额'],
          flbzze: res.data['复利倍增总额'],
          sfze: res.data['复利倍增总额'],
          xzze: res.data['新增总额'],
          rgdzzs: res.data['认购地址总数']
        }
      })
    },
    handleTofixed(num, digtal = 2) {
      if (!num) {
        return 0
      }
      return num
    }
  }
}
</script>

<style lang="scss" scoped>
p{
  margin: 0;
  padding: 0;
}
.flexBox{
    display: flex;
    justify-content: space-around;
    align-items: center;
    .item{
      text-align: center;
      p:first-child{
        font-size: 12px;
        color: rgba(0,0,0,0.5);
      }
      p:last-child{
        font-size: 20px;
        font-weight: bold;
        color: #242833;
        padding-top: 10px;
      }
      flex: 1;
    }
     .line{
      width: 1px;
      height: 30px;
      opacity: 0.08;
      border: 1px solid #000000;
    }
  }
.home{
  // background: #182E51;
  .title{
    font-size: 18px;
    padding-top: 20px;
    padding-bottom: 30px;
    padding-left: 20px;
    span{
      display: inline-block;
      width: 4px;
      height: 16px;
      background: #37CFFC;
      margin-right: 10px;
      border-radius: 2px;
    }
  }
  .box{
    width: 100%;
    height: 180px;
    border-radius: 10px;
    background-color: #ffffff;
    margin-bottom: 20px;

  }
  .box2{
    width: 100%;
    height: 180px;
    border-radius: 10px;
    margin-bottom: 20px;
    justify-content: space-between;
  }
  .leftBox{
    width: 49%;
    height: 180px;
    background-color: #ffffff;
    border-radius: 10px;
  }
  .rightBox{
    width: 49%;
    height: 180px;
    background-color: #ffffff;
    border-radius: 10px;
  }
}
.filter{
  padding: 0 20px;
  height: 80px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .resultTxt{
    width: 60px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #FFFFFF;
    border-radius: 5px 0px 0px 5px;
    border: 1px solid #D8DEE6;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;

  }
  .result{
    width: 180px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #F4F6F9;
    // border-radius: 5px;
    border: 1px solid #D8DEE6;
    display: inline-block;
    vertical-align: middle;
    border-left: none;
    font-size: 14px;

  }
  .searchBtn{
    width: 120px;
    height: 40px;
    background: #FABF5F;
    box-shadow: 0px 4px 10px 0px rgba(250,191,95,0.4);
    border-radius:  0px 5px 5px 0px ;
    text-align: center;
    line-height: 40px;
    color: #242833;
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;

  }
}

</style>
