import { Project, SyntaxKind } from 'ts-morph';

export class AstService {
  private project: Project;

  constructor() {
    this.project = new Project({ useInMemoryFileSystem: true });
  }

  /**
   * Calculates the Cyclomatic Complexity of a given source code snippet
   * by walking the AST and counting decision points (if, while, for, etc.).
   */
  public calculateCyclomaticComplexity(sourceCode: string): number {
    try {
      const sourceFile = this.project.createSourceFile('temp.ts', sourceCode, { overwrite: true });
      let complexity = 1;

      sourceFile.forEachDescendant((node) => {
        switch (node.getKind()) {
          case SyntaxKind.IfStatement:
          case SyntaxKind.ForStatement:
          case SyntaxKind.ForInStatement:
          case SyntaxKind.ForOfStatement:
          case SyntaxKind.WhileStatement:
          case SyntaxKind.DoStatement:
          case SyntaxKind.CatchClause:
          case SyntaxKind.ConditionalExpression:
            complexity++;
            break;
          case SyntaxKind.CaseClause:
            // Every case in a switch statement (except default) adds to complexity
            complexity++;
            break;
          case SyntaxKind.BinaryExpression:
            const operator = node.asKind(SyntaxKind.BinaryExpression)?.getOperatorToken().getKind();
            if (operator === SyntaxKind.AmpersandAmpersandToken || operator === SyntaxKind.BarBarToken) {
              complexity++;
            }
            break;
        }
      });

      return complexity;
    } catch (error) {
      console.warn("Failed to parse AST for code chunk, defaulting complexity to 1");
      return 1;
    }
  }
}