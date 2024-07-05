<template>
  <div>
    <el-select v-model="form.region" clearable>
      <el-option v-for="item in regions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>
    <el-select v-model="form.area" clearable>
      <el-option v-for="item in regionsSelect.children" :key="item.value" :label="item.label" :value="item.value"> </el-option>
    </el-select>
    <el-button type="primary" @click="handleSearch">查询</el-button>
    <div id="container"></div>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";

function getProvinceAdcode(provinceName) {
  let adcodeMapping = tansformProvinceData(provinceData);
  console.log("adcodeMapping", adcodeMapping);
  return adcodeMapping[provinceName];
}
const keywordMap = {};
let provinceData = []; // 省
// eslint-disable-next-line no-unused-vars
let cityData = []; // 市

// 用于存储图层的堆栈
let layerStack = [];

// 切换到下一个图层并记录当前图层
function pushLayer(nextLayer) {
  let currentLayer = layerStack[layerStack.length - 1];
  currentLayer.hide();
  nextLayer.show();
  layerStack.push(nextLayer);
}

// 返回到上一个图层
function popLayer() {
  if (layerStack.length > 1) {
    let currentLayer = layerStack.pop();
    currentLayer.hide();
    let previousLayer = layerStack[layerStack.length - 1];
    previousLayer.show();
  }
}

// 將地图的省市=>adcode转换
function tansformProvinceData(provinceData) {
  let obj = {};
  let trans = function (data) {
    for (let item of data) {
      obj[item.name] = item.adcode;
      if (item.districtList && item.districtList.length) {
        trans(item.districtList);
      }
    }
  };
  trans(provinceData);
  return obj;
}

export default {
  name: "index",
  data() {
    return {
      AMap: null,
      map: null,
      districtSearch: null, //行政区查询服务
      provincesObj: {},
      defaultLayer: null, //默认标准图层 layer
      disCountry: null, //省地图 layer
      layerProvince: null, //省名称 layer
      disLabelMarker: null, //省名称 marker
      disProvince: null, //市地图 layer
      layerCity: null, //市名称 layer
      form: {
        region: null,
        area: null,
      },
      regions: [
        {
          label: "零售华北大区",
          value: "零售华北大区",
          provinces: ["黑龙江省", "吉林省", "辽宁省", "河北省", "山西省", "北京市", "天津市"], // 大区对应的省
          citys: [],
          children: [
            {
              label: "零售黑龙江区域",
              value: "零售黑龙江区域",
              provinces: ["黑龙江省", "呼伦贝尔市"],
            },
            {
              label: "雯售吉林区域",
              value: "雯售吉林区域",
              provinces: ["吉林省"], // 大区对应的省
            },
            {
              label: "零售辽宁区域",
              value: "零售辽宁区域",
              provinces: ["辽宁省"], // 大区对应的省
            },
            {
              label: "零售北京区域",
              value: "零售北京区域",
              provinces: ["北京市", "天津市", "张家口市", "廊坊市", "承德市", "唐山市", "秦皇岛市"], // 大区对应的省
            },
            {
              label: "零售河北区域",
              value: "零售河北区域",
              provinces: ["保定市", "石家庄市", "沧州市", "邢台市", "衡水市", "邯郸市"],
            },
            {
              label: "零售山西区域",
              value: "零售山西区域",
              provinces: ["山西省"],
            },
          ],
        },
        {
          label: "零售华东大区",
          value: "零售华东大区",
          provinces: ["山东省", "上海市", "江苏省", "浙江省", "福建省"], // 大区对应的省
          citys: [],
          children: [],
        },
        {
          label: "零售华南大区",
          value: "零售华南大区",
          provinces: ["广东省", "广西壮族自治区", "海南省", "云南省", "贵州省"], // 大区对应的省
          citys: [],
          children: [],
        },
        {
          label: "零售华中大区",
          value: "零售华中大区",
          provinces: ["湖南省", "湖北省", "河南省", "安徽省", "江西省"], // 大区对应的省
          citys: [],
          children: [],
        },
        {
          label: "零售西北大区",
          value: "零售西北大区",
          provinces: ["陕西省", "甘肃省", "青海省", "内蒙古自治区", "宁夏回族自治区", "四川省", "重庆市"], // 大区对应的省
          citys: [],
          children: [],
        },
      ],
    };
  },
  computed: {
    // 已选中的大区
    regionsSelect() {
      if (!this.form.region) {
        return {
          provinces: [],
          children: [],
        };
      }
      return this.regions.find((item) => item.value === this.form.region);
    },
    areaSelect() {
      if (!this.form.area) return;
      return this.regionsSelect.children.find((item) => item.value === this.form.area).provinces;
    },
  },
  methods: {
    async initAMap() {
      this.AMap = await AMapLoader.load({
        key: "0d29a3a5efa3e8e3b3b9f4043aee1287", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.ToolBar", "AMap.Scale", "AMap.DistrictSearch", "AMap.ControlBar"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      });
    },
    // 行政区查询服务
    async initDistrictSearch() {
      this.districtSearch = new this.AMap.DistrictSearch({
        extensions: "all",
        subdistrict: 2,
        level: "country",
      });
      let { districtList } = await this.districtSearchPromise("中国");
      provinceData = districtList[0].districtList;
      console.log("provinceData", provinceData);
    },
    // 省名称 layer
    initLayerProvince() {
      // LabelsLayer 图层是用于承载 LabelMarker 标记的图层
      this.layerProvince = new this.AMap.LabelsLayer({
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: false,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true,
      });
    },
    // 获取LabelMarkers
    getLabelMarkers(newMarkers) {
      return newMarkers.map((marker) => {
        return new this.AMap.LabelMarker({
          name: marker.name,
          position: [marker.center.lng, marker.center.lat],
          zooms: [4, 13],
          zIndex: 1,
          opacity: 1,
          text: {
            content: marker.name,
            direction: "center",
            offset: [0, 0],
            zooms: [3, 20],
            style: {
              fontSize: 12,
              fontWeight: "normal",
              fillColor: "#88f",
              strokeColor: "#fff",
              strokeWidth: 2,
            },
          },
        });
      });
    },
    // 市名称 layer
    initLayerCity() {
      this.layerCity = new this.AMap.LabelsLayer({
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: false,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true,
      });
    },
    // 省Layer图层
    initDisCountry(options) {
      if (this.disCountry) {
        this.map.remove(this.disCountry);
        // this.disProvince = null
      }
      let config = {
        opacity: 0.5,
        zIndex: 10,
        SOC: "CHN", //设置显示国家
        depth: 1, //设置数据显示层级，0：显示国家面，1：显示省级，当国家为中国时设置depth为2的可以显示市一级
        styles: {
          "stroke-width": 1.5,
          "nation-stroke": "#ff0000", //国境线颜色
          "coastline-stroke": "#0088ff", //海岸线颜色
          "province-stroke": "#fff", //省界颜色
          fill: (props) => {
            return this.getFillColor(this.provincesObj[props.NAME_CHN]);
          },
        },
      };
      if (options) {
        config = { ...config, ...options };
      }
      this.disCountry = new this.AMap.DistrictLayer.Country(config);
      this.map.add(this.disCountry);
    },
    // 市Layer图层  简易行政区图-省区
    initProvince() {
      if (this.disProvince) {
        this.map.remove(this.disProvince);
        // this.disProvince = null
      }
      this.disProvince = new this.AMap.DistrictLayer.Province({
        zIndex: 12,
        adcode: "", // 未指定特定adcode，显示所有省级区域
        depth: 1,
        styles: {
          fill: (properties) => {
            // properties为可用于做样式映射的字段，包含
            // NAME_CHN:中文名称
            // adcode_pro
            // adcode_cit
            // adcode
            var adcode = properties.adcode;
            return this.getFillColor(adcode);
          },
          "stroke-width": 1.5,
          "province-stroke": "cornflowerblue",
          "city-stroke": "#fff", // 中国地级市边界
          "county-stroke": "rgba(255,255,255,0.5)", // 中国区县边界
        },
      });
      this.map.add(this.disProvince);
    },
    // 默认标准图层
    initCreateDefaultLayer() {
      this.defaultLayer = this.AMap.createDefaultLayer();
    },
    initMap() {
      return new Promise((resolve) => {
        // 初始化地图
        let map = new this.AMap.Map("container", {
          zoom: 4,
          center: [106.122082, 33.719192],
          isHotspot: false, // 是否开启地图热点和标注的 hover 效果
          defaultCursor: "pointer",
          layers: [this.defaultLayer],
          // layers: [this.AMap.createDefaultLayer()],
          viewMode: "3D",
          resizeEnable: true,
        });
        this.map = map;
        window.$map = map;
        //加载工具条
        map.addControl(new this.AMap.ToolBar({ liteStyle: true }));
        map.addControl(new this.AMap.Scale());
        this.map.on("complete", () => {
          resolve();
          this.$message.success("地图加载完成！");

          this.setProvinceName(provinceData);
          // this.map.add(this.layerProvince); //再添加
        });
      });
    },
    // 加载省名称
    async setProvinceName(provinceData) {
      this.disLabelMarker && this.layerProvince.remove(this.disLabelMarker); // 先移除
      this.disLabelMarker = this.getLabelMarkers(provinceData);
      // 将 LabelMarker 标记添加到 LabelsLayer 图层上
      this.layerProvince.add(this.disLabelMarker);
      return this.layerProvince;
    },
    // 点击省区域
    async handleProvinceClick(event) {
      if (!event.props) return;
      if (event.props.level === "province") {
        pushLayer(this.disProvince);
        // this.map.remove(this.layerProvince); // 移除省
        // this.setProvince(event.props.adcode, 1);
        this.layerProvince.hide(); // 隐藏省名称
        // this.disCountry.hide();// 隐藏省
        // this.disProvince.show()// 展示市
        this.disProvince.setDistricts(event.props.adcode + ""); // 显示当前点击的省份
        // this.setProvince(event.props.adcode, 1);
        // 设置地图中心和缩放级别
        this.map.setZoomAndCenter(7, event.origin.lnglat); // 放大并将省份移到中心

        // 获取当前点击省份下的市级数据
        cityData = this.getCitysForProvince(event.props.NAME_CHN);
        console.log("cityData", cityData);
        for (let i = 0; i < cityData.length; i++) {
          var city = cityData[i];
          var marker = new this.AMap.LabelMarker({
            name: city.name,
            position: [city.center.lng, city.center.lat],
            zIndex: 10,
            text: {
              content: city.name,
              direction: "center",
              style: {
                fontSize: 10,
                fontWeight: "normal",
                fillColor: "#fff",
                backgroundColor: "rgb(246,137,38)",
                borderColor: "#fff",
              },
            },
          });
          this.layerCity.add(marker);
        }
        this.map.add(this.layerCity);
      }
    },
    // 获取指定省下的市
    getCitysForProvince(name) {
      return provinceData.find((item) => item.name === name).districtList;
    },
    // 点击市区域
    async handleCityClick(event) {
      if (!event.props) return;
      if (event.props.level === "city") {
        pushLayer(this.defaultLayer);
        this.layerCity.hide(); // 隐藏市标题
        // this.disProvince.hide();// 隐藏市图层
        // this.defaultLayer.show()
        this.districtSearch.setLevel("province"); // 设置为省
        // 如何加载地图详情 todo
        // let tileLayer = new this.AMap.TileLayer({
        //   zIndex: 10, // 图层叠加顺序，数字越小，越底层
        //   extData: {}, // 扩展数据，可以用于自定义图层
        // });
        // this.map.add(tileLayer);
        // this.disProvince.setMap(null);
        // 设置地图中心和缩放级别
        this.map.setZoomAndCenter(12, event.origin.lnglat); // 放大并将省份移到中心

        // 获取市轮廓
        let result = await this.districtSearchPromise(event.props.NAME_CHN);
        // 外多边形坐标数组和内多边形坐标数组
        var outer = [
          // eslint-disable-next-line no-undef
          new this.AMap.LngLat(-360, 90, true),
          // eslint-disable-next-line no-undef
          new this.AMap.LngLat(-360, -90, true),
          // eslint-disable-next-line no-undef
          new this.AMap.LngLat(360, -90, true),
          // eslint-disable-next-line no-undef
          new this.AMap.LngLat(360, 90, true),
        ];
        var holes = result.districtList[0].boundaries;

        var pathArray = [outer];
        pathArray.push.apply(pathArray, holes);
        // eslint-disable-next-line no-undef
        this.polygon = new this.AMap.Polygon({
          strokeColor: "#00eeff",
          strokeWeight: 1,
          fillColor: "#71B3ff",
          fillOpacity: 0.5,
        });
        this.polygon.setPath(pathArray);
        this.map.add(this.polygon);

        //创建右键菜单
        // eslint-disable-next-line no-undef
        var contextMenu = new this.AMap.ContextMenu();
        //右键放大
        contextMenu.addItem(
          "返回全国",
          (e) => {
            console.log(e);
            popLayer();
            popLayer();
            this.map.remove(this.polygon);
          },
          0
        );
        contextMenu.addItem(
          "返回省",
          (e) => {
            console.log(e);
            popLayer();
            this.map.remove(this.polygon);
          },
          1
        );

        // 遮罩层点击
        this.polygon.on("click", (e) => {
          console.log("遮罩单击事件", e);
          // 返回市 todo
          contextMenu.open(this.map, e.lnglat);
        });
      }
    },
    loadPoints(cityName) {
      this.getPoints(`${cityName}`)
        .then((response) => response.json())
        .then((data) => {
          data.forEach((point) => {
            new this.AMap.Marker({
              position: [point.lng, point.lat],
              map: this.map,
            });
          });
        });
    },
    // eslint-disable-next-line no-unused-vars
    getFillColor(value) {
      let colors = ["rgba(255, 0, 0, 1)", "rgba(255, 153, 0, 1)", "rgba(255, 255, 0, 1)", "rgba(153, 204, 0, 1)"];
      return colors[Math.floor(Math.random() * colors.length)];
      // 根据值范围返回对应的颜色
      // if (value > 80) return 'rgba(255, 0, 0, 1)';
      // if (value > 60) return 'rgba(255, 153, 0, 1)';
      // if (value > 40) return 'rgba(255, 255, 0, 1)';
      // if (value > 20) return 'rgba(153, 204, 0, 1)';
      // return '#00cc00';
    },
    // 获取省
    getProvinces() {
      return Promise.resolve([
        { name: "北京市", value: 75 },
        { name: "上海市", value: 80 },
        { name: "天津市", value: 30 },
        { name: "重庆市", value: 100 },
        { name: "河北省", value: 45 },
        { name: "山西省", value: 50 },
        { name: "辽宁省", value: 55 },
        { name: "吉林省", value: 60 },
        { name: "黑龙江省", value: 65 },
        { name: "江苏省", value: 70 },
        { name: "浙江省", value: 75 },
        { name: "安徽省", value: 80 },
        { name: "福建省", value: 85 },
        { name: "江西省", value: 90 },
        { name: "山东省", value: 95 },
        { name: "河南省", value: 40 },
        { name: "湖北省", value: 35 },
        { name: "湖南省", value: 30 },
        { name: "广东省", value: 33 },
        { name: "海南省", value: 36 },
        { name: "四川省", value: 39 },
        { name: "贵州省", value: 42 },
        { name: "云南省", value: 45 },
        { name: "陕西省", value: 48 },
        { name: "甘肃省", value: 51 },
        { name: "青海省", value: 54 },
        { name: "台湾省", value: 57 },
        { name: "内蒙古自治区", value: 60 },
        { name: "广西壮族自治区", value: 63 },
        { name: "西藏自治区", value: 66 },
        { name: "宁夏回族自治区", value: 69 },
        { name: "新疆维吾尔自治区", value: 72 },
        { name: "香港特别行政区", value: 75 },
        { name: "澳门特别行政区", value: 78 },
      ]);
    },
    // 获取区
    getPoints() {},
    // 省市简易行政区图层创建及设置方法
    async setProvince(code, dep) {
      // this.disCountry.setMap(null);
      this.disCountry.hide();
      this.districtSearch.setLevel("province"); // 设置为省
      // 获取省下的市
      let { districtList } = await this.districtSearchPromise(code);
      console.log("districtList2", districtList, code);
      districtList = districtList[0].districtList;
      // 设置市名称
      this.setTitle(districtList);
      // 显示指定省下的市
      this.disProvince = new this.AMap.DistrictLayer.Province({
        zIndex: 12,
        adcode: [code],
        depth: dep,
        styles: {
          fill: (properties) => {
            // properties为可用于做样式映射的字段，包含
            // NAME_CHN:中文名称
            // adcode_pro
            // adcode_cit
            // adcode
            var adcode = properties.adcode;
            return this.getFillColor(adcode);
          },
          "province-stroke": "cornflowerblue",
          "city-stroke": "white", // 中国地级市边界
          "county-stroke": "rgba(255,255,255,0.5)", // 中国区县边界
        },
      });

      this.disProvince.setMap(this.map);
      this.disProvince.on("click", (e) => {
        console.log("触发地图鼠标左键单击事件", e);
        this.handleProvinceClick(e);
      });
    },
    handleSearch() {
      if (!this.form.region) {
        // 重置地图
        this.setProvinceName(provinceData);
        // todo 重新渲染全国地图
        this.disCountry.setDistricts("");
        return;
      } else if (this.form.area) {
        // 重新设置depth层级为2
        this.initDisCountry({
          depth: 2,
          adcode: this.areaSelect.map((province) => getProvinceAdcode(province)),
        });
        //
        // this.disCountry.setDistricts(this.areaSelect.map((province) => getProvinceAdcode(province)));
      } else if (this.form.region) {
        //
        // this.drawRegion()
        // 清除页面
        // this.distCountry.setMap(null);
        this.toogleProvinces();
      }
    },
    // 切换
    toogleProvinces() {
      let provinces = this.regionsSelect.provinces;
      // 设置 adcodes 值
      this.disCountry.setDistricts(provinces.map((province) => getProvinceAdcode(province)));
      this.layerProvince.show(); //省名称展示
      this.disCountry.show(); // 省展示
      this.disProvince.hide(); // 市隐藏
      this.layerCity.hide(); //市名称隐藏
      let data = provinceData.filter((item) => provinces.includes(item.name));
      console.log("provinces", provinces, provinceData, data);
      this.setProvinceName(data);
    },
    // 利用Polygon镂空 绘制大区（卡顿）
    async drawRegion() {
      // 需要移除多边形时
      if (this.polygon) {
        this.map.remove(this.polygon);
        this.polygon = null; // 清除引用
      }
      // 外多边形坐标数组和内多边形坐标数组
      // 外多边形坐标数组和内多边形坐标数组
      var outer = [
        new this.AMap.LngLat(-360, 90, true),
        new this.AMap.LngLat(-360, -90, true),
        new this.AMap.LngLat(360, -90, true),
        new this.AMap.LngLat(360, 90, true),
      ];
      var holes = [];
      // 查省/直辖市
      this.districtSearch.setLevel("province");
      const provinces = this.regionsSelect.provinces;
      for (let city of provinces) {
        let result = await this.districtSearchPromise(city);
        if (result.districtList[0].boundaries) {
          holes.push(...result.districtList[0].boundaries);
        }
      }

      var pathArray = [outer];
      pathArray.push.apply(pathArray, holes);
      console.log("pathArray", pathArray);

      this.polygon = new this.AMap.Polygon({
        strokeColor: "#00eeff",
        strokeWeight: 1,
        fillColor: "#71B3ff",
        fillOpacity: 0.5,
      });

      this.polygon.setPath(pathArray);
      this.map.add(this.polygon);
      this.map.setFitView(this.polygon);
    },
    // districtSearch查询
    districtSearchPromise(keyword) {
      keyword = typeof keyword === "number" ? keyword.toString() : keyword;
      return new Promise((resolve, reject) => {
        if (keywordMap[keyword]) return resolve(keywordMap[keyword]);
        this.districtSearch.search(keyword, (status, result) => {
          if (status === "complete" && result.info === "OK") {
            console.log("获取完成", keyword, result);
            keywordMap[keyword] = result;
            resolve(result);
          } else {
            reject(new Error(`Failed to search ${keyword}`));
          }
        });
      });
    },
    // 先查询大区的数据
    getRegionData() {},
  },
  async mounted() {
    window._AMapSecurityConfig = {
      securityJsCode: "1acb92eeeb115a9db798a31502a196da",
    };
    let provinces = await this.getProvinces();
    this.provincesObj = provinces.reduce((obj, item) => {
      obj[item.name] = item.value;
      return obj;
    }, {});
    await this.initAMap();
    await this.initDistrictSearch();
    this.initLayerProvince();
    this.initLayerCity();
    this.initCreateDefaultLayer();
    await this.initMap();
    this.initDisCountry();
    layerStack.push(this.disCountry);
    this.initProvince();

    this.disCountry.on("click", (e) => {
      console.log("省点击", e);
      this.handleProvinceClick(e);
    });

    this.disProvince.on("click", (e) => {
      console.log("市点击", e);
      this.handleCityClick(e);
    });
    this.map.add(this.layerProvince); //再添加
    this.defaultLayer.hide(); // 先把标准地图隱藏
    this.disProvince.hide(); // 先把市隱藏
  },
  unmounted() {
    this.map?.destroy();
  },
};
</script>

<style scoped lang="scss">
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
</style>
