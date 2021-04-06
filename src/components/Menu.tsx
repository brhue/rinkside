import * as React from "react";

type MenuContextValue = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  menuRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
};

const MenuContext = React.createContext<MenuContextValue | undefined>(undefined);

type MenuProps = {
  children:
    | React.ReactNode
    | ((props: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => React.ReactNode);
};
export function Menu({ children, ...props }: MenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Handles closing the menu when clicking outside of it
  // Could (should) be abstracted out to a useOutsideClick hook like chakra-ui has
  React.useEffect(() => {
    const onMouseDown = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onMouseDown, true);
    return () => {
      document.removeEventListener("click", onMouseDown, true);
    };
  }, []);

  const value = {
    isOpen,
    setIsOpen,
    menuRef,
    buttonRef,
  };

  return (
    <MenuContext.Provider value={value}>
      {typeof children === "function" ? children({ isOpen, setIsOpen }) : children}
    </MenuContext.Provider>
  );
}

type MenuButtonProps = {
  className?: string;
};
export function MenuButton({ children, ...props }: React.PropsWithChildren<MenuButtonProps>) {
  const menu = useMenu();
  const { isOpen, setIsOpen } = menu;
  return (
    <button ref={menu.buttonRef} {...props} onClick={() => setIsOpen(!isOpen)}>
      {children}
    </button>
  );
}

type MenuItemsProps = {
  className?: string;
};
export function MenuItems({ children, ...props }: React.PropsWithChildren<MenuItemsProps>) {
  const menu = useMenu();
  const { isOpen } = menu;
  return (
    <div
      ref={menu.menuRef}
      style={{
        visibility: isOpen ? "visible" : "hidden",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function useMenu() {
  const menu = React.useContext(MenuContext);
  if (menu === undefined) {
    throw new Error("Not called from inside of a Menu component.");
  }
  return menu;
}
