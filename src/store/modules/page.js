import { remove, get, cloneDeep } from "lodash";
import utils from "@/libs/utils";

// 设置文件
import setting from "@/config/setting.js";

export default {
  namespaced: true,
  state: {
    // 当前显示的多页面列表
    opened: [...setting.page.opened],
    // 当前页面
    current: "",
    // 需要缓存的页面 name
    keepAlive: [],
  },
  actions: {
    /**
     * @class opened
     * @description 从持久化数据载入分页列表
     * @param {Object} state vuex state
     */
    // eslint-disable-next-line no-unused-vars
    openedLoad({ state, commit, dispatch }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // store 赋值
        const value = utils.storage.get("opened", setting.page.opened);
        // 在处理函数中进行数据优化 过滤掉现在已经失效的页签或者已经改变了信息的页签
        // 以 name 字段为准
        // 如果页面过多的话可能需要优化算法
        // valid 有效列表 1, 1, 0, 1 => 有效, 有效, 失效, 有效
        const valid = [];
        // 处理数据
        state.opened = value.map((opened) => {
          // 忽略首页
          if (opened.name === "Home") {
            valid.push(1);
            return opened;
          }
          return Object.assign({}, opened);
        });
        // 根据 opened 数据生成缓存设置
        commit("keepAliveRefresh");
        // end
        resolve();
      });
    },
    /**
     * 将 opened 属性赋值并持久化 在这之前请先确保已经更新了 state.opened
     * @param {Object} state vuex state
     */
    // eslint-disable-next-line no-unused-vars
    opend2db({ state, dispatch }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // 设置数据
        utils.storage.set("opened", state.opened);
        resolve();
      });
    },
    /**
     * @class opened
     * @description 更新页面列表上的某一项
     * @param {Object} state vuex state
     * @param {Object} param { index, params, query } 路由信息
     */
    // eslint-disable-next-line no-unused-vars
    openedUpdate({ state, commit, dispatch }, { index, route }) {
      const { params, query } = route;
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // 更新页面列表某一项
        let page = state.opened[index];
        page.route.params = params || page.route.params;
        page.route.query = query || page.route.query;
        state.opened.splice(index, 1, page);
        // 增加缓存设置
        commit("keepAlivePush", page.name);
        // 持久化
        await dispatch("opend2db");
        // end
        resolve();
      });
    },
    /**
     * @class opened
     * @description 新增一个 tag (打开一个页面)
     * @param {Object} state vuex state
     * @param {Object} param new tag info
     */
    // eslint-disable-next-line no-unused-vars
    add({ state, commit, dispatch }, { name, route, title }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // 使用 lodash 的 cloneDeep 函数深拷贝 this.$route 对象
        const clonedRoute = cloneDeep(route);

        // 删除不需要的属性
        delete clonedRoute.matched;
        delete clonedRoute.redirectedFrom;
        // 设置新的 tag 在新打开一个以前没打开过的页面时使用
        let newTag = {};
        newTag.name = name;
        newTag.route = cloneDeep(clonedRoute);
        newTag.title = title;
        // 添加进当前显示的页面数组
        state.opened.push(newTag);
        // 如果这个页面需要缓存 将其添加到缓存设置
        if (get(newTag, "route.meta.keepalive", false)) {
          commit("keepAlivePush", name);
        }
        // 持久化
        await dispatch("opend2db");
        // end
        resolve();
      });
    },
    /**
     * @class current
     * @description 打开一个新的页面
     * @param {Object} state vuex state
     * @param {Object} param { name, params, query } 路由信息
     */
    open({ state, commit, dispatch }, route) {
      let { name } = route;
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // 已经打开的页面
        let opened = state.opened;
        // 判断此页面是否已经打开 并且记录位置
        let pageOpendIndex = 0;
        const pageOpend = opened.find((page, index) => {
          const same = page.name === name;
          pageOpendIndex = same ? index : pageOpendIndex;
          return same;
        });
        if (pageOpend) {
          // 页面以前打开过 但是新的页面可能 name 一样，参数不一样
          await dispatch("openedUpdate", {
            index: pageOpendIndex,
            route,
          });
        } else {
          // 页面以前没有打开过
          await dispatch("add", {
            name: route.name,
            route,
            title: route.meta?.title || route.name,
          });
        }
        commit("currentSet", name);
        // end
        resolve();
      });
    },
    /**
     * @class opened
     * @description 关闭一个 tag (关闭一个页面)
     * @param {Object} state vuex state
     * @param {Object} param { tagName: 要关闭的标签名字, vm: vue }
     */
    // eslint-disable-next-line no-unused-vars
    close({ state, commit, dispatch }, { tagName, vm }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // 下个新的页面
        let newPage = state.opened[0];
        const isCurrent = state.current === tagName;
        // 如果关闭的页面就是当前显示的页面
        if (isCurrent) {
          // 去找一个新的页面
          let len = state.opened.length;
          for (let i = 1; i < len; i++) {
            if (state.opened[i].name === tagName) {
              if (i < len - 1) {
                newPage = state.opened[i + 1];
              } else {
                newPage = state.opened[i - 1];
              }
              break;
            }
          }
        }
        // 找到这个页面在已经打开的数据里是第几个
        const index = state.opened.findIndex((page) => page.name === tagName);
        if (index >= 0) {
          // 更新数据 删除关闭的页面
          state.opened.splice(index, 1);
          // 如果这个页面是缓存的页面 将其在缓存设置中删除
          commit("keepAliveRemove", tagName);
        }
        // 持久化
        await dispatch("opend2db");
        // 最后需要判断是否需要跳到首页
        if (isCurrent) {
          const { name = "", params = {}, query = {} } = newPage;
          let routerObj = {
            name,
            params,
            query,
          };
          vm.$router.push(routerObj);
        }
        // end
        resolve();
      });
    },
    /**
     * @class opened
     * @description 关闭当前标签左边的标签
     * @param {Object} state vuex state
     * @param {Object} param { pageSelect: 当前选中的tagName, vm: vue }
     */
    closeLeft({ state, commit, dispatch }, { pageSelect, vm } = {}) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const pageAim = pageSelect || state.current;
        let currentIndex = 0;
        state.opened.forEach((page, index) => {
          if (page.name === pageAim) {
            currentIndex = index;
          }
        });
        if (currentIndex > 0) {
          // 删除打开的页面 并在缓存设置中删除
          state.opened.splice(1, currentIndex - 1).forEach(({ name }) => commit("keepAliveRemove", name));
        }
        state.current = pageAim;
        if (vm && vm.$route.name !== pageAim) {
          vm.$router.push({
            name: pageAim,
          });
        }
        // 持久化
        await dispatch("opend2db");
        // end
        resolve();
      });
    },
    /**
     * @class opened
     * @description 关闭当前标签右边的标签
     * @param {Object} state vuex state
     * @param {Object} param { pageSelect: 当前选中的tagName, vm: vue }
     */
    closeRight({ state, commit, dispatch }, { pageSelect, vm } = {}) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const pageAim = pageSelect || state.current;
        let currentIndex = 0;
        state.opened.forEach((page, index) => {
          if (page.name === pageAim) {
            currentIndex = index;
          }
        });
        // 删除打开的页面 并在缓存设置中删除
        state.opened.splice(currentIndex + 1).forEach(({ name }) => commit("keepAliveRemove", name));
        // 设置当前的页面
        state.current = pageAim;
        if (vm && vm.$route.name !== pageAim) {
          vm.$router.push({
            name: pageAim,
          });
        }
        // 持久化
        await dispatch("opend2db");
        // end
        resolve();
      });
    },
    /**
     * @class opened
     * @description 关闭当前激活之外的 tag
     * @param {Object} state vuex state
     * @param {Object} param { pageSelect: 当前选中的tagName, vm: vue }
     */
    closeOther({ state, commit, dispatch }, { pageSelect, vm } = {}) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        const pageAim = pageSelect || state.current;
        let currentIndex = 0;
        state.opened.forEach((page, index) => {
          if (page.name === pageAim) {
            currentIndex = index;
          }
        });
        // 删除打开的页面数据 并更新缓存设置
        if (currentIndex === 0) {
          state.opened.splice(1).forEach(({ name }) => commit("keepAliveRemove", name));
        } else {
          state.opened.splice(currentIndex + 1).forEach(({ name }) => commit("keepAliveRemove", name));
          state.opened.splice(1, currentIndex - 1).forEach(({ name }) => commit("keepAliveRemove", name));
        }
        // 设置新的页面
        state.current = pageAim;
        if (vm && vm.$route.name !== pageAim) {
          vm.$router.push({
            name: pageAim,
          });
        }
        // 持久化
        await dispatch("opend2db");
        // end
        resolve();
      });
    },
    /**
     * @class opened
     * @description 关闭所有 tag
     * @param {Object} state vuex state
     * @param {Object} vm vue
     */
    closeAll({ state, commit, dispatch }, vm) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // 删除打开的页面 并在缓存设置中删除
        state.opened.splice(1).forEach(({ name }) => commit("keepAliveRemove", name));
        // 持久化
        await dispatch("opend2db");
        // 关闭所有的标签页后需要判断一次现在是不是在首页
        if (vm.$route.name !== "Home") {
          vm.$router.push({
            name: "Home",
          });
        }
        // end
        resolve();
      });
    },
  },
  mutations: {
    /**
     * @class keepAlive
     * @description 从已经打开的页面记录中更新需要缓存的页面记录
     * @param {Object} state vuex state
     */
    keepAliveRefresh(state) {
      state.keepAlive = state.opened
        .filter((item) => {
          if (item.meta) {
            if (item.meta.notCache) {
              return false;
            }
          }
          return true;
        })
        .map((e) => e.name);
    },
    /**
     * @description 删除一个页面的缓存设置
     * @param {Object} state vuex state
     * @param {String} name name
     */
    keepAliveRemove(state, name) {
      const list = [...state.keepAlive];
      remove(list, (item) => item === name);
      state.keepAlive = list;
    },
    /**
     * @description 增加一个页面的缓存设置
     * @param {Object} state vuex state
     * @param {String} name name
     */
    keepAlivePush(state, name) {
      const keep = [...state.keepAlive];
      keep.push(name);
      state.keepAlive = Array.from(new Set(keep));
    },
    /**
     * @description 清空页面缓存设置
     * @param {Object} state vuex state
     */
    keepAliveClean(state) {
      state.keepAlive = [];
    },
    /**
     * @class current
     * @description 设置当前激活的页面 name
     * @param {Object} state vuex state
     * @param {String} name new name
     */
    currentSet(state, name) {
      state.current = name;
    },
    /**
     * @class pool
     * @description 保存 pool (候选池)
     * @param {Object} state vuex state
     * @param {Array} routes routes
     */
    init(state, routes) {
      const pool = [];
      const push = function (routes) {
        routes.forEach((route) => {
          if (route.children) {
            push(route.children);
          } else {
            if (!route.hidden) {
              const { meta, name, path } = route;
              pool.push({ meta, name, path });
            }
          }
        });
      };
      push(routes);
      state.pool = pool;
    },
  },
};
