import { User } from '@/interfaces/user.interface';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/constants/routes';
import { useNavigate } from 'react-router';

export default function DropdownMenuWithAvatar({ user }: { user: User }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-20 sm:w-1/3 min-w-[50px] flex justify-end">
          <motion.div
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="h-7 w-7 sm:h-10 sm:w-10 border border-primary sm:border-2">
              <AvatarImage src={user?.picture} alt={user.firstName} />
              <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[280px] w-auto" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-sans">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="font-semibold">{user.firstName + ' ' + user.lastName}</span>
              <span className="text-muted-foreground text-xs break-all">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigate(routes.profile)} className="cursor-pointer flex gap-2 items-center">
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout} className="cursor-pointer flex gap-2 items-center">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
