
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Store
 * 
 */
export type Store = $Result.DefaultSelection<Prisma.$StorePayload>
/**
 * Model Vehicle
 * 
 */
export type Vehicle = $Result.DefaultSelection<Prisma.$VehiclePayload>
/**
 * Model VehicleImage
 * 
 */
export type VehicleImage = $Result.DefaultSelection<Prisma.$VehicleImagePayload>
/**
 * Model ProcessingJob
 * 
 */
export type ProcessingJob = $Result.DefaultSelection<Prisma.$ProcessingJobPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  PHOTOGRAPHER: 'PHOTOGRAPHER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const ImageType: {
  FRONT_QUARTER: 'FRONT_QUARTER',
  FRONT: 'FRONT',
  BACK_QUARTER: 'BACK_QUARTER',
  BACK: 'BACK',
  DRIVER_SIDE: 'DRIVER_SIDE',
  PASSENGER_SIDE: 'PASSENGER_SIDE',
  GALLERY: 'GALLERY',
  GALLERY_EXTERIOR: 'GALLERY_EXTERIOR',
  GALLERY_INTERIOR: 'GALLERY_INTERIOR'
};

export type ImageType = (typeof ImageType)[keyof typeof ImageType]


export const ProcessingStatus: {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
};

export type ProcessingStatus = (typeof ProcessingStatus)[keyof typeof ProcessingStatus]


export const JobStatus: {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type JobStatus = (typeof JobStatus)[keyof typeof JobStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type ImageType = $Enums.ImageType

export const ImageType: typeof $Enums.ImageType

export type ProcessingStatus = $Enums.ProcessingStatus

export const ProcessingStatus: typeof $Enums.ProcessingStatus

export type JobStatus = $Enums.JobStatus

export const JobStatus: typeof $Enums.JobStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.store`: Exposes CRUD operations for the **Store** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Stores
    * const stores = await prisma.store.findMany()
    * ```
    */
  get store(): Prisma.StoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehicle`: Exposes CRUD operations for the **Vehicle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehicles
    * const vehicles = await prisma.vehicle.findMany()
    * ```
    */
  get vehicle(): Prisma.VehicleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehicleImage`: Exposes CRUD operations for the **VehicleImage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VehicleImages
    * const vehicleImages = await prisma.vehicleImage.findMany()
    * ```
    */
  get vehicleImage(): Prisma.VehicleImageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.processingJob`: Exposes CRUD operations for the **ProcessingJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProcessingJobs
    * const processingJobs = await prisma.processingJob.findMany()
    * ```
    */
  get processingJob(): Prisma.ProcessingJobDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.1
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Store: 'Store',
    Vehicle: 'Vehicle',
    VehicleImage: 'VehicleImage',
    ProcessingJob: 'ProcessingJob'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "store" | "vehicle" | "vehicleImage" | "processingJob"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Store: {
        payload: Prisma.$StorePayload<ExtArgs>
        fields: Prisma.StoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          findFirst: {
            args: Prisma.StoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          findMany: {
            args: Prisma.StoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          create: {
            args: Prisma.StoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          createMany: {
            args: Prisma.StoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          delete: {
            args: Prisma.StoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          update: {
            args: Prisma.StoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          deleteMany: {
            args: Prisma.StoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          upsert: {
            args: Prisma.StoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          aggregate: {
            args: Prisma.StoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStore>
          }
          groupBy: {
            args: Prisma.StoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoreCountArgs<ExtArgs>
            result: $Utils.Optional<StoreCountAggregateOutputType> | number
          }
        }
      }
      Vehicle: {
        payload: Prisma.$VehiclePayload<ExtArgs>
        fields: Prisma.VehicleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehicleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehicleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          findFirst: {
            args: Prisma.VehicleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehicleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          findMany: {
            args: Prisma.VehicleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          create: {
            args: Prisma.VehicleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          createMany: {
            args: Prisma.VehicleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VehicleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          delete: {
            args: Prisma.VehicleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          update: {
            args: Prisma.VehicleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          deleteMany: {
            args: Prisma.VehicleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VehicleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VehicleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          upsert: {
            args: Prisma.VehicleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          aggregate: {
            args: Prisma.VehicleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicle>
          }
          groupBy: {
            args: Prisma.VehicleGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehicleGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehicleCountArgs<ExtArgs>
            result: $Utils.Optional<VehicleCountAggregateOutputType> | number
          }
        }
      }
      VehicleImage: {
        payload: Prisma.$VehicleImagePayload<ExtArgs>
        fields: Prisma.VehicleImageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehicleImageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehicleImageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>
          }
          findFirst: {
            args: Prisma.VehicleImageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehicleImageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>
          }
          findMany: {
            args: Prisma.VehicleImageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>[]
          }
          create: {
            args: Prisma.VehicleImageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>
          }
          createMany: {
            args: Prisma.VehicleImageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VehicleImageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>[]
          }
          delete: {
            args: Prisma.VehicleImageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>
          }
          update: {
            args: Prisma.VehicleImageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>
          }
          deleteMany: {
            args: Prisma.VehicleImageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VehicleImageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VehicleImageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>[]
          }
          upsert: {
            args: Prisma.VehicleImageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehicleImagePayload>
          }
          aggregate: {
            args: Prisma.VehicleImageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicleImage>
          }
          groupBy: {
            args: Prisma.VehicleImageGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehicleImageGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehicleImageCountArgs<ExtArgs>
            result: $Utils.Optional<VehicleImageCountAggregateOutputType> | number
          }
        }
      }
      ProcessingJob: {
        payload: Prisma.$ProcessingJobPayload<ExtArgs>
        fields: Prisma.ProcessingJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProcessingJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProcessingJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          findFirst: {
            args: Prisma.ProcessingJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProcessingJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          findMany: {
            args: Prisma.ProcessingJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>[]
          }
          create: {
            args: Prisma.ProcessingJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          createMany: {
            args: Prisma.ProcessingJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProcessingJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>[]
          }
          delete: {
            args: Prisma.ProcessingJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          update: {
            args: Prisma.ProcessingJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          deleteMany: {
            args: Prisma.ProcessingJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProcessingJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProcessingJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>[]
          }
          upsert: {
            args: Prisma.ProcessingJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProcessingJobPayload>
          }
          aggregate: {
            args: Prisma.ProcessingJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProcessingJob>
          }
          groupBy: {
            args: Prisma.ProcessingJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProcessingJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProcessingJobCountArgs<ExtArgs>
            result: $Utils.Optional<ProcessingJobCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    store?: StoreOmit
    vehicle?: VehicleOmit
    vehicleImage?: VehicleImageOmit
    processingJob?: ProcessingJobOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type StoreCountOutputType
   */

  export type StoreCountOutputType = {
    vehicles: number
  }

  export type StoreCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicles?: boolean | StoreCountOutputTypeCountVehiclesArgs
  }

  // Custom InputTypes
  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreCountOutputType
     */
    select?: StoreCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountVehiclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleWhereInput
  }


  /**
   * Count Type VehicleCountOutputType
   */

  export type VehicleCountOutputType = {
    images: number
    processingJobs: number
  }

  export type VehicleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    images?: boolean | VehicleCountOutputTypeCountImagesArgs
    processingJobs?: boolean | VehicleCountOutputTypeCountProcessingJobsArgs
  }

  // Custom InputTypes
  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCountOutputType
     */
    select?: VehicleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountImagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleImageWhereInput
  }

  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountProcessingJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcessingJobWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    role: $Enums.UserRole | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    role: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    role?: true
    name?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    name: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "passwordHash" | "role" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      passwordHash: string
      role: $Enums.UserRole
      name: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly name: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model Store
   */

  export type AggregateStore = {
    _count: StoreCountAggregateOutputType | null
    _min: StoreMinAggregateOutputType | null
    _max: StoreMaxAggregateOutputType | null
  }

  export type StoreMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoreMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoreCountAggregateOutputType = {
    id: number
    name: number
    address: number
    brandLogos: number
    imageUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StoreMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoreMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoreCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    brandLogos?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Store to aggregate.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Stores
    **/
    _count?: true | StoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoreMaxAggregateInputType
  }

  export type GetStoreAggregateType<T extends StoreAggregateArgs> = {
        [P in keyof T & keyof AggregateStore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStore[P]>
      : GetScalarType<T[P], AggregateStore[P]>
  }




  export type StoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreWhereInput
    orderBy?: StoreOrderByWithAggregationInput | StoreOrderByWithAggregationInput[]
    by: StoreScalarFieldEnum[] | StoreScalarFieldEnum
    having?: StoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoreCountAggregateInputType | true
    _min?: StoreMinAggregateInputType
    _max?: StoreMaxAggregateInputType
  }

  export type StoreGroupByOutputType = {
    id: string
    name: string
    address: string
    brandLogos: string[]
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: StoreCountAggregateOutputType | null
    _min: StoreMinAggregateOutputType | null
    _max: StoreMaxAggregateOutputType | null
  }

  type GetStoreGroupByPayload<T extends StoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoreGroupByOutputType[P]>
            : GetScalarType<T[P], StoreGroupByOutputType[P]>
        }
      >
    >


  export type StoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    brandLogos?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    vehicles?: boolean | Store$vehiclesArgs<ExtArgs>
    _count?: boolean | StoreCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["store"]>

  export type StoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    brandLogos?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["store"]>

  export type StoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    brandLogos?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["store"]>

  export type StoreSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    brandLogos?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "address" | "brandLogos" | "imageUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["store"]>
  export type StoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicles?: boolean | Store$vehiclesArgs<ExtArgs>
    _count?: boolean | StoreCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StoreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StoreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Store"
    objects: {
      vehicles: Prisma.$VehiclePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      address: string
      brandLogos: string[]
      imageUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["store"]>
    composites: {}
  }

  type StoreGetPayload<S extends boolean | null | undefined | StoreDefaultArgs> = $Result.GetResult<Prisma.$StorePayload, S>

  type StoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoreCountAggregateInputType | true
    }

  export interface StoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Store'], meta: { name: 'Store' } }
    /**
     * Find zero or one Store that matches the filter.
     * @param {StoreFindUniqueArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoreFindUniqueArgs>(args: SelectSubset<T, StoreFindUniqueArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Store that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StoreFindUniqueOrThrowArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoreFindUniqueOrThrowArgs>(args: SelectSubset<T, StoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Store that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindFirstArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoreFindFirstArgs>(args?: SelectSubset<T, StoreFindFirstArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Store that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindFirstOrThrowArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoreFindFirstOrThrowArgs>(args?: SelectSubset<T, StoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Stores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stores
     * const stores = await prisma.store.findMany()
     * 
     * // Get first 10 Stores
     * const stores = await prisma.store.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storeWithIdOnly = await prisma.store.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoreFindManyArgs>(args?: SelectSubset<T, StoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Store.
     * @param {StoreCreateArgs} args - Arguments to create a Store.
     * @example
     * // Create one Store
     * const Store = await prisma.store.create({
     *   data: {
     *     // ... data to create a Store
     *   }
     * })
     * 
     */
    create<T extends StoreCreateArgs>(args: SelectSubset<T, StoreCreateArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Stores.
     * @param {StoreCreateManyArgs} args - Arguments to create many Stores.
     * @example
     * // Create many Stores
     * const store = await prisma.store.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoreCreateManyArgs>(args?: SelectSubset<T, StoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Stores and returns the data saved in the database.
     * @param {StoreCreateManyAndReturnArgs} args - Arguments to create many Stores.
     * @example
     * // Create many Stores
     * const store = await prisma.store.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Stores and only return the `id`
     * const storeWithIdOnly = await prisma.store.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StoreCreateManyAndReturnArgs>(args?: SelectSubset<T, StoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Store.
     * @param {StoreDeleteArgs} args - Arguments to delete one Store.
     * @example
     * // Delete one Store
     * const Store = await prisma.store.delete({
     *   where: {
     *     // ... filter to delete one Store
     *   }
     * })
     * 
     */
    delete<T extends StoreDeleteArgs>(args: SelectSubset<T, StoreDeleteArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Store.
     * @param {StoreUpdateArgs} args - Arguments to update one Store.
     * @example
     * // Update one Store
     * const store = await prisma.store.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoreUpdateArgs>(args: SelectSubset<T, StoreUpdateArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Stores.
     * @param {StoreDeleteManyArgs} args - Arguments to filter Stores to delete.
     * @example
     * // Delete a few Stores
     * const { count } = await prisma.store.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoreDeleteManyArgs>(args?: SelectSubset<T, StoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stores
     * const store = await prisma.store.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoreUpdateManyArgs>(args: SelectSubset<T, StoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stores and returns the data updated in the database.
     * @param {StoreUpdateManyAndReturnArgs} args - Arguments to update many Stores.
     * @example
     * // Update many Stores
     * const store = await prisma.store.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Stores and only return the `id`
     * const storeWithIdOnly = await prisma.store.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StoreUpdateManyAndReturnArgs>(args: SelectSubset<T, StoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Store.
     * @param {StoreUpsertArgs} args - Arguments to update or create a Store.
     * @example
     * // Update or create a Store
     * const store = await prisma.store.upsert({
     *   create: {
     *     // ... data to create a Store
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Store we want to update
     *   }
     * })
     */
    upsert<T extends StoreUpsertArgs>(args: SelectSubset<T, StoreUpsertArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreCountArgs} args - Arguments to filter Stores to count.
     * @example
     * // Count the number of Stores
     * const count = await prisma.store.count({
     *   where: {
     *     // ... the filter for the Stores we want to count
     *   }
     * })
    **/
    count<T extends StoreCountArgs>(
      args?: Subset<T, StoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Store.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoreAggregateArgs>(args: Subset<T, StoreAggregateArgs>): Prisma.PrismaPromise<GetStoreAggregateType<T>>

    /**
     * Group by Store.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoreGroupByArgs['orderBy'] }
        : { orderBy?: StoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Store model
   */
  readonly fields: StoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Store.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicles<T extends Store$vehiclesArgs<ExtArgs> = {}>(args?: Subset<T, Store$vehiclesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Store model
   */
  interface StoreFieldRefs {
    readonly id: FieldRef<"Store", 'String'>
    readonly name: FieldRef<"Store", 'String'>
    readonly address: FieldRef<"Store", 'String'>
    readonly brandLogos: FieldRef<"Store", 'String[]'>
    readonly imageUrl: FieldRef<"Store", 'String'>
    readonly createdAt: FieldRef<"Store", 'DateTime'>
    readonly updatedAt: FieldRef<"Store", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Store findUnique
   */
  export type StoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store findUniqueOrThrow
   */
  export type StoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store findFirst
   */
  export type StoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stores.
     */
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store findFirstOrThrow
   */
  export type StoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stores.
     */
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store findMany
   */
  export type StoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Stores to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store create
   */
  export type StoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The data needed to create a Store.
     */
    data: XOR<StoreCreateInput, StoreUncheckedCreateInput>
  }

  /**
   * Store createMany
   */
  export type StoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Stores.
     */
    data: StoreCreateManyInput | StoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Store createManyAndReturn
   */
  export type StoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * The data used to create many Stores.
     */
    data: StoreCreateManyInput | StoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Store update
   */
  export type StoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The data needed to update a Store.
     */
    data: XOR<StoreUpdateInput, StoreUncheckedUpdateInput>
    /**
     * Choose, which Store to update.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store updateMany
   */
  export type StoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Stores.
     */
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyInput>
    /**
     * Filter which Stores to update
     */
    where?: StoreWhereInput
    /**
     * Limit how many Stores to update.
     */
    limit?: number
  }

  /**
   * Store updateManyAndReturn
   */
  export type StoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * The data used to update Stores.
     */
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyInput>
    /**
     * Filter which Stores to update
     */
    where?: StoreWhereInput
    /**
     * Limit how many Stores to update.
     */
    limit?: number
  }

  /**
   * Store upsert
   */
  export type StoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The filter to search for the Store to update in case it exists.
     */
    where: StoreWhereUniqueInput
    /**
     * In case the Store found by the `where` argument doesn't exist, create a new Store with this data.
     */
    create: XOR<StoreCreateInput, StoreUncheckedCreateInput>
    /**
     * In case the Store was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoreUpdateInput, StoreUncheckedUpdateInput>
  }

  /**
   * Store delete
   */
  export type StoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter which Store to delete.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store deleteMany
   */
  export type StoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stores to delete
     */
    where?: StoreWhereInput
    /**
     * Limit how many Stores to delete.
     */
    limit?: number
  }

  /**
   * Store.vehicles
   */
  export type Store$vehiclesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    where?: VehicleWhereInput
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    cursor?: VehicleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Store without action
   */
  export type StoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Store
     */
    omit?: StoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
  }


  /**
   * Model Vehicle
   */

  export type AggregateVehicle = {
    _count: VehicleCountAggregateOutputType | null
    _min: VehicleMinAggregateOutputType | null
    _max: VehicleMaxAggregateOutputType | null
  }

  export type VehicleMinAggregateOutputType = {
    id: string | null
    stockNumber: string | null
    vin: string | null
    storeId: string | null
    processingStatus: $Enums.ProcessingStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VehicleMaxAggregateOutputType = {
    id: string | null
    stockNumber: string | null
    vin: string | null
    storeId: string | null
    processingStatus: $Enums.ProcessingStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VehicleCountAggregateOutputType = {
    id: number
    stockNumber: number
    vin: number
    storeId: number
    processingStatus: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VehicleMinAggregateInputType = {
    id?: true
    stockNumber?: true
    vin?: true
    storeId?: true
    processingStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VehicleMaxAggregateInputType = {
    id?: true
    stockNumber?: true
    vin?: true
    storeId?: true
    processingStatus?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VehicleCountAggregateInputType = {
    id?: true
    stockNumber?: true
    vin?: true
    storeId?: true
    processingStatus?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VehicleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehicle to aggregate.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vehicles
    **/
    _count?: true | VehicleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehicleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehicleMaxAggregateInputType
  }

  export type GetVehicleAggregateType<T extends VehicleAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicle[P]>
      : GetScalarType<T[P], AggregateVehicle[P]>
  }




  export type VehicleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleWhereInput
    orderBy?: VehicleOrderByWithAggregationInput | VehicleOrderByWithAggregationInput[]
    by: VehicleScalarFieldEnum[] | VehicleScalarFieldEnum
    having?: VehicleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehicleCountAggregateInputType | true
    _min?: VehicleMinAggregateInputType
    _max?: VehicleMaxAggregateInputType
  }

  export type VehicleGroupByOutputType = {
    id: string
    stockNumber: string
    vin: string
    storeId: string
    processingStatus: $Enums.ProcessingStatus
    createdAt: Date
    updatedAt: Date
    _count: VehicleCountAggregateOutputType | null
    _min: VehicleMinAggregateOutputType | null
    _max: VehicleMaxAggregateOutputType | null
  }

  type GetVehicleGroupByPayload<T extends VehicleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehicleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehicleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehicleGroupByOutputType[P]>
            : GetScalarType<T[P], VehicleGroupByOutputType[P]>
        }
      >
    >


  export type VehicleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stockNumber?: boolean
    vin?: boolean
    storeId?: boolean
    processingStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
    images?: boolean | Vehicle$imagesArgs<ExtArgs>
    processingJobs?: boolean | Vehicle$processingJobsArgs<ExtArgs>
    _count?: boolean | VehicleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stockNumber?: boolean
    vin?: boolean
    storeId?: boolean
    processingStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    stockNumber?: boolean
    vin?: boolean
    storeId?: boolean
    processingStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectScalar = {
    id?: boolean
    stockNumber?: boolean
    vin?: boolean
    storeId?: boolean
    processingStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VehicleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "stockNumber" | "vin" | "storeId" | "processingStatus" | "createdAt" | "updatedAt", ExtArgs["result"]["vehicle"]>
  export type VehicleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
    images?: boolean | Vehicle$imagesArgs<ExtArgs>
    processingJobs?: boolean | Vehicle$processingJobsArgs<ExtArgs>
    _count?: boolean | VehicleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VehicleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type VehicleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $VehiclePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vehicle"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
      images: Prisma.$VehicleImagePayload<ExtArgs>[]
      processingJobs: Prisma.$ProcessingJobPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      stockNumber: string
      vin: string
      storeId: string
      processingStatus: $Enums.ProcessingStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vehicle"]>
    composites: {}
  }

  type VehicleGetPayload<S extends boolean | null | undefined | VehicleDefaultArgs> = $Result.GetResult<Prisma.$VehiclePayload, S>

  type VehicleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VehicleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehicleCountAggregateInputType | true
    }

  export interface VehicleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vehicle'], meta: { name: 'Vehicle' } }
    /**
     * Find zero or one Vehicle that matches the filter.
     * @param {VehicleFindUniqueArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VehicleFindUniqueArgs>(args: SelectSubset<T, VehicleFindUniqueArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vehicle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VehicleFindUniqueOrThrowArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VehicleFindUniqueOrThrowArgs>(args: SelectSubset<T, VehicleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindFirstArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VehicleFindFirstArgs>(args?: SelectSubset<T, VehicleFindFirstArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindFirstOrThrowArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VehicleFindFirstOrThrowArgs>(args?: SelectSubset<T, VehicleFindFirstOrThrowArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vehicles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehicles
     * const vehicles = await prisma.vehicle.findMany()
     * 
     * // Get first 10 Vehicles
     * const vehicles = await prisma.vehicle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VehicleFindManyArgs>(args?: SelectSubset<T, VehicleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vehicle.
     * @param {VehicleCreateArgs} args - Arguments to create a Vehicle.
     * @example
     * // Create one Vehicle
     * const Vehicle = await prisma.vehicle.create({
     *   data: {
     *     // ... data to create a Vehicle
     *   }
     * })
     * 
     */
    create<T extends VehicleCreateArgs>(args: SelectSubset<T, VehicleCreateArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vehicles.
     * @param {VehicleCreateManyArgs} args - Arguments to create many Vehicles.
     * @example
     * // Create many Vehicles
     * const vehicle = await prisma.vehicle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VehicleCreateManyArgs>(args?: SelectSubset<T, VehicleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vehicles and returns the data saved in the database.
     * @param {VehicleCreateManyAndReturnArgs} args - Arguments to create many Vehicles.
     * @example
     * // Create many Vehicles
     * const vehicle = await prisma.vehicle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vehicles and only return the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VehicleCreateManyAndReturnArgs>(args?: SelectSubset<T, VehicleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vehicle.
     * @param {VehicleDeleteArgs} args - Arguments to delete one Vehicle.
     * @example
     * // Delete one Vehicle
     * const Vehicle = await prisma.vehicle.delete({
     *   where: {
     *     // ... filter to delete one Vehicle
     *   }
     * })
     * 
     */
    delete<T extends VehicleDeleteArgs>(args: SelectSubset<T, VehicleDeleteArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vehicle.
     * @param {VehicleUpdateArgs} args - Arguments to update one Vehicle.
     * @example
     * // Update one Vehicle
     * const vehicle = await prisma.vehicle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VehicleUpdateArgs>(args: SelectSubset<T, VehicleUpdateArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vehicles.
     * @param {VehicleDeleteManyArgs} args - Arguments to filter Vehicles to delete.
     * @example
     * // Delete a few Vehicles
     * const { count } = await prisma.vehicle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VehicleDeleteManyArgs>(args?: SelectSubset<T, VehicleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehicles
     * const vehicle = await prisma.vehicle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VehicleUpdateManyArgs>(args: SelectSubset<T, VehicleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles and returns the data updated in the database.
     * @param {VehicleUpdateManyAndReturnArgs} args - Arguments to update many Vehicles.
     * @example
     * // Update many Vehicles
     * const vehicle = await prisma.vehicle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vehicles and only return the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VehicleUpdateManyAndReturnArgs>(args: SelectSubset<T, VehicleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vehicle.
     * @param {VehicleUpsertArgs} args - Arguments to update or create a Vehicle.
     * @example
     * // Update or create a Vehicle
     * const vehicle = await prisma.vehicle.upsert({
     *   create: {
     *     // ... data to create a Vehicle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehicle we want to update
     *   }
     * })
     */
    upsert<T extends VehicleUpsertArgs>(args: SelectSubset<T, VehicleUpsertArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleCountArgs} args - Arguments to filter Vehicles to count.
     * @example
     * // Count the number of Vehicles
     * const count = await prisma.vehicle.count({
     *   where: {
     *     // ... the filter for the Vehicles we want to count
     *   }
     * })
    **/
    count<T extends VehicleCountArgs>(
      args?: Subset<T, VehicleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehicleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehicle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehicleAggregateArgs>(args: Subset<T, VehicleAggregateArgs>): Prisma.PrismaPromise<GetVehicleAggregateType<T>>

    /**
     * Group by Vehicle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehicleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehicleGroupByArgs['orderBy'] }
        : { orderBy?: VehicleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehicleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vehicle model
   */
  readonly fields: VehicleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vehicle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehicleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    images<T extends Vehicle$imagesArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$imagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    processingJobs<T extends Vehicle$processingJobsArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$processingJobsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vehicle model
   */
  interface VehicleFieldRefs {
    readonly id: FieldRef<"Vehicle", 'String'>
    readonly stockNumber: FieldRef<"Vehicle", 'String'>
    readonly vin: FieldRef<"Vehicle", 'String'>
    readonly storeId: FieldRef<"Vehicle", 'String'>
    readonly processingStatus: FieldRef<"Vehicle", 'ProcessingStatus'>
    readonly createdAt: FieldRef<"Vehicle", 'DateTime'>
    readonly updatedAt: FieldRef<"Vehicle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Vehicle findUnique
   */
  export type VehicleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle findUniqueOrThrow
   */
  export type VehicleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle findFirst
   */
  export type VehicleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle findFirstOrThrow
   */
  export type VehicleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle findMany
   */
  export type VehicleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicles to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle create
   */
  export type VehicleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The data needed to create a Vehicle.
     */
    data: XOR<VehicleCreateInput, VehicleUncheckedCreateInput>
  }

  /**
   * Vehicle createMany
   */
  export type VehicleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vehicles.
     */
    data: VehicleCreateManyInput | VehicleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vehicle createManyAndReturn
   */
  export type VehicleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * The data used to create many Vehicles.
     */
    data: VehicleCreateManyInput | VehicleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vehicle update
   */
  export type VehicleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The data needed to update a Vehicle.
     */
    data: XOR<VehicleUpdateInput, VehicleUncheckedUpdateInput>
    /**
     * Choose, which Vehicle to update.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle updateMany
   */
  export type VehicleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vehicles.
     */
    data: XOR<VehicleUpdateManyMutationInput, VehicleUncheckedUpdateManyInput>
    /**
     * Filter which Vehicles to update
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to update.
     */
    limit?: number
  }

  /**
   * Vehicle updateManyAndReturn
   */
  export type VehicleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * The data used to update Vehicles.
     */
    data: XOR<VehicleUpdateManyMutationInput, VehicleUncheckedUpdateManyInput>
    /**
     * Filter which Vehicles to update
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vehicle upsert
   */
  export type VehicleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The filter to search for the Vehicle to update in case it exists.
     */
    where: VehicleWhereUniqueInput
    /**
     * In case the Vehicle found by the `where` argument doesn't exist, create a new Vehicle with this data.
     */
    create: XOR<VehicleCreateInput, VehicleUncheckedCreateInput>
    /**
     * In case the Vehicle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehicleUpdateInput, VehicleUncheckedUpdateInput>
  }

  /**
   * Vehicle delete
   */
  export type VehicleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter which Vehicle to delete.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle deleteMany
   */
  export type VehicleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehicles to delete
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to delete.
     */
    limit?: number
  }

  /**
   * Vehicle.images
   */
  export type Vehicle$imagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    where?: VehicleImageWhereInput
    orderBy?: VehicleImageOrderByWithRelationInput | VehicleImageOrderByWithRelationInput[]
    cursor?: VehicleImageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: VehicleImageScalarFieldEnum | VehicleImageScalarFieldEnum[]
  }

  /**
   * Vehicle.processingJobs
   */
  export type Vehicle$processingJobsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    where?: ProcessingJobWhereInput
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    cursor?: ProcessingJobWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProcessingJobScalarFieldEnum | ProcessingJobScalarFieldEnum[]
  }

  /**
   * Vehicle without action
   */
  export type VehicleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
  }


  /**
   * Model VehicleImage
   */

  export type AggregateVehicleImage = {
    _count: VehicleImageCountAggregateOutputType | null
    _avg: VehicleImageAvgAggregateOutputType | null
    _sum: VehicleImageSumAggregateOutputType | null
    _min: VehicleImageMinAggregateOutputType | null
    _max: VehicleImageMaxAggregateOutputType | null
  }

  export type VehicleImageAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type VehicleImageSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type VehicleImageMinAggregateOutputType = {
    id: string | null
    vehicleId: string | null
    originalUrl: string | null
    processedUrl: string | null
    optimizedUrl: string | null
    thumbnailUrl: string | null
    imageType: $Enums.ImageType | null
    sortOrder: number | null
    isProcessed: boolean | null
    isOptimized: boolean | null
    processedAt: Date | null
    uploadedAt: Date | null
    updatedAt: Date | null
  }

  export type VehicleImageMaxAggregateOutputType = {
    id: string | null
    vehicleId: string | null
    originalUrl: string | null
    processedUrl: string | null
    optimizedUrl: string | null
    thumbnailUrl: string | null
    imageType: $Enums.ImageType | null
    sortOrder: number | null
    isProcessed: boolean | null
    isOptimized: boolean | null
    processedAt: Date | null
    uploadedAt: Date | null
    updatedAt: Date | null
  }

  export type VehicleImageCountAggregateOutputType = {
    id: number
    vehicleId: number
    originalUrl: number
    processedUrl: number
    optimizedUrl: number
    thumbnailUrl: number
    imageType: number
    sortOrder: number
    isProcessed: number
    isOptimized: number
    processedAt: number
    uploadedAt: number
    updatedAt: number
    _all: number
  }


  export type VehicleImageAvgAggregateInputType = {
    sortOrder?: true
  }

  export type VehicleImageSumAggregateInputType = {
    sortOrder?: true
  }

  export type VehicleImageMinAggregateInputType = {
    id?: true
    vehicleId?: true
    originalUrl?: true
    processedUrl?: true
    optimizedUrl?: true
    thumbnailUrl?: true
    imageType?: true
    sortOrder?: true
    isProcessed?: true
    isOptimized?: true
    processedAt?: true
    uploadedAt?: true
    updatedAt?: true
  }

  export type VehicleImageMaxAggregateInputType = {
    id?: true
    vehicleId?: true
    originalUrl?: true
    processedUrl?: true
    optimizedUrl?: true
    thumbnailUrl?: true
    imageType?: true
    sortOrder?: true
    isProcessed?: true
    isOptimized?: true
    processedAt?: true
    uploadedAt?: true
    updatedAt?: true
  }

  export type VehicleImageCountAggregateInputType = {
    id?: true
    vehicleId?: true
    originalUrl?: true
    processedUrl?: true
    optimizedUrl?: true
    thumbnailUrl?: true
    imageType?: true
    sortOrder?: true
    isProcessed?: true
    isOptimized?: true
    processedAt?: true
    uploadedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VehicleImageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VehicleImage to aggregate.
     */
    where?: VehicleImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleImages to fetch.
     */
    orderBy?: VehicleImageOrderByWithRelationInput | VehicleImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehicleImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VehicleImages
    **/
    _count?: true | VehicleImageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VehicleImageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VehicleImageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehicleImageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehicleImageMaxAggregateInputType
  }

  export type GetVehicleImageAggregateType<T extends VehicleImageAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicleImage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicleImage[P]>
      : GetScalarType<T[P], AggregateVehicleImage[P]>
  }




  export type VehicleImageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleImageWhereInput
    orderBy?: VehicleImageOrderByWithAggregationInput | VehicleImageOrderByWithAggregationInput[]
    by: VehicleImageScalarFieldEnum[] | VehicleImageScalarFieldEnum
    having?: VehicleImageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehicleImageCountAggregateInputType | true
    _avg?: VehicleImageAvgAggregateInputType
    _sum?: VehicleImageSumAggregateInputType
    _min?: VehicleImageMinAggregateInputType
    _max?: VehicleImageMaxAggregateInputType
  }

  export type VehicleImageGroupByOutputType = {
    id: string
    vehicleId: string
    originalUrl: string
    processedUrl: string | null
    optimizedUrl: string | null
    thumbnailUrl: string
    imageType: $Enums.ImageType
    sortOrder: number
    isProcessed: boolean
    isOptimized: boolean
    processedAt: Date | null
    uploadedAt: Date
    updatedAt: Date
    _count: VehicleImageCountAggregateOutputType | null
    _avg: VehicleImageAvgAggregateOutputType | null
    _sum: VehicleImageSumAggregateOutputType | null
    _min: VehicleImageMinAggregateOutputType | null
    _max: VehicleImageMaxAggregateOutputType | null
  }

  type GetVehicleImageGroupByPayload<T extends VehicleImageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehicleImageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehicleImageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehicleImageGroupByOutputType[P]>
            : GetScalarType<T[P], VehicleImageGroupByOutputType[P]>
        }
      >
    >


  export type VehicleImageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    originalUrl?: boolean
    processedUrl?: boolean
    optimizedUrl?: boolean
    thumbnailUrl?: boolean
    imageType?: boolean
    sortOrder?: boolean
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: boolean
    uploadedAt?: boolean
    updatedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleImage"]>

  export type VehicleImageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    originalUrl?: boolean
    processedUrl?: boolean
    optimizedUrl?: boolean
    thumbnailUrl?: boolean
    imageType?: boolean
    sortOrder?: boolean
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: boolean
    uploadedAt?: boolean
    updatedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleImage"]>

  export type VehicleImageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    originalUrl?: boolean
    processedUrl?: boolean
    optimizedUrl?: boolean
    thumbnailUrl?: boolean
    imageType?: boolean
    sortOrder?: boolean
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: boolean
    uploadedAt?: boolean
    updatedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicleImage"]>

  export type VehicleImageSelectScalar = {
    id?: boolean
    vehicleId?: boolean
    originalUrl?: boolean
    processedUrl?: boolean
    optimizedUrl?: boolean
    thumbnailUrl?: boolean
    imageType?: boolean
    sortOrder?: boolean
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: boolean
    uploadedAt?: boolean
    updatedAt?: boolean
  }

  export type VehicleImageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicleId" | "originalUrl" | "processedUrl" | "optimizedUrl" | "thumbnailUrl" | "imageType" | "sortOrder" | "isProcessed" | "isOptimized" | "processedAt" | "uploadedAt" | "updatedAt", ExtArgs["result"]["vehicleImage"]>
  export type VehicleImageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type VehicleImageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type VehicleImageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }

  export type $VehicleImagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VehicleImage"
    objects: {
      vehicle: Prisma.$VehiclePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vehicleId: string
      originalUrl: string
      processedUrl: string | null
      optimizedUrl: string | null
      thumbnailUrl: string
      imageType: $Enums.ImageType
      sortOrder: number
      isProcessed: boolean
      isOptimized: boolean
      processedAt: Date | null
      uploadedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["vehicleImage"]>
    composites: {}
  }

  type VehicleImageGetPayload<S extends boolean | null | undefined | VehicleImageDefaultArgs> = $Result.GetResult<Prisma.$VehicleImagePayload, S>

  type VehicleImageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VehicleImageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehicleImageCountAggregateInputType | true
    }

  export interface VehicleImageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VehicleImage'], meta: { name: 'VehicleImage' } }
    /**
     * Find zero or one VehicleImage that matches the filter.
     * @param {VehicleImageFindUniqueArgs} args - Arguments to find a VehicleImage
     * @example
     * // Get one VehicleImage
     * const vehicleImage = await prisma.vehicleImage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VehicleImageFindUniqueArgs>(args: SelectSubset<T, VehicleImageFindUniqueArgs<ExtArgs>>): Prisma__VehicleImageClient<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one VehicleImage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VehicleImageFindUniqueOrThrowArgs} args - Arguments to find a VehicleImage
     * @example
     * // Get one VehicleImage
     * const vehicleImage = await prisma.vehicleImage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VehicleImageFindUniqueOrThrowArgs>(args: SelectSubset<T, VehicleImageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VehicleImageClient<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VehicleImage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleImageFindFirstArgs} args - Arguments to find a VehicleImage
     * @example
     * // Get one VehicleImage
     * const vehicleImage = await prisma.vehicleImage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VehicleImageFindFirstArgs>(args?: SelectSubset<T, VehicleImageFindFirstArgs<ExtArgs>>): Prisma__VehicleImageClient<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first VehicleImage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleImageFindFirstOrThrowArgs} args - Arguments to find a VehicleImage
     * @example
     * // Get one VehicleImage
     * const vehicleImage = await prisma.vehicleImage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VehicleImageFindFirstOrThrowArgs>(args?: SelectSubset<T, VehicleImageFindFirstOrThrowArgs<ExtArgs>>): Prisma__VehicleImageClient<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more VehicleImages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleImageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VehicleImages
     * const vehicleImages = await prisma.vehicleImage.findMany()
     * 
     * // Get first 10 VehicleImages
     * const vehicleImages = await prisma.vehicleImage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicleImageWithIdOnly = await prisma.vehicleImage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VehicleImageFindManyArgs>(args?: SelectSubset<T, VehicleImageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a VehicleImage.
     * @param {VehicleImageCreateArgs} args - Arguments to create a VehicleImage.
     * @example
     * // Create one VehicleImage
     * const VehicleImage = await prisma.vehicleImage.create({
     *   data: {
     *     // ... data to create a VehicleImage
     *   }
     * })
     * 
     */
    create<T extends VehicleImageCreateArgs>(args: SelectSubset<T, VehicleImageCreateArgs<ExtArgs>>): Prisma__VehicleImageClient<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many VehicleImages.
     * @param {VehicleImageCreateManyArgs} args - Arguments to create many VehicleImages.
     * @example
     * // Create many VehicleImages
     * const vehicleImage = await prisma.vehicleImage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VehicleImageCreateManyArgs>(args?: SelectSubset<T, VehicleImageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VehicleImages and returns the data saved in the database.
     * @param {VehicleImageCreateManyAndReturnArgs} args - Arguments to create many VehicleImages.
     * @example
     * // Create many VehicleImages
     * const vehicleImage = await prisma.vehicleImage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VehicleImages and only return the `id`
     * const vehicleImageWithIdOnly = await prisma.vehicleImage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VehicleImageCreateManyAndReturnArgs>(args?: SelectSubset<T, VehicleImageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a VehicleImage.
     * @param {VehicleImageDeleteArgs} args - Arguments to delete one VehicleImage.
     * @example
     * // Delete one VehicleImage
     * const VehicleImage = await prisma.vehicleImage.delete({
     *   where: {
     *     // ... filter to delete one VehicleImage
     *   }
     * })
     * 
     */
    delete<T extends VehicleImageDeleteArgs>(args: SelectSubset<T, VehicleImageDeleteArgs<ExtArgs>>): Prisma__VehicleImageClient<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one VehicleImage.
     * @param {VehicleImageUpdateArgs} args - Arguments to update one VehicleImage.
     * @example
     * // Update one VehicleImage
     * const vehicleImage = await prisma.vehicleImage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VehicleImageUpdateArgs>(args: SelectSubset<T, VehicleImageUpdateArgs<ExtArgs>>): Prisma__VehicleImageClient<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more VehicleImages.
     * @param {VehicleImageDeleteManyArgs} args - Arguments to filter VehicleImages to delete.
     * @example
     * // Delete a few VehicleImages
     * const { count } = await prisma.vehicleImage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VehicleImageDeleteManyArgs>(args?: SelectSubset<T, VehicleImageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VehicleImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleImageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VehicleImages
     * const vehicleImage = await prisma.vehicleImage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VehicleImageUpdateManyArgs>(args: SelectSubset<T, VehicleImageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VehicleImages and returns the data updated in the database.
     * @param {VehicleImageUpdateManyAndReturnArgs} args - Arguments to update many VehicleImages.
     * @example
     * // Update many VehicleImages
     * const vehicleImage = await prisma.vehicleImage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more VehicleImages and only return the `id`
     * const vehicleImageWithIdOnly = await prisma.vehicleImage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VehicleImageUpdateManyAndReturnArgs>(args: SelectSubset<T, VehicleImageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one VehicleImage.
     * @param {VehicleImageUpsertArgs} args - Arguments to update or create a VehicleImage.
     * @example
     * // Update or create a VehicleImage
     * const vehicleImage = await prisma.vehicleImage.upsert({
     *   create: {
     *     // ... data to create a VehicleImage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VehicleImage we want to update
     *   }
     * })
     */
    upsert<T extends VehicleImageUpsertArgs>(args: SelectSubset<T, VehicleImageUpsertArgs<ExtArgs>>): Prisma__VehicleImageClient<$Result.GetResult<Prisma.$VehicleImagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of VehicleImages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleImageCountArgs} args - Arguments to filter VehicleImages to count.
     * @example
     * // Count the number of VehicleImages
     * const count = await prisma.vehicleImage.count({
     *   where: {
     *     // ... the filter for the VehicleImages we want to count
     *   }
     * })
    **/
    count<T extends VehicleImageCountArgs>(
      args?: Subset<T, VehicleImageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehicleImageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VehicleImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleImageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehicleImageAggregateArgs>(args: Subset<T, VehicleImageAggregateArgs>): Prisma.PrismaPromise<GetVehicleImageAggregateType<T>>

    /**
     * Group by VehicleImage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleImageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehicleImageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehicleImageGroupByArgs['orderBy'] }
        : { orderBy?: VehicleImageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehicleImageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleImageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VehicleImage model
   */
  readonly fields: VehicleImageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VehicleImage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehicleImageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle<T extends VehicleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleDefaultArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VehicleImage model
   */
  interface VehicleImageFieldRefs {
    readonly id: FieldRef<"VehicleImage", 'String'>
    readonly vehicleId: FieldRef<"VehicleImage", 'String'>
    readonly originalUrl: FieldRef<"VehicleImage", 'String'>
    readonly processedUrl: FieldRef<"VehicleImage", 'String'>
    readonly optimizedUrl: FieldRef<"VehicleImage", 'String'>
    readonly thumbnailUrl: FieldRef<"VehicleImage", 'String'>
    readonly imageType: FieldRef<"VehicleImage", 'ImageType'>
    readonly sortOrder: FieldRef<"VehicleImage", 'Int'>
    readonly isProcessed: FieldRef<"VehicleImage", 'Boolean'>
    readonly isOptimized: FieldRef<"VehicleImage", 'Boolean'>
    readonly processedAt: FieldRef<"VehicleImage", 'DateTime'>
    readonly uploadedAt: FieldRef<"VehicleImage", 'DateTime'>
    readonly updatedAt: FieldRef<"VehicleImage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VehicleImage findUnique
   */
  export type VehicleImageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * Filter, which VehicleImage to fetch.
     */
    where: VehicleImageWhereUniqueInput
  }

  /**
   * VehicleImage findUniqueOrThrow
   */
  export type VehicleImageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * Filter, which VehicleImage to fetch.
     */
    where: VehicleImageWhereUniqueInput
  }

  /**
   * VehicleImage findFirst
   */
  export type VehicleImageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * Filter, which VehicleImage to fetch.
     */
    where?: VehicleImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleImages to fetch.
     */
    orderBy?: VehicleImageOrderByWithRelationInput | VehicleImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VehicleImages.
     */
    cursor?: VehicleImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehicleImages.
     */
    distinct?: VehicleImageScalarFieldEnum | VehicleImageScalarFieldEnum[]
  }

  /**
   * VehicleImage findFirstOrThrow
   */
  export type VehicleImageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * Filter, which VehicleImage to fetch.
     */
    where?: VehicleImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleImages to fetch.
     */
    orderBy?: VehicleImageOrderByWithRelationInput | VehicleImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VehicleImages.
     */
    cursor?: VehicleImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleImages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VehicleImages.
     */
    distinct?: VehicleImageScalarFieldEnum | VehicleImageScalarFieldEnum[]
  }

  /**
   * VehicleImage findMany
   */
  export type VehicleImageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * Filter, which VehicleImages to fetch.
     */
    where?: VehicleImageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VehicleImages to fetch.
     */
    orderBy?: VehicleImageOrderByWithRelationInput | VehicleImageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VehicleImages.
     */
    cursor?: VehicleImageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VehicleImages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VehicleImages.
     */
    skip?: number
    distinct?: VehicleImageScalarFieldEnum | VehicleImageScalarFieldEnum[]
  }

  /**
   * VehicleImage create
   */
  export type VehicleImageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * The data needed to create a VehicleImage.
     */
    data: XOR<VehicleImageCreateInput, VehicleImageUncheckedCreateInput>
  }

  /**
   * VehicleImage createMany
   */
  export type VehicleImageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VehicleImages.
     */
    data: VehicleImageCreateManyInput | VehicleImageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VehicleImage createManyAndReturn
   */
  export type VehicleImageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * The data used to create many VehicleImages.
     */
    data: VehicleImageCreateManyInput | VehicleImageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * VehicleImage update
   */
  export type VehicleImageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * The data needed to update a VehicleImage.
     */
    data: XOR<VehicleImageUpdateInput, VehicleImageUncheckedUpdateInput>
    /**
     * Choose, which VehicleImage to update.
     */
    where: VehicleImageWhereUniqueInput
  }

  /**
   * VehicleImage updateMany
   */
  export type VehicleImageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VehicleImages.
     */
    data: XOR<VehicleImageUpdateManyMutationInput, VehicleImageUncheckedUpdateManyInput>
    /**
     * Filter which VehicleImages to update
     */
    where?: VehicleImageWhereInput
    /**
     * Limit how many VehicleImages to update.
     */
    limit?: number
  }

  /**
   * VehicleImage updateManyAndReturn
   */
  export type VehicleImageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * The data used to update VehicleImages.
     */
    data: XOR<VehicleImageUpdateManyMutationInput, VehicleImageUncheckedUpdateManyInput>
    /**
     * Filter which VehicleImages to update
     */
    where?: VehicleImageWhereInput
    /**
     * Limit how many VehicleImages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * VehicleImage upsert
   */
  export type VehicleImageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * The filter to search for the VehicleImage to update in case it exists.
     */
    where: VehicleImageWhereUniqueInput
    /**
     * In case the VehicleImage found by the `where` argument doesn't exist, create a new VehicleImage with this data.
     */
    create: XOR<VehicleImageCreateInput, VehicleImageUncheckedCreateInput>
    /**
     * In case the VehicleImage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehicleImageUpdateInput, VehicleImageUncheckedUpdateInput>
  }

  /**
   * VehicleImage delete
   */
  export type VehicleImageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
    /**
     * Filter which VehicleImage to delete.
     */
    where: VehicleImageWhereUniqueInput
  }

  /**
   * VehicleImage deleteMany
   */
  export type VehicleImageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VehicleImages to delete
     */
    where?: VehicleImageWhereInput
    /**
     * Limit how many VehicleImages to delete.
     */
    limit?: number
  }

  /**
   * VehicleImage without action
   */
  export type VehicleImageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleImage
     */
    select?: VehicleImageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the VehicleImage
     */
    omit?: VehicleImageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleImageInclude<ExtArgs> | null
  }


  /**
   * Model ProcessingJob
   */

  export type AggregateProcessingJob = {
    _count: ProcessingJobCountAggregateOutputType | null
    _min: ProcessingJobMinAggregateOutputType | null
    _max: ProcessingJobMaxAggregateOutputType | null
  }

  export type ProcessingJobMinAggregateOutputType = {
    id: string | null
    vehicleId: string | null
    status: $Enums.JobStatus | null
    errorMessage: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type ProcessingJobMaxAggregateOutputType = {
    id: string | null
    vehicleId: string | null
    status: $Enums.JobStatus | null
    errorMessage: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type ProcessingJobCountAggregateOutputType = {
    id: number
    vehicleId: number
    imageIds: number
    status: number
    errorMessage: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type ProcessingJobMinAggregateInputType = {
    id?: true
    vehicleId?: true
    status?: true
    errorMessage?: true
    createdAt?: true
    completedAt?: true
  }

  export type ProcessingJobMaxAggregateInputType = {
    id?: true
    vehicleId?: true
    status?: true
    errorMessage?: true
    createdAt?: true
    completedAt?: true
  }

  export type ProcessingJobCountAggregateInputType = {
    id?: true
    vehicleId?: true
    imageIds?: true
    status?: true
    errorMessage?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type ProcessingJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessingJob to aggregate.
     */
    where?: ProcessingJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessingJobs to fetch.
     */
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProcessingJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessingJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessingJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProcessingJobs
    **/
    _count?: true | ProcessingJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProcessingJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProcessingJobMaxAggregateInputType
  }

  export type GetProcessingJobAggregateType<T extends ProcessingJobAggregateArgs> = {
        [P in keyof T & keyof AggregateProcessingJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProcessingJob[P]>
      : GetScalarType<T[P], AggregateProcessingJob[P]>
  }




  export type ProcessingJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProcessingJobWhereInput
    orderBy?: ProcessingJobOrderByWithAggregationInput | ProcessingJobOrderByWithAggregationInput[]
    by: ProcessingJobScalarFieldEnum[] | ProcessingJobScalarFieldEnum
    having?: ProcessingJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProcessingJobCountAggregateInputType | true
    _min?: ProcessingJobMinAggregateInputType
    _max?: ProcessingJobMaxAggregateInputType
  }

  export type ProcessingJobGroupByOutputType = {
    id: string
    vehicleId: string
    imageIds: string[]
    status: $Enums.JobStatus
    errorMessage: string | null
    createdAt: Date
    completedAt: Date | null
    _count: ProcessingJobCountAggregateOutputType | null
    _min: ProcessingJobMinAggregateOutputType | null
    _max: ProcessingJobMaxAggregateOutputType | null
  }

  type GetProcessingJobGroupByPayload<T extends ProcessingJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProcessingJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProcessingJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProcessingJobGroupByOutputType[P]>
            : GetScalarType<T[P], ProcessingJobGroupByOutputType[P]>
        }
      >
    >


  export type ProcessingJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    imageIds?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    completedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["processingJob"]>

  export type ProcessingJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    imageIds?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    completedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["processingJob"]>

  export type ProcessingJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    vehicleId?: boolean
    imageIds?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    completedAt?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["processingJob"]>

  export type ProcessingJobSelectScalar = {
    id?: boolean
    vehicleId?: boolean
    imageIds?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type ProcessingJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "vehicleId" | "imageIds" | "status" | "errorMessage" | "createdAt" | "completedAt", ExtArgs["result"]["processingJob"]>
  export type ProcessingJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type ProcessingJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type ProcessingJobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }

  export type $ProcessingJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProcessingJob"
    objects: {
      vehicle: Prisma.$VehiclePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      vehicleId: string
      imageIds: string[]
      status: $Enums.JobStatus
      errorMessage: string | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["processingJob"]>
    composites: {}
  }

  type ProcessingJobGetPayload<S extends boolean | null | undefined | ProcessingJobDefaultArgs> = $Result.GetResult<Prisma.$ProcessingJobPayload, S>

  type ProcessingJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProcessingJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProcessingJobCountAggregateInputType | true
    }

  export interface ProcessingJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProcessingJob'], meta: { name: 'ProcessingJob' } }
    /**
     * Find zero or one ProcessingJob that matches the filter.
     * @param {ProcessingJobFindUniqueArgs} args - Arguments to find a ProcessingJob
     * @example
     * // Get one ProcessingJob
     * const processingJob = await prisma.processingJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProcessingJobFindUniqueArgs>(args: SelectSubset<T, ProcessingJobFindUniqueArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProcessingJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProcessingJobFindUniqueOrThrowArgs} args - Arguments to find a ProcessingJob
     * @example
     * // Get one ProcessingJob
     * const processingJob = await prisma.processingJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProcessingJobFindUniqueOrThrowArgs>(args: SelectSubset<T, ProcessingJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProcessingJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobFindFirstArgs} args - Arguments to find a ProcessingJob
     * @example
     * // Get one ProcessingJob
     * const processingJob = await prisma.processingJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProcessingJobFindFirstArgs>(args?: SelectSubset<T, ProcessingJobFindFirstArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProcessingJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobFindFirstOrThrowArgs} args - Arguments to find a ProcessingJob
     * @example
     * // Get one ProcessingJob
     * const processingJob = await prisma.processingJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProcessingJobFindFirstOrThrowArgs>(args?: SelectSubset<T, ProcessingJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProcessingJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProcessingJobs
     * const processingJobs = await prisma.processingJob.findMany()
     * 
     * // Get first 10 ProcessingJobs
     * const processingJobs = await prisma.processingJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const processingJobWithIdOnly = await prisma.processingJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProcessingJobFindManyArgs>(args?: SelectSubset<T, ProcessingJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProcessingJob.
     * @param {ProcessingJobCreateArgs} args - Arguments to create a ProcessingJob.
     * @example
     * // Create one ProcessingJob
     * const ProcessingJob = await prisma.processingJob.create({
     *   data: {
     *     // ... data to create a ProcessingJob
     *   }
     * })
     * 
     */
    create<T extends ProcessingJobCreateArgs>(args: SelectSubset<T, ProcessingJobCreateArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProcessingJobs.
     * @param {ProcessingJobCreateManyArgs} args - Arguments to create many ProcessingJobs.
     * @example
     * // Create many ProcessingJobs
     * const processingJob = await prisma.processingJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProcessingJobCreateManyArgs>(args?: SelectSubset<T, ProcessingJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProcessingJobs and returns the data saved in the database.
     * @param {ProcessingJobCreateManyAndReturnArgs} args - Arguments to create many ProcessingJobs.
     * @example
     * // Create many ProcessingJobs
     * const processingJob = await prisma.processingJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProcessingJobs and only return the `id`
     * const processingJobWithIdOnly = await prisma.processingJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProcessingJobCreateManyAndReturnArgs>(args?: SelectSubset<T, ProcessingJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProcessingJob.
     * @param {ProcessingJobDeleteArgs} args - Arguments to delete one ProcessingJob.
     * @example
     * // Delete one ProcessingJob
     * const ProcessingJob = await prisma.processingJob.delete({
     *   where: {
     *     // ... filter to delete one ProcessingJob
     *   }
     * })
     * 
     */
    delete<T extends ProcessingJobDeleteArgs>(args: SelectSubset<T, ProcessingJobDeleteArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProcessingJob.
     * @param {ProcessingJobUpdateArgs} args - Arguments to update one ProcessingJob.
     * @example
     * // Update one ProcessingJob
     * const processingJob = await prisma.processingJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProcessingJobUpdateArgs>(args: SelectSubset<T, ProcessingJobUpdateArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProcessingJobs.
     * @param {ProcessingJobDeleteManyArgs} args - Arguments to filter ProcessingJobs to delete.
     * @example
     * // Delete a few ProcessingJobs
     * const { count } = await prisma.processingJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProcessingJobDeleteManyArgs>(args?: SelectSubset<T, ProcessingJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcessingJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProcessingJobs
     * const processingJob = await prisma.processingJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProcessingJobUpdateManyArgs>(args: SelectSubset<T, ProcessingJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProcessingJobs and returns the data updated in the database.
     * @param {ProcessingJobUpdateManyAndReturnArgs} args - Arguments to update many ProcessingJobs.
     * @example
     * // Update many ProcessingJobs
     * const processingJob = await prisma.processingJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProcessingJobs and only return the `id`
     * const processingJobWithIdOnly = await prisma.processingJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProcessingJobUpdateManyAndReturnArgs>(args: SelectSubset<T, ProcessingJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProcessingJob.
     * @param {ProcessingJobUpsertArgs} args - Arguments to update or create a ProcessingJob.
     * @example
     * // Update or create a ProcessingJob
     * const processingJob = await prisma.processingJob.upsert({
     *   create: {
     *     // ... data to create a ProcessingJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProcessingJob we want to update
     *   }
     * })
     */
    upsert<T extends ProcessingJobUpsertArgs>(args: SelectSubset<T, ProcessingJobUpsertArgs<ExtArgs>>): Prisma__ProcessingJobClient<$Result.GetResult<Prisma.$ProcessingJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProcessingJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobCountArgs} args - Arguments to filter ProcessingJobs to count.
     * @example
     * // Count the number of ProcessingJobs
     * const count = await prisma.processingJob.count({
     *   where: {
     *     // ... the filter for the ProcessingJobs we want to count
     *   }
     * })
    **/
    count<T extends ProcessingJobCountArgs>(
      args?: Subset<T, ProcessingJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProcessingJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProcessingJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProcessingJobAggregateArgs>(args: Subset<T, ProcessingJobAggregateArgs>): Prisma.PrismaPromise<GetProcessingJobAggregateType<T>>

    /**
     * Group by ProcessingJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProcessingJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProcessingJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProcessingJobGroupByArgs['orderBy'] }
        : { orderBy?: ProcessingJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProcessingJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProcessingJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProcessingJob model
   */
  readonly fields: ProcessingJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProcessingJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProcessingJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle<T extends VehicleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleDefaultArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ProcessingJob model
   */
  interface ProcessingJobFieldRefs {
    readonly id: FieldRef<"ProcessingJob", 'String'>
    readonly vehicleId: FieldRef<"ProcessingJob", 'String'>
    readonly imageIds: FieldRef<"ProcessingJob", 'String[]'>
    readonly status: FieldRef<"ProcessingJob", 'JobStatus'>
    readonly errorMessage: FieldRef<"ProcessingJob", 'String'>
    readonly createdAt: FieldRef<"ProcessingJob", 'DateTime'>
    readonly completedAt: FieldRef<"ProcessingJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProcessingJob findUnique
   */
  export type ProcessingJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * Filter, which ProcessingJob to fetch.
     */
    where: ProcessingJobWhereUniqueInput
  }

  /**
   * ProcessingJob findUniqueOrThrow
   */
  export type ProcessingJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * Filter, which ProcessingJob to fetch.
     */
    where: ProcessingJobWhereUniqueInput
  }

  /**
   * ProcessingJob findFirst
   */
  export type ProcessingJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * Filter, which ProcessingJob to fetch.
     */
    where?: ProcessingJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessingJobs to fetch.
     */
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessingJobs.
     */
    cursor?: ProcessingJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessingJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessingJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessingJobs.
     */
    distinct?: ProcessingJobScalarFieldEnum | ProcessingJobScalarFieldEnum[]
  }

  /**
   * ProcessingJob findFirstOrThrow
   */
  export type ProcessingJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * Filter, which ProcessingJob to fetch.
     */
    where?: ProcessingJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessingJobs to fetch.
     */
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProcessingJobs.
     */
    cursor?: ProcessingJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessingJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessingJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProcessingJobs.
     */
    distinct?: ProcessingJobScalarFieldEnum | ProcessingJobScalarFieldEnum[]
  }

  /**
   * ProcessingJob findMany
   */
  export type ProcessingJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * Filter, which ProcessingJobs to fetch.
     */
    where?: ProcessingJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProcessingJobs to fetch.
     */
    orderBy?: ProcessingJobOrderByWithRelationInput | ProcessingJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProcessingJobs.
     */
    cursor?: ProcessingJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProcessingJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProcessingJobs.
     */
    skip?: number
    distinct?: ProcessingJobScalarFieldEnum | ProcessingJobScalarFieldEnum[]
  }

  /**
   * ProcessingJob create
   */
  export type ProcessingJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * The data needed to create a ProcessingJob.
     */
    data: XOR<ProcessingJobCreateInput, ProcessingJobUncheckedCreateInput>
  }

  /**
   * ProcessingJob createMany
   */
  export type ProcessingJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProcessingJobs.
     */
    data: ProcessingJobCreateManyInput | ProcessingJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProcessingJob createManyAndReturn
   */
  export type ProcessingJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * The data used to create many ProcessingJobs.
     */
    data: ProcessingJobCreateManyInput | ProcessingJobCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProcessingJob update
   */
  export type ProcessingJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * The data needed to update a ProcessingJob.
     */
    data: XOR<ProcessingJobUpdateInput, ProcessingJobUncheckedUpdateInput>
    /**
     * Choose, which ProcessingJob to update.
     */
    where: ProcessingJobWhereUniqueInput
  }

  /**
   * ProcessingJob updateMany
   */
  export type ProcessingJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProcessingJobs.
     */
    data: XOR<ProcessingJobUpdateManyMutationInput, ProcessingJobUncheckedUpdateManyInput>
    /**
     * Filter which ProcessingJobs to update
     */
    where?: ProcessingJobWhereInput
    /**
     * Limit how many ProcessingJobs to update.
     */
    limit?: number
  }

  /**
   * ProcessingJob updateManyAndReturn
   */
  export type ProcessingJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * The data used to update ProcessingJobs.
     */
    data: XOR<ProcessingJobUpdateManyMutationInput, ProcessingJobUncheckedUpdateManyInput>
    /**
     * Filter which ProcessingJobs to update
     */
    where?: ProcessingJobWhereInput
    /**
     * Limit how many ProcessingJobs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProcessingJob upsert
   */
  export type ProcessingJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * The filter to search for the ProcessingJob to update in case it exists.
     */
    where: ProcessingJobWhereUniqueInput
    /**
     * In case the ProcessingJob found by the `where` argument doesn't exist, create a new ProcessingJob with this data.
     */
    create: XOR<ProcessingJobCreateInput, ProcessingJobUncheckedCreateInput>
    /**
     * In case the ProcessingJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProcessingJobUpdateInput, ProcessingJobUncheckedUpdateInput>
  }

  /**
   * ProcessingJob delete
   */
  export type ProcessingJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
    /**
     * Filter which ProcessingJob to delete.
     */
    where: ProcessingJobWhereUniqueInput
  }

  /**
   * ProcessingJob deleteMany
   */
  export type ProcessingJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProcessingJobs to delete
     */
    where?: ProcessingJobWhereInput
    /**
     * Limit how many ProcessingJobs to delete.
     */
    limit?: number
  }

  /**
   * ProcessingJob without action
   */
  export type ProcessingJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProcessingJob
     */
    select?: ProcessingJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProcessingJob
     */
    omit?: ProcessingJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProcessingJobInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const StoreScalarFieldEnum: {
    id: 'id',
    name: 'name',
    address: 'address',
    brandLogos: 'brandLogos',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StoreScalarFieldEnum = (typeof StoreScalarFieldEnum)[keyof typeof StoreScalarFieldEnum]


  export const VehicleScalarFieldEnum: {
    id: 'id',
    stockNumber: 'stockNumber',
    vin: 'vin',
    storeId: 'storeId',
    processingStatus: 'processingStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VehicleScalarFieldEnum = (typeof VehicleScalarFieldEnum)[keyof typeof VehicleScalarFieldEnum]


  export const VehicleImageScalarFieldEnum: {
    id: 'id',
    vehicleId: 'vehicleId',
    originalUrl: 'originalUrl',
    processedUrl: 'processedUrl',
    optimizedUrl: 'optimizedUrl',
    thumbnailUrl: 'thumbnailUrl',
    imageType: 'imageType',
    sortOrder: 'sortOrder',
    isProcessed: 'isProcessed',
    isOptimized: 'isOptimized',
    processedAt: 'processedAt',
    uploadedAt: 'uploadedAt',
    updatedAt: 'updatedAt'
  };

  export type VehicleImageScalarFieldEnum = (typeof VehicleImageScalarFieldEnum)[keyof typeof VehicleImageScalarFieldEnum]


  export const ProcessingJobScalarFieldEnum: {
    id: 'id',
    vehicleId: 'vehicleId',
    imageIds: 'imageIds',
    status: 'status',
    errorMessage: 'errorMessage',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type ProcessingJobScalarFieldEnum = (typeof ProcessingJobScalarFieldEnum)[keyof typeof ProcessingJobScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'ProcessingStatus'
   */
  export type EnumProcessingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProcessingStatus'>
    


  /**
   * Reference to a field of type 'ProcessingStatus[]'
   */
  export type ListEnumProcessingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProcessingStatus[]'>
    


  /**
   * Reference to a field of type 'ImageType'
   */
  export type EnumImageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImageType'>
    


  /**
   * Reference to a field of type 'ImageType[]'
   */
  export type ListEnumImageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImageType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'JobStatus'
   */
  export type EnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus'>
    


  /**
   * Reference to a field of type 'JobStatus[]'
   */
  export type ListEnumJobStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'JobStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    name?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    name?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    name?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type StoreWhereInput = {
    AND?: StoreWhereInput | StoreWhereInput[]
    OR?: StoreWhereInput[]
    NOT?: StoreWhereInput | StoreWhereInput[]
    id?: StringFilter<"Store"> | string
    name?: StringFilter<"Store"> | string
    address?: StringFilter<"Store"> | string
    brandLogos?: StringNullableListFilter<"Store">
    imageUrl?: StringNullableFilter<"Store"> | string | null
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
    vehicles?: VehicleListRelationFilter
  }

  export type StoreOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    brandLogos?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    vehicles?: VehicleOrderByRelationAggregateInput
  }

  export type StoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StoreWhereInput | StoreWhereInput[]
    OR?: StoreWhereInput[]
    NOT?: StoreWhereInput | StoreWhereInput[]
    name?: StringFilter<"Store"> | string
    address?: StringFilter<"Store"> | string
    brandLogos?: StringNullableListFilter<"Store">
    imageUrl?: StringNullableFilter<"Store"> | string | null
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
    vehicles?: VehicleListRelationFilter
  }, "id">

  export type StoreOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    brandLogos?: SortOrder
    imageUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StoreCountOrderByAggregateInput
    _max?: StoreMaxOrderByAggregateInput
    _min?: StoreMinOrderByAggregateInput
  }

  export type StoreScalarWhereWithAggregatesInput = {
    AND?: StoreScalarWhereWithAggregatesInput | StoreScalarWhereWithAggregatesInput[]
    OR?: StoreScalarWhereWithAggregatesInput[]
    NOT?: StoreScalarWhereWithAggregatesInput | StoreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Store"> | string
    name?: StringWithAggregatesFilter<"Store"> | string
    address?: StringWithAggregatesFilter<"Store"> | string
    brandLogos?: StringNullableListFilter<"Store">
    imageUrl?: StringNullableWithAggregatesFilter<"Store"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Store"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Store"> | Date | string
  }

  export type VehicleWhereInput = {
    AND?: VehicleWhereInput | VehicleWhereInput[]
    OR?: VehicleWhereInput[]
    NOT?: VehicleWhereInput | VehicleWhereInput[]
    id?: StringFilter<"Vehicle"> | string
    stockNumber?: StringFilter<"Vehicle"> | string
    vin?: StringFilter<"Vehicle"> | string
    storeId?: StringFilter<"Vehicle"> | string
    processingStatus?: EnumProcessingStatusFilter<"Vehicle"> | $Enums.ProcessingStatus
    createdAt?: DateTimeFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeFilter<"Vehicle"> | Date | string
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
    images?: VehicleImageListRelationFilter
    processingJobs?: ProcessingJobListRelationFilter
  }

  export type VehicleOrderByWithRelationInput = {
    id?: SortOrder
    stockNumber?: SortOrder
    vin?: SortOrder
    storeId?: SortOrder
    processingStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    store?: StoreOrderByWithRelationInput
    images?: VehicleImageOrderByRelationAggregateInput
    processingJobs?: ProcessingJobOrderByRelationAggregateInput
  }

  export type VehicleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    stockNumber_storeId?: VehicleStockNumberStoreIdCompoundUniqueInput
    AND?: VehicleWhereInput | VehicleWhereInput[]
    OR?: VehicleWhereInput[]
    NOT?: VehicleWhereInput | VehicleWhereInput[]
    stockNumber?: StringFilter<"Vehicle"> | string
    vin?: StringFilter<"Vehicle"> | string
    storeId?: StringFilter<"Vehicle"> | string
    processingStatus?: EnumProcessingStatusFilter<"Vehicle"> | $Enums.ProcessingStatus
    createdAt?: DateTimeFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeFilter<"Vehicle"> | Date | string
    store?: XOR<StoreScalarRelationFilter, StoreWhereInput>
    images?: VehicleImageListRelationFilter
    processingJobs?: ProcessingJobListRelationFilter
  }, "id" | "stockNumber_storeId">

  export type VehicleOrderByWithAggregationInput = {
    id?: SortOrder
    stockNumber?: SortOrder
    vin?: SortOrder
    storeId?: SortOrder
    processingStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VehicleCountOrderByAggregateInput
    _max?: VehicleMaxOrderByAggregateInput
    _min?: VehicleMinOrderByAggregateInput
  }

  export type VehicleScalarWhereWithAggregatesInput = {
    AND?: VehicleScalarWhereWithAggregatesInput | VehicleScalarWhereWithAggregatesInput[]
    OR?: VehicleScalarWhereWithAggregatesInput[]
    NOT?: VehicleScalarWhereWithAggregatesInput | VehicleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vehicle"> | string
    stockNumber?: StringWithAggregatesFilter<"Vehicle"> | string
    vin?: StringWithAggregatesFilter<"Vehicle"> | string
    storeId?: StringWithAggregatesFilter<"Vehicle"> | string
    processingStatus?: EnumProcessingStatusWithAggregatesFilter<"Vehicle"> | $Enums.ProcessingStatus
    createdAt?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
  }

  export type VehicleImageWhereInput = {
    AND?: VehicleImageWhereInput | VehicleImageWhereInput[]
    OR?: VehicleImageWhereInput[]
    NOT?: VehicleImageWhereInput | VehicleImageWhereInput[]
    id?: StringFilter<"VehicleImage"> | string
    vehicleId?: StringFilter<"VehicleImage"> | string
    originalUrl?: StringFilter<"VehicleImage"> | string
    processedUrl?: StringNullableFilter<"VehicleImage"> | string | null
    optimizedUrl?: StringNullableFilter<"VehicleImage"> | string | null
    thumbnailUrl?: StringFilter<"VehicleImage"> | string
    imageType?: EnumImageTypeFilter<"VehicleImage"> | $Enums.ImageType
    sortOrder?: IntFilter<"VehicleImage"> | number
    isProcessed?: BoolFilter<"VehicleImage"> | boolean
    isOptimized?: BoolFilter<"VehicleImage"> | boolean
    processedAt?: DateTimeNullableFilter<"VehicleImage"> | Date | string | null
    uploadedAt?: DateTimeFilter<"VehicleImage"> | Date | string
    updatedAt?: DateTimeFilter<"VehicleImage"> | Date | string
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }

  export type VehicleImageOrderByWithRelationInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    originalUrl?: SortOrder
    processedUrl?: SortOrderInput | SortOrder
    optimizedUrl?: SortOrderInput | SortOrder
    thumbnailUrl?: SortOrder
    imageType?: SortOrder
    sortOrder?: SortOrder
    isProcessed?: SortOrder
    isOptimized?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    updatedAt?: SortOrder
    vehicle?: VehicleOrderByWithRelationInput
  }

  export type VehicleImageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VehicleImageWhereInput | VehicleImageWhereInput[]
    OR?: VehicleImageWhereInput[]
    NOT?: VehicleImageWhereInput | VehicleImageWhereInput[]
    vehicleId?: StringFilter<"VehicleImage"> | string
    originalUrl?: StringFilter<"VehicleImage"> | string
    processedUrl?: StringNullableFilter<"VehicleImage"> | string | null
    optimizedUrl?: StringNullableFilter<"VehicleImage"> | string | null
    thumbnailUrl?: StringFilter<"VehicleImage"> | string
    imageType?: EnumImageTypeFilter<"VehicleImage"> | $Enums.ImageType
    sortOrder?: IntFilter<"VehicleImage"> | number
    isProcessed?: BoolFilter<"VehicleImage"> | boolean
    isOptimized?: BoolFilter<"VehicleImage"> | boolean
    processedAt?: DateTimeNullableFilter<"VehicleImage"> | Date | string | null
    uploadedAt?: DateTimeFilter<"VehicleImage"> | Date | string
    updatedAt?: DateTimeFilter<"VehicleImage"> | Date | string
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }, "id">

  export type VehicleImageOrderByWithAggregationInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    originalUrl?: SortOrder
    processedUrl?: SortOrderInput | SortOrder
    optimizedUrl?: SortOrderInput | SortOrder
    thumbnailUrl?: SortOrder
    imageType?: SortOrder
    sortOrder?: SortOrder
    isProcessed?: SortOrder
    isOptimized?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    uploadedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: VehicleImageCountOrderByAggregateInput
    _avg?: VehicleImageAvgOrderByAggregateInput
    _max?: VehicleImageMaxOrderByAggregateInput
    _min?: VehicleImageMinOrderByAggregateInput
    _sum?: VehicleImageSumOrderByAggregateInput
  }

  export type VehicleImageScalarWhereWithAggregatesInput = {
    AND?: VehicleImageScalarWhereWithAggregatesInput | VehicleImageScalarWhereWithAggregatesInput[]
    OR?: VehicleImageScalarWhereWithAggregatesInput[]
    NOT?: VehicleImageScalarWhereWithAggregatesInput | VehicleImageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"VehicleImage"> | string
    vehicleId?: StringWithAggregatesFilter<"VehicleImage"> | string
    originalUrl?: StringWithAggregatesFilter<"VehicleImage"> | string
    processedUrl?: StringNullableWithAggregatesFilter<"VehicleImage"> | string | null
    optimizedUrl?: StringNullableWithAggregatesFilter<"VehicleImage"> | string | null
    thumbnailUrl?: StringWithAggregatesFilter<"VehicleImage"> | string
    imageType?: EnumImageTypeWithAggregatesFilter<"VehicleImage"> | $Enums.ImageType
    sortOrder?: IntWithAggregatesFilter<"VehicleImage"> | number
    isProcessed?: BoolWithAggregatesFilter<"VehicleImage"> | boolean
    isOptimized?: BoolWithAggregatesFilter<"VehicleImage"> | boolean
    processedAt?: DateTimeNullableWithAggregatesFilter<"VehicleImage"> | Date | string | null
    uploadedAt?: DateTimeWithAggregatesFilter<"VehicleImage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"VehicleImage"> | Date | string
  }

  export type ProcessingJobWhereInput = {
    AND?: ProcessingJobWhereInput | ProcessingJobWhereInput[]
    OR?: ProcessingJobWhereInput[]
    NOT?: ProcessingJobWhereInput | ProcessingJobWhereInput[]
    id?: StringFilter<"ProcessingJob"> | string
    vehicleId?: StringFilter<"ProcessingJob"> | string
    imageIds?: StringNullableListFilter<"ProcessingJob">
    status?: EnumJobStatusFilter<"ProcessingJob"> | $Enums.JobStatus
    errorMessage?: StringNullableFilter<"ProcessingJob"> | string | null
    createdAt?: DateTimeFilter<"ProcessingJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"ProcessingJob"> | Date | string | null
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }

  export type ProcessingJobOrderByWithRelationInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    imageIds?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    vehicle?: VehicleOrderByWithRelationInput
  }

  export type ProcessingJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProcessingJobWhereInput | ProcessingJobWhereInput[]
    OR?: ProcessingJobWhereInput[]
    NOT?: ProcessingJobWhereInput | ProcessingJobWhereInput[]
    vehicleId?: StringFilter<"ProcessingJob"> | string
    imageIds?: StringNullableListFilter<"ProcessingJob">
    status?: EnumJobStatusFilter<"ProcessingJob"> | $Enums.JobStatus
    errorMessage?: StringNullableFilter<"ProcessingJob"> | string | null
    createdAt?: DateTimeFilter<"ProcessingJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"ProcessingJob"> | Date | string | null
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }, "id">

  export type ProcessingJobOrderByWithAggregationInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    imageIds?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: ProcessingJobCountOrderByAggregateInput
    _max?: ProcessingJobMaxOrderByAggregateInput
    _min?: ProcessingJobMinOrderByAggregateInput
  }

  export type ProcessingJobScalarWhereWithAggregatesInput = {
    AND?: ProcessingJobScalarWhereWithAggregatesInput | ProcessingJobScalarWhereWithAggregatesInput[]
    OR?: ProcessingJobScalarWhereWithAggregatesInput[]
    NOT?: ProcessingJobScalarWhereWithAggregatesInput | ProcessingJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProcessingJob"> | string
    vehicleId?: StringWithAggregatesFilter<"ProcessingJob"> | string
    imageIds?: StringNullableListFilter<"ProcessingJob">
    status?: EnumJobStatusWithAggregatesFilter<"ProcessingJob"> | $Enums.JobStatus
    errorMessage?: StringNullableWithAggregatesFilter<"ProcessingJob"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ProcessingJob"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"ProcessingJob"> | Date | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    role: $Enums.UserRole
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreCreateInput = {
    id?: string
    name: string
    address: string
    brandLogos?: StoreCreatebrandLogosInput | string[]
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicles?: VehicleCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateInput = {
    id?: string
    name: string
    address: string
    brandLogos?: StoreCreatebrandLogosInput | string[]
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicles?: VehicleUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    brandLogos?: StoreUpdatebrandLogosInput | string[]
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicles?: VehicleUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    brandLogos?: StoreUpdatebrandLogosInput | string[]
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicles?: VehicleUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateManyInput = {
    id?: string
    name: string
    address: string
    brandLogos?: StoreCreatebrandLogosInput | string[]
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    brandLogos?: StoreUpdatebrandLogosInput | string[]
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    brandLogos?: StoreUpdatebrandLogosInput | string[]
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleCreateInput = {
    id?: string
    stockNumber: string
    vin: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutVehiclesInput
    images?: VehicleImageCreateNestedManyWithoutVehicleInput
    processingJobs?: ProcessingJobCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateInput = {
    id?: string
    stockNumber: string
    vin: string
    storeId: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: VehicleImageUncheckedCreateNestedManyWithoutVehicleInput
    processingJobs?: ProcessingJobUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutVehiclesNestedInput
    images?: VehicleImageUpdateManyWithoutVehicleNestedInput
    processingJobs?: ProcessingJobUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: VehicleImageUncheckedUpdateManyWithoutVehicleNestedInput
    processingJobs?: ProcessingJobUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleCreateManyInput = {
    id?: string
    stockNumber: string
    vin: string
    storeId: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleImageCreateInput = {
    id?: string
    originalUrl: string
    processedUrl?: string | null
    optimizedUrl?: string | null
    thumbnailUrl: string
    imageType: $Enums.ImageType
    sortOrder?: number
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: Date | string | null
    uploadedAt?: Date | string
    updatedAt?: Date | string
    vehicle: VehicleCreateNestedOneWithoutImagesInput
  }

  export type VehicleImageUncheckedCreateInput = {
    id?: string
    vehicleId: string
    originalUrl: string
    processedUrl?: string | null
    optimizedUrl?: string | null
    thumbnailUrl: string
    imageType: $Enums.ImageType
    sortOrder?: number
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: Date | string | null
    uploadedAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleImageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalUrl?: StringFieldUpdateOperationsInput | string
    processedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    optimizedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    imageType?: EnumImageTypeFieldUpdateOperationsInput | $Enums.ImageType
    sortOrder?: IntFieldUpdateOperationsInput | number
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    isOptimized?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutImagesNestedInput
  }

  export type VehicleImageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    originalUrl?: StringFieldUpdateOperationsInput | string
    processedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    optimizedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    imageType?: EnumImageTypeFieldUpdateOperationsInput | $Enums.ImageType
    sortOrder?: IntFieldUpdateOperationsInput | number
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    isOptimized?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleImageCreateManyInput = {
    id?: string
    vehicleId: string
    originalUrl: string
    processedUrl?: string | null
    optimizedUrl?: string | null
    thumbnailUrl: string
    imageType: $Enums.ImageType
    sortOrder?: number
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: Date | string | null
    uploadedAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleImageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalUrl?: StringFieldUpdateOperationsInput | string
    processedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    optimizedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    imageType?: EnumImageTypeFieldUpdateOperationsInput | $Enums.ImageType
    sortOrder?: IntFieldUpdateOperationsInput | number
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    isOptimized?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleImageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    originalUrl?: StringFieldUpdateOperationsInput | string
    processedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    optimizedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    imageType?: EnumImageTypeFieldUpdateOperationsInput | $Enums.ImageType
    sortOrder?: IntFieldUpdateOperationsInput | number
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    isOptimized?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessingJobCreateInput = {
    id?: string
    imageIds?: ProcessingJobCreateimageIdsInput | string[]
    status?: $Enums.JobStatus
    errorMessage?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
    vehicle: VehicleCreateNestedOneWithoutProcessingJobsInput
  }

  export type ProcessingJobUncheckedCreateInput = {
    id?: string
    vehicleId: string
    imageIds?: ProcessingJobCreateimageIdsInput | string[]
    status?: $Enums.JobStatus
    errorMessage?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ProcessingJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageIds?: ProcessingJobUpdateimageIdsInput | string[]
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    vehicle?: VehicleUpdateOneRequiredWithoutProcessingJobsNestedInput
  }

  export type ProcessingJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    imageIds?: ProcessingJobUpdateimageIdsInput | string[]
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProcessingJobCreateManyInput = {
    id?: string
    vehicleId: string
    imageIds?: ProcessingJobCreateimageIdsInput | string[]
    status?: $Enums.JobStatus
    errorMessage?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ProcessingJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageIds?: ProcessingJobUpdateimageIdsInput | string[]
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProcessingJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    imageIds?: ProcessingJobUpdateimageIdsInput | string[]
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type VehicleListRelationFilter = {
    every?: VehicleWhereInput
    some?: VehicleWhereInput
    none?: VehicleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type VehicleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StoreCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    brandLogos?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumProcessingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingStatus | EnumProcessingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingStatusFilter<$PrismaModel> | $Enums.ProcessingStatus
  }

  export type StoreScalarRelationFilter = {
    is?: StoreWhereInput
    isNot?: StoreWhereInput
  }

  export type VehicleImageListRelationFilter = {
    every?: VehicleImageWhereInput
    some?: VehicleImageWhereInput
    none?: VehicleImageWhereInput
  }

  export type ProcessingJobListRelationFilter = {
    every?: ProcessingJobWhereInput
    some?: ProcessingJobWhereInput
    none?: ProcessingJobWhereInput
  }

  export type VehicleImageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProcessingJobOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VehicleStockNumberStoreIdCompoundUniqueInput = {
    stockNumber: string
    storeId: string
  }

  export type VehicleCountOrderByAggregateInput = {
    id?: SortOrder
    stockNumber?: SortOrder
    vin?: SortOrder
    storeId?: SortOrder
    processingStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleMaxOrderByAggregateInput = {
    id?: SortOrder
    stockNumber?: SortOrder
    vin?: SortOrder
    storeId?: SortOrder
    processingStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleMinOrderByAggregateInput = {
    id?: SortOrder
    stockNumber?: SortOrder
    vin?: SortOrder
    storeId?: SortOrder
    processingStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumProcessingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingStatus | EnumProcessingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProcessingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProcessingStatusFilter<$PrismaModel>
    _max?: NestedEnumProcessingStatusFilter<$PrismaModel>
  }

  export type EnumImageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ImageType | EnumImageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ImageType[] | ListEnumImageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImageType[] | ListEnumImageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumImageTypeFilter<$PrismaModel> | $Enums.ImageType
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type VehicleScalarRelationFilter = {
    is?: VehicleWhereInput
    isNot?: VehicleWhereInput
  }

  export type VehicleImageCountOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    originalUrl?: SortOrder
    processedUrl?: SortOrder
    optimizedUrl?: SortOrder
    thumbnailUrl?: SortOrder
    imageType?: SortOrder
    sortOrder?: SortOrder
    isProcessed?: SortOrder
    isOptimized?: SortOrder
    processedAt?: SortOrder
    uploadedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleImageAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type VehicleImageMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    originalUrl?: SortOrder
    processedUrl?: SortOrder
    optimizedUrl?: SortOrder
    thumbnailUrl?: SortOrder
    imageType?: SortOrder
    sortOrder?: SortOrder
    isProcessed?: SortOrder
    isOptimized?: SortOrder
    processedAt?: SortOrder
    uploadedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleImageMinOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    originalUrl?: SortOrder
    processedUrl?: SortOrder
    optimizedUrl?: SortOrder
    thumbnailUrl?: SortOrder
    imageType?: SortOrder
    sortOrder?: SortOrder
    isProcessed?: SortOrder
    isOptimized?: SortOrder
    processedAt?: SortOrder
    uploadedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VehicleImageSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumImageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImageType | EnumImageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ImageType[] | ListEnumImageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImageType[] | ListEnumImageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumImageTypeWithAggregatesFilter<$PrismaModel> | $Enums.ImageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumImageTypeFilter<$PrismaModel>
    _max?: NestedEnumImageTypeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus
  }

  export type ProcessingJobCountOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    imageIds?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ProcessingJobMaxOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type ProcessingJobMinOrderByAggregateInput = {
    id?: SortOrder
    vehicleId?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type EnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobStatusFilter<$PrismaModel>
    _max?: NestedEnumJobStatusFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StoreCreatebrandLogosInput = {
    set: string[]
  }

  export type VehicleCreateNestedManyWithoutStoreInput = {
    create?: XOR<VehicleCreateWithoutStoreInput, VehicleUncheckedCreateWithoutStoreInput> | VehicleCreateWithoutStoreInput[] | VehicleUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: VehicleCreateOrConnectWithoutStoreInput | VehicleCreateOrConnectWithoutStoreInput[]
    createMany?: VehicleCreateManyStoreInputEnvelope
    connect?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
  }

  export type VehicleUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<VehicleCreateWithoutStoreInput, VehicleUncheckedCreateWithoutStoreInput> | VehicleCreateWithoutStoreInput[] | VehicleUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: VehicleCreateOrConnectWithoutStoreInput | VehicleCreateOrConnectWithoutStoreInput[]
    createMany?: VehicleCreateManyStoreInputEnvelope
    connect?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
  }

  export type StoreUpdatebrandLogosInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type VehicleUpdateManyWithoutStoreNestedInput = {
    create?: XOR<VehicleCreateWithoutStoreInput, VehicleUncheckedCreateWithoutStoreInput> | VehicleCreateWithoutStoreInput[] | VehicleUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: VehicleCreateOrConnectWithoutStoreInput | VehicleCreateOrConnectWithoutStoreInput[]
    upsert?: VehicleUpsertWithWhereUniqueWithoutStoreInput | VehicleUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: VehicleCreateManyStoreInputEnvelope
    set?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
    disconnect?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
    delete?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
    connect?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
    update?: VehicleUpdateWithWhereUniqueWithoutStoreInput | VehicleUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: VehicleUpdateManyWithWhereWithoutStoreInput | VehicleUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: VehicleScalarWhereInput | VehicleScalarWhereInput[]
  }

  export type VehicleUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<VehicleCreateWithoutStoreInput, VehicleUncheckedCreateWithoutStoreInput> | VehicleCreateWithoutStoreInput[] | VehicleUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: VehicleCreateOrConnectWithoutStoreInput | VehicleCreateOrConnectWithoutStoreInput[]
    upsert?: VehicleUpsertWithWhereUniqueWithoutStoreInput | VehicleUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: VehicleCreateManyStoreInputEnvelope
    set?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
    disconnect?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
    delete?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
    connect?: VehicleWhereUniqueInput | VehicleWhereUniqueInput[]
    update?: VehicleUpdateWithWhereUniqueWithoutStoreInput | VehicleUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: VehicleUpdateManyWithWhereWithoutStoreInput | VehicleUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: VehicleScalarWhereInput | VehicleScalarWhereInput[]
  }

  export type StoreCreateNestedOneWithoutVehiclesInput = {
    create?: XOR<StoreCreateWithoutVehiclesInput, StoreUncheckedCreateWithoutVehiclesInput>
    connectOrCreate?: StoreCreateOrConnectWithoutVehiclesInput
    connect?: StoreWhereUniqueInput
  }

  export type VehicleImageCreateNestedManyWithoutVehicleInput = {
    create?: XOR<VehicleImageCreateWithoutVehicleInput, VehicleImageUncheckedCreateWithoutVehicleInput> | VehicleImageCreateWithoutVehicleInput[] | VehicleImageUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehicleImageCreateOrConnectWithoutVehicleInput | VehicleImageCreateOrConnectWithoutVehicleInput[]
    createMany?: VehicleImageCreateManyVehicleInputEnvelope
    connect?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
  }

  export type ProcessingJobCreateNestedManyWithoutVehicleInput = {
    create?: XOR<ProcessingJobCreateWithoutVehicleInput, ProcessingJobUncheckedCreateWithoutVehicleInput> | ProcessingJobCreateWithoutVehicleInput[] | ProcessingJobUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: ProcessingJobCreateOrConnectWithoutVehicleInput | ProcessingJobCreateOrConnectWithoutVehicleInput[]
    createMany?: ProcessingJobCreateManyVehicleInputEnvelope
    connect?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
  }

  export type VehicleImageUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<VehicleImageCreateWithoutVehicleInput, VehicleImageUncheckedCreateWithoutVehicleInput> | VehicleImageCreateWithoutVehicleInput[] | VehicleImageUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehicleImageCreateOrConnectWithoutVehicleInput | VehicleImageCreateOrConnectWithoutVehicleInput[]
    createMany?: VehicleImageCreateManyVehicleInputEnvelope
    connect?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
  }

  export type ProcessingJobUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<ProcessingJobCreateWithoutVehicleInput, ProcessingJobUncheckedCreateWithoutVehicleInput> | ProcessingJobCreateWithoutVehicleInput[] | ProcessingJobUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: ProcessingJobCreateOrConnectWithoutVehicleInput | ProcessingJobCreateOrConnectWithoutVehicleInput[]
    createMany?: ProcessingJobCreateManyVehicleInputEnvelope
    connect?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
  }

  export type EnumProcessingStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProcessingStatus
  }

  export type StoreUpdateOneRequiredWithoutVehiclesNestedInput = {
    create?: XOR<StoreCreateWithoutVehiclesInput, StoreUncheckedCreateWithoutVehiclesInput>
    connectOrCreate?: StoreCreateOrConnectWithoutVehiclesInput
    upsert?: StoreUpsertWithoutVehiclesInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutVehiclesInput, StoreUpdateWithoutVehiclesInput>, StoreUncheckedUpdateWithoutVehiclesInput>
  }

  export type VehicleImageUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<VehicleImageCreateWithoutVehicleInput, VehicleImageUncheckedCreateWithoutVehicleInput> | VehicleImageCreateWithoutVehicleInput[] | VehicleImageUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehicleImageCreateOrConnectWithoutVehicleInput | VehicleImageCreateOrConnectWithoutVehicleInput[]
    upsert?: VehicleImageUpsertWithWhereUniqueWithoutVehicleInput | VehicleImageUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: VehicleImageCreateManyVehicleInputEnvelope
    set?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
    disconnect?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
    delete?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
    connect?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
    update?: VehicleImageUpdateWithWhereUniqueWithoutVehicleInput | VehicleImageUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: VehicleImageUpdateManyWithWhereWithoutVehicleInput | VehicleImageUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: VehicleImageScalarWhereInput | VehicleImageScalarWhereInput[]
  }

  export type ProcessingJobUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<ProcessingJobCreateWithoutVehicleInput, ProcessingJobUncheckedCreateWithoutVehicleInput> | ProcessingJobCreateWithoutVehicleInput[] | ProcessingJobUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: ProcessingJobCreateOrConnectWithoutVehicleInput | ProcessingJobCreateOrConnectWithoutVehicleInput[]
    upsert?: ProcessingJobUpsertWithWhereUniqueWithoutVehicleInput | ProcessingJobUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: ProcessingJobCreateManyVehicleInputEnvelope
    set?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
    disconnect?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
    delete?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
    connect?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
    update?: ProcessingJobUpdateWithWhereUniqueWithoutVehicleInput | ProcessingJobUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: ProcessingJobUpdateManyWithWhereWithoutVehicleInput | ProcessingJobUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: ProcessingJobScalarWhereInput | ProcessingJobScalarWhereInput[]
  }

  export type VehicleImageUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<VehicleImageCreateWithoutVehicleInput, VehicleImageUncheckedCreateWithoutVehicleInput> | VehicleImageCreateWithoutVehicleInput[] | VehicleImageUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: VehicleImageCreateOrConnectWithoutVehicleInput | VehicleImageCreateOrConnectWithoutVehicleInput[]
    upsert?: VehicleImageUpsertWithWhereUniqueWithoutVehicleInput | VehicleImageUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: VehicleImageCreateManyVehicleInputEnvelope
    set?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
    disconnect?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
    delete?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
    connect?: VehicleImageWhereUniqueInput | VehicleImageWhereUniqueInput[]
    update?: VehicleImageUpdateWithWhereUniqueWithoutVehicleInput | VehicleImageUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: VehicleImageUpdateManyWithWhereWithoutVehicleInput | VehicleImageUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: VehicleImageScalarWhereInput | VehicleImageScalarWhereInput[]
  }

  export type ProcessingJobUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<ProcessingJobCreateWithoutVehicleInput, ProcessingJobUncheckedCreateWithoutVehicleInput> | ProcessingJobCreateWithoutVehicleInput[] | ProcessingJobUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: ProcessingJobCreateOrConnectWithoutVehicleInput | ProcessingJobCreateOrConnectWithoutVehicleInput[]
    upsert?: ProcessingJobUpsertWithWhereUniqueWithoutVehicleInput | ProcessingJobUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: ProcessingJobCreateManyVehicleInputEnvelope
    set?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
    disconnect?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
    delete?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
    connect?: ProcessingJobWhereUniqueInput | ProcessingJobWhereUniqueInput[]
    update?: ProcessingJobUpdateWithWhereUniqueWithoutVehicleInput | ProcessingJobUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: ProcessingJobUpdateManyWithWhereWithoutVehicleInput | ProcessingJobUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: ProcessingJobScalarWhereInput | ProcessingJobScalarWhereInput[]
  }

  export type VehicleCreateNestedOneWithoutImagesInput = {
    create?: XOR<VehicleCreateWithoutImagesInput, VehicleUncheckedCreateWithoutImagesInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutImagesInput
    connect?: VehicleWhereUniqueInput
  }

  export type EnumImageTypeFieldUpdateOperationsInput = {
    set?: $Enums.ImageType
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type VehicleUpdateOneRequiredWithoutImagesNestedInput = {
    create?: XOR<VehicleCreateWithoutImagesInput, VehicleUncheckedCreateWithoutImagesInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutImagesInput
    upsert?: VehicleUpsertWithoutImagesInput
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutImagesInput, VehicleUpdateWithoutImagesInput>, VehicleUncheckedUpdateWithoutImagesInput>
  }

  export type ProcessingJobCreateimageIdsInput = {
    set: string[]
  }

  export type VehicleCreateNestedOneWithoutProcessingJobsInput = {
    create?: XOR<VehicleCreateWithoutProcessingJobsInput, VehicleUncheckedCreateWithoutProcessingJobsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutProcessingJobsInput
    connect?: VehicleWhereUniqueInput
  }

  export type ProcessingJobUpdateimageIdsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumJobStatusFieldUpdateOperationsInput = {
    set?: $Enums.JobStatus
  }

  export type VehicleUpdateOneRequiredWithoutProcessingJobsNestedInput = {
    create?: XOR<VehicleCreateWithoutProcessingJobsInput, VehicleUncheckedCreateWithoutProcessingJobsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutProcessingJobsInput
    upsert?: VehicleUpsertWithoutProcessingJobsInput
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutProcessingJobsInput, VehicleUpdateWithoutProcessingJobsInput>, VehicleUncheckedUpdateWithoutProcessingJobsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumProcessingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingStatus | EnumProcessingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingStatusFilter<$PrismaModel> | $Enums.ProcessingStatus
  }

  export type NestedEnumProcessingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProcessingStatus | EnumProcessingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ProcessingStatus[] | ListEnumProcessingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumProcessingStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProcessingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProcessingStatusFilter<$PrismaModel>
    _max?: NestedEnumProcessingStatusFilter<$PrismaModel>
  }

  export type NestedEnumImageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ImageType | EnumImageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ImageType[] | ListEnumImageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImageType[] | ListEnumImageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumImageTypeFilter<$PrismaModel> | $Enums.ImageType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumImageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImageType | EnumImageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ImageType[] | ListEnumImageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImageType[] | ListEnumImageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumImageTypeWithAggregatesFilter<$PrismaModel> | $Enums.ImageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumImageTypeFilter<$PrismaModel>
    _max?: NestedEnumImageTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumJobStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusFilter<$PrismaModel> | $Enums.JobStatus
  }

  export type NestedEnumJobStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.JobStatus | EnumJobStatusFieldRefInput<$PrismaModel>
    in?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.JobStatus[] | ListEnumJobStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumJobStatusWithAggregatesFilter<$PrismaModel> | $Enums.JobStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumJobStatusFilter<$PrismaModel>
    _max?: NestedEnumJobStatusFilter<$PrismaModel>
  }

  export type VehicleCreateWithoutStoreInput = {
    id?: string
    stockNumber: string
    vin: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: VehicleImageCreateNestedManyWithoutVehicleInput
    processingJobs?: ProcessingJobCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutStoreInput = {
    id?: string
    stockNumber: string
    vin: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: VehicleImageUncheckedCreateNestedManyWithoutVehicleInput
    processingJobs?: ProcessingJobUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutStoreInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutStoreInput, VehicleUncheckedCreateWithoutStoreInput>
  }

  export type VehicleCreateManyStoreInputEnvelope = {
    data: VehicleCreateManyStoreInput | VehicleCreateManyStoreInput[]
    skipDuplicates?: boolean
  }

  export type VehicleUpsertWithWhereUniqueWithoutStoreInput = {
    where: VehicleWhereUniqueInput
    update: XOR<VehicleUpdateWithoutStoreInput, VehicleUncheckedUpdateWithoutStoreInput>
    create: XOR<VehicleCreateWithoutStoreInput, VehicleUncheckedCreateWithoutStoreInput>
  }

  export type VehicleUpdateWithWhereUniqueWithoutStoreInput = {
    where: VehicleWhereUniqueInput
    data: XOR<VehicleUpdateWithoutStoreInput, VehicleUncheckedUpdateWithoutStoreInput>
  }

  export type VehicleUpdateManyWithWhereWithoutStoreInput = {
    where: VehicleScalarWhereInput
    data: XOR<VehicleUpdateManyMutationInput, VehicleUncheckedUpdateManyWithoutStoreInput>
  }

  export type VehicleScalarWhereInput = {
    AND?: VehicleScalarWhereInput | VehicleScalarWhereInput[]
    OR?: VehicleScalarWhereInput[]
    NOT?: VehicleScalarWhereInput | VehicleScalarWhereInput[]
    id?: StringFilter<"Vehicle"> | string
    stockNumber?: StringFilter<"Vehicle"> | string
    vin?: StringFilter<"Vehicle"> | string
    storeId?: StringFilter<"Vehicle"> | string
    processingStatus?: EnumProcessingStatusFilter<"Vehicle"> | $Enums.ProcessingStatus
    createdAt?: DateTimeFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeFilter<"Vehicle"> | Date | string
  }

  export type StoreCreateWithoutVehiclesInput = {
    id?: string
    name: string
    address: string
    brandLogos?: StoreCreatebrandLogosInput | string[]
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreUncheckedCreateWithoutVehiclesInput = {
    id?: string
    name: string
    address: string
    brandLogos?: StoreCreatebrandLogosInput | string[]
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreCreateOrConnectWithoutVehiclesInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutVehiclesInput, StoreUncheckedCreateWithoutVehiclesInput>
  }

  export type VehicleImageCreateWithoutVehicleInput = {
    id?: string
    originalUrl: string
    processedUrl?: string | null
    optimizedUrl?: string | null
    thumbnailUrl: string
    imageType: $Enums.ImageType
    sortOrder?: number
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: Date | string | null
    uploadedAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleImageUncheckedCreateWithoutVehicleInput = {
    id?: string
    originalUrl: string
    processedUrl?: string | null
    optimizedUrl?: string | null
    thumbnailUrl: string
    imageType: $Enums.ImageType
    sortOrder?: number
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: Date | string | null
    uploadedAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleImageCreateOrConnectWithoutVehicleInput = {
    where: VehicleImageWhereUniqueInput
    create: XOR<VehicleImageCreateWithoutVehicleInput, VehicleImageUncheckedCreateWithoutVehicleInput>
  }

  export type VehicleImageCreateManyVehicleInputEnvelope = {
    data: VehicleImageCreateManyVehicleInput | VehicleImageCreateManyVehicleInput[]
    skipDuplicates?: boolean
  }

  export type ProcessingJobCreateWithoutVehicleInput = {
    id?: string
    imageIds?: ProcessingJobCreateimageIdsInput | string[]
    status?: $Enums.JobStatus
    errorMessage?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ProcessingJobUncheckedCreateWithoutVehicleInput = {
    id?: string
    imageIds?: ProcessingJobCreateimageIdsInput | string[]
    status?: $Enums.JobStatus
    errorMessage?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type ProcessingJobCreateOrConnectWithoutVehicleInput = {
    where: ProcessingJobWhereUniqueInput
    create: XOR<ProcessingJobCreateWithoutVehicleInput, ProcessingJobUncheckedCreateWithoutVehicleInput>
  }

  export type ProcessingJobCreateManyVehicleInputEnvelope = {
    data: ProcessingJobCreateManyVehicleInput | ProcessingJobCreateManyVehicleInput[]
    skipDuplicates?: boolean
  }

  export type StoreUpsertWithoutVehiclesInput = {
    update: XOR<StoreUpdateWithoutVehiclesInput, StoreUncheckedUpdateWithoutVehiclesInput>
    create: XOR<StoreCreateWithoutVehiclesInput, StoreUncheckedCreateWithoutVehiclesInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutVehiclesInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutVehiclesInput, StoreUncheckedUpdateWithoutVehiclesInput>
  }

  export type StoreUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    brandLogos?: StoreUpdatebrandLogosInput | string[]
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUncheckedUpdateWithoutVehiclesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    brandLogos?: StoreUpdatebrandLogosInput | string[]
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleImageUpsertWithWhereUniqueWithoutVehicleInput = {
    where: VehicleImageWhereUniqueInput
    update: XOR<VehicleImageUpdateWithoutVehicleInput, VehicleImageUncheckedUpdateWithoutVehicleInput>
    create: XOR<VehicleImageCreateWithoutVehicleInput, VehicleImageUncheckedCreateWithoutVehicleInput>
  }

  export type VehicleImageUpdateWithWhereUniqueWithoutVehicleInput = {
    where: VehicleImageWhereUniqueInput
    data: XOR<VehicleImageUpdateWithoutVehicleInput, VehicleImageUncheckedUpdateWithoutVehicleInput>
  }

  export type VehicleImageUpdateManyWithWhereWithoutVehicleInput = {
    where: VehicleImageScalarWhereInput
    data: XOR<VehicleImageUpdateManyMutationInput, VehicleImageUncheckedUpdateManyWithoutVehicleInput>
  }

  export type VehicleImageScalarWhereInput = {
    AND?: VehicleImageScalarWhereInput | VehicleImageScalarWhereInput[]
    OR?: VehicleImageScalarWhereInput[]
    NOT?: VehicleImageScalarWhereInput | VehicleImageScalarWhereInput[]
    id?: StringFilter<"VehicleImage"> | string
    vehicleId?: StringFilter<"VehicleImage"> | string
    originalUrl?: StringFilter<"VehicleImage"> | string
    processedUrl?: StringNullableFilter<"VehicleImage"> | string | null
    optimizedUrl?: StringNullableFilter<"VehicleImage"> | string | null
    thumbnailUrl?: StringFilter<"VehicleImage"> | string
    imageType?: EnumImageTypeFilter<"VehicleImage"> | $Enums.ImageType
    sortOrder?: IntFilter<"VehicleImage"> | number
    isProcessed?: BoolFilter<"VehicleImage"> | boolean
    isOptimized?: BoolFilter<"VehicleImage"> | boolean
    processedAt?: DateTimeNullableFilter<"VehicleImage"> | Date | string | null
    uploadedAt?: DateTimeFilter<"VehicleImage"> | Date | string
    updatedAt?: DateTimeFilter<"VehicleImage"> | Date | string
  }

  export type ProcessingJobUpsertWithWhereUniqueWithoutVehicleInput = {
    where: ProcessingJobWhereUniqueInput
    update: XOR<ProcessingJobUpdateWithoutVehicleInput, ProcessingJobUncheckedUpdateWithoutVehicleInput>
    create: XOR<ProcessingJobCreateWithoutVehicleInput, ProcessingJobUncheckedCreateWithoutVehicleInput>
  }

  export type ProcessingJobUpdateWithWhereUniqueWithoutVehicleInput = {
    where: ProcessingJobWhereUniqueInput
    data: XOR<ProcessingJobUpdateWithoutVehicleInput, ProcessingJobUncheckedUpdateWithoutVehicleInput>
  }

  export type ProcessingJobUpdateManyWithWhereWithoutVehicleInput = {
    where: ProcessingJobScalarWhereInput
    data: XOR<ProcessingJobUpdateManyMutationInput, ProcessingJobUncheckedUpdateManyWithoutVehicleInput>
  }

  export type ProcessingJobScalarWhereInput = {
    AND?: ProcessingJobScalarWhereInput | ProcessingJobScalarWhereInput[]
    OR?: ProcessingJobScalarWhereInput[]
    NOT?: ProcessingJobScalarWhereInput | ProcessingJobScalarWhereInput[]
    id?: StringFilter<"ProcessingJob"> | string
    vehicleId?: StringFilter<"ProcessingJob"> | string
    imageIds?: StringNullableListFilter<"ProcessingJob">
    status?: EnumJobStatusFilter<"ProcessingJob"> | $Enums.JobStatus
    errorMessage?: StringNullableFilter<"ProcessingJob"> | string | null
    createdAt?: DateTimeFilter<"ProcessingJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"ProcessingJob"> | Date | string | null
  }

  export type VehicleCreateWithoutImagesInput = {
    id?: string
    stockNumber: string
    vin: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutVehiclesInput
    processingJobs?: ProcessingJobCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutImagesInput = {
    id?: string
    stockNumber: string
    vin: string
    storeId: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    processingJobs?: ProcessingJobUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutImagesInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutImagesInput, VehicleUncheckedCreateWithoutImagesInput>
  }

  export type VehicleUpsertWithoutImagesInput = {
    update: XOR<VehicleUpdateWithoutImagesInput, VehicleUncheckedUpdateWithoutImagesInput>
    create: XOR<VehicleCreateWithoutImagesInput, VehicleUncheckedCreateWithoutImagesInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutImagesInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutImagesInput, VehicleUncheckedUpdateWithoutImagesInput>
  }

  export type VehicleUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutVehiclesNestedInput
    processingJobs?: ProcessingJobUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutImagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processingJobs?: ProcessingJobUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleCreateWithoutProcessingJobsInput = {
    id?: string
    stockNumber: string
    vin: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutVehiclesInput
    images?: VehicleImageCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutProcessingJobsInput = {
    id?: string
    stockNumber: string
    vin: string
    storeId: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    images?: VehicleImageUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutProcessingJobsInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutProcessingJobsInput, VehicleUncheckedCreateWithoutProcessingJobsInput>
  }

  export type VehicleUpsertWithoutProcessingJobsInput = {
    update: XOR<VehicleUpdateWithoutProcessingJobsInput, VehicleUncheckedUpdateWithoutProcessingJobsInput>
    create: XOR<VehicleCreateWithoutProcessingJobsInput, VehicleUncheckedCreateWithoutProcessingJobsInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutProcessingJobsInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutProcessingJobsInput, VehicleUncheckedUpdateWithoutProcessingJobsInput>
  }

  export type VehicleUpdateWithoutProcessingJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutVehiclesNestedInput
    images?: VehicleImageUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutProcessingJobsInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: VehicleImageUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleCreateManyStoreInput = {
    id?: string
    stockNumber: string
    vin: string
    processingStatus?: $Enums.ProcessingStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type VehicleUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: VehicleImageUpdateManyWithoutVehicleNestedInput
    processingJobs?: ProcessingJobUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: VehicleImageUncheckedUpdateManyWithoutVehicleNestedInput
    processingJobs?: ProcessingJobUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    stockNumber?: StringFieldUpdateOperationsInput | string
    vin?: StringFieldUpdateOperationsInput | string
    processingStatus?: EnumProcessingStatusFieldUpdateOperationsInput | $Enums.ProcessingStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleImageCreateManyVehicleInput = {
    id?: string
    originalUrl: string
    processedUrl?: string | null
    optimizedUrl?: string | null
    thumbnailUrl: string
    imageType: $Enums.ImageType
    sortOrder?: number
    isProcessed?: boolean
    isOptimized?: boolean
    processedAt?: Date | string | null
    uploadedAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProcessingJobCreateManyVehicleInput = {
    id?: string
    imageIds?: ProcessingJobCreateimageIdsInput | string[]
    status?: $Enums.JobStatus
    errorMessage?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type VehicleImageUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalUrl?: StringFieldUpdateOperationsInput | string
    processedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    optimizedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    imageType?: EnumImageTypeFieldUpdateOperationsInput | $Enums.ImageType
    sortOrder?: IntFieldUpdateOperationsInput | number
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    isOptimized?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleImageUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalUrl?: StringFieldUpdateOperationsInput | string
    processedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    optimizedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    imageType?: EnumImageTypeFieldUpdateOperationsInput | $Enums.ImageType
    sortOrder?: IntFieldUpdateOperationsInput | number
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    isOptimized?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleImageUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    originalUrl?: StringFieldUpdateOperationsInput | string
    processedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    optimizedUrl?: NullableStringFieldUpdateOperationsInput | string | null
    thumbnailUrl?: StringFieldUpdateOperationsInput | string
    imageType?: EnumImageTypeFieldUpdateOperationsInput | $Enums.ImageType
    sortOrder?: IntFieldUpdateOperationsInput | number
    isProcessed?: BoolFieldUpdateOperationsInput | boolean
    isOptimized?: BoolFieldUpdateOperationsInput | boolean
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProcessingJobUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageIds?: ProcessingJobUpdateimageIdsInput | string[]
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProcessingJobUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageIds?: ProcessingJobUpdateimageIdsInput | string[]
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ProcessingJobUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    imageIds?: ProcessingJobUpdateimageIdsInput | string[]
    status?: EnumJobStatusFieldUpdateOperationsInput | $Enums.JobStatus
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}