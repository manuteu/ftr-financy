import { NavLink } from "react-router"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logo from '@/assets/logo.svg'
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router";

export function Header() {
  const { user, getInitials, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-background">
      <div className="relative mx-auto flex h-16 items-center justify-between px-12">

        <div className="flex items-center">
          <NavLink
            to="/"
            className="text-xl font-bold tracking-tight"
          >
            <img src={Logo} className="w-25" />
          </NavLink>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-5 text-sm font-medium">

            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors ${isActive
                    ? "text-green-800"
                    : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `transition-colors ${isActive
                    ? "text-green-800"
                    : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                Transações
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `transition-colors ${isActive
                    ? "text-green-800"
                    : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                Categorias
              </NavLink>
            </li>

          </ul>
        </nav>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer size-9">
                <AvatarImage src="xxx" />
                <div className="bg-gray-300 size-9 text-gray-800 text-sm font-medium flex items-center justify-center">
                  {getInitials(user?.name ?? "")}
                </div>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <NavLink to="/profile">Perfil</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  )
}
