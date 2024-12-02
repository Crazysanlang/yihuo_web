<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
  .flexBetween{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .searchBtn{
    width: 120px;
    height: 40px;
    background: #37cffc;
    box-shadow: 0px 4px 10px 0px rgba(250,191,95,0.4);
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
    color: #242833;
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
  }

</style>
