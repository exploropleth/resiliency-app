export const EQUAL_INTERVAL = "equalInterval";
export const PERCENTILE = "percentile";
export const DEFINED_INTERVAL = "definedInterval";
export const QUANTILE = "quantile";
export const EQUAL_SIZE_INTERVAL_AREA = "equalSizeIntervalArea";
export const BOXPLOT = "boxPlot";
export const STANDARD_DEVIATION = "standardDeviation";
export const STANDARD_DEVIATION_ABSOLUTE = "standardDeviationAbsolute";
export const MAXIMUM_BREAKS = "maximumBreaks";
export const PRETTY_BREAKS = "prettyBreaks";
export const CK_MEANS = "ckMeans";
export const HEAD_TAIL_BREAKS = "headTailBreaks";
export const JENKS_CASPALL = "jenksCaspall";
export const MAX_P = "maxP";
export const FISHER_JENKS = "fisherJenks";
export const EXPONENTIAL_CLASS_SIZE = "exponentialClassSize";
export const GEOMETRIC_INTERVAL = "geometricInterval";
export const UNCLASSED = "unclassed";
export const MANUAL_INTERVAL = "manualInterval";
export const SPECIAL_FREQUENCY_MOST_FREQUENT_CLASS = "specialFrequencyMostFrequentClass";
export const SPECIAL_MOST_FREQUENT_CLASS = "specialMostFrequentClass";
export const SPECIAL_COMBINED_MOST_FREQUENT_CLASS = "specialCombinedMostFrequentClass";
export const RESILIENCY = "resiliency";


export let BINNING_METHODS = {
  [UNCLASSED]: {
    name: "Unclassed",
    description: ["No discrete bins; a continuous color ramp spans the range of data values."],
    longDescription: ["This method divides data into a continuous range of values, rather than into a set number of discrete bins; it uses a color ramp, typically progressing from low to high values, to represent the data, with each color in the ramp representing a different range of values."]
  },
  [DEFINED_INTERVAL]: {
    name: "Defined Interval",
    description: ["Number of bins are determined by manually specifying a desired bin interval."],
    longDescription: ["This method defines a series of bins with the same value range. By specifying the interval size and maximum sample size, the number of bins is determined automatically. For example, if the interval size is 75, each bin will span 75 units."]
  },
  [EQUAL_INTERVAL]: {
    name: "Equal Interval",
    description: ["Each bin has the same interval size based on the manually specified number of bins."],
    longDescription: ["This method divides the range of attribute values into equal-sized subranges (intervals). By specifying the number of bins (or intervals), the bin breaks are automatically determined based on the value range. For example, if we specify three bins for an attribute whose values range from 0 to 300, three bins with ranges of 0-100, 101-200, and 201-300 are created. Equal interval is best applied to familiar data ranges, such as percentages and temperature."]
  },
  [PRETTY_BREAKS]: {
    name: "Pretty Breaks",
    description: ["Each bin break is rounded to pretty values (e.g., to two signficant digits) by the user."],
    longDescription: ["This method rounds each bin break up or down into pretty values that are easier to read, understand, and explain, e.g., [0-10] instead of [0-9.364]. These bin intervals are defined based on the data values, user preferences, desired number of bins, and rounding factor."]
  },
  [GEOMETRIC_INTERVAL]: {
    name: "Geometric",
    description: ["Bin intervals follow a geometric progression: a + ar + ar^2 + ... a = constant, r = coefficient."],
    longDescription: ["Originally called 'Smart Quantiles', this method defines bin breaks based on bin intervals that have a geometric series (a + ar + ar^2 + ar^3 + ...) where a is a constant and r is the geometric coefficient. This r can change once (to its inverse) to optimize the bin ranges. This technique is useful for visualizing continuous data that is not distributed normally, or when the distribution is extremely skewed, creating a balance between highlighting changes in the middle values and the extreme values, thereby producing a result that is visually appealing and cartographically comprehensive."]
  },
  [EXPONENTIAL_CLASS_SIZE]: {
    name: "Exponential",
    description: ["Number of data records in each successive bin increase (or decrease) exponentially."],
    longDescription: ["This method utilizes an exponential series (a^n) for classification. There are two commonly used variants of this strategy: (1) bin intervals are defined such that the number of observations in each successive interval increases (or decreases) exponentially; (2) bin intervals are defined such that the size of the intervals increases by an exponential factor between each successive interval, e.g., 1-2, 2-4, 4-8, 8-16, 16-32."]
  },
  [MANUAL_INTERVAL]: {
    name: "Manual Interval",
    description: ["Number of bins and corresponding bin breaks are manually specified as per user needs."],
    longDescription: ["This method organizes data into bins based on predetermined criteria or when automated methods are inappropriate or unavailable. Note that this strategy is less explainable and can be time-consuming and error-prone to execute, especially when the dataset is large or complex."]
  },
  [QUANTILE]: {
    name: "Quantile",
    description: ["Each bin consists of approximately the same number of data observations."],
    longDescription: ["This method defines bin intervals such that the number of observations in each interval is (approximately) the same. For example, if there are 100 data points and one needs 5 equal-sized bins (or quantiles), each bin would then contain 100/5=20 data points. The term quartiles is used when the attribute values are divided into four bins, quintiles for five, sextiles for six, etc. With this strategy, bins are not left empty nor do they have limited or excessive number of values. However, because of the way the bins are grouped, the maps can sometimes be confusing or misleading because the values that are put into the bins can be similar to or very different from one another."]
  },
  [PERCENTILE]: {
    name: "Percentile",
    description: ["6 Bins: [0,1)%, [1-10)%, [10-50)%, [50%-90)%, [90%-99)%, [99,100]%."],
    longDescription: ["This method, a custom variant of the quantile strategy, defines six unequal bin intervals based on percentiles (\%): [0,1), [1,10), [10,50), [50,90), [90,99), [99,100]."]
  },
  [BOXPLOT]: {
    name: "Box Plot",
    description: ["6 bins: [UQ+1.5*IQR, UQ, M, LQ, LQ-1.5*IQR]. M=median, Q=quartile, IQR=inter-Q range."],
    longDescription: ["This method typically defines six bins: four quartiles plus two classifications for data items that are more than 1.5 times the inter-quartile range (IQR) from the median, enabling quick visualization of the distribution of the data across the region being mapped, as well as identifying any outliers or areas with unusual values."]
  },
  [STANDARD_DEVIATION]: {
    name: "Standard Deviation",
    description: ["2n Bins: [μ - n * σ, ..., μ - σ, μ, μ + σ, ..., μ + n * σ]. μ = mean, σ = standard deviation."],
    longDescription: ["This method is a way to measure how spread out a dataset is compared to its mean divides. It divides the data into a set of bins such that each bin contains data points that are within a certain number of standard deviations (σ) from the mean (μ) of the data, usually at intervals of 1.0σ or 0.5σ. There are two commonly used variants of this strategy: (1) bins are defined on either side of the mean and hence there is no central bin and the number of bins is even; (2) one central bin (μ+-0.5σ) and additional bins at μ+-1.0σ intervals beyond this central bin, for a total odd number of bins."]
  },
  [MAXIMUM_BREAKS]: {
    name: "Maximum Breaks",
    description: ["Bins are placed where differences between sorted, successive values are the largest."],
    longDescription: ["Based on the manually specified number of bins, this method defines bin breaks based on the maximum gradients of sorted data values, where a gradient is the difference between successive data values. For each desired bin, this strategy looks at how apart each data value is from the next one in the sorted sequence and accordingly places a break point in between the pairs of values that are most stretched apart from each other."]
  },
  [FISHER_JENKS]: {
    name: "Natural Breaks",
    description: ["Sum of the absolute deviations around the medians of the resultant bins is minimum."],
    longDescription: ["This method defines bins such that they are as homogenous as possible within themselves and as heterogeneous as possible between themselves, by minimizing the within-bin variance and maximizing the between-bin variance, thereby creating bins that are more meaningful and interpretable. There are two commonly used variants of this strategy: (1) Jenks-Caspall minimizes the sum of absolute deviations around bin means; (2) Fisher-Jenks minimizes the sum of the absolute deviations around bin medians. Note that (2) uses a dynamic programming approach as opposed to (1)'s heuristic approach and is hence guaranteed to produce an optimal classification for a prespecified number of bins."]
  },
  [CK_MEANS]: {
    name: "CK-Means",
    description: ["Standard deviation (sum of squared Euclidean distances to) of each bin is minimized."],
    longDescription: ["This method heuristically partitions data into k bins such that the sum of squared Euclidean distances to each bin mean is minimized, computing new bin centers until local convergence is achieved. It is slow, not repeatable, and unoptimal; CK-Means is one dynamic programming algorithm for optimal one-dimensional classification."]
  },
  [HEAD_TAIL_BREAKS]: {
    name: "Head Tail Breaks",
    description: ["Recursive binning to balance the number of smaller and larger values in each bin."],
    longDescription: ["This method defines bins by recursively splitting data around the iterative means until the distributions within each of the bins no longer displays a heavy-tailed distribution, i.e., there is a balance between the number of smaller and larger values assigned to each bin. This method is particularly effective for data with a heavy-tailed distribution, such as power law and log normal distributions, as it recognizes that there may be far more objects of smaller (than larger) magnitudes."]
  },
  [RESILIENCY]: {
    name: "Resiliency",
    description: ["Geographies are placed in their most agreed-upon bin across multiple binning methods."],
    longDescription: ["This is an ensemble technique that considers how frequently a geographic entity (e.g., county) falls in a particular bin across multiple comparable data binning strategies. By adjusting the number of bins as well as bin intervals, this scheme strives to force-fit maximum geographic entities fall in the bin that is most frequently assigned to it; in this way, this scheme rewards consistency and is called resiliency."]
  }
}