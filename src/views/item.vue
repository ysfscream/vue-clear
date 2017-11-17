<template>
  <div class="item">
    <div class="list-item">
      <a href="#" @click="checkItem">
        <i v-if="!item.checked" class="fa fa-check-circle-o" aria-hidden="true"></i>
        <i v-else class="fa fa-check-circle" aria-hidden="true"></i>
      </a>
      <input class="list-item-input" :class="{ 'checked': item.checked === true }"
       type="text" v-model="item.text" :disabled="locked" @keyup.enter="changeText"
       placeholder="输入修改你的待办事项...">
    </div>
    <span class="list-item-delete">
      <a @click="deleteItem(item.id)">
        <i v-if="!locked" class="fa fa-minus-circle" aria-hidden="true"></i>
      </a>
    </span>
  </div>
</template>

<script>
export default {
  name: 'item',
  props: ['item', 'locked'],
  methods: {
    checkItem() {
      if (this.locked) {
        return;
      }
      this.item.checked = !this.item.checked;
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

<style lang="scss">
  .item {
    height: 80px;
    background: #f9f6f0;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
    a {
      color: #999c9d;
      padding-left: 10px;
      padding-right: 10px;
      font-size: 1.3rem;
    }
    .checked {
      text-decoration: line-through;
    }
    .list-item-input {
      height: 70px;
      width: 80%;
      background: #f9f6f0;
      outline: none;
      font-size: 1.2rem;
      color: #747e8f;
      border: none;
      padding-top: 15px;
    }
    .list-item-delete {
      position: relative;
      left: 90%;
      bottom: 45px;
      a {
        cursor: pointer;
        color: #999c9d;
        font-size: 1.6rem;
      }
    }
  }
</style>
