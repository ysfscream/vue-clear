<template>
  <div class="menus">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <a @click="gotoList(item.id)" :class="{ 'active': item.id === todoId }">
          <span v-if="item.locked">🔐</span>
          <span>{{ item.title }}</span>
        </a>
        <span>{{ item.count }}</span>
        <a @click="removeItem(item.id)">
          <span>删除</span>
        </a>
      </li>
    </ul>
    <input type="text" v-model="itemsTitle" :disabled="disabled" @keyup.enter="addMenu">
    <button type="button" name="button" @click="addMenuInput">填写</button>
  </div>
</template>

<script>
import bus from '../bus';

export default {
  name: 'menus',
  data() {
    return {
      disabled: true,
      itemsTitle: '',
      items: [],
      todoId: '',
    };
  },
  watch: {
    todoId(id) {
      this.$router.push({ name: 'todo', params: { id } });
    },
  },
  methods: {
    loadItems() {
      this.$http.get('/items').then((res) => {
        if (res.status === 200) {
          this.items = res.data;
        }
      });
    },
    addMenuInput() {
      this.disabled = false;
    },
    addMenu() {
      this.$http.post('/items', {
        title: this.itemsTitle,
        locked: false,
        count: 0,
      }).then((res) => {
        if (res.status === 201) {
          this.loadItems();
          this.todoId = res.data.id;
          this.itemsTitle = '';
          this.disabled = true;
        }
      });
    },
    removeItem(id) {
      const itemID = id;
      this.$http.delete(`/items/${itemID}`).then((res) => {
        if (res.status === 200) {
          this.todoId = this.items[0].id;
          this.loadItems();
        }
      });
    },
    gotoList(id) {
      this.todoId = id;
    },
  },
  created() {
    this.loadItems();
  },
  mounted() {
    bus.$on('reLoad', () => {
      this.loadItems();
    });
  },
};
</script>

<style lang="css">
.active {
  border: 1px solid;
}
</style>
