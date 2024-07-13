export default function Layout({ children }: { children: React.ReactNode }) {
  //TODO: IF NOT LOGGED REDIRECT TO /login
  return <main>{children}</main>
}
