import { Artifacts } from "hardhat/types";
import { Project } from "ts-morph";


export default async function GenerateCrafts(
    craftsRootDir: string,
    artifacts: Artifacts
){

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