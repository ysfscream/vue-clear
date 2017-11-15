<template>
  <div class="item">
    <div class="list-item">
      <input type="checkbox" v-model="item.checked" :disabled="locked" @change="checkItem">
      <input type="text" v-model="item.text" :disabled="locked" @keyup.enter="changeText">
    </div>
    <span><a @click="deleteItem(item.id)">删除</a></span>
  </div>
</template>

<script>
export default {
  name: 'item',
  props: ['item', 'locked'],
  methods: {
    checkItem() {
      const itemInfo = {
        id: this.item.id,
        checked: this.item.checked,
      };
      this.$emit('checkItem', itemInfo);
    },
    changeText() {
      const itemInfo = {
        id: this.item.id,
        text: this.item.text,
      };
      this.$emit('updateItem', itemInfo);
    },
    deleteItem(id) {
      this.$emit('deleteTodo', id);
    },
  },
};
</script>

<style lang="css">
</style>
