import { PropsWithChildren, ReactChildren } from "react";

type ContainerProps = {};
export default function Container({ children }: PropsWithChildren<ContainerProps>) {
  return <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">{children}</section>;
}
