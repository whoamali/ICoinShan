/** @format */

// import React, {forwardRef, useRef, useEffect} from "react"
// import {
//   Chart as Chart$1,
//   LineController,
//   BarController,
//   RadarController,
//   DoughnutController,
//   PolarAreaController,
//   BubbleController,
//   PieController,
//   ScatterController,
// } from "chart.js"

const defaultDatasetIdKey = "label"
function reforwardRef(ref, value) {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}
function setOptions(chart, nextOptions) {
  chart.options = {
    ...nextOptions,
  }
}
function setLabels(currentData, nextLabels) {
  currentData.labels = nextLabels
}
function setDatasets(
  currentData,
  nextDatasets,
  datasetIdKey = defaultDatasetIdKey
) {
  const addedDatasets = []
  currentData.datasets = nextDatasets.map((nextDataset) => {
    // given the new set, find it's current match
    const currentDataset = currentData.datasets.find(
      (dataset) => dataset[datasetIdKey] === nextDataset[datasetIdKey]
    )
    // There is no original to update, so simply add new one
    if (
      !currentDataset ||
      !nextDataset.data ||
      addedDatasets.includes(currentDataset)
    ) {
      return {
        ...nextDataset,
      }
    }
    addedDatasets.push(currentDataset)
    Object.assign(currentDataset, nextDataset)
    return currentDataset
  })
}
function cloneData(data, datasetIdKey = defaultDatasetIdKey) {
  const nextData = {
    labels: [],
    datasets: [],
  }
  setLabels(nextData, data.labels)
  setDatasets(nextData, data.datasets, datasetIdKey)
  return nextData
}
/**
 * Get dataset from mouse click event
 * @param chart - Chart.js instance
 * @param event - Mouse click event
 * @returns Dataset
 */ function getDatasetAtEvent(chart, event) {
  return chart.getElementsAtEventForMode(
    event.nativeEvent,
    "dataset",
    {
      intersect: true,
    },
    false
  )
}
/**
 * Get single dataset element from mouse click event
 * @param chart - Chart.js instance
 * @param event - Mouse click event
 * @returns Dataset
 */ function getElementAtEvent(chart, event) {
  return chart.getElementsAtEventForMode(
    event.nativeEvent,
    "nearest",
    {
      intersect: true,
    },
    false
  )
}
/**
 * Get all dataset elements from mouse click event
 * @param chart - Chart.js instance
 * @param event - Mouse click event
 * @returns Dataset
 */ function getElementsAtEvent(chart, event) {
  return chart.getElementsAtEventForMode(
    event.nativeEvent,
    "index",
    {
      intersect: true,
    },
    false
  )
}

function ChartComponent(
  {
    height = 150,
    width = 300,
    redraw = false,
    datasetIdKey,
    type,
    data,
    options,
    plugins = [],
    fallbackContent,
    ...props
  },
  ref
) {
  const canvasRef = React.useRef(null)
  const chartRef = React.useRef()
  const renderChart = () => {
    if (!canvasRef.current) return
    chartRef.current = new Chart(canvasRef.current, {
      type,
      data: cloneData(data, datasetIdKey),
      options,
      plugins,
    })
    reforwardRef(ref, chartRef.current)
  }
  const destroyChart = () => {
    reforwardRef(ref, null)
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
  }
  React.useEffect(() => {
    if (!redraw && chartRef.current && options) {
      setOptions(chartRef.current, options)
    }
  }, [redraw, options])
  React.useEffect(() => {
    if (!redraw && chartRef.current) {
      setLabels(chartRef.current.config.data, data.labels)
    }
  }, [redraw, data.labels])
  React.useEffect(() => {
    if (!redraw && chartRef.current && data.datasets) {
      setDatasets(chartRef.current.config.data, data.datasets, datasetIdKey)
    }
  }, [redraw, data.datasets])
  React.useEffect(() => {
    if (!chartRef.current) return
    if (redraw) {
      destroyChart()
      setTimeout(renderChart)
    } else {
      chartRef.current.update()
    }
  }, [redraw, options, data.labels, data.datasets])
  React.useEffect(() => {
    renderChart()
    return () => destroyChart()
  }, [])
  return /*#__PURE__*/ React.createElement(
    "canvas",
    Object.assign(
      {
        ref: canvasRef,
        role: "img",
        height: height,
        width: width,
      },
      props
    ),
    fallbackContent
  )
}
const ChartForwardRef = /*#__PURE__*/ React.forwardRef(ChartComponent)

function createTypedChart(type, registerables) {
  Chart.register(registerables)
  return /*#__PURE__*/ React.forwardRef((props, ref) =>
    /*#__PURE__*/ React.createElement(
      ChartForwardRef,
      Object.assign({}, props, {
        ref: ref,
        type: type,
      })
    )
  )
}
const Line = /* #__PURE__ */ createTypedChart("line", Chart.LineController)
const Bar = /* #__PURE__ */ createTypedChart("bar", Chart.BarController)
const Radar = /* #__PURE__ */ createTypedChart("radar", Chart.RadarController)
const Doughnut = /* #__PURE__ */ createTypedChart(
  "doughnut",
  Chart.DoughnutController
)
const PolarArea = /* #__PURE__ */ createTypedChart(
  "polarArea",
  Chart.PolarAreaController
)
const Bubble = /* #__PURE__ */ createTypedChart("bubble", Chart.BubbleController)
const Pie = /* #__PURE__ */ createTypedChart("pie", Chart.PieController)
const Scatter = /* #__PURE__ */ createTypedChart("scatter", Chart.ScatterController)

// export {
//   Bar,
//   Bubble,
//   Chart,
//   Doughnut,
//   Line,
//   Pie,
//   PolarArea,
//   Radar,
//   Scatter,
//   getDatasetAtEvent,
//   getElementAtEvent,
//   getElementsAtEvent,
// }
//# sourceMappingURL=index.modern.js.map
