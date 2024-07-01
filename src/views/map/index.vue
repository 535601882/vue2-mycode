<template>
  <div id="container"></div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  name: "index",
  data() {
    return {
      AMap: null,
      map: null,
      district: null,
      districtSearch: null,
      currentLevel: "province",
      currentProvince: null,
      currentCity: null,
      provincesObj: {},
      provinceLayer: null, //省名称
    };
  },
  methods: {
    async initAMap() {
      this.AMap = await AMapLoader.load({
        key: "0d29a3a5efa3e8e3b3b9f4043aee1287", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.ToolBar", "AMap.Scale", "AMap.DistrictSearch"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      });
      // 行政区查询服务
      // eslint-disable-next-line no-undef
      this.districtSearch = new this.AMap.DistrictSearch({
        extensions: "all",
        subdistrict: 1,
        level: "country",
      });

      // this.districtSearch.search('中国', function(status, result) {
      //   console.log('中国 result',status, result)
      // });
      //
      // this.districtSearch.setLevel('province')
      // this.districtSearch.search("440000", function(status, result) {
      //   console.log('广东省 result',status, result)
      // });
    },
    initMap() {
      // 初始化地图
      let map = new this.AMap.Map("container", {
        zoom: 4,
        isHotspot: false,
        defaultCursor: "pointer",
        // layers: [this.distCountry],
        layers: [this.AMap.createDefaultLayer()],
        viewMode: "2D",
      });
      // eslint-disable-next-line no-undef
      this.provinceLayer = new this.AMap.LabelsLayer({
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: false,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true,
      });
      this.map = map;
      window.$map = map;
      //加载工具条
      map.addControl(new this.AMap.ToolBar({ liteStyle: true }));
      map.addControl(new this.AMap.Scale());
      this.map.on("complete", () => {
        this.$message.success("地图加载完成！");
        this.setProvinceName();
      });
    },
    setCountryLayer() {
      // 创建国家简易行政区图层
      // eslint-disable-next-line no-undef
      this.distCountry = new this.AMap.DistrictLayer.Country({
        opacity: 0.5,
        zIndex: 10,
        SOC: "CHN", //设置显示国家
        depth: 1, //设置数据显示层级，0：显示国家面，1：显示省级，当国家为中国时设置depth为2的可以显示市一级
        styles: {
          "nation-stroke": "#ff0000",
          "coastline-stroke": "#0088ff",
          "province-stroke": "grey",
          fill: (props) => {
            return this.getFillColor(this.provincesObj[props.NAME_CHN]);
          },
        },
      });
      this.map.setLayers([this.distCountry]);
      this.distCountry.on("click", (e) => {
        console.log("触发地图鼠标左键单击事件", e);
        this.handleProvinceClick(e);
      });
    },
    // 加载省名称
    async setProvinceName() {
      // eslint-disable-next-line no-unused-vars
      let { districtList } = await this.getProvincesListByDistrictSearch("中国");
      districtList = districtList[0].districtList;
      this.setTitle(districtList);
      this.map.add(this.provinceLayer); // 添加省份标注名
    },
    // 设置名称
    setTitle(districtList) {
      this.provinceLayer.clear(); // 先清除
      for (var i = 0; i < districtList.length; i++) {
        // eslint-disable-next-line no-undef
        var labelsMarker = new this.AMap.LabelMarker({
          name: "",
          position: [districtList[i].center.lng, districtList[i].center.lat],
          zooms: [4, 13],
          zIndex: 1,
          opacity: 1,
          text: {
            content: districtList[i].name,
            direction: "center",
            offset: [0, 0],
            zooms: [3, 20],
            style: {
              fontSize: 10,
              fontWeight: "normal",
              fillColor: "#eee",
              strokeColor: "#88f",
              strokeWidth: 2,
            },
          },
        });
        this.provinceLayer.add(labelsMarker);
      }
      this.map.add(this.provinceLayer); //再添加 todo
    },
    // 调用search方法查询省份列表
    getProvincesListByDistrictSearch(keyword) {
      keyword = typeof keyword === "number" ? keyword.toString() : keyword;
      return new Promise((resolve, reject) => {
        this.districtSearch.search(keyword, function (status, result) {
          // 查询成功时status为'complete'，result为返回的查询结果
          if (status === "complete" && result.districtList.length > 0) {
            console.log("result", keyword, result);
            resolve(result);
          } else {
            // 查询失败或其他状态
            console.log("查询失败：" + result.info);
            reject(result);
          }
        });
      });
    },
    // 点击省区域
    // eslint-disable-next-line no-unused-vars
    async handleProvinceClick(event) {
      if (!event.props) return;

      if (event.props.level === "province") {
        this.map.remove(this.provinceLayer); // 移除省
        this.setProvince(event.props.adcode, 1);
        // 设置地图中心和缩放级别
        this.map.setZoomAndCenter(7, event.origin.lnglat); // 放大并将省份移到中心
      }
      if (event.props.level === "city") {
        // 如何加载地图详情 todo
        // eslint-disable-next-line no-undef
        let tileLayer = new this.AMap.TileLayer({
          zIndex: 10, // 图层叠加顺序，数字越小，越底层
          extData: {}, // 扩展数据，可以用于自定义图层
        });
        this.map.add(tileLayer);
        this.distCountry.setMap(null);
        // 设置地图中心和缩放级别
        this.map.setZoomAndCenter(12, event.origin.lnglat); // 放大并将省份移到中心

        // 市
        this.districtSearch.search(event.props.NAME_CHN, (status, result) => {
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
          var polygon = new this.AMap.Polygon({
            strokeColor: "#00eeff",
            strokeWeight: 1,
            fillColor: "#71B3ff",
            fillOpacity: 0.5,
          });
          polygon.setPath(pathArray);
          this.map.add(polygon);

          //创建右键菜单
          // eslint-disable-next-line no-undef
          var contextMenu = new this.AMap.ContextMenu();
          //右键放大
          contextMenu.addItem(
            "返回全国",
            function (e) {
              console.log(e);
            },
            0
          );
          contextMenu.addItem(
            "返回省",
            function (e) {
              console.log(e);
            },
            1
          );
          contextMenu.addItem(
            "返回市",
            function (e) {
              console.log(e);
            },
            1
          );

          // 遮罩层点击
          polygon.on("click", (e) => {
            console.log("遮罩单击事件", e);
            // 返回市 todo
            contextMenu.open(this.map, e.lnglat);
          });
        });
      }
    },
    // 点击市区域
    handleCityClick(event) {
      if (this.currentLevel === "city") {
        const city = event.target.getExtData();
        this.currentCity = city.name;
        this.map.setZoomAndCenter(10, event.lnglat);
        this.loadPoints(city.name);
        this.currentLevel = "point";
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
    // 获取市
    getCities(provinceName) {
      // 示例省份和对应市的数据结构
      const provincesData = {
        北京市: [
          "东城区",
          "西城区",
          "朝阳区",
          "丰台区",
          "石景山区",
          "海淀区",
          "门头沟区",
          "房山区",
          "通州区",
          "顺义区",
          "昌平区",
          "大兴区",
          "怀柔区",
          "平谷区",
          "密云区",
          "延庆区",
        ],
        上海市: [],
        天津市: [],
        重庆市: [],
        河北省: [],
        山西省: ["忻州市", "晋中市", "太原市", "朔州市", "阳泉市", "长治市", "晋城市", "临汾市", "运城市"],
        辽宁省: [],
        吉林省: [],
        黑龙江省: [],
        江苏省: [],
        浙江省: [],
        安徽省: [],
        福建省: ["福州市", "厦门市", "莆田市", "三明市", "泉州市", "漳州市", "南平市", "龙岩市", "宁德市"],
        江西省: ["南昌市", "景德镇市", "萍乡市", "九江市", "宜春市", "赣州市", "上饶市", "抚州市", "宿州市", "吉安市", "鹰潭市", "瑞昌市", "高安市"],
        山东省: [
          "济南市",
          "青岛市",
          "淄博市",
          "枣庄市",
          "东营市",
          "烟台市",
          "潍坊市",
          "济宁市",
          "泰安市",
          "威海市",
          "日照市",
          "临沂市",
          "德州市",
          "聊城市",
          "滨州市",
          "菏泽市",
        ],
        河南省: [
          "郑州市",
          "开封市",
          "洛阳市",
          "平顶山市",
          "安阳市",
          "鹤壁市",
          "新乡市",
          "焦作市",
          "濮阳市",
          "许昌市",
          "漯河市",
          "三门峡市",
          "南阳市",
          "商丘市",
          "信阳市",
          "周口市",
          "驻马店市",
        ],
        湖北省: ["十堰市", "荆州市", "襄阳市", "鄂州市", "孝感市", "荆门市", "黄石市", "咸宁市", "随州市", "恩施土家族苗族自治州"],
        湖南省: ["长沙市", "株洲市", "湘潭市", "衡阳市", "邵阳市", "岳阳市", "常德市", "张家界市", "益阳市", "郴州市", "永州市", "怀化市"],
        广东省: [
          "广州市",
          "深圳市",
          "珠海市",
          "汕头市",
          "佛山市",
          "江门市",
          "湛江市",
          "茂名市",
          "肇庆市",
          "惠州市",
          "梅州市",
          "汕尾市",
          "河源市",
          "阳江市",
          "清远市",
          "东莞市",
          "中山市",
          "潮州市",
          "揭阳市",
          "云浮市",
        ],
        海南省: [],
        四川省: [
          "成都市",
          "自贡市",
          "攀枝花市",
          "泸定县",
          "德阳市",
          "绵阳市",
          "广元市",
          "遂宁市",
          "内江市",
          "乐山市",
          "自贡市",
          "宜宾市",
          "眉山市",
          "资阳市",
          "亚东县",
          "金堂县",
          "剑阁县",
          "五通桥市",
          "黎川县",
          "遂宁市",
          "射洪县",
          "大英县",
          "邛崃市",
          "彭山县",
          "长寿县",
          "中江县",
          "越西县",
          "仁寿县",
          "彭山县",
          "东兴区",
          "西昌市",
          "木里藏族羌族自治县",
          "盐边县",
          "昭觉县",
          "金阳县",
          "雷波县",
          "美姑藏族侗族自治县",
          "布拖藏族佤族苗族自治县",
          "光辉县",
          "喜德县",
          "冕宁县",
          "甘洛县",
          "石棠县",
          "稻城县",
          "得荣县",
        ],
        贵州省: [],
        云南省: [],
        陕西省: [],
        甘肃省: [],
        青海省: [],
        台湾省: [],
        内蒙古自治区: [],
        广西壮族自治区: [],
        西藏自治区: [],
        宁夏回族自治区: [],
        新疆维吾尔自治区: [],
        香港特别行政区: [],
        澳门特别行政区: [],
      };

      // 检查输入的省份是否存在于数据中
      // eslint-disable-next-line no-prototype-builtins
      if (!provincesData.hasOwnProperty(provinceName)) {
        console.error(`省份 "${provinceName}" 不存在.`);
        return null;
      }

      // 获取指定省份下的所有市
      const cities = provincesData[provinceName];

      // 为每个市生成随机value并构建最终数据结构
      const citiesWithValues = cities.map((city) => ({
        name: city,
        value: Math.floor(Math.random() * (100 - 30 + 1)) + 30, // 生成30到100之间的随机数
      }));

      console.log("citiesWithValues", provinceName, citiesWithValues);
      return Promise.resolve(citiesWithValues);
    },
    // 获取区
    getPoints() {},
    // 省市简易行政区图层创建及设置方法
    async setProvince(code, dep) {
      this.distCountry.setMap(null);
      this.districtSearch.setLevel("province");
      let { districtList } = await this.getProvincesListByDistrictSearch(code);
      console.log("districtList2", districtList, code);
      districtList = districtList[0].districtList;
      this.setTitle(districtList);
      // eslint-disable-next-line no-undef
      this.distCountry = new AMap.DistrictLayer.Province({
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

      this.distCountry.setMap(this.map);
      this.distCountry.on("click", (e) => {
        console.log("触发地图鼠标左键单击事件", e);
        this.handleProvinceClick(e);
      });
    },
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
    this.initMap();
    this.setCountryLayer();
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
