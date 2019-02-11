class Log {

  log(message: string): void{
    console.log(`${new Date().toUTCString()} | ${message}`)
  }

  info(message:string): void{
    this.log(message)
  }

  error(error: Error, message: string):void{
    console.log(error)
    this.log(message)
  }
}

export default new Log()
