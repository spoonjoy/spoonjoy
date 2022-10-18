type BackgroundLayoutProps = {
  children: React.ReactNode
}

const BackgroundLayout = ({ children }: BackgroundLayoutProps) => {
  return <main className="bg-white px-4 pb-4">{children}</main>
}

export default BackgroundLayout
