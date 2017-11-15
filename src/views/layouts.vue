<template>
  <div class="layouts">
    <section class="left-menu">
      <menus></menus>
    </section>
    <section class="right-content">
      <todo></todo>
    </section>
  </div>
</template>

<script>
import Menus from './menus';
import Todo from './todo';

export default {
  name: 'layouts',
  components: {
    Menus,
    Todo,
  },
};
</script>

<style lang="scss">
.layouts {
  width: 80%;
  margin: 60px;
  .left-menu {
    position: absolute;
    border: 1px solid;
    width: 250px;
    height: 600px;
  }
  .right-content{
    border: 1px solid;
    height: 600px;
    margin-left: 260px;
  }

}
</style>
