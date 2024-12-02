<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="require('@/assets/logo_circle.png')" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="dialogVisible = true">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="账号" prop="user">
          <el-input v-model="ruleForm.user" />
        </el-form-item>
        <el-form-item label="原密码" prop="originpass">
          <el-input v-model="ruleForm.originpass" />
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input v-model="ruleForm.newpass" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangePwd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePwd, getPriceStatus, updatePriceStatus} from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  data() {
    return {
      isCheck: false, // 开关状态
      setPrice: 0, // 自设价格
      defaultPrice: 0, // 默认价格
      dialogVisible: false,
      ruleForm: {
        user: '',
        originpass: '',
        newpass: ''
      },
      rules: {
        user: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        originpass: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newpass: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
  },
  methods: {

    handleChange(val) {
      if (val) {
        this.$prompt('请输入自设价格', '提示', {
          inputValue: this.setPrice,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          const params = {
            useMyPrice: 2,
            usdtPrice: value
          }
          updatePriceStatus(params).then(res => {
            this.$message.success('操作成功')
            this.getRemotePrice()
          })
        }).catch(() => {
          this.$message.info('已取消操作')
          this.getRemotePrice()
        })
      } else {
        this.$confirm('关闭自设价格开关，默认为币安价格？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            useMyPrice: 1,
            usdtPrice: this.setPrice
          }
          updatePriceStatus(params).then(res => {
            this.$message.success('操作成功')
            this.getRemotePrice()
          })
        }).catch(() => {
          this.$message.info('已取消操作')
          this.getRemotePrice()
        })
      }
    },
    handleShow() {
      this.dialogVisible = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleChangePwd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const params = {
            ...this.ruleForm
          }
          updatePwd(params).then(res => {
            this.$message.success('修改成功')
            this.dialogVisible = false
            this.logout()
          })
        }
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .usdtShowPrice{
    float: right;
    height: 50px;
    margin: 0 40px;
    font-size: 14px;
    display: flex;
    align-items: center;
    .el-switch{
      margin: 0 10px;
      vertical-align: middle;
      margin-top: -3px;
    }
    img{
      vertical-align: middle;
      margin-top: -3px;
      width: 20px; height: 20px;
    }
  }
}
</style>
