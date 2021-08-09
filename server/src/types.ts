import { EntityManager } from "typeorm";
import { Request, Response } from "express";

export type MyContext = {
  manager: EntityManager;
  req: Request;
  res: Response;
};
