import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full flex flex-col gap-4 p-4 lg:gap-2 lg:p-6">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}