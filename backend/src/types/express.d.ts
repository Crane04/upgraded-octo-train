import { Hospital } from "../db/hospitals";

declare module "express-serve-static-core" {
  interface Request {
    identity?: Hospital;
  }
}
