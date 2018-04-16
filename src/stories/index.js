import { storiesOf } from "@storybook/vue";
import { withKnobs, boolean, number } from "@storybook/addon-knobs/vue";
import { withMarkdownNotes } from "@storybook/addon-notes";

import SparkLine from "../components/SparkLine";

function baseDecorator() {
  return {
    template:
      '<div style="font-family: sans-serif; text-align: center; color: #2c3e50"><story/></div>'
  };
}

const nptsBig = 50000;
const nptsMed = 500;
const dataMed = [{ x: 0, y: 100 }];
const dataBig = [{ x: 0, y: 100 }];
const dataCustom = [{ x: 0, value: 100 }];
const dataArray = [[0, 100]]
const volatility = 0.02;
for (let i = 1; i < nptsBig; i++) {
  // const rnd = parseInt(Math.sin(i).toString().substr(6, 9)) / 1.e9
  const rnd = Math.random() - 0.5;
  let changePercent = volatility * rnd;
  const changeAmount = 1 + changePercent;
  dataBig.push({ x: i, y: dataBig[i - 1]["y"] * changeAmount });
  if (i < nptsMed) {
    dataMed.push({ x: i, y: dataBig[i - 1]["y"] + changeAmount });
    dataCustom.push({ x: i, value: dataBig[i - 1]["y"] + changeAmount });
    dataArray.push([i, dataBig[i - 1]["y"] + changeAmount]);
  }
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

storiesOf("SparkLine", module)
  .addDecorator(baseDecorator)
  .addDecorator(withKnobs)

  .add(
    "inline",
    withMarkdownNotes(`
~~~js
<SparkLine :data="data" />
~~~
default data format:
~~~
[{x: 1, y: 1}, ...]
~~~            
  `)(() => ({
      data() {
        return {
          data: dataMed
        };
      },
      template: `<p>Inline sparkline <SparkLine :data="data" /> rendered as part of a line of text</p>`
    }))
  )

  .add(
    "new line",
    withMarkdownNotes(`
~~~js
<SparkLine :data="data" :display="'newline'" />
~~~
  `)(() => ({
      data() {
        return {
          data: dataMed
        };
      },
      template: `<p>A sparkline <SparkLine :data="data" :display="'newline'" /> rendered on its own line</p>`
    }))
  )

  .add(
    "custom data accessor",
    withMarkdownNotes(`
Use the *x-accessor* and *y-accessor* properties to pass functions that access non-default data formats
~~~js
<SparkLine :data="data" :y-accessor="valueAccessor"/>
~~~
different data format:
~~~
[{x: 1, value: 1}, ...]
~~~            
with a custom data accessor:
~~~js
valueAccessor: d => d.value
~~~
  `)(() => ({
      data() {
        return {
          data: dataCustom,
          valueAccessor: d => d.value
        };
      },
      template: `<p><SparkLine :data="data" :y-accessor="valueAccessor"/></p>`
    }))
  )

  .add(
    "custom data accessor pt.2",
    withMarkdownNotes(`
Use the *x-accessor* and *y-accessor* properties to pass functions that access non-default data formats
~~~js
<SparkLine :data="data" :x-accessor="xAccessor" :y-accessor="yAccessor"/>
~~~
different data format:
~~~
[[1, 1], ...]
~~~            
with a custom data accessor:
~~~js
xAccessor: d => d[0]
yAccessor: d => d[1]
~~~
  `)(() => ({
      data() {
        return {
          data: dataArray,
          xAccessor: d => d[0],
          yAccessor: d => d[1]
        };
      },
      template: `<p><SparkLine :data="data" :x-accessor="xAccessor" :y-accessor="yAccessor"/></p>`
    }))
  )

  .add(
    "with points",
    withMarkdownNotes(`
Only a good idea for smaller datasets
~~~js
<SparkLine :data="data" :show-points="true"/>
~~~
  `)(() => ({
      data() {
        return {
          data: smallData
        };
      },
      template: `<p><SparkLine :data="data" :show-points="true"/></p>`
    }))
  )

  .add(
    "different aspect ratio",
    withMarkdownNotes(`
~~~js
<SparkLine :data="data" :aspect-ratio="aspectRatio"/>
~~~
  `)(() => ({
      data() {
        return {
          data: dataMed,
          aspectRatio: number("Aspect Ratio", 5)
        };
      },
      template: `<p><SparkLine :data="data" :aspect-ratio="aspectRatio"/></p>`
    }))
  )

  .add(
    "explicit height",
    withMarkdownNotes(`
Not currently supported for inline sparklines
~~~js
<SparkLine :data="data" :display="'newline'" :height="height" :aspect-ratio="aspectRatio" :responsive="true"/>
~~~
  `)(() => ({
      data() {
        return {
          data: dataMed,
          aspectRatio: number("Aspect Ratio", 5),
          height: number("Height in px", 80)
        };
      },
      template: `<p><SparkLine :data="data" :display="'newline'" :height="height" :aspect-ratio="aspectRatio" :responsive="true"/></p>`
    }))
  )

  .add(
    "fill parent container",
    withMarkdownNotes(`
Use the *responsive* property to re-render the plot when the parent container resizes. This is 50k data points, simplified appropriately for the size of the container.
~~~js
<SparkLine :data="data" :display="'fill'" :responsive="responsive"/>
~~~
  `)(() => ({
      data() {
        return {
          data: dataBig,
          responsive: boolean("Responsive", true)
        };
      },
      template: `<div style="width:100%; height:100px"><SparkLine :data="data" :display="'fill'" :responsive="responsive"/></div>`
    }))
  );
