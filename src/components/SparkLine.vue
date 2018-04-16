<template>
    <div class="spark-line-container" :style="style">
        <svg :width="svgWidth" :height="svgHeight">
            <g :style="{transform: `translate(${pointRadius}px, ${pointRadius}px)`}">
                <path class="spark-line" :d="sparkLine" />
                <g v-if="showPoints">
                    <circle class="spark-point" v-for="point in points" :key="point.id" :cx="point.x" :cy="point.y" :r="point.r" />
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
import { scaleLinear as d3scaleLinear } from "d3-scale";
import { line as d3line } from "d3-shape";
import { extent as d3extent } from "d3-array";
import * as debounce from "lodash.debounce";
import Visvalingham from "../util/Visvalingham";

const displayOptions = ["inline", "fill", "newline"];

export default {
  name: "SparkLine",
  props: {
    showPoints: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    xAccessor: {
      type: Function,
      default: d => d.x
    },
    yAccessor: {
      type: Function,
      default: d => d.y
    },
    display: {
      type: String,
      default: "inline",
      validator: value => displayOptions.indexOf(value) > -1
    },
    isTimeSeries: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 16
    },
    aspectRatio: {
      type: Number,
      default: 5
    },
    showEndValue: {
      type: Boolean,
      default: false
    },
    showStartValue: {
      type: Boolean,
      default: false
    },
    responsive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const style = {};
    if (this.display === "fill") {
      style.height = "100%";
      style.width = "100%";
    } else {
      style.display = this.display === "inline" ? "inline-block" : "block";
    }
    return {
      svgWidth: 0,
      svgHeight: 0,
      points: [],
      pointRadius: 0,
      sparkLine: "",
      style: style
    };
  },
  mounted() {
    // if (this.responsive) window.addEventListener('resize', this.renderLine);
    if (this.responsive)
      window.addEventListener("resize", debounce(this.renderLine, 50));
    Visvalingham.calculateTriangles(this.data, this.xAccessor, this.yAccessor);
    this.renderLine();
  },
  beforeDestroy() {
    if (this.responsive) window.removeEventListener("resize", this.renderLine);
  },
  methods: {
    getSvgSize() {
      if (this.display === "fill") {
        this.svgHeight = this.$el.offsetHeight;
        this.svgWidth = this.$el.offsetWidth;
      } else {
        this.svgHeight =
          this.display === "inline"
            ? parseInt(
                window.getComputedStyle(this.$el).getPropertyValue("font-size")
              )
            : this.height;
        this.svgWidth = this.svgWidth = this.svgHeight * this.aspectRatio;
      }
      if (this.showPoints) {
        this.pointRadius = this.svgHeight / 8;
      }
    },
    setScales() {
      this.getSvgSize();
      const x = d3scaleLinear()
        .range([0, this.svgWidth - 2 * this.pointRadius])
        .domain(d3extent(this.data, this.xAccessor));
      const unitX = Math.abs(x(1) - x(0));
      const y = d3scaleLinear()
        .range([this.svgHeight - 2 * this.pointRadius, 0])
        .domain(d3extent(this.data, this.yAccessor));
      const unitY = Math.abs(y(1) - y(0));

      return { x, y, unitX, unitY };
    },
    renderLine() {
      const scales = this.setScales();
      const createLine = d3line()
        .x(d => scales.x(this.xAccessor(d)))
        .y(d => scales.y(this.yAccessor(d)));
      if (this.showPoints) {
        this.points = [];
        this.data.forEach((d, i) => {
          this.points.push({
            x: scales.x(this.xAccessor(d)),
            y: scales.y(this.yAccessor(d)),
            r: this.pointRadius,
            id: i
          });
        });
      }
      const plotData = Visvalingham.filter(
        this.data,
        scales.unitX * scales.unitY
      );
      this.sparkLine = createLine(plotData);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
path {
  fill: none;
  stroke: #454f5b;
  stroke-width: 1px;
}
circle {
  fill: #70563f;
  stroke-width: 1px;
  stroke: white;
}
</style>
