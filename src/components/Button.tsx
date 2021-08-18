import * as React from "react";

export default function Button({ children, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className={`rounded-lg border px-3 py-2 bg-white hover:bg-gray-50 hover:border-gray-400 dark:bg-gray-700 dark:border-black dark:hover:bg-gray-800 dark:hover:border-black transition-colors ${props.className}`}
    >
      {children}
    </button>
  );
}
