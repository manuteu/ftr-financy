import { NavLink } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logo from '@/assets/logo.svg'

export function Header() {
  return (
    <header className="w-full border-b bg-background">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <div className="flex items-center">
          <NavLink
            to="/"
            className="text-xl font-bold tracking-tight"
          >
            <img src={Logo} className="w-25" />
          </NavLink>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-8 text-sm font-medium">

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
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>ML</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <NavLink to="/profile">Perfil</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  )
}
