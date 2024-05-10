"use client"

import { UserButton, useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import SearchInput from './SearchInput';

import teacher from '@/lib/teacher';


export default function NavbarRoutes() {
    
    const {userId}=useAuth();

    const pathname = usePathname();
    

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage =pathname === "/search";

  return (
    <>
    {isSearchPage &&(
        <div className='block'>
            <SearchInput/>
        </div>
    )}
        <div className=' flex gap-x-2 ml-auto '>
            {isTeacherPage || isCoursePage ? (
                <Link href="/">
                    <Button size="sm" variant="ghost">
                        <LogOut className='h-4 w-4 mr-2'/>
                        Exit
                    </Button>
                </Link>
            ) : teacher(userId) ? (
                <Link href="/teacher/courses">
                    <Button size="sm" variant="ghost">
                        Teacher mode
                    </Button>
                </Link>
            ) : null}
            <UserButton
                afterSignOutUrl='/'
            />
        </div>
    </>
  )
}
