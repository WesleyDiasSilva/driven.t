import { ApplicationError } from "@/protocols";

export function notAllowedError(): ApplicationError {
  return {
    name: "notAllowed",
    message: ""
  };
}
