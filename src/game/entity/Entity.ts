import { Tile } from "../ui/Tile";
import { AxialCoordinate } from "./Coordinates";

abstract class Entity {

    constructor(public position: AxialCoordinate, public tile: Tile) {

    }

}

export default Entity;
