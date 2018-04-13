<template>
  <div id="app">
    <p>
      Inline sparkline <SparkLine :data="bigData1"/> goes here.
    </p>
    <p>
      with points <SparkLine :data="smallData" :show-points="true"/> goes here.
    </p>
    <p>
      Custom accessor <SparkLine :data="bigData2" :y-accessor="valueAccessor"/> goes here.
    </p>
    <p>
      non-inline sparkline <SparkLine :data="bigData1" :display="'newline'"/> goes here
    </p>
    <p>
      fill div
    </p>
    <div style="width:100%; height:100px">
      <SparkLine :data="bigData1" :display="'fill'" :responsive="true"/>
    </div>
  </div>
</template>

<script>
import SparkLine from "@/components/SparkLine";

export default {
  name: "app",
  components: {
    SparkLine
  },
  data() {
    const npts = 50000;
    const bigData1 = [{ x: 0, y: 100 }];
    const bigData2 = [{ x: 0, value: 100 }];
    const volatility = 0.02;
    for (let i = 1; i < npts; i++) {
      // const rnd = parseInt(Math.sin(i).toString().substr(6, 9)) / 1.e9
      const rnd = Math.random() - 0.5;
      let changePercent = volatility * rnd;
      const changeAmount = bigData1[i - 1]["y"] * changePercent;
      bigData1.push({ x: i, y: bigData1[i - 1]["y"] + changeAmount });
      bigData2.push({ x: i, value: bigData1[i - 1]["y"] + changeAmount });
    }
    const smallData = [
      { x: 1, y: 1 },
      { x: 2, y: 1.4 },
      { x: 3, y: 2.1 },
      { x: 4, y: 1.8 },
      { x: 5, y: 3 },
      { x: 6, y: 2.4 },
      { x: 7, y: 1.8 },
      { x: 8, y: 2.4 },
      { x: 9, y: 2.2 },
      { x: 10, y: 2.876 }
    ];
    return {
      bigData1,
      bigData2,
      smallData,
      valueAccessor: d => d.value
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
