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
@import '../assets/style/color';

.layouts {
  width: 90%;
  position: absolute;
  top: 10%;
  left: 5%;
  .left-menu {
    overflow: scroll;
    box-shadow: -8px -8px 15px rgba(0,0,0,0.2);
    background: $background-menu;
    position: absolute;
    width: 300px;
    height: 600px;
  }
  .right-content{
    height: 600px;
    margin-left: 310px;
  }

}
</style>
