import { Artifact } from "hardhat/types";
import path from "path";

interface ArtifactInfo {
    dirName: string
    contractName: string
}
export const getArtifactInfo = ({ contractName, sourceName }:Artifact):ArtifactInfo => ({
    dirName: path.join(sourceName, ".."),
    contractName
})