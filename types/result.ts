export type Result<Success, ErrorType> =
    | SuccessResult<Success>
    | ErrorResult<ErrorType>

type SuccessResult<Success> = Success extends null
    ? { success: true }
    : { success: true; value: Success }

type ErrorResult<ErrorType> = ErrorType extends null
    ? { success: false }
    : { success: false; error: ErrorType }
