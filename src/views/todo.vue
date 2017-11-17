<template>
  <div class="todo">
    <div class="welcome-word" v-if="!itemID">
      <p>👉 欢迎使用 👈</p>
      <p>🎉 简洁好看 🎉</p>
      <p>👏 方便好用 👏</p>
      <p>😄 点击左侧 😄</p>
    </div>
    <div v-if="itemID">
      <nav class="page-title">
        <div class="page-title-left todo-title">
          <span>{{ todo.title }}</span>
          <div class="todo-count">
            <span>{{ checkCount.length }}</span>
          </div>
        </div>
        <div class="page-title-right">
          <a @click="isLocked">
            <span>
              <i v-if="todo.locked" class="fa fa-lock" aria-hidden="true"></i>
              <i v-else class="fa fa-unlock" aria-hidden="true"></i>
            </span>
          </a>
        </div>
        <div class="page-title-bottom">
          <input type="text" v-model="text" :disabled="todo.locked" placeholder="解锁后才能添加">
          <a @click="addItem">
            <i class="fa fa-plus" aria-hidden="true"></i>
          </a>
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
  .welcome-word {
    text-align: center;
    font-weight: 600;
    font-size: 3rem;
    letter-spacing: 10px;
    color: #747e8f;
    box-shadow: 0px 0px 20px rgba(0,0,0,0.2);
    height: 600px;
    position: relative;
    bottom: 50px;
    p {
      padding-top: 30px;
    }
  }
  .page-title {
    height: 140px;
    background: #54cec3;
    box-shadow: 8px 8px 0px #b3e9e4;
    .page-title-left {
      font-size: 2rem;
      color: white;
      font-weight: 400;
      letter-spacing: 5px;
    }
    .todo-title {
      position: relative;
      left: 5%;
      top: 10px;
      .todo-count {
        height: 35px;
        width: 35px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid white;
        box-shadow: 0px 0px 20px rgba(0,0,0,0.2);
        background: white;
        color: #54cec3;
        font-size: 1.6rem;
        position: absolute;
        top: 5px;
        left: 140px;
        span {
          line-height: 30px;
        }
      }
    }
    .page-title-right {
      position: relative;
      left: 85%;
      color: white;
      font-size: 2.5rem;
      a {
        cursor: pointer;
      }
    }
    .page-title-bottom {
      color: white;
      height: 50px;
      margin-top: -20px;
      background-color: #a0e4dd;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
      width: 50%;
      a {
        cursor: pointer;
      }
      input {
        height: 50px;
        background-color: #a0e4dd;
        width: 90%;
        border: none;
        outline: none;
        font-size: 1rem;
        font-weight: 300;
        text-align: center;
        letter-spacing: 1px;
        color: white;
      }
      input::-webkit-input-placeholder {
        color: white;
      }
      input:-moz-placeholder {
        color: white;
      }
    }
  }
  .page-content {
    border: 1px solid #f4ede1;
    margin-top: 30px;
    height: 430px;
    background: #f4ede1;
    box-shadow: 5px 5px 10px #eee8e2;
    overflow: scroll;
  }
</style>
