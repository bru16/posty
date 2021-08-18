import { EntityManager } from "typeorm";
import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
  manager: EntityManager;
  req: Request;
  res: Response;
  redis: Redis;
};
