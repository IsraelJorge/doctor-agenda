import { PropsWithChildren } from 'react'

export function PageContainer({ children }: PropsWithChildren) {
  return <main className="space-y-6 p-6">{children}</main>
}

export const PageHeader = ({ children }: PropsWithChildren) => {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {children}
    </header>
  )
}

export const PageHeaderContent = ({ children }: PropsWithChildren) => {
  return <div className="space-y-1">{children}</div>
}

export const PageTitle = ({ children }: PropsWithChildren) => {
  return <h1 className="text-2xl font-bold">{children}</h1>
}

export const PageDescription = ({ children }: PropsWithChildren) => {
  return <p className="text-muted-foreground text-sm">{children}</p>
}

export const PageActions = ({ children }: PropsWithChildren) => {
  return <div className="flex items-center gap-2">{children}</div>
}

export const PageContent = ({ children }: PropsWithChildren) => {
  return <div className="space-y-6">{children}</div>
}
