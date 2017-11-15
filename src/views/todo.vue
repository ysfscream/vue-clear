<template>
  <div class="todo">
    <p v-if="!itemID">欢迎使用</p>
    <div v-if="itemID">
      <nav class="page-title">
        <div class="page-title-left">
          <span>{{ todo.title }}</span>
          <span>{{ todo.count }}</span>
        </div>
        <div class="page-title-right">
          <a @click="isLocked">
            <span>{{ todo.locked ? '解锁' : '锁定' }}</span>
          </a>
        </div>
        <div class="page-title-bottom">
          <input type="text" v-model="text" :disabled="todo.locked">
          <button type="button" name="button" @click="addItem">+</button>
        </div>
      </nav>
      <section  class="page-content">
        <div class="page-content-item" v-for="(item, index) in todoItems">
          <item
          :item="item" :locked="todo.locked"
          @updateItem="updateText"
          @deleteTodo="deleteTodo"
          @checkItem="checkItem"></item>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import item from './item';
import bus from '../bus';

export default {
  name: 'todo',
  components: {
    item,
  },
  data() {
    return {
      text: '',
      itemID: this.$route.params.id,
      todo: {},
      todoItems: [],
      checkCount: [],
    };
  },
  watch: {
    $route() {
      this.itemID = this.$route.params.id;
      if (this.itemID) {
        this.loadData();
      }
    },
    checkCount: 'updateCount',
  },
  methods: {
    loadItemsDetails() {
      return this.$http.get(`/items/${this.itemID}`);
    },
    loadTodoItems() {
      return this.$http.get(`/todoItems/?itemID=${this.itemID}`);
    },
    loadData() {
      this.$http.all([this.loadTodoItems(), this.loadItemsDetails()]).then(
        this.$http.spread((acct, perms) => {
          this.todoItems = acct.data;
          this.todo = perms.data;
          this.checkCount = this.todoItems.filter(todoitem => todoitem.checked);
        }),
      );
    },
    addItem() {
      if (!this.text) {
        return;
      }
      const newTodoItems = {
        checked: false, text: this.text, itemID: this.itemID,
      };
      this.todoItems.push(newTodoItems);
      this.$http.post('/todoItems', newTodoItems).then((res) => {
        if (res.status === 201) {
          this.text = '';
          this.loadData();
        }
      });
    },
    deleteTodo(id) {
      this.$http.delete(`/todoItems/${id}`).then((res) => {
        if (res.status === 200) {
          this.loadData();
        }
      });
    },
    checkItem(info) {
      const { id, checked } = info;
      this.$http.patch(`/todoItems/${id}?itemID=${this.itemID}`, {
        checked,
      }).then((res) => {
        if (res.status === 200) {
          this.loadData();
        }
      });
    },
    isLocked() {
      this.todo.locked = !this.todo.locked;
      this.$http.patch(`/items/${this.itemID}`, {
        locked: this.todo.locked,
      }).then((res) => {
        if (res.status === 200) {
          bus.$emit('reLoad');
        }
      });
    },
    updateText(info) {
      const { id, text } = info;
      this.$http.patch(`/todoItems/${id}?itemID=${this.itemID}`, {
        text,
      }).then((res) => {
        if (res.status === 200) {
          this.isLocked();
        }
      });
    },
    updateCount() {
      const count = this.checkCount.length;
      this.$http.patch(`/items/${this.itemID}`, {
        count,
      }).then((res) => {
        if (res.status === 200) {
          bus.$emit('reLoad');
          this.loadData();
        }
      });
    },
  },
  created() {
    if (this.itemID) {
      this.loadData();
    }
  },
};
</script>

<style lang="scss">
  .page-title {
    border: 1px solid;
  }
  .page-content {
    border: 1px solid;
    margin-top: 5px;
    height: 525px;
  }
</style>
