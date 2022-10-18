type BackgroundLayoutProps = {
  children: React.ReactNode
}

const BackgroundLayout = ({ children }: BackgroundLayoutProps) => {
  return <main className="mx-4 bg-white pb-4">{children}</main>
}

export default BackgroundLayout
