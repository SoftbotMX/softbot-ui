export interface Option {
  badge?: string;
  icon?: string;
  link: string;
  title: string;
}

export interface OptionProps extends Option {
  deactivate: (option: OptionActive) => void;
  navigation: (link: string) => void;
}

export interface OptionActive {
  option: (active: boolean) => void;
}

export interface Submenu {
  icon?: string;
  options: Option[];
  title: string;
}

export interface SubmenuProps extends Submenu {
  deactivate: (option: OptionActive) => void;
  navigation: (link: string) => void;
}

export interface MenuOptions {
  section?: string;
  options: Option[] | Submenu;
  isSubmenu?: boolean;
}
