<template>
  <div class="menus">
    <ul>
      <li v-for="(item, index) in items" :key="index" :class="{ 'active': item.id === todoId }">
        <a @click="gotoList(item.id)">
          <span class="locked" v-if="item.locked">
            <i class="fa fa-lock" aria-hidden="true"></i>
          </span>
          <span class="title">{{ item.title }}</span>
        </a>
        <div class="count">
          <span>{{ item.count }}</span>
        </div>
        <a class="remove" @click="removeItem(item.id)">
          <span>
            <i class="fa fa-trash-o" aria-hidden="true"></i>
          </span>
        </a>
      </li>
    </ul>
    <div class="add">
      <div class="input-text">
        <input type="text" v-model="itemsTitle" placeholder="添加你的日程" @keyup.enter="addMenu">
      </div>
      <a @click="addMenu" class="add-button">
        <i class="fa fa-plus-circle" aria-hidden="true"></i>
      </a>
    </div>
  </div>
</template>

<script>
import bus from '../bus';

export default {
  name: 'menus',
  data() {
    return {
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
    addMenu() {
      if (!this.itemsTitle) {
        return;
      }
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

<style lang="scss">

.menus {
  > ul {
    .active {
      background: #ef8189;
      box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
    }
    > li {
      &:hover {
        background: #ef8189;
        box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
      }
      > a {
        cursor: pointer;
      }
      list-style: none;
      color: white;
      font-size: 1.1rem;
      padding: 15px 10px 25px 10px;
      .locked {
        position: absolute;
        left: 20px;
      }
      .count {
        color: #ef8189;
        font-size: 0.8rem;
        line-height: 20px;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 15px #e84b56;
        text-align: center;
        background: white;
        margin: 0px 0 0 20px;
      }
      .title {
        position: absolute;
        left: 110px;
        width: 130px;
      }
      .remove {
        position: absolute;
        right: 20px;
        margin-top: -18px;
      }
    }
  }
  .add {
    text-align: center;
    color: white;
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 20px;
    .input-text {
      box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
      width: 240px;
      input {
        background-color: #ef8189;
        height: 60px;
        width: 240px;
        border: none;
        outline: none;
        padding: 8px 0;
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
    .add-button {
      position: relative;
      left: 125px;
      bottom: 40px;
    }
  }
}
</style>
