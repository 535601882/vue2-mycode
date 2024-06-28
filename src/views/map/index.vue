<template>
  <div id="container"></div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
var districts = [
  {
    citycode: [],
    adcode: "440000",
    name: "广东",
    center: "113.280637,23.125178",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "410000",
    name: "河南",
    center: "113.665412,34.757975",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "150000",
    name: "内蒙古",
    center: "111.670801,40.818311",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "230000",
    name: "黑龙江",
    center: "126.642464,45.756967",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "650000",
    name: "新疆",
    center: "87.617733,43.792818",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "420000",
    name: "湖北",
    center: "114.298572,30.584355",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "210000",
    name: "辽宁",
    center: "123.429096,41.796767",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "370000",
    name: "山东",
    center: "117.000923,36.675807",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "610000",
    name: "陕西",
    center: "108.948024,34.263161",
    level: "province",
    districts: [],
  },
  {
    citycode: "021",
    adcode: "310000",
    name: "上海",
    center: "121.472644,31.231706",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "520000",
    name: "贵州",
    center: "106.713478,26.578343",
    level: "province",
    districts: [],
  },
  {
    citycode: "023",
    adcode: "500000",
    name: "重庆",
    center: "106.504962,29.533155",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "540000",
    name: "西藏",
    center: "91.132212,29.660361",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "340000",
    name: "安徽",
    center: "117.283042,31.86119",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "350000",
    name: "福建",
    center: "119.306239,26.075302",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "430000",
    name: "湖南",
    center: "112.982279,28.19409",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "460000",
    name: "海南",
    center: "110.33119,20.031971",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "320000",
    name: "江苏",
    center: "118.767413,32.041544",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "630000",
    name: "青海",
    center: "101.778916,36.623178",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "450000",
    name: "广西",
    center: "108.320004,22.82402",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "640000",
    name: "宁夏",
    center: "106.278179,38.46637",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "360000",
    name: "江西",
    center: "115.892151,28.676493",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "330000",
    name: "浙江",
    center: "120.153576,30.287459",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "130000",
    name: "河北",
    center: "114.502461,38.045474",
    level: "province",
    districts: [],
  },
  {
    citycode: "1853",
    adcode: "820000",
    name: "澳门",
    center: "113.54909,22.198951",
    level: "province",
    districts: [],
  },
  {
    citycode: "1886",
    adcode: "710000",
    name: "台湾",
    center: "121.509062,25.044332",
    level: "province",
    districts: [],
  },
  {
    citycode: "1852",
    adcode: "810000",
    name: "香港",
    center: "114.173355,22.320048",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "620000",
    name: "甘肃",
    center: "103.823557,36.058039",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "510000",
    name: "四川",
    center: "104.065735,30.659462",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "220000",
    name: "吉林",
    center: "125.3245,43.886841",
    level: "province",
    districts: [],
  },
  {
    citycode: "022",
    adcode: "120000",
    name: "天津",
    center: "117.190182,39.125596",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "530000",
    name: "云南",
    center: "102.712251,25.040609",
    level: "province",
    districts: [],
  },
  {
    citycode: "010",
    adcode: "110000",
    name: "北京",
    center: "116.405285,39.904989",
    level: "province",
    districts: [],
  },
  {
    citycode: [],
    adcode: "140000",
    name: "山西",
    center: "112.549248,37.857014",
    level: "province",
    districts: [],
  },
];

var LabelsData = [];

var directions = {
  北京: "top",
  河北: "right",
  宁夏: "bottom",
  浙江: "bottom",
  上海: "right",
  青海: "left",
  黑龙江: "top",
  江苏: "right",
  安徽: "top",
  重庆: "right",
  湖南: "left",
  澳门: "bottom",
  香港: "right",
  台湾: "bottom",
  内蒙古: "top",
};

for (let i = 0; i < districts.length; i++) {
  let config = {
    name: "",
    position: [116.12, 39.11],
    zooms: [4, 13],
    zIndex: 1,
    opacity: 1,
    text: {
      content: "",
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
  };
  var district = districts[i];
  var name = district.name;
  config.text.content = name;
  config.position = district.center.split(",");
  if (directions[name]) {
    config.text.direction = directions[name];
  }
  LabelsData.push(config);
}
export default {
  name: "index",
  data() {
    return {
      AMap: null,
      map: null,
      district: null,
      currentLevel: "province",
      currentProvince: null,
      currentCity: null,
      provincesObj: {},
      provinceLayer: null, //省名称
    };
  },
  methods: {
    async initAMap() {
      let AMap = await AMapLoader.load({
        key: "0d29a3a5efa3e8e3b3b9f4043aee1287", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.ToolBar", "AMap.Scale", "AMap.DistrictSearch"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
      });
      this.AMap = AMap;

      // 创建国家简易行政区图层
      this.distCountry = new AMap.DistrictLayer.Country({
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

      // 初始化地图
      let map = new AMap.Map("container", {
        zoom: 4,
        isHotspot: false,
        defaultCursor: "pointer",
        layers: [this.distCountry],
        viewMode: "3D",
      });
      this.map = map;
      window.$map = map;
      //加载工具条
      map.addControl(new AMap.ToolBar({ liteStyle: true }));
      map.addControl(new AMap.Scale());
      this.map.on("complete", () => {
        this.$message.success("地图加载完成！");
        this.setProvinceName();
      });

      this.distCountry.on("click", (e) => {
        console.log("触发地图鼠标左键单击事件", e);
        this.handleProvinceClick(e);
      });
    },
    // 加载省名称
    setProvinceName() {
      // eslint-disable-next-line no-undef
      this.provinceLayer = new AMap.LabelsLayer({
        // 开启标注避让，默认为开启，v1.4.15 新增属性
        collision: false,
        // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
        animation: true,
      });
      for (var i = 0; i < LabelsData.length; i++) {
        // eslint-disable-next-line no-undef
        var labelsMarker = new AMap.LabelMarker(LabelsData[i]);
        this.provinceLayer.add(labelsMarker);
      }
      this.map.add(this.provinceLayer);
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
        let tileLayer = new AMap.TileLayer({
          zIndex: 10, // 图层叠加顺序，数字越小，越底层
          extData: {}, // 扩展数据，可以用于自定义图层
        });
        this.map.add(tileLayer);
        this.distCountry.setMap(null);
        // 设置地图中心和缩放级别
        this.map.setZoomAndCenter(12, event.origin.lnglat); // 放大并将省份移到中心

        // eslint-disable-next-line no-undef
        new AMap.DistrictSearch({
          extensions: "all",
          subdistrict: 0,
        }).search(event.props.NAME_CHN, (status, result) => {
          // 外多边形坐标数组和内多边形坐标数组
          var outer = [
            // eslint-disable-next-line no-undef
            new AMap.LngLat(-360, 90, true),
            // eslint-disable-next-line no-undef
            new AMap.LngLat(-360, -90, true),
            // eslint-disable-next-line no-undef
            new AMap.LngLat(360, -90, true),
            // eslint-disable-next-line no-undef
            new AMap.LngLat(360, 90, true),
          ];
          var holes = result.districtList[0].boundaries;

          var pathArray = [outer];
          pathArray.push.apply(pathArray, holes);
          // eslint-disable-next-line no-undef
          var polygon = new AMap.Polygon({
            strokeColor: "#00eeff",
            strokeWeight: 1,
            fillColor: "#71B3ff",
            fillOpacity: 0.5,
          });
          polygon.setPath(pathArray);
          this.map.add(polygon);

          //创建右键菜单
          // eslint-disable-next-line no-undef
          var contextMenu = new AMap.ContextMenu();
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
    setProvince(code, dep) {
      this.distCountry.setMap(null);
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
    this.initAMap();
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
