let BASE_FEATURES = {
    "usa": {
        featureFile: "us-county-indicators.csv",
        features: [ "Life Expectancy (2021)", "Life Expectancy (2020)", "Adult Obesity Percentage", "Infant Mortality Rate", "Incarceration Rate", "Incarceration_Rate_1k", "HIV_Prevalence", "Motor Vehicle Death Rate", "Secondary Educational Attainment", "GINI Index (Income Inequality)", "Population Density", "Domestic In-Migrants 2010s", "Domestic In-Migrants 2010s (norm)", "Domestic Net Migrants 2010s", "Domestic Net Migrants 2010s (norm)",
        ],
        labelFeatures: ["State", "County"],
        primaryKey: "FIPS_Code",
    },
    "india": {
        featureFile: "india-states-uts-indicators.csv",
        features: ["Infant Mortality Rate", "Total Fertility Rate (Children per women)","Population Density","Death Rate", "Birth Rate", "Elementary School Gross Enrolment Ratio (%) - Boys","Elementary School Gross Enrolment Ratio (%) - Girls","Elementary School Gross Enrolment Ratio (%) - Overall","Secondary School Gross Enrolment Ratio (%) - Boys","Secondary School Gross Enrolment Ratio (%) - Girls","Secondary School Gross Enrolment Ratio (%) - Overall","Senior Secondary School Gross Enrolment Ratio (%) - Boys","Senior Secondary School Gross Enrolment Ratio (%) - Girls","Senior Secondary School Gross Enrolment Ratio (%) - Overall","Higher Education Gross Enrolment Ratio (%) - Boys","Higher Education Gross Enrolment Ratio (%) - Girls","Higher Education Gross Enrolment Ratio (%) - Overall"],
        labelFeatures: ["Category"],
        primaryKey: "State/UT"
    }
}

let BASE_GEOGRAPHIES = {
    "usa": {
        "county": {
            geoFile: "us-counties.json",
            mapProjection: "albersUsa",
            mapCenter: [98.5795, 39.8283],
            topoPrimaryKey: "id",
            topoFeatureRootKey: "counties"
        }
    },
    "india": {
        "state": {
            geoFile: "india-states-uts.json",
            mapProjection: "mercator",
            mapCenter: [78.9629, 20.5937],
            topoFeatureRootKey: "india-states-uts",
            topoPrimaryKey: "id"
        }
    }
}

let BASE_DATASET = [{
    "name": "India",
    "code": "india",
    "geographies": [{
        "name": "State",
        "code": "state",
        "features": []
    }]
},
{
    "name": "United States",
    "code": "usa",
    "geographies": [{
        "name": "County",
        "code": "county",
        "features": []
    }]
}
]

BASE_DATASET.forEach(function(dataset){
    dataset["geographies"].forEach(function(geography){
        let geoData = BASE_GEOGRAPHIES[dataset["code"]][geography["code"]];
        let combinedData = geoData;
        combinedData["featureFile"] = BASE_FEATURES[dataset["code"]]["featureFile"];
        combinedData["features"] = BASE_FEATURES[dataset["code"]]["features"];
        combinedData["labelFeatures"] = BASE_FEATURES[dataset["code"]]["labelFeatures"];
        combinedData["primaryKey"] = BASE_FEATURES[dataset["code"]]["primaryKey"];
        BASE_FEATURES[dataset["code"]]["features"].forEach(function(feature){
            combinedData["feature"] = feature;
            geography["features"].push(JSON.parse(JSON.stringify(combinedData)));
        });
    });
});

export let DATASETS = BASE_DATASET;