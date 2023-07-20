
import { Tool } from "langchain/tools";
import { Parser } from "expr-eval";

export class Calculator extends Tool{

    name = 'calculator';
    description = `用于计算数学表达式的工具。该工具的输入应该是一个可以被简单计算器执行的有效数学表达式。`;

    async _call(input: string){
        try{
            return Parser.evaluate(input).toString()
        }catch(error){
            return "I don't know how to do that.";
        }
    }

}