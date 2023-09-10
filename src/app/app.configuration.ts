export const AppConfig = Object.freeze({
  dataPath: 'assets/data/',
  tooltipOptions: Object.freeze({
    'autoPlacement': true,
    'showDelay': 0,
    'trigger': 'hover'
  }),
  vegaLiteOptions: Object.freeze({
    renderer: "canvas",
    // actions: true, // POSTER
    actions: false,
    hover: true,
    tooltip: true
  })
});