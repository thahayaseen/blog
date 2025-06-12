import { v4 as uuid } from "uuid";
export function uniqueusername(name: string) {
  const uuids = uuid();
  return name.split(" ").join("").toLowerCase() + uuids.slice(0, 6);
}
