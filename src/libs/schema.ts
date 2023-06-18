type ValueDict = {
  text: string;
  email: string;
  date: Date;
  list: readonly string[];
};
type SchemaUnitType = keyof ValueDict;
type RuleCore = "required";
type RuleDict = {
  [K in SchemaUnitType]: {
    text: "email" | RuleCore;
    email: RuleCore;
    date: RuleCore;
    list: "onlyListed" | RuleCore;
  }[K];
};
const ruleForType = {
  text: [],
  email: ["email"],
  date: ["date"],
  list: [],
} as const satisfies { [Key in SchemaUnitType]: unknown };
type SchemaUnitCore<Type extends SchemaUnitType> = {
  readonly type: Type;
  readonly key: string;
  readonly label?: string;
  readonly init?: ValueDict[Type];
  readonly rules: RuleDict[Type][];
};
type SchemaUnitDict = {
  [K in SchemaUnitType]: {
    text: SchemaUnitCore<"text">;
    email: SchemaUnitCore<"email">;
    date: SchemaUnitCore<"date">;
    list: SchemaUnitCore<"list"> & { options?: string[] };
  }[K];
};
type SchemaUnitWithValueDict = {
  [K in SchemaUnitType]: SchemaUnitDict[K] & { value?: ValueDict[K] };
};
type SchemaUnitWithValue = SchemaUnitWithValueDict[keyof SchemaUnitWithValueDict];
type SchemaUnit = SchemaUnitDict[keyof SchemaUnitDict];
type SchemaValue = SchemaUnitWithValue["value"];
type SchemaValues = {
  [key: string]: SchemaUnitWithValue["value"];
};

type Schema = readonly SchemaUnit[];
type SchemaWithValue = readonly SchemaUnitWithValue[];
type Rule = SchemaUnit["rules"][number] | (typeof ruleForType)[keyof typeof ruleForType][number];

const isOk = (value: SchemaValue, rule: Rule) => {
  if (!value) return rule !== "required";
  switch (rule) {
    case "required": {
      if (Array.isArray(value)) return value.length > 0;
      return true;
    }
    case "email": {
      const pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
      return typeof value === "string" && pattern.test(value);
    }
  }
};
const validateUnit = (value: SchemaValue, unit: SchemaUnit) => {
  const invalids = ([...unit.rules, ...ruleForType[unit.type]] as string[]).filter(
    rule => !isOk(value, rule as Rule),
  ) as Rule[];
  return invalids.length > 0 ? [{ key: unit.key, rules: invalids }] : [];
};

const validate = (values: SchemaValues, schema: Schema) => {
  const errors = schema.flatMap(unit => validateUnit(values[unit.key], unit));
  return errors.length > 0 ? ({ ok: false, errors } as const) : ({ ok: true } as const);
};

const schemaWithValue = (values: SchemaValues, schema: Schema): SchemaUnitWithValue[] => {
  return schema.map(unit => {
    const value = values[unit.key] ?? unit.init;
    return { ...unit, value } as SchemaUnitWithValue;
  });
};

type MakeSchemaUnit = {
  <
    K extends string,
    T extends SchemaUnitType,
    O extends Partial<Omit<SchemaUnitDict[T], "key" | "type">>,
  >(
    key: K,
    type: T,
    opt: O,
  ): SchemaUnitDict[T];
  <K extends string, T extends SchemaUnitType>(key: K, type: T): SchemaUnitDict[T];
};

const makeSchemaUnit: MakeSchemaUnit = <
  K extends string,
  T extends SchemaUnitType,
  O extends Partial<Omit<SchemaUnitDict[T], "key" | "type">>,
>(
  key: K,
  type: T,
  opt?: O,
) => {
  return { type, key, rules: [] as RuleDict[T][], ...opt } as unknown as SchemaUnitDict[T];
};

const makeSchema = (unitFn: (unit: MakeSchemaUnit) => void) => {
  let schema: Schema = [];
  const schemaMaker = (...args: Parameters<MakeSchemaUnit>) => {
    const unit = makeSchemaUnit(...args);
    schema = [...schema, unit as SchemaUnit] as const;
    return unit;
  };
  unitFn(schemaMaker);
  return schema;
};

export type { Schema, SchemaUnit, SchemaWithValue };
export { validate, schemaWithValue, makeSchema };
