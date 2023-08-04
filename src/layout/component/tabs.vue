<template>
  <div class="multiple-page-control-group">
    <div class="multiple-page-control-content">
      <div class="multiple-page-control-content-inner">
        <contextmenu :visible.sync="contextmenuFlag" :x="contentmenuX" :y="contentmenuY">
          <contextmenu-list :menulist="tagName === 'index' ? contextmenuListIndex : contextmenuList" @rowClick="contextmenuClick" />
        </contextmenu>
        <el-tabs
          class="multiple-page-control"
          :value="current"
          type="card"
          @tab-click="handleClick"
          @edit="handleTabsEdit"
          @contextmenu.native="handleContextmenu"
        >
          <el-tab-pane v-for="(page, index) in opened" :key="index" :label="page.title || '未命名'" :name="page.name" :closable="!page.fixed" />
        </el-tabs>
      </div>
    </div>
    <div class="multiple-page-control-btn">
      <el-dropdown size="default" split-button @click="handleControlBtnClick" @command="(command) => handleControlItemClick(command)">
        删除
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="left">
            <i class="el-icon-arrow-left cheng-mr-10" />
            关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="right">
            <i class="el-icon-arrow-right cheng-mr-10" />
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="other">
            <i class="el-icon-finished cheng-mr-10" />
            关闭其它
          </el-dropdown-item>
          <el-dropdown-item command="all">
            <i class="el-icon-finished cheng-mr-10" />
            全部关闭
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Contextmenu: () => import("./contextmenu"),
    ContextmenuList: () => import("./contextmenu/components/contentmenuList"),
  },
  data() {
    return {
      contextmenuFlag: false,
      contentmenuX: 0,
      contentmenuY: 0,
      contextmenuListIndex: [{ icon: "times-circle", title: "关闭全部", value: "all" }],
      contextmenuList: [
        { icon: "arrow-left", title: "关闭左侧", value: "left" },
        { icon: "arrow-right", title: "关闭右侧", value: "right" },
        { icon: "times", title: "关闭其它", value: "other" },
        { icon: "times-circle", title: "关闭全部", value: "all" },
      ],
      tagName: "index",
    };
  },
  computed: {
    ...mapState("page", ["opened", "current"]),
  },
  methods: {
    ...mapActions("page", ["close", "closeLeft", "closeRight", "closeOther", "closeAll"]),
    /**
     * @description 右键菜单功能点击
     */
    handleContextmenu(event) {
      let target = event.target;
      // 解决 https://github.com/projects/admin/issues/54
      let flag = false;
      if (target.className.indexOf("el-tabs__item") > -1) flag = true;
      else if (target.parentNode.className.indexOf("el-tabs__item") > -1) {
        target = target.parentNode;
        flag = true;
      }
      if (flag) {
        event.preventDefault();
        event.stopPropagation();
        this.contentmenuX = event.clientX;
        this.contentmenuY = event.clientY;
        this.tagName = target.getAttribute("aria-controls").slice(5);
        this.contextmenuFlag = true;
      }
    },
    /**
     * @description 右键菜单的row-click事件
     */
    contextmenuClick(command) {
      this.handleControlItemClick(command, this.tagName);
    },
    /**
     * @description 接收点击关闭控制上选项的事件
     */
    handleControlItemClick(command, tagName = null) {
      if (tagName) {
        this.contextmenuFlag = false;
      }
      const params = {
        pageSelect: tagName,
        vm: this,
      };
      switch (command) {
        case "left":
          this.closeLeft(params);
          break;
        case "right":
          this.closeRight(params);
          break;
        case "other":
          this.closeOther(params);
          break;
        case "all":
          this.closeAll(this);
          break;
        default:
          this.$message.error("无效的操作");
          break;
      }
    },
    /**
     * @description 接收点击关闭控制上按钮的事件
     */
    handleControlBtnClick() {
      this.closeAll(this);
    },
    /**
     * @description 接收点击 tab 标签的事件
     */
    // eslint-disable-next-line no-unused-vars
    handleClick(tab, event) {
      // 找到点击的页面在 tag 列表里是哪个
      const page = this.opened.find((page) => page.name === tab.name);
      const { name, route } = page;
      if (page) {
        this.$router.push({ name, params: route.params, query: route.query });
      }
    },
    /**
     * @description 点击 tab 上的删除按钮触发这里 首页的删除按钮已经隐藏 因此这里不用判断是 index
     */
    handleTabsEdit(tagName, action) {
      if (action === "remove") {
        this.close({
          tagName,
          vm: this,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// 多页面控制器
.multiple-page-control-group {
  display: flex;
  .multiple-page-control-content {
    flex: 1;
    overflow: auto;
    position: relative;
    .multiple-page-control-content-inner {
      .multiple-page-control {
        .el-tabs__header.is-top {
          margin: 0px;
        }
        .el-tabs__nav {
          overflow: hidden;
        }
      }
    }
  }
  .multiple-page-control-btn {
    position: relative;
    ::v-deep .el-dropdown {
      .el-button-group {
        .el-button:first-child {
          border-bottom-left-radius: 0px;
        }
        .el-button:last-child {
          border-bottom-right-radius: 0px;
        }
      }
    }
  }
}
</style>
