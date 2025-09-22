interface Option {
  badge?: string;
  icon?: string;
  link: string;
  title: string;
}

interface OptionProps extends Option {
  deactivate: (option: OptionActive) => void;
  navigation: (link: string) => void;
}

interface OptionActive {
  option: (active: boolean) => void;
}

interface Submenu {
  icon?: string;
  options: Option[];
  title: string;
}

interface SubmenuProps extends Submenu {
  deactivate: (option: OptionActive) => void;
  navigation: (link: string) => void;
}

interface Menu {
  section?: string;
  options: Option[] | Submenu;
  isSubmenu: boolean;
}
