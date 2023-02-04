import { ApplicationError } from "@/protocols";
import { Request, Response } from "express";
import httpStatus from "http-status";

export function handleApplicationErrors(err: ApplicationError | Error, _req: Request, res: Response) {
  if (err.name === "CannotEnrollBeforeStartDateError") {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: err.message,
    });
  }

  if (err.name === "ConflictError" || err.name === "DuplicatedEmailError") {
    return res.status(httpStatus.CONFLICT).send({
      message: err.message,
    });
  }

  if (err.name === "InvalidCredentialsError") {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: err.message,
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(httpStatus.UNAUTHORIZED).send({
      message: err.message,
    });
  }

  if(err.name === "notAllowed") {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  if (err.name === "NotFoundError") {
    return res.status(httpStatus.NOT_FOUND).send({
      message: err.message,
    });
  }

  if(err.name === "InvalidDataError") {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  /* eslint-disable-next-line no-console */
  console.error(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: "InternalServerError",
    message: "Internal Server Error",
  });
}
