import Head from "next/head"
import NavBar from "../components/NavBar"

interface LayoutProps {
  title: string
  children: React.ReactNode
}

export const Layout = ({title, children}: LayoutProps) => {
  return(
    <div className="flex flex-col w-full min-h-screen bg-white dark:bg-black dark:text-white">
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="Software engineering user research tool"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky top-0 flex-none w-full px-10 bg-white dark:bg-black">
        <NavBar />
      </header>
      <div className="flex flex-col flex-1 w-full px-10">
        {children}
      </div>
    </div>
  )
}