import { Artifact } from "hardhat/types"
import { Project } from "ts-morph"

export interface SetProjectFileProps {
    artifacts: Artifact[]
    project: Project
    craftsRootDir: string
}