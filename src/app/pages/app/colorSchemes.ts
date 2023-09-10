import * as d3 from "d3";

export const COLOR_SCHEMES = [{
    "name": "Categorical",
    "examples": [{
        "sname": "Accent",
        "file": "Accent",
        "code": "accent",
        "function": d3.schemeAccent
    },
    {
        "sname": "Category 10",
        "file": "Category10",
        "code": "category10",
        "function": d3.schemeCategory10
    },
    {
        "sname": "Dark 2",
        "file": "Dark2",
        "code": "dark2",
        "function": d3.schemeDark2
    },
    {
        "sname": "Paired",
        "file": "Paired",
        "code": "paired",
        "function": d3.schemePaired
    },
    {
        "sname": "Pastel 1",
        "file": "Pastel1",
        "code": "pastel1",
        "function": d3.schemePastel1
    },
    {
        "sname": "Pastel 2",
        "file": "Pastel2",
        "code": "pastel2",
        "function": d3.schemePastel2
    },
    {
        "sname": "Set 1",
        "file": "Set1",
        "code": "set1",
        "function": d3.schemeSet1
    },
    {
        "sname": "Set 2",
        "file": "Set2",
        "code": "set2",
        "function": d3.schemeSet2
    },
    {
        "sname": "Set 3",
        "file": "Set3",
        "code": "set3",
        "function": d3.schemeSet3
    },
    {
        "sname": "Tableau 10",
        "file": "Tableau10",
        "code": "tableau10",
        "function": d3.schemeTableau10
    }]
},
{
    "name": "Sequential Single-Hue",
    "examples": [{
        "sname": "Blues",
        "file": "Blues",
        "code": "blues",
        "function": d3.schemeBlues
    }, 
    {
        "sname": "Greens",
        "file": "Greens",
        "code": "greens",
        "function": d3.schemeGreens
    }, 
    {
        "sname": "Oranges",
        "file": "Oranges",
        "code": "oranges",
        "function": d3.schemeOranges
    }, {
        "sname": "Reds",
        "file": "Reds",
        "code": "reds",
        "function": d3.schemeReds
    }, {
        "sname": "Purples",
        "file": "Purples",
        "code": "purples",
        "function": d3.schemePurples
    }, 
    {
        "sname": "Greys",
        "file": "Greys",
        "code": "greys",
        "function": d3.schemeGreys
    }]
},
{
    "name": "Sequential Multi-Hue",
    "examples": [{
        "sname": "Turbo",
        "file": "Turbo",
        "code": "turbo",
        "function": d3.interpolateTurbo
    },
    {
        "sname": "Magma",
        "file": "Magma",
        "code": "magma",
        "function": d3.interpolateMagma
    },
    {
        "sname": "Viridis",
        "file": "Viridis",
        "code": "viridis",
        "function": d3.interpolateViridis
    },
    {
        "sname": "Inferno",
        "file": "Inferno",
        "code": "inferno",
        "function": d3.interpolateInferno
    },
    {
        "sname": "Cividis",
        "file": "Cividis",
        "code": "cividis",
        "function": d3.interpolateCividis
    },
    {
        "sname": "Blue-Green",
        "file": "BuGn",
        "code": "bluegreen",
        "function": d3.schemeBuGn
    },
    {
        "sname": "Blue-Purple",
        "file": "BuPu",
        "code": "bluepurple",
        "function": d3.schemeBuPu
    },
    {
        "sname": "Green-Blue",
        "file": "GnBu",
        "code": "greenblue",
        "function": d3.schemeGnBu
    },
    {
        "sname": "Orange-Red",
        "file": "OrRd",
        "code": "orangered",
        "function": d3.schemeOrRd
    },
    {
        "sname": "Purple-Blue-Green",
        "file": "PuBuGn",
        "code": "purplebluegreen",
        "function": d3.schemePuBuGn
    },
    {
        "sname": "Purple-Blue",
        "file": "PuBu",
        "code": "purpleblue",
        "function": d3.schemePuBu
    },
    {
        "sname": "Purple-Red",
        "file": "PuRd",
        "code": "purplered",
        "function": d3.schemePuRd
    },
    {
        "sname": "Red-Purple",
        "file": "RdPu",
        "code": "redpurple",
        "function": d3.schemeRdPu
    },
    {
        "sname": "Yellow-Green-Blue",
        "file": "YlGnBu",
        "code": "yellowgreenblue",
        "function": d3.schemeYlGnBu
    },
    {
        "sname": "Yellow-Green",
        "file": "YlGn",
        "code": "yellowgreen",
        "function": d3.schemeYlGn
    },
    {
        "sname": "Yellow-Orange-Brown",
        "file": "YlOrBr",
        "code": "yelloworangebrown",
        "function": d3.schemeYlOrBr
    },
    {
        "sname": "Yellow-Orange-Red",
        "file": "YlOrRd",
        "code": "yelloworangered",
        "function": d3.schemeYlOrRd
    }]
},
{
    "name": "Diverging",
    "examples": [
        {
        "sname": "Brown-Blue-Green",
        "file": "BrBG",
        "code": "brownbluegreen",
        "function": d3.schemeBrBG
    },
    {
        "sname": "Pink-Yellow-Green",
        "file": "PiYG",
        "code": "pinkyellowgreen",
        "function": d3.schemePiYG
    },
    {
        "sname": "Purple-Orange",
        "file": "PuOr",
        "code": "purpleorange",
        "function": d3.schemePuOr
    },
    {
        "sname": "Red-Blue",
        "file": "RdBu",
        "code": "redblue",
        "function": d3.schemeRdBu
    },
    {
        "sname": "Red-Grey",
        "file": "RdGy",
        "code": "redgrey",
        "function": d3.schemeRdGy
    },
    {
        "sname": "Red-Yellow-Blue",
        "file": "RdYlBu",
        "code": "redyellowblue",
        "function": d3.schemeRdYlBu
    },
    {
        "sname": "Red-Yellow-Green",
        "file": "RdYlGn",
        "code": "redyellowgreen",
        "function": d3.schemeRdYlGn
    },
    {
        "sname": "Spectral",
        "file": "Spectral",
        "code": "spectral",
        "function": d3.schemeSpectral
    }
    ]
},
{
    "name": "Cyclical",
    "examples": [{
        "sname": "Rainbow",
        "file": "Rainbow",
        "code": "rainbow",
        "function": d3.interpolateRainbow
    },
    {
        "sname": "Sinebow",
        "file": "Sinebow",
        "code": "sinebow",
        "function": d3.interpolateSinebow
    }]
}
]