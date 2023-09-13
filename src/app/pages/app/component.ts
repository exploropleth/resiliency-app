import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import html2canvas from 'html2canvas';
import * as jQuery from 'jquery';
import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as changedpi from 'changedpi';
import { BinGuru } from "binguru";
import vegaEmbed, { Config } from "vega-embed";

// Local
import baseGeoVisSpec from "./baseGeoVisSpec.json";
import { AppConfig } from "src/app/app.configuration";
import { COLOR_SCHEMES } from "./colorSchemes";
import { DATASETS } from "./datasets";
import * as binningMethods from "./binningMethods";

@Component({
  selector: "resiliency-app",
  templateUrl: "./component.html",
  providers: [],
  styleUrls: ["./component.scss"],
})
export class MainComponent implements OnInit {

  @ViewChild('compareBinFrequencyVisContainer', { read: ElementRef }) compareBinFrequencyVisContainer: ElementRef;
  @ViewChild('resiliencyVisContainer', { read: ElementRef }) resiliencyVisContainer: ElementRef;
  @ViewChild('attrDistributionVisContainer', { read: ElementRef }) attrDistributionVisContainer: ElementRef;
  @ViewChild('downloadImageCanvas') downloadImageCanvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  visModel: Object;
  baseGeoVisSpec: Object;
  validBinningMethodsForResiliency: Array<string>;
  objectKeys: any;
  objectValues: any;
  appConfig: any;

  constructor() {

    let context = this;
    this.objectKeys = Object.keys;
    this.objectValues = Object.values;
    this.appConfig = AppConfig;

    // Customizable properties
    this.visModel = {
      // Set Data
      datasets: DATASETS,
      // dataset: DATASETS[0]["geographies"][0]["features"][1], // INDIA > FERTILITY RATE
      dataset: DATASETS[1]["geographies"][0]["features"][0], // USA > Life Expectancy
      // Processed Data
      baseDataFeatureCollection: [],
      featureData: {},
      featureDataNaNs: {},
      featureRawDataWithNaNs: {},
      featureRawDataWithNaNsJSON: [],
      histogramBins: [],
      binMaxCount: 0,
      showInvalidValues: "on", // on | off
      invalidValuesColor: "grey",
      binCount: 6,
      frequencyOfBins: {},
      frequentBins: {},
      resiliency: {},
      validBinningMethodsForResiliency: {
        [binningMethods.EQUAL_INTERVAL]: { selected: true },
        [binningMethods.PERCENTILE]: { selected: true },
        [binningMethods.QUANTILE]: { selected: true },
        [binningMethods.GEOMETRIC_INTERVAL]: { selected: true },
        [binningMethods.BOXPLOT]: { selected: true },
        [binningMethods.STANDARD_DEVIATION]: { selected: true },
        [binningMethods.MAXIMUM_BREAKS]: { selected: true },
        [binningMethods.FISHER_JENKS]: { selected: true },
        // [binningMethods.PRETTY_BREAKS]: { selected: true },
        // [binningMethods.CK_MEANS]: { selected: true }
      },
      binningMethodsForResiliency: [],
      specialDataClassificationTypes: {
        [binningMethods.SPECIAL_MOST_FREQUENT_CLASS]: {
          name: "Most Consistent Bin"
        },
        [binningMethods.SPECIAL_FREQUENCY_MOST_FREQUENT_CLASS]: {
          name: "Frequency of Most Consistent Bin"
        },
        [binningMethods.SPECIAL_COMBINED_MOST_FREQUENT_CLASS]: {
          name: "Most Consistent Bin and its Frequency"
        }
      },
      binGuruObj: null,
      colorSchemes: COLOR_SCHEMES,
      colorScheme: COLOR_SCHEMES[3]["examples"][2], // purple-orange diverging
      binningMethods: binningMethods.BINNING_METHODS,
      dataMap: new Map(),
      colorScale: null,
      primaryKeys: []
    };
  }

  getColorScheme() {
    let context = this;
    return context.visModel['colorScheme']["code"];
  }

  /*
 * Use html2canvas to download the div as an image.
 */
  downloadView(tab, elementRef, size = "medium", event) {

    let scale, dpi;
    switch (size) {
      case "small":
        scale = 1;
        dpi = 72;
        break;
      case "medium":
        scale = 5;
        dpi = 150;
        break;
      case "large":
        scale = 10;
        dpi = 300;
        break;
    }

    html2canvas($(elementRef)[0] as HTMLElement, { scale: scale }).then(canvas => {
      // this.downloadImageCanvas.nativeElement.src = canvas.toDataURL();
      const dataUrl = canvas.toDataURL('image/png');
      var customResDataUrl = changedpi.changeDpiDataUrl(dataUrl, dpi);
      this.downloadLink.nativeElement.href = customResDataUrl;
      this.downloadLink.nativeElement.download = size + '-export.png';
      this.downloadLink.nativeElement.click();
    });
  }


  /* 
  * Get shape of data, 
  */
  getDataShape(type = "total") {
    let context = this;
    let response;
    try {
      const valid = context.visModel['featureData'][context.visModel["dataset"]["feature"]].length;
      const invalid = context.visModel['featureDataNaNs'][context.visModel["dataset"]["feature"]];
      let total = valid + invalid;
      switch (type) {
        case "total":
          response = total;
          break;
        case "valid":
          response = valid;
          break;
        case "invalid":
          response = invalid;
          break;
        case "invalidpct":
          response = (invalid * 100 / total).toPrecision(3);
          break;
      }
    } catch (err) {
      response = -1;
    }
    return response;
  }

  getValidBinningMethodForResiliency() {
    let context = this;
    let arr = [];
    Object.keys(context.visModel["validBinningMethodsForResiliency"]).forEach(function (key) {
      if (context.visModel["validBinningMethodsForResiliency"][key]["selected"] && !context.isCompatibleBinningMethod(key)) arr.push(key);
    });
    return arr;
  }

  isCompatibleBinningMethod(binningMethod){
    let context = this;
    let binCount = context.visModel["binCount"];
    if(binCount != 6){
      if([binningMethods.PERCENTILE, binningMethods.BOXPLOT].indexOf(binningMethod) !== -1){
        return true;
      }
    }
    return false;
  }

  prepareSpecialVIS() {
    let context = this;
    let combinedJSON = [];
    let tooltips = [];

    // Prepare the data to be bound to the visualization
    Object.keys(context.visModel["frequencyOfBins"]).forEach(function (primaryKey, valIndex) {
      let obj = {
        "Frequency_of_Most_Frequent_Bin": context.visModel["frequencyOfBins"][primaryKey],
        "Most_Frequent_Bin": context.visModel["frequentBins"][primaryKey]
      };
      obj[context.visModel["dataset"]["primaryKey"]] = primaryKey;

      context.visModel["binningMethodsForResiliency"].forEach(function (dataClassificationType) {
        obj[dataClassificationType] = context.visModel["resiliency"]["binObjs"][dataClassificationType]["dataBinAssignments"][valIndex];
        tooltips.push({
          "field": dataClassificationType,
          "type": "ordinal",
          "title": "BinID(" + context.visModel['binningMethods'][dataClassificationType]['name'] + ")"
        });
      });
      combinedJSON.push(obj);
    });

    // Override number of columns so that they are linearly ordered.
    const noOfColumns = 1;
    context.baseGeoVisSpec["columns"] = noOfColumns;

    // Bind the data to the Vega-Lite specification
    context.baseGeoVisSpec["transform"].push({
      "lookup": context.visModel["dataset"]["topoPrimaryKey"],
      "from": {
        "data": {
          "values": combinedJSON
        },
        "key": context.visModel["dataset"]["primaryKey"],
        "fields": ["Frequency_of_Most_Frequent_Bin", "Most_Frequent_Bin", context.visModel["dataset"]["primaryKey"], ...context.visModel["binningMethodsForResiliency"]]
      }
    });

    let width = (context.compareBinFrequencyVisContainer.nativeElement.parentNode.offsetWidth / noOfColumns) - 10 - 30 - 60; // adjustments for spacing
    let height = width * 0.66;

    // Loop over the special data classification types
    Object.keys(context.visModel["specialDataClassificationTypes"]).forEach(function (specialDataClassificationType) {

      let obj2Concat = {
        "width": width,
        "height": height,
        "layer": [{
          "title": {
            "text": context.visModel["specialDataClassificationTypes"][specialDataClassificationType]['name'],
            "subtitle": "across multiple binning methods.",
            "fontSize": 24,
            "subtitleFontSize": 18,
            "color": "#34495e",
            "dy": 0
          },
          "projection": {
            "type": context.visModel["dataset"]["mapProjection"],
            "fit": context.visModel['baseDataFeatureCollection'],
            "center": context.visModel["dataset"]['mapCenter']
          },
          "mark": {
            "type": "geoshape",
            "stroke": "black",
            "strokeWidth": "0.35", // TODO: Support this as a feature.
            "invalid": context.visModel['showInvalidValues'] == "on" ? null : "filter", // If set to `null`, then all affected marks are included and treated as zeroes. If set to 'filter', all affected marks are filtered out, e.g., geoshapes associated with Lake Michigan near Chicago.
          },
          "encoding": {
            "color": {
              // ToDo: This color condition works but the legend shows this condition's color in the opacity channel which can be misleading; this color is just for NaN/null, not the entire map. 
              // Noted bug, maybe?
              "condition": {
                "test": "!isValid(datum['Frequency_of_Most_Frequent_Bin'])", // Uncomment this along with setting the "invalid" mark property above to `null`
                "value": context.visModel['invalidValuesColor']
              },
              "field": "Most_Frequent_Bin",
              "type": "ordinal",
              "legend": {
                "title": "Bin",
                "titleFontSize": 16,
                "labelFontSize": 18,
                // offset: -40,
              },
              "scale": {
                "domain": [...Array(context.visModel['binCount']).keys()].map(x => x += 1),
                "type": 'ordinal',
                "scheme": context.getColorScheme()
              }
            },
            "opacity": {
              "field": "Frequency_of_Most_Frequent_Bin",
              "type": "quantitative",
              "legend": {
                "title": "Freq",
                "values": new Array(context.visModel["binningMethodsForResiliency"].length).fill(null).map((_, i) => i + 1),
                "titleFontSize": 16,
                "labelFontSize": 18,
                // offset: -40,
              },
              "scale": {
                "domain": [1, context.visModel["binningMethodsForResiliency"].length],
                "range": [0.1, 1],
                "type": 'pow',
              }
            },
            "tooltip": [
              ...context.getMapTooltip(),
              { "field": "Most_Frequent_Bin", "type": "ordinal", "title": "Most Frequent Bin" },
              { "field": "Frequency_of_Most_Frequent_Bin", "type": "ordinal", "title": "Frequency of Most Frequent Bin" },
              ...tooltips
            ]
          }
        }],
      }

      // Remove "condition" spec within color if invalidValues are supposed to be hidden.
      if (context.visModel["showInvalidValues"] == "off") {
        delete obj2Concat["layer"][0]["encoding"]["color"]["condition"];
      }

      // Remove "opacity" encoding for SPECIAL_MOST_FREQUENT_CLASS
      if (specialDataClassificationType == binningMethods.SPECIAL_MOST_FREQUENT_CLASS) {
        delete obj2Concat["layer"][0]["encoding"]["opacity"];
      }

      // Remove "color" encoding for SPECIAL_FREQUENCY_MOST_FREQUENT_CLASS
      if (specialDataClassificationType == binningMethods.SPECIAL_FREQUENCY_MOST_FREQUENT_CLASS) {
        // This works, but it removes the `condition` to hide/show nans/nulls which is annoying.
        obj2Concat["layer"][0]["mark"]["fill"] = "black";
        delete obj2Concat["layer"][0]["encoding"]["color"];

        // HACK: Let the encoding channel stay but override it's scale and domain.
        // obj2Concat["layer"][0]["encoding"]["color"]["scale"] = {
        //   "domain": [...Array(context.visModel['binCount']).keys()].map(x => x += 1),
        //   "type": "category",
        //   "range": [...Array(context.visModel['binCount']).keys()].map(x => "black"),
        // } as any;
      }

      // add it to the spec
      context.baseGeoVisSpec["concat"].push(obj2Concat);

    });

  }


  getMapTooltip() {
    let context = this;
    let tooltipContent = [];
    // Feature
    tooltipContent.push({ "field": context.visModel["dataset"]["feature"], "type": "quantitative", "title": context.visModel["dataset"]["feature"], "format": ".2f" });

    // Primary Key
    tooltipContent.push({ "field": context.visModel["dataset"]["primaryKey"], "type": "nominal", "title": context.visModel["dataset"]["primaryKey"] });

    // Label Features
    context.visModel["dataset"]["labelFeatures"].forEach(function (feat) {
      tooltipContent.push({ "field": feat, "type": "nominal", "title": feat }); // ToDo: datatype is nominal for now.
    });

    return tooltipContent;
  }


  prepareResiliencyVIS(scale) {
    let context = this;

    // VIS Size
    let width = context.resiliencyVisContainer.nativeElement.parentNode.offsetWidth - 10 - 30 - 60; // adjustments for spacing
    let height = width * 0.66;

    let obj2Concat = {
      "width": width,
      "height": height,
      "layer": [{
        "title": {
          "text": "Resiliency",
          "subtitle": ["Geographies are placed in their most agreed-upon bin across multiple binning methods."], // set below after the binSizes are computed
          "limit": width - 20, // for DEFINED_INTERVAL, the resultant binCount can be so huge that a limit to the subtitle text is necessary.
          "fontSize": 24,
          "subtitleFontSize": 18,
          "color": "#34495e",
          "dy": 0
        },
        "projection": {
          "type": context.visModel["dataset"]["mapProjection"],
          "fit": context.visModel['baseDataFeatureCollection'],
          "center": context.visModel["dataset"]['mapCenter']
        },
        "mark": {
          "type": "geoshape",
          "stroke": "black",
          "strokeWidth": "0.35", // TODO: Support this as a feature.
          "invalid": context.visModel['showInvalidValues'] == "on" ? null : "filter", // If set to `null`, then all affected marks are included and treated as zeroes. If set to 'filter', all affected marks are filtered out, e.g., geoshapes associated with Lake Michigan near Chicago. Note: To color these marks as grey or some other color instead, set this value to `null` and then uncomment the "condition" under "color" below.
        },
        "encoding": {
          "color": {
            "condition": {
              "test": "!isValid(datum['" + context.visModel["dataset"]["feature"] + "'])", // Uncomment this along with setting the "invalid" mark property above to `null`
              "value": context.visModel['invalidValuesColor']
            },
            "field": context.visModel["dataset"]["feature"],
            "type": "quantitative",
            "legend": {
              "title": null,
              "format": ".3f", // Format
              "labelFontSize": 16
              // "labelOverlap": false
            },
            // "legend": null, // Legend takes width that messes up the `width` computation. Unfortunately, Vega-Lite doesn't do the `autosize` stuff well for concatenated views such as these; hence, legend is disabled.
            "scale": scale
          },
          "tooltip": context.getMapTooltip()
        }
      }]
    }

    // add it to the spec
    context.baseGeoVisSpec["concat"].push(obj2Concat);

  }


  renderAttrDistributionVisSpec() {
    let context = this;
    let spec = null, invalidPlotWidth = 20;

    let width = (context.attrDistributionVisContainer.nativeElement.offsetWidth) - 60; // adjustments for spacing
    width = context.visModel['showInvalidValues'] == "off" ? width : width - 4 * invalidPlotWidth;
    let height = width * 0.4;

    let invalidCount = context.getDataShape("invalid");
    let yrange = [0, context.visModel["binMaxCount"] > invalidCount ? context.visModel["binMaxCount"] : invalidCount];

    spec = {
      "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
      "data": { "values": context.visModel["histogramBins"] },
      "config": {
        "concat": {
          "spacing": 0
        }
      },
      "concat": [{
        "width": width,
        "height": height,
        "mark": {
          "type": "bar",
          "tooltip": { "content": "data" }
        },
        "encoding": {
          "x": {
            "field": "bin_start",
            "bin": { "binned": true },
            "title": null,
            "type": "quantitative",
            "axis": {
              "labelFontSize": 12,
              "titleFontSize": 14
            }
          },
          "x2": {
            "field": "bin_end",
            "axis": {
              "labelFontSize": 12,
              "titleFontSize": 14
            }
          },
          "y": {
            "field": "count",
            "title": "count",
            "type": "quantitative",
            "scale": {
              "domain": yrange
            },
            "axis": {
              "formatType": "number",
              "format": ".2s",
              "labelFontSize": 12,
              "titleFontSize": 14
            }
          },
          "tooltip": [{"field": "bin_start", "type": "quantitative", "format": ".2f"},
          {"field": "bin_end", "type": "quantitative", "format": ".2f"},
          {"field": "count", "type": "quantitative"}]
        }
      }]
    }

    if (context.visModel["showInvalidValues"] == "on") {
      spec["concat"].push({
        "width": invalidPlotWidth,
        "height": height,
        "data": { "values": [{ "field": "NaN/nulls", "invalidCount": invalidCount }] },
        "mark": {
          "type": "bar",
          "tooltip": { "content": "invalidCount" }
        },
        "encoding": {
          "x": {
            "field": "field",
            "type": "nominal",
            "title": null,
            "axis": {
              "labelAngle": "0",
              "labelFontSize": 12,
              "titleFontSize": 14
            }
          },
          "y": {
            "field": "invalidCount",
            "type": "quantitative",
            "title": "count",
            "scale": {
              "domain": yrange,
            },
            "axis": {
              "orient": "right",
              "formatType": "number",
              "format": ".2s",
              "labelFontSize": 12,
              "titleFontSize": 14
              // "labels": false,
              // "ticks": false,
            }
          }
        }
      }
      );
    }

    // Render (or embed) Vega-Lite spec.
    vegaEmbed("#attrDistributionVisContainer", spec, context.appConfig.vegaLiteOptions)
      .then(result => { })
      .catch(console.warn);

  }

  prepareBaseVISSpec() {
    let context = this;
    // Start with the baseGeoVisSpec
    context.baseGeoVisSpec = JSON.parse(JSON.stringify(baseGeoVisSpec));

    // Set number of columns in the grid
    context.baseGeoVisSpec["columns"] = 1;
    // context.baseGeoVisSpec["columns"] = context.visModel['columns'];

    // Data
    context.baseGeoVisSpec["data"]["url"] = AppConfig['dataPath'] + context.visModel["dataset"]["geoFile"];
    // context.baseGeoVisSpec["transform"][0]["from"]["data"]["url"] = AppConfig['dataPath'] + context.visModel["dataset"]["featureFile"];
    delete context.baseGeoVisSpec["transform"][0]["from"]["data"]["url"];
    context.baseGeoVisSpec["transform"][0]["from"]["data"]["values"] = context.visModel['featureRawDataWithNaNsJSON'];
    context.baseGeoVisSpec["transform"][0]["from"]["key"] = context.visModel["dataset"]["primaryKey"];
    context.baseGeoVisSpec["transform"][0]["lookup"] = context.visModel["dataset"]["topoPrimaryKey"];

    // Set TopoJSON feature root property
    context.baseGeoVisSpec["data"]["format"]["feature"] = context.visModel["dataset"]["topoFeatureRootKey"];

    // Specify all fields that are needed in the Vega-Lite object model: primaryKey, features, labelFeatures
    context.baseGeoVisSpec["transform"][0]["from"]["fields"] = [context.visModel["dataset"]['primaryKey'], ...context.visModel["dataset"]['labelFeatures'], ...context.visModel["dataset"]["features"]];

  }

  renderVIS() {
    let context = this;

    // Get valid data classification types
    context.visModel["binningMethodsForResiliency"] = context.getValidBinningMethodForResiliency();

    // Resiliency, which depends on the other data classification types.
    context.visModel["resiliency"] = context.visModel["binGuruObj"].resiliency(context.visModel["binningMethodsForResiliency"], {});

    let resiliencyScale = {};
    resiliencyScale["domain"] = context.visModel["resiliency"]["binBreaks"];
    resiliencyScale['type'] = 'threshold';
    resiliencyScale['scheme'] = context.getColorScheme();

    // Map back frequentBins to its primaryKey index.
    context.visModel["frequentBins"] = {}
    Object.values(context.visModel["resiliency"]["mostFrequentBins"]).forEach(function(value, valindex){
      let primaryKey = context.visModel['primaryKeys'][valindex];
      context.visModel["frequentBins"][primaryKey] = value;
    });

    // Map back frequencyOfBins to its primaryKey index.
    context.visModel["frequencyOfBins"] = {};
    Object.values(context.visModel["resiliency"]["frequencyOfMostFrequentBins"]).forEach(function(value, valindex){
      let primaryKey = context.visModel['primaryKeys'][valindex];
      context.visModel["frequencyOfBins"][primaryKey] = value;
    });

    // Prepare VIS for special class frequency / consistency.
    context.prepareBaseVISSpec();
    context.prepareSpecialVIS();

    // Render (or embed) Vega-Lite spec.
    vegaEmbed("#compareBinFrequencyVisContainer", context.baseGeoVisSpec, context.appConfig.vegaLiteOptions)
      .then(result => { })
      .catch(console.warn);

    // Prepare resiliency VIS
    context.prepareBaseVISSpec();
    context.prepareResiliencyVIS(resiliencyScale);

    // Render (or embed) Vega-Lite spec.
    vegaEmbed("#resiliencyVisContainer", context.baseGeoVisSpec, context.appConfig.vegaLiteOptions)
      .then(result => { })
      .catch(console.warn);
  }

  updateDataset() {
    let context = this;

    Promise.all([
      d3.json(AppConfig['dataPath'] + context.visModel["dataset"]["geoFile"]),
      d3.csv(AppConfig['dataPath'] + context.visModel["dataset"]["featureFile"], function (d) {
        context.visModel['dataMap'].set(d[context.visModel["dataset"]["primaryKey"]], d);
        return d;
      })]).then(function (dataFromPromise) {

        let geoTopoData: any = dataFromPromise[0];
        let data = dataFromPromise[1];

        // Reset PrimaryKeys, Data-related datastructures
        context.visModel['primaryKeys'] = [];
        context.visModel['featureData'] = {};
        context.visModel['featureDataNaNs'] = {};
        context.visModel['featureRawDataWithNaNs'] = {};
        context.visModel['featureRawDataWithNaNsJSON'] = [];

        // Set baseData feature collection to be able to `fit` the resultant projected map within the view bounds
        context.visModel['baseDataFeatureCollection'] = topojson.feature(geoTopoData, geoTopoData.objects[context.visModel["dataset"]["topoFeatureRootKey"]])["features"];

        // Store feature data
        data.forEach(function (row) {
          let processedRow = {};

          // Primary Keys
          context.visModel['primaryKeys'].push(row[context.visModel["dataset"]["primaryKey"]]);

          Object.keys(row).forEach(function (attr) {
            if (!(attr in context.visModel['featureData'])) {
              context.visModel['featureData'][attr] = [];
            }
            if (!(attr in context.visModel['featureDataNaNs'])) {
              context.visModel['featureDataNaNs'][attr] = 0;
            }
            if (!(attr in context.visModel['featureRawDataWithNaNs'])) {
              context.visModel['featureRawDataWithNaNs'][attr] = [];
            }
            let value = parseFloat(row[attr]);
            if (Number.isNaN(value)) {
              context.visModel['featureDataNaNs'][attr]++;
              context.visModel['featureRawDataWithNaNs'][attr].push(row[attr]); // Add everything including NaNs and valid values to this key
            } else {
              context.visModel['featureData'][attr].push(value);
              context.visModel['featureRawDataWithNaNs'][attr].push(value); // Add everything including NaNs and valid values to this key
            }

            if (context.visModel["dataset"]["features"].indexOf(attr) !== -1) {
              processedRow[attr] = Number.isNaN(value) || value == null ? NaN : value; // Can set it to `null` or `NaN`
            } else {
              processedRow[attr] = row[attr];
            }
          });

          // Add everything including NaNs and valid values to this JSON
          context.visModel['featureRawDataWithNaNsJSON'].push(processedRow);
        });

        context.updateAllVis();
      });
  }

  updateAllVis(){
    let context = this;

    // Data
    let data = context.visModel['featureRawDataWithNaNs'][context.visModel["dataset"]["feature"]];

    // BinGuru data object.
    let binCount = context.visModel['binCount'];

    context.visModel["binGuruObj"] = new BinGuru(data, binCount);
    let min = context.visModel["binGuruObj"]["min"];
    let max = context.visModel["binGuruObj"]["max"];
    let minSortedData = context.visModel["binGuruObj"]["minSortedData"];

    // render AttributeDistributionVIS
    let thresholds = [];
    const gap = (max - min) / binCount;
    [...Array(binCount).keys()].forEach(function (index) {
      thresholds.push(min + gap * (index + 1));
    });

    var histGenerator = d3.bin()
      .value(d => d)
      // .domain([this.min, this.max])
      // .thresholds(this.binCount + 1);
      .thresholds(thresholds);

    let bins = [];
    let binMaxCount = 0;
    histGenerator(minSortedData).forEach(function (bin) {
      if (binMaxCount < bin.length) {
        binMaxCount = bin.length;
      }
      bins.push({ bin_start: bin.x0, bin_end: bin.x1, count: bin.length })
    });
    context.visModel["binMaxCount"] = binMaxCount;
    context.visModel["histogramBins"] = bins;

    context.renderAttrDistributionVisSpec();
    context.renderVIS();
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    // Load dataset and start rocking
    this.updateDataset();
  }

  ngOnDestroy(): void { }

}