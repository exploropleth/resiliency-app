declare function structuredClone<T>(
  value: T,
  options?: StructuredSerializeOptions
): T;

interface StructuredSerializeOptions {
  transfer?: any[];
} 