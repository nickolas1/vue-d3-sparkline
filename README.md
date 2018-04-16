# vue-sparkline

A D3 sparkline component for vue.

[Demo](https://nickolas1.github.io/vue-d3-sparkline/)

## Installation
```sh
npm i vue-d3-sparkline
```

## Basic usage
```js
import SparkLine from "vue-d3-sparkline";
```

```html
<SparkLine :data="data" /> 
```

## Data format
### Standard
```js
data = [{x: <number>, y: <number>}, ...]
```

### Custom
different object form:
```js
dataCustom = [{xval: <number>, value: <number>}, ...]
xAccessor = d => d.xval
yAccessor = d => d.value
```
or as an array of arrays:
```js
dataCustom = [[<number>, <number>], ...]
xAccessor = d => d.[0]
yAccessor = d => d.[1]
```
```html
<Sparkline :data="dataCustom" :x-accessor="xAccessor" :y-accessor="yAccessor" />
```


## Properties
| prop        | type | required | default value |
| ------------ |:---:|:--------:|:-------------:|
| data | Array(Object) | false (but really, should have some data) | [] |
| showPoints | boolean | false | false |
| xAccessor | function | false | d => d.x |
| yAccessor | function | false | d => d.y |
| display | string ('inline', 'fill', 'newline') | false | 'inline' |
| height | number | false | 16 |
| aspectRatio | number | false | 5 |
| responsive | boolean | false | false |

