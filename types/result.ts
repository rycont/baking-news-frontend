export type Result<Success, ErrorType> =
    | (Success extends null
          ? { success: true }
          : {
                success: true
                value: Success
            })
    | {
          success: false
          error: ErrorType
      }
