export interface MenuOption {
  badge?: string;
  icon?: string;
  link: string;
  title: string;
}

export interface OptionProps extends MenuOption {
  deactivate: (option: OptionActive) => void;
  navigation: (link: string) => void;
}

export interface OptionActive {
  option: (active: boolean) => void;
}

export interface SubmenuOptions {
  icon?: string;
  options: MenuOption[];
  title: string;
}

export interface SubmenuProps extends SubmenuOptions {
  deactivate: (option: OptionActive) => void;
  navigation: (link: string) => void;
}

export interface MenuOptions {
  section?: string;
  options: MenuOption[] | SubmenuOptions;
  isSubmenu?: boolean;
}
