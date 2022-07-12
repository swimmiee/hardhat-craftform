import { Artifacts } from "hardhat/types"
import { Project } from "ts-morph"

export interface SetProjectFileProps {
    artifacts: Artifacts
    project: Project
    craftsRootDir: string    
    contractNames: string[]
    contractToArtifactMap: {
        [key: string]: string
    }
}