import hre from "hardhat"
import { Artifacts } from "hardhat/types";
import { Project } from "ts-morph";


export default async function GenerateCrafts(){
    const craftsRootDir = hre.config.paths.crafts;
    const artifacts = hre.artifacts

    const artifactNames = await artifacts.getAllFullyQualifiedNames()
    if(!artifactNames.length){
        return;
    }
    const project = new Project({})
    project.addSourceFilesAtPaths(`${craftsRootDir}/**/*.ts`);
    for (const artifactName of artifactNames) {
        const craftClassFile = project.createSourceFile(`${craftsRootDir}/${artifactName}.craft.ts`, `
            import { Craft, Contract } from "hardhat-craftform/core"
            
            @Craft()
            export class ${artifactName} {
                
                address!: string

            }
        `);
        
    }
    
    await project.save()
}