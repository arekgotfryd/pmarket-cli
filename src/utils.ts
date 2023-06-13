import { Context } from "./strategy/context";
import { Strategy } from "./strategy/strategy";

export const setAndExecuteStrategy = (strategy: Strategy, options: any, context: Context): void => {
    context.setStrategy(strategy);
    context.executeStrategy(options);
}