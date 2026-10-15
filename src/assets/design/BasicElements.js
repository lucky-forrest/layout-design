export default [
  {
    primaryKey: "Line",
    name: "container",
    displayName: "容器",
    canContain: true,
    width: 300,
    height: 396,
    attrs: { hidden: false },
    styles: {
      overflow: "hidden",
      "border-color": "#e3e3e3",
      "border-style": "solid",
      "border-width": "1px",
      "background-color": "skyblue",
      "clip-path": "polygon( 0% 15%, 0% 0%, 15% 0%, 85% 0%, 100% 0%, 100% 15%, 100% 85%, 100% 100%, 85% 100%, 15% 100%, 0% 100%, 0% 85% )"
    },
    children: []
  },
  {
    primaryKey: "L",
    name: "equipment",
    displayName: "设备",
    canContain: true,
    width: 300,
    height: 396,
    attrs: {
      bgColor: "currentStatus",
      borderColor: "alive",
      hidden: false
    },
    styles: {
      overflow: "hidden",
      "border-color": "rgba(0, 0, 0, 0.15)",
      "border-style": "solid",
      "border-width": "1px",
      "clip-path": "polygon( 0% 15%, 0% 0%, 15% 0%, 85% 0%, 100% 0%, 100% 15%, 100% 85%, 100% 100%, 85% 100%, 15% 100%, 0% 100%, 0% 85% )"
    },
    children: []
  },
  {
    primaryKey: "Oven",
    name: "oven",
    displayName: "炉子",
    canContain: false,
    attrs: { nickName:'1#' },
    width: 40,
    height: 60,
    styles: {
      overflow: "hidden",
      "border-color": "rgba(0, 0, 0, 0.15)",
      "border-style": "solid",
      "border-width": "1px",
    },
    children: []
  },
  {
    primaryKey: "DataItem",
    name: "dataItem",
    displayName: "数据组",
    canContain: true,
    width: 240,
    height: 200,
    attrs: { row: "6", col: "1" },
    styles: {
      overflow: "hidden",
      "border-color": "rgba(0, 0, 0, 0.15)",
      "border-style": "solid",
      "border-width": "1px"
    }
  },
  {
    primaryKey: "CarrierBoard",
    name: "carrier",
    displayName: "载板",
    canContain: false,
    width: 1196,
    height: 396,
    attrs: { row: "10", col: "30" },
    styles: {
      overflow: "hidden",
      "border-color": "rgba(0, 0, 0, 0.15)",
      "border-style": "solid",
      "border-width": "1px"
    }
  },
  {
    primaryKey: "PathDesign",
    name: "path-setting",
    displayName: "路径规划",
    canContain: false,
    width: 1196,
    height: 396,
    attrs: {
      row: "10",
      col: "30",
      pathList: []
  },
    styles: {
      "border-color": "rgba(0, 0, 0, 0.15)",
      "border-style": "solid",
      "border-width": "1px"
    }
  },
  {
    primaryKey: "Basket",
    name: "basket",
    displayName: "花篮",
    canContain: false,
    width: 400,
    height: 60,
    attrs: { direction: "left", col: "6" },
    styles: {
      overflow: "hidden",
      "border-color": "rgba(0, 0, 0, 0.15)",
      "border-style": "solid",
      "border-width": "1px"
    }
  },
  {
    primaryKey: "Port",
    name: "port",
    displayName: "Port",
    canContain: false,
    width: 80,
    height: 100,
    attrs: {
      src: "equipment/layout-Normal-Cassette",
      rotate: 0,
      bgColor: "portStatus",
      hidden: false
    }
  },
  {
    primaryKey: "Unit",
    name: "unit",
    displayName: "Unit",
    canContain: false,
    width: 80,
    height: 100,
    attrs: {
      src: "equipment/layout-Robot(Single-Arm)",
      rotate: 0,
      bgColor: "currentStauts",
      backgroundImage: "清洗1G.png",
      hidden: false
    },
    styles: {
      opacity: 0.7,
      "clip-path": "polygon( 0% 15%, 0% 0%, 15% 0%, 85% 0%, 100% 0%, 100% 15%, 100% 85%, 100% 100%, 85% 100%, 15% 100%, 0% 100%, 0% 85% )"
    }
  },
  {
    primaryKey: "Vcr",
    name: "vcr",
    displayName: "VCR",
    canContain: false,
    width: 80,
    height: 100,
    attrs: { src: "equipment/layout-Reader-VCR", rotate: 0, hidden: false }
  },
  {
    primaryKey: "Linksignal",
    name: "arrows",
    displayName: "LinkSignal",
    canContain: false,
    width: 80,
    height: 100,
    attrs: { src: "equipment/arrows", rotate: 0, hidden: false }
  },
  {
    primaryKey: "Button",
    name: "custom-button",
    displayName: "Button",
    text: "Button",
    width: 200,
    height: 40,
    attrs: {},
    styles: { overflow: "hidden", "text-overflow": "ellipsis" }
  },
  {
    primaryKey: "Text",
    name: "custom-text",
    displayName: "Text",
    width: 150,
    height: 25,
    attrs: {},
    styles: { overflow: "hidden", "text-overflow": "ellipsis" }
  },
  {
    primaryKey: "DynamicTags",
    name: "dynamictags",
    displayName: "动态标签",
    element: true,
    width: 150,
    height: 25,
    attrs: { children: [] },
    styles: {
      "background-color": "#000",
      color: "#fff",
      overflow: "hidden",
      "text-overflow": "ellipsis"
    }
  },
  {
    primaryKey: "Image",
    name: "custom-image",
    displayName: "Image",
    canContain: false,
    width: 80,
    height: 80,
    attrs: { src: "equipment/", rotate: 0, hidden: false },
    styles: {
      overflow: "hidden",
      "border-color": "rgba(0, 0, 0, 0.15)",
      "border-style": "solid",
      "border-width": "1px"
    }
  },
  {
    primaryKey: "Car",
    name: "car",
    displayName: "小车",
    canContain: false,
    width: 1000,
    height: 140,
    attrs: { direction: "left", col: "80" },
    styles: {
      overflow: "hidden",
      "border-color": "rgba(0, 0, 0, 0.15)",
      "border-style": "solid",
      "border-width": "1px",
      "background-color":"#8887878F"
    }
  }
];
