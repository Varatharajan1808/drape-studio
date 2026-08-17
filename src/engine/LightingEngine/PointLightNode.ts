import { LightNode } from "./LightNode.js";

export class PointLightNode extends LightNode {
    radius: number = 10;

    constructor(name: string = "PointLight") {
        super(name);
        this.type = "PointLight";
    }
}
