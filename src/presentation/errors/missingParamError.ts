export class MissinParamError extends Error {
  constructor(paramName: string) {
    super(`Missin param: ${paramName}`)
    this.name = 'MissinParamError'
  }
}
