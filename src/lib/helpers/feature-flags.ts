import { stringToBoolean } from "@parsekit/string-to-boolean";

export const transparentHeader = stringToBoolean(
  process.env.NEXT_PUBLIC_FF_TRANSPARENT_HEADER,
);
