import { Artifacts } from "hardhat/types";
import { Project } from "ts-morph";
import ts from "typescript"

export default async function GenerateCrafts(
    craftsRootDir: string,
    artifacts: Artifacts
){

    const artifactNames = await artifacts.getAllFullyQualifiedNames()
    const project = new Project({})
    project.addSourceFilesAtPaths(`${craftsRootDir}/**/*.ts`);
    for await (const artifactName of artifactNames) {
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