import { EntityManager } from "typeorm";

export type MyContext = {
  manager: EntityManager;
};
